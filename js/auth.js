// js/auth.js
import { getFirestore, doc, getDoc, onSnapshot, query, collection, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { getSubmissionRef } from './submission.js';
import { displaySubmittedView } from './quiz-handler.js';

const TEACHER_PASSWORD = '338495';

const studentSelectionView = document.getElementById('student-selection-view');
const allSubmissionsView = document.getElementById('all-submissions-view');
const studentSelect = document.getElementById('student-select');
const startAssignmentButton = document.getElementById('start-assignment-button');
const studentSelectError = document.getElementById('student-select-error');
const studentDisplayName = document.getElementById('student-display-name');
const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password-input');
const loginError = document.getElementById('login-error');
const teacherLoginButton = document.getElementById('teacher-login-button');
const cancelLoginButton = document.getElementById('cancel-login-button');
const teacherLogoutButton = document.getElementById('teacher-logout-button');

export function handleAuth(firebaseServices, callbacks) {
    const { db, appId } = firebaseServices;
    let unsubscribeSubmissions = null;

    startAssignmentButton.addEventListener('click', async () => {
        if (studentSelect.value) {
            const currentStudent = studentSelect.value;
            studentDisplayName.textContent = currentStudent;
            studentSelectError.classList.add('hidden');
            
            const studentDocRef = getSubmissionRef(db, appId, currentStudent);
            const docSnap = await getDoc(studentDocRef);
            const studentDoc = docSnap.exists() ? docSnap.data() : null;

            if (studentDoc && studentDoc.attempt1 && studentDoc.resubmissionStatus !== 'approved') {
                displaySubmittedView(studentDoc);
            } else {
                callbacks.onStudentLogin(currentStudent, studentDoc);
            }
        } else {
            studentSelectError.classList.remove('hidden');
        }
    });

    teacherLoginButton.addEventListener('click', () => loginOverlay.classList.remove('hidden'));
    
    cancelLoginButton.addEventListener('click', () => {
        loginOverlay.classList.add('hidden');
        loginError.classList.add('hidden');
        passwordInput.value = '';
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (passwordInput.value === TEACHER_PASSWORD) {
            studentSelectionView.classList.add('hidden');
            loginOverlay.classList.add('hidden');
            allSubmissionsView.classList.remove('hidden');
            
            if (unsubscribeSubmissions) unsubscribeSubmissions();
            const submissionsCollectionRef = collection(db, `/artifacts/${appId}/public/data/submissions`);
            unsubscribeSubmissions = onSnapshot(query(submissionsCollectionRef), (snapshot) => {
                callbacks.onTeacherLogin(snapshot.docs);
            });
        } else {
            loginError.classList.remove('hidden');
        }
    });

    teacherLogoutButton.addEventListener('click', () => {
        allSubmissionsView.classList.add('hidden');
        studentSelectionView.classList.remove('hidden');
        if(unsubscribeSubmissions) unsubscribeSubmissions();
    });

    const submittedView = document.getElementById('submitted-view');
    submittedView.querySelector('#back-to-select-button')?.addEventListener('click', () => {
        submittedView.classList.add('hidden');
        studentSelectionView.classList.remove('hidden');
        studentSelect.value = '';
    });
}