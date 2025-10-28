/**
 * Renders various types of multiple-choice questions.
 * @param {object} section - The section data object from quiz-data.js.
 * @returns {string} The complete HTML string for the section.
 */
export function renderMcqTasks(section) {
    let questionsHTML = `<div class="grid grid-cols-1 gap-4">`;
    section.questions.forEach(q => {
        const qNum = q.qNum;
        questionsHTML += `<div class="bg-white border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-md">`;
        questionsHTML += `<p class="font-medium text-slate-800">${q.prompt}</p>`;
        questionsHTML += `<div class="mt-4">`;
        
        switch(q.type) {
            case 'mcq-underline':
                questionsHTML += `<fieldset><legend class="sr-only">Options for question ${q.qNum}</legend><div class="flex flex-wrap gap-2">`;
                for(const letter in q.options) {
                    questionsHTML += `<label class="flex items-center justify-center p-3 rounded-md border-2 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500"><input name="q${qNum}" type="radio" value="${letter}" class="sr-only"><span class="font-semibold">${letter}. ${q.options[letter]}</span></label>`;
                }
                questionsHTML += `</div></fieldset>`;
                break;
            case 'mcq-standard':
                 questionsHTML += `<fieldset><legend class="sr-only">Options for question ${q.qNum}</legend><div class="grid grid-cols-1 sm:grid-cols-2 gap-2">`;
                q.options.forEach((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    questionsHTML += `<label class="col-span-1 flex items-start text-left p-3 rounded-md border-2 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500"><input name="q${qNum}" type="radio" value="${letter}" class="sr-only"><span class="font-semibold mr-2">${letter}.</span><span>${opt}</span></label>`;
                });
                 questionsHTML += `</div></fieldset>`;
                break;
            case 'mcq-buttons':
                questionsHTML += `<fieldset><legend class="sr-only">Options for question ${q.qNum}</legend><div class="flex gap-2"><label class="flex-1 p-3 text-center rounded-md border-2 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500"><input name="q${qNum}" type="radio" value="too" class="sr-only"><span>too</span></label><label class="flex-1 p-3 text-center rounded-md border-2 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500"><input name="q${qNum}" type="radio" value="either" class="sr-only"><span>either</span></label></div></fieldset>`;
                break;
        }
        questionsHTML += `</div></div>`;
    });
    questionsHTML += `</div>`;
    return questionsHTML;
}