// js/submission.js
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let _sections = [];
let _key = {};
let _gradableCount = 0;

export function initSubmission({ sections }) {
  _sections = Array.isArray(sections) ? sections : [];
  _key = _sections.reduce((acc, s) => Object.assign(acc, s.answers || {}), {});
  _gradableCount = Object.keys(_key).length;
}

export function getQuestionCounts() {
  return {
    gradable: _gradableCount
  };
}

const norm = v => String(v ?? '').trim().replace(/[.,?!'"]/g, '').replace(/\s+/g, ' ').toUpperCase();

function scoreOf(answers) {
  let c = 0;
  for (const q in _key) {
    if (norm(answers[q]) === norm(_key[q])) c++;
  }
  return c;
}

export function getSubmissionRef(db, appId, student) {
  const assignmentId = window.__ASSIGNMENT_ID__ || location.pathname;
  const docId = `${encodeURIComponent(assignmentId)}__${student}`;
  return doc(db, `/artifacts/${appId}/public/data/submissions`, docId);
}

export async function saveSubmission(firebaseServices, currentStudent, studentDoc, answers) {
  const { db, appId } = firebaseServices;
  const ref = getSubmissionRef(db, appId, currentStudent);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};

  let slot = 'attempt1';
  if (existing.attempt1 && !existing.attempt2 && existing.resubmissionStatus === 'approved') {
    slot = 'attempt2';
  } else if (existing.attempt1) {
    throw new Error('First attempt already submitted. Resubmission not approved.');
  }

  const now = serverTimestamp();
  const payload = {
    [slot]: {
      answers,
      score: scoreOf(answers),
      submittedAt: now,
    },
    lastUpdated: now,
    resubmissionStatus: slot === 'attempt2' ? 'completed' : 'none',
    studentName: currentStudent,
  };

  await setDoc(ref, payload, { merge: true });
  const latest = await getDoc(ref);
  return latest.data();
}

export function activateResultTabs(container, uniqueifier = '') {
    const tabButtons = container.querySelectorAll(`.result-tab-btn${uniqueifier}`);
    const contentPanes = container.querySelectorAll(`.result-tab-content${uniqueifier}`);
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            
            tabButtons.forEach(btn => {
                btn.classList.remove('border-blue-500', 'text-blue-600');
                btn.classList.add('border-transparent', 'text-slate-500');
            });
            button.classList.add('border-blue-500', 'text-blue-600');
            button.classList.remove('border-transparent', 'text-slate-500');

            contentPanes.forEach(pane => {
                pane.classList.toggle('hidden', pane.id !== targetId);
            });
        });
    });
}

export function showResults(docData, isTeacher = false, container) {
  if (!docData) return;
  const renderTarget = container || document.getElementById('results-section');
  if (!renderTarget) return;

  const { gradable } = getQuestionCounts();
  const attempts = ['attempt1', 'attempt2'].filter(a => docData[a]);
  let html = '';

  const renderAttempt = (attempt, title, uniqueifier = '') => {
    const ans = attempt.answers || {};
    let content = `<div class="text-xl font-bold mb-4 text-left">${title}</div>`;
    content += `<div class="mb-4 border-b border-slate-200"><nav class="-mb-px flex flex-wrap gap-2" aria-label="Tabs">`;
    _sections.forEach((section, idx) => {
        content += `<button type="button" class="result-tab-btn${uniqueifier} whitespace-nowrap py-2 px-3 font-medium text-sm rounded-t-md border-b-2 ${idx === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}" data-target="results-${section.id}${uniqueifier}">${section.title}</button>`;
    });
    content += `</nav></div>`;

    _sections.forEach((section, idx) => {
        content += `<div id="results-${section.id}${uniqueifier}" class="result-tab-content${uniqueifier} ${idx > 0 ? 'hidden' : ''}">`;
        let tableRows = '';
        (section.questions || []).forEach(q => {
            const qNum = q.qNum;
            const studentAnswer = ans[qNum] ?? '';
            const isGradable = qNum in _key;
            const isCorrect = isGradable && norm(studentAnswer) === norm(_key[qNum]);
            const rowClass = isGradable ? (isCorrect ? 'bg-green-50' : 'bg-red-50') : 'bg-slate-50';
            const statusCell = isGradable ? `<td class="p-2 text-center">${isCorrect ? '✔' : '✘'}</td>` : '<td></td>';
            const correctAnswerCell = `<td class="p-2 text-slate-600">${_key[qNum] || ''}</td>`;

            tableRows += `<tr class="${rowClass}">
                <td class="p-2 text-center font-medium w-12">${qNum}</td>
                <td class="p-2">${studentAnswer || '<span class="text-slate-400">—</span>'}</td>
                ${statusCell}
                ${isTeacher ? correctAnswerCell : ''}
            </tr>`;
        });
        
        const teacherHeader = isTeacher ? '<th class="p-2 text-left">Correct Answer</th>' : '';
        content += `<div class="border rounded-lg overflow-hidden">
            <table class="w-full text-sm">
                <thead class="bg-slate-50"><tr>
                    <th class="p-2 text-center">Q</th>
                    <th class="p-2 text-left">Student Answer</th>
                    <th class="p-2 text-center">Status</th>
                    ${teacherHeader}
                </tr></thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div></div>`;
    });
    return content;
  };

  const title1 = `Attempt 1 (Score: ${docData.attempt1.score}/${gradable})`;
  if (attempts.length === 2) {
    const title2 = `Attempt 2 (Score: ${docData.attempt2.score}/${gradable})`;
    html = `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>${renderAttempt(docData.attempt1, title1, '-a1')}</div>
              <div>${renderAttempt(docData.attempt2, title2, '-a2')}</div>
            </div>`;
  } else {
    const viewTitle = isTeacher ? `Viewing: ${docData.studentName}` : 'Your Results';
    html = renderAttempt(docData.attempt1, `${viewTitle} - ${title1}`);
  }
  
  renderTarget.innerHTML = html;
  
  if (renderTarget) {
      if (attempts.length === 2) {
          activateResultTabs(renderTarget, '-a1');
          activateResultTabs(renderTarget, '-a2');
      } else {
          activateResultTabs(renderTarget);
      }
  }
}