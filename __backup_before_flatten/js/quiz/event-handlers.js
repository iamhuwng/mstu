// js/quiz/event-handlers.js
import { saveSubmission } from '../submission.js';
import { listMissing, switchTab } from './dom-utils.js';
import { saveProgress, clearProgress } from './progress-manager.js';

let sections = [];
let tabContainer;
let submissionForm;

export function initEventHandlers(config) {
    sections = config.sections;
    tabContainer = config.tabContainer;
    submissionForm = config.submissionForm;
}

export function handleTabClick(e) {
    const targetId = e.currentTarget.dataset.target;
    const current = tabContainer?.querySelector('.active');
    if (!current || targetId === current.dataset.target) return;
    
    const currentSection = sections.find(s => s.id === current.dataset.target);
    const miss = listMissing(currentSection ? [currentSection] : []);
    
    if (miss.length) {
        if (confirm(`You have not answered these questions in this section: ${miss.join(', ')}. Move to the next section anyway?`)) {
            switchTab(targetId);
        }
    } else {
        switchTab(targetId);
    }
}

export function handleChange(e) {
    if (e.target.matches('.dropdown-unique')) {
        const dds = Array.from(document.querySelectorAll('.dropdown-unique'));
        const picked = new Set(dds.map(d => d.value).filter(Boolean));
        dds.forEach(d => {
            const currentVal = d.value;
            Array.from(d.options).forEach(opt => {
                opt.hidden = (opt.value && opt.value !== currentVal && picked.has(opt.value));
            });
        });
    }
    saveProgress();
}

export function handleInput(e) {
    if (e.target.matches('.auto-expand-input')) {
        const el = e.target;
        el.style.width = 'auto';
        el.style.width = `${el.scrollWidth}px`;
    }
    saveProgress();
}

export async function handleSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-button');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting…';
    }
    try {
        const miss = listMissing(sections);
        if (miss.length > 0 && !confirm(`You have missed ${miss.length} questions. Are you sure you want to submit?`)) {
            if (btn) {
                btn.disabled = false;
                btn.textContent = 'Submit Final Answers';
            }
            return null; 
        }
        const rt = window.__RUNTIME__;
        const student = rt.currentStudent;
        if (!student) throw new Error('No student selected.');
        const data = new FormData(submissionForm);
        const answers = {};
        sections.forEach(s => (s.questions || []).forEach(q => {
            answers[q.qNum] = (data.get(`q${q.qNum}`) ?? '').trim();
        }));
        const updated = await saveSubmission(rt.firebaseServices, student, rt.studentDoc, answers);
        
        clearProgress();
        alert('Submission successful!');
        return updated; 
    } catch (err) {
        alert(`Submission failed: ${err.message}`);
        if (btn) {
            btn.disabled = false;
            btn.textContent = 'Submit Final Answers';
        }
        return null;
    }
}