/**
 * Renders various types of writing tasks.
 * @param {object} section - The section data object from quiz-data.js.
 * @returns {string} The complete HTML string for the section.
 */
export function renderWritingTasks(section) {
    let questionsHTML = `<div class="grid grid-cols-1 gap-4">`;
    section.questions.forEach(q => {
        const qNum = q.qNum;
        questionsHTML += `<div class="bg-white border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-md">`;
        let questionPromptHTML = `<div class="font-medium text-slate-800">${q.prompt}</div>`;

        if (q.type === 'writing-inline') {
           questionPromptHTML = q.prompt.replace(`{{BLANK_${q.qNum}}}`, `<input name="q${qNum}" type="text" class="auto-expand-input bg-slate-50 border-b-2 border-slate-300 focus:border-blue-500 outline-none p-1">`);
        }

        questionsHTML += questionPromptHTML;
        questionsHTML += `<div class="mt-4">`;
        
        switch(q.type) {
            case 'fill-in-text':
                 questionsHTML += `<input name="q${qNum}" type="text" class="bg-slate-50 border border-slate-300 text-sm rounded-lg w-full p-2.5">`;
                 break;
            case 'writing':
                questionsHTML += `<textarea name="q${qNum}" rows="4" class="bg-slate-50 border border-slate-300 text-sm rounded-lg w-full p-2.5"></textarea>`;
                break;
             case 'writing-letter':
                questionsHTML += `<textarea name="q${qNum}" rows="12" class="bg-slate-50 border border-slate-300 text-sm rounded-lg w-full p-2.5"></textarea>${q.outro || ''}`;
                break;
            case 'writing-inline':
                // Handled in promptHTML, no extra element needed
                break;
        }
        questionsHTML += `</div></div>`;
    });
    questionsHTML += `</div>`;
    return questionsHTML;
}