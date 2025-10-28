// js/renderer.js
import { renderMcqTasks } from './renderers/mcqRenderer.js';
import { renderReadingComprehension, renderSummaryCompletion } from './renderers/readingRenderer.js';
import { renderWritingTasks } from './renderers/writingRenderer.js';

// A map that connects a renderer name to a function
const rendererMap = {
    renderMcqTasks,
    renderReadingComprehension,
    renderSummaryCompletion,
    renderWritingTasks
};

/**
 * The main rendering function. It chooses the correct renderer based on the section's data.
 * @param {object} section - A section object from quiz-data.js.
 * @returns {string} The HTML for the rendered section.
 */
export function renderSection(section) {
    const rendererFunction = rendererMap[section.renderer];
    if (typeof rendererFunction === 'function') {
        return rendererFunction(section);
    }
    // Fallback for any section that might be missing a renderer property
    console.warn(`No renderer found for section type: "${section.renderer}". Using default renderer.`);
    return renderWritingTasks(section); // Default to a simple text/writing renderer
}