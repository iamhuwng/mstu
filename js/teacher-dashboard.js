// js/teacher-dashboard.js
import { doc, updateDoc, deleteDoc, collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showResults, activateResultTabs } from './submission.js';
import { getQuestionCounts } from './submission.js';
import { showToastNotification } from './notifications.js';

let isFirstLoad = true; // Prevents notifications on initial page load

function renderDashboard(docs, firebaseServices) {
    const tableBody = document.getElementById('submissions-table-body');
    const loadingRow = document.getElementById('loading-row');
    const { db, appId } = firebaseServices;

    if (!tableBody || !loadingRow) return;

    if (!docs || docs.length === 0) {
        loadingRow.innerHTML = `<td colspan="5" class="text-center p-4 text-slate-500">No submissions found.</td>`;
        return;
    }

    tableBody.innerHTML = '';
    docs.sort((a, b) => a.id.localeCompare(b.id));

    docs.forEach(doc => {
        try {
            const submissionId = doc.id;
            const data = doc.data();
            const attempt1 = data.attempt1;
            if (!attempt1) return;

            const score = `${attempt1.score} / ${getQuestionCounts().gradable}`;
            const timestamp = attempt1.submittedAt?.toDate ? attempt1.submittedAt.toDate().toLocaleString() : 'N/A';
            const isRequested = data.resubmissionStatus === 'requested';
            const rowClass = isRequested ? 'bg-orange-50' : '';

            const row = document.createElement('tr');
            row.className = `border-b ${rowClass}`;
            row.innerHTML = `
                <td class="p-3 font-medium">${data.studentName || submissionId}</td>
                <td class="p-3">${score}</td>
                <td class="p-3 text-sm text-slate-600">${timestamp}</td>
                <td class="p-3 text-sm capitalize font-medium ${isRequested ? 'text-orange-600' : ''}">${data.resubmissionStatus || 'none'}</td>
                <td class="p-3">
                    <div class="flex gap-2">
                        <button data-action="view" class="text-blue-600 hover:underline text-sm">View</button>
                        <button data-action="approve" class="text-green-600 hover:underline text-sm ${isRequested ? '' : 'hidden'}">Approve</button>
                        <button data-action="delete" class="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                </td>
            `;

            row.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                if (action === 'view') {
                    const modalBody = document.getElementById('teacher-submission-modal-body');
                    const modal = document.getElementById('teacher-submission-modal');
                    if(modalBody && modal) {
                        modalBody.innerHTML = '';
                        showResults(data, true, modalBody);
                        modal.classList.remove('hidden');
                    }
                } else if (action === 'approve') {
                    approveResubmission(db, appId, submissionId);
                } else if (action === 'delete') {
                    deleteSubmission(db, appId, submissionId);
                }
            });
            tableBody.appendChild(row);
        } catch (error) {
            console.error("Failed to render a submission row for:", doc.id, error);
        }
    });
}

async function approveResubmission(db, appId, submissionId) {
    const studentName = submissionId.split('__')[1] || submissionId;
    if (!confirm(`Are you sure you want to approve a resubmission for ${studentName}?`)) return;
    const submissionRef = doc(db, `/artifacts/${appId}/public/data/submissions`, submissionId);
    await updateDoc(submissionRef, { resubmissionStatus: 'approved' });
}

async function deleteSubmission(db, appId, submissionId) {
    const studentName = submissionId.split('__')[1] || submissionId;
    if (!confirm(`WARNING: This will permanently delete all attempts for ${studentName}. Are you sure?`)) return;
    const submissionRef = doc(db, `/artifacts/${appId}/public/data/submissions`, submissionId);
    await deleteDoc(submissionRef);
}

/**
 * Initializes the entire teacher dashboard, including the real-time listener for notifications.
 * @param {object} firebaseServices - Contains db, auth, appId instances.
 * @returns {Function} A function to unsubscribe from the listener.
 */
export function initTeacherDashboard(firebaseServices) {
    isFirstLoad = true; // Reset for each time the teacher logs in
    const { db, appId } = firebaseServices;
    const submissionsCollectionRef = collection(db, `/artifacts/${appId}/public/data/submissions`);
    
    const unsubscribe = onSnapshot(query(submissionsCollectionRef), (snapshot) => {
        renderDashboard(snapshot.docs, firebaseServices);

        if (isFirstLoad) {
            isFirstLoad = false;
            return;
        }

        snapshot.docChanges().forEach((change) => {
            const docData = change.doc.data();
            if (change.type === "added") {
                showToastNotification(`New Submission: ${docData.studentName} has submitted their work.`, 'success');
            }
            if (change.type === "modified") {
                if (docData.resubmissionStatus === 'requested') {
                    showToastNotification(`Request: ${docData.studentName} is requesting a resubmission.`, 'warning');
                }
                if (docData.attempt2 && docData.resubmissionStatus === 'completed') {
                     showToastNotification(`Resubmission: ${docData.studentName} has submitted their second attempt.`, 'info');
                }
            }
        });
    });

    return unsubscribe;
}