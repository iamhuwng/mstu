const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');

/**
 * Shows a customizable modal dialog.
 * @param {string} title - The title of the modal.
 * @param {string} body - The HTML content for the modal's body.
 * @param {Array<object>} buttons - An array of button objects, each with text, classes, and an onClick handler.
 */
export function showModal(title, body, buttons) {
    modalTitle.textContent = title;
    modalBody.innerHTML = body;
    modalFooter.innerHTML = '';
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.className = btn.classes;
        button.onclick = btn.onClick;
        modalFooter.appendChild(button);
    });
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.modal-content').classList.remove('scale-95');
    }, 10);
}

/**
 * Hides the modal dialog.
 */
export function hideModal() {
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-content').classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 250);
}
