// js/quiz/progress-manager.js
let sections = [];
const ASSIGNMENT_ID = window.__ASSIGNMENT_ID__ || location.pathname;

export function initProgressManager(quizSections) {
    sections = quizSections;
}

function storageKey() {
    const student = (window.__RUNTIME__?.currentStudent || '').toString().trim();
    return `quizProgress_${ASSIGNMENT_ID}__${student}`;
}

export function saveProgress() {
    const submissionForm = document.getElementById('submission-form');
    if (!submissionForm) return;
    const data = new FormData(submissionForm);
    const answers = {};
    sections.forEach(s => (s.questions || []).forEach(q => {
        const v = data.get(`q${q.qNum}`);
        if (v != null && String(v).trim() !== '') answers[q.qNum] = String(v).trim();
    }));
    try {
        localStorage.setItem(storageKey(), JSON.stringify(answers));
    } catch (e) {
        console.error("Failed to save progress:", e);
    }
}

export function restoreProgress() {
    let saved = null;
    try {
        saved = JSON.parse(localStorage.getItem(storageKey()) || 'null');
    } catch (e) {
        console.error("Failed to restore progress:", e);
        return;
    }
    if (!saved) return;
    Object.entries(saved).forEach(([qNum, val]) => {
        const inputs = document.querySelectorAll(`[name="q${qNum}"]`);
        if (inputs.length === 0) return;
        if (inputs[0].type === 'radio') {
            const targetRadio = document.querySelector(`[name="q${qNum}"][value="${val}"]`);
            if (targetRadio) targetRadio.checked = true;
        } else {
            inputs[0].value = val;
        }
    });
}

export function clearProgress() {
    try {
        localStorage.removeItem(storageKey());
    } catch (e) {
        console.error("Failed to clear progress:", e);
    }
}