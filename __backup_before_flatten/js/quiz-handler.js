// js/quiz-handler.js
import { renderSection } from './renderer.js';
import { initProgressManager, restoreProgress } from './quiz/progress-manager.js';
import { initEventHandlers, handleTabClick, handleChange, handleInput, handleSubmit } from './quiz/event-handlers.js';
import { showResults, activateResultTabs, getSubmissionRef } from './submission.js';
import { showModal, hideModal } from './utils.js';
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

let sections = [];

export function initQuiz(quizData) {
    sections = Array.isArray(quizData.sections) ? quizData.sections : [];
    
    initProgressManager(sections);
    renderUI();
    wireHandlers();
    restoreProgress();
}

function renderUI() {
    const tabContainer = document.getElementById('tab-container')?.querySelector('nav');
    const quizContainer = document.getElementById('quiz-container');
    if (!tabContainer || !quizContainer) return;

    tabContainer.innerHTML = ''; 
    quizContainer.innerHTML = '';
  
    sections.forEach((section, idx) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = `tab-btn whitespace-nowrap py-2 px-3 font-medium text-sm rounded-md border-2 border-transparent text-slate-500 hover:bg-slate-100 ${idx === 0 ? 'active' : ''}`;
        tab.textContent = section.title;
        tab.dataset.target = section.id;
        tabContainer.appendChild(tab);
  
        const host = document.createElement('div');
        host.id = section.id;
        host.className = `quiz-section-content ${idx > 0 ? 'hidden' : ''}`;
        host.innerHTML = renderSection(section);
        quizContainer.appendChild(host);
    });
}

function wireHandlers() {
    const submissionForm = document.getElementById('submission-form');
    const quizContainer = document.getElementById('quiz-container');
    const tabContainer = document.getElementById('tab-container')?.querySelector('nav');

    if (!submissionForm || !quizContainer || !tabContainer) return;

    initEventHandlers({ sections, submissionForm, tabContainer });

    quizContainer.addEventListener('change', handleChange);
    quizContainer.addEventListener('input', handleInput);
    
    submissionForm.addEventListener('submit', async (e) => {
        const updatedDoc = await handleSubmit(e);
        if (updatedDoc) {
            displaySubmittedView(updatedDoc);
        }
    });
    
    tabContainer.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', handleTabClick);
    });
}

export function displaySubmittedView(studentDoc) {
    const { db, appId } = window.__RUNTIME__.firebaseServices;
    const studentDocRef = getSubmissionRef(db, appId, studentDoc.studentName);

    document.getElementById('form-view')?.classList.add('hidden');
    document.getElementById('student-selection-view')?.classList.add('hidden');
    const submittedView = document.getElementById('submitted-view');
    submittedView?.classList.remove('hidden');

    const viewResultsBtn = submittedView.querySelector('#view-results-button');
    if (viewResultsBtn) {
        viewResultsBtn.classList.remove('hidden');
        viewResultsBtn.onclick = () => {
            const resultsContainer = document.createElement('div');
            showResults(studentDoc, false, resultsContainer);
            showModal('Your Results', resultsContainer.innerHTML, [{ text: 'Close', classes: 'text-slate-700 bg-slate-200 hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-2.5', onClick: hideModal }]);
            const modalBody = document.getElementById('modal-body');
            if (modalBody) {
                if (studentDoc.attempt2) {
                    activateResultTabs(modalBody, '-a1');
                    activateResultTabs(modalBody, '-a2');
                } else {
                    activateResultTabs(modalBody);
                }
            }
        };
    }
    
    const resubBtn = submittedView.querySelector('#request-resubmission-button');
    if (resubBtn) {
        const canRequest = studentDoc.attempt1 && !studentDoc.attempt2;
        resubBtn.classList.toggle('hidden', !canRequest);
        
        resubBtn.disabled = studentDoc.resubmissionStatus === 'requested';
        resubBtn.textContent = studentDoc.resubmissionStatus === 'requested' ? 'Request Sent' : 'Request Resubmission';
        
        if (canRequest) {
            resubBtn.onclick = async () => {
                if (confirm("Request a resubmission?")) {
                    resubBtn.disabled = true;
                    resubBtn.textContent = 'Sending...';
                    await updateDoc(studentDocRef, { resubmissionStatus: 'requested' });
                    resubBtn.textContent = 'Request Sent';
                }
            };
        }
    }
}