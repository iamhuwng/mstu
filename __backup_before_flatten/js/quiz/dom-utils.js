// js/quiz/dom-utils.js
export function lockForm(disabled = true) {
    document.getElementById('submission-form')?.querySelectorAll('input,select,textarea,button').forEach(el => el.disabled = disabled);
}

export function switchTab(id) {
    document.getElementById('tab-container')?.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.target === id));
    document.getElementById('quiz-container')?.querySelectorAll('.quiz-section-content').forEach(c => c.classList.toggle('hidden', c.id !== id));
}

export function listMissing(sections) {
    const submissionForm = document.getElementById('submission-form');
    if (!submissionForm) return [];
    const data = new FormData(submissionForm);
    const miss = [];
    sections.forEach(s => (s.questions || []).forEach(q => {
        const v = data.get(`q${q.qNum}`);
        if (v == null || String(v).trim() === '') miss.push(q.qNum);
    }));
    return miss;
}