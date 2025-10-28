// js/notifications.js

const toastContainer = document.getElementById('toast-container');

/**
 * Displays a pop-up "toast" notification in the bottom-right corner.
 * @param {string} message - The message to display.
 * @param {string} type - 'info' (blue), 'success' (green), or 'warning' (orange).
 * @param {number} duration - How long the toast stays, in milliseconds.
 */
export function showToastNotification(message, type = 'info', duration = 5000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    const typeClasses = {
        info: 'bg-blue-500',
        success: 'bg-green-500',
        warning: 'bg-orange-500'
    };

    toast.className = `toast-notification text-white p-4 rounded-lg shadow-xl max-w-sm transition-all duration-300 ease-in-out transform translate-x-full opacity-0`;
    toast.classList.add(typeClasses[type] || typeClasses.info);
    toast.innerHTML = `<p>${message}</p>`;

    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Set timer to remove
    const timer = setTimeout(() => {
        toast.classList.add('opacity-0');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);

    // Allow user to click to dismiss
    toast.addEventListener('click', () => {
        clearTimeout(timer);
        toast.classList.add('opacity-0');
        toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    });
}