/**
 * Renders a reading section with a two-column layout (text on right, questions on left).
 * @param {object} section - The section data object from quiz-data.js.
 * @returns {string} The complete HTML string for the section.
 */
export function renderReadingComprehension(section) {
    let questionsHTML = `<div class="grid grid-cols-1 gap-4">`;
    section.questions.forEach(q => {
        questionsHTML += `<div class="bg-white border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-md">`;
        questionsHTML += `<p class="font-medium text-slate-800">${q.prompt}</p><div class="mt-4">`;

        switch(q.type) {
            case 'mcq-standard':
                 questionsHTML += `<fieldset><legend class="sr-only">Options for question ${q.qNum}</legend><div class="grid grid-cols-1 gap-2">`;
                q.options.forEach((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    questionsHTML += `<label class="col-span-1 flex items-start text-left p-3 rounded-md border-2 border-slate-200 hover:bg-slate-100 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500"><input name="q${q.qNum}" type="radio" value="${letter}" class="sr-only"><span class="font-semibold text-slate-700 mr-2">${letter}.</span><span class="text-slate-700">${opt}</span></label>`;
                });
                 questionsHTML += `</div></fieldset>`;
                break;
            case 'writing':
                questionsHTML += `<textarea name="q${q.qNum}" rows="4" class="bg-slate-50 border border-slate-300 text-sm rounded-lg w-full p-2.5"></textarea>`;
                break;
        }
        questionsHTML += `</div></div>`;
    });
    questionsHTML += `</div>`;

    return `<div class="md:grid md:grid-cols-2 md:gap-8">${questionsHTML}<div class="reading-pane mt-4 md:mt-0 md:sticky md:top-4"><div class="p-4 bg-slate-50 border rounded-lg text-slate-700">${section.readingText}</div></div></div>`;
}

/**
 * Renders a summary completion task where blanks are filled in the text.
 * @param {object} section - The section data object from quiz-data.js.
 * @returns {string} The complete HTML string for the section.
 */
export function renderSummaryCompletion(section) {
    let textWithBlanks = section.readingText;
    section.questions.forEach(q => {
        let replacement = '';
        if (q.type === 'blank-in-text') {
            replacement = `<input name="q${q.qNum}" type="text" class="bg-slate-50 border border-slate-300 rounded-md p-1 mx-1 w-28 inline-block">`;
        } else if (q.type === 'dropdown-in-text') {
             replacement = `<select name="q${q.qNum}" class="bg-slate-50 border border-slate-300 rounded-md p-1 mx-1 inline-block dropdown-unique z-10 relative">
                <option value="">---</option>
                ${section.wordBank.map(word => `<option value="${word}">${word}</option>`).join('')}
            </select>`;
        }
        textWithBlanks = textWithBlanks.replace(`{{BLANK_${q.qNum}}}`, replacement);
    });
    
    return `<div class="p-4 bg-slate-50 border rounded-lg text-slate-700 leading-loose">${textWithBlanks}</div>`;
}