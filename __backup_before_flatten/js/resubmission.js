import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { showModal, hideModal } from './utils.js';

const submissionText = document.getElementById('submission-text');
const requestResubmissionButton = document.getElementById('request-resubmission-button');

/**
 * Updates the post-submission view based on the student's document data.
 * @param {object} studentDoc - The student's submission data from Firestore.
 */
export function handlePostSubmissionView(studentDoc) {
    if (!studentDoc) return;
    const { resubmissionStatus, attempt1, attempt2 } = studentDoc;

    if (resubmissionStatus === 'requested') {
        submissionText.textContent = "Your request for resubmission is pending teacher approval.";
        requestResubmissionButton.classList.add('hidden');
    } else if (resubmissionStatus === 'none' && attempt1 && !attempt2) {
        submissionText.textContent = "You have completed this assignment.";
        requestResubmissionButton.classList.remove('hidden');
    } else if (resubmissionStatus === 'completed' && attempt2) {
        submissionText.textContent = "You have completed your resubmission.";
        requestResubmissionButton.classList.add('hidden');
    } else if (resubmissionStatus === 'denied') {
        submissionText.textContent = "Your request for resubmission was denied by the teacher.";
        requestResubmissionButton.classList.add('hidden');
    }
}

/**
 * Handles the student's click on the "Request Resubmission" button.
 * @param {object} firebaseServices - Contains db, appId instances.
 * @param {string} currentStudent - The name of the current student.
 */
export async function handleRequestResubmission(firebaseServices, currentStudent) {
    if (!currentStudent) return;
    const { db, appId } = firebaseServices;
    const studentDocRef = doc(db, `/artifacts/${appId}/public/data/submissions`, currentStudent);
    try {
        await updateDoc(studentDocRef, { resubmissionStatus: 'requested' });
        submissionText.textContent = "Your request has been sent to the teacher for approval.";
        requestResubmissionButton.classList.add('hidden');
    } catch (error) {
        console.error("Error requesting resubmission:", error);
        showModal('Error', 'Could not send your request. Please try again later.', [{ text: 'OK', classes: 'text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5', onClick: hideModal }]);
    }
}

/**
 * Shows a confirmation modal for the teacher to approve or deny a resubmission request.
 * @param {object} firebaseServices - Contains db, appId instances.
 * @param {string} studentName - The name of the student requesting resubmission.
 */
export function handleApproveResubmission(firebaseServices, studentName) {
    const { db, appId } = firebaseServices;
     showModal( 'Approve Resubmission', `<p>Do you want to allow <strong>${studentName}</strong> to retake the quiz? Their original score will be saved for comparison.</p>`,
        [
            { 
                text: 'Deny', 
                classes: 'text-slate-700 bg-slate-200 hover:bg-slate-300 font-medium rounded-lg text-sm px-5 py-2.5', 
                onClick: async () => {
                    const studentDocRef = doc(db, `/artifacts/${appId}/public/data/submissions`, studentName);
                    await updateDoc(studentDocRef, { resubmissionStatus: 'denied' });
                    hideModal();
                }
            },
            { 
                text: 'Approve', 
                classes: 'text-white bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5', 
                onClick: async () => {
                    const studentDocRef = doc(db, `/artifacts/${appId}/public/data/submissions`, studentName);
                    try {
                        await updateDoc(studentDocRef, { resubmissionStatus: 'approved' });
                        hideModal();
                    } catch (error) {
                        console.error("Error approving resubmission: ", error);
                    }
                }
            }
        ]
    );
}
