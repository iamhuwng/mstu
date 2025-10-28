// js/main.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';
import { handleAuth } from './auth.js';
import { initQuiz } from './quiz-handler.js';
import { initSubmission } from './submission.js';
import { initTeacherDashboard } from './teacher-dashboard.js';
import { initChatSystem, loadStudentConversation } from './chat.js'; 

async function loadQuizData() {
    const path = location.pathname.replace(/index\.html?$/i, '');
    const href = new URL(`${path}quiz-data.js`, location.origin).href;
    try {
        const mod = await import(href);
        if (!mod.sections) throw new Error('quiz-data.js is missing the "sections" export.');
        document.title = mod.meta?.title || document.title;
        return mod;
    } catch (e) {
        console.error('Failed to load quiz-data.js:', e);
        document.body.innerHTML = `<div style="text-align: center; padding: 4rem;"><h1>Error: Could not load quiz data.</h1><p>Please ensure a valid <strong>quiz-data.js</strong> file exists in this folder.</p></div>`;
        throw e;
    }
}

(async () => {
    const quizData = await loadQuizData();
    window.__ASSIGNMENT_ID__ = quizData.assignmentId || location.pathname;

    const firebaseConfig = {
        apiKey: "AIzaSyB4qNTWzUVA3m8xKihEP4rT1JTtX_fX0kw",
        authDomain: "temp-a1437.firebaseapp.com",
        projectId: "temp-a1437",
        storageBucket: "temp-a1437.firebasestorage.app",
        messagingSenderId: "171016256749",
        appId: "1:171016256749:web:36629e9fc55658a89ca0e4",
        measurementId: "G-22R567RD5N"
    };
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const firebaseServices = { db, app, appId: quizData.assignmentId };
    
    window.__RUNTIME__ = { firebaseServices };

    initSubmission(quizData);
    initChatSystem(firebaseServices);

    handleAuth(firebaseServices, {
        onStudentLogin: (student, doc) => {
            window.__RUNTIME__.currentStudent = student;
            window.__RUNTIME__.studentDoc = doc;
            document.getElementById('student-selection-view')?.classList.add('hidden');
            document.getElementById('form-view')?.classList.remove('hidden');
            document.getElementById('open-chat-button')?.classList.remove('hidden');
            loadStudentConversation(student);
            initQuiz(quizData);
        },
        onTeacherLogin: () => {
            return initTeacherDashboard(firebaseServices);
        }
    });
})();