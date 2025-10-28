import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- IMPORTANT ---
// PASTE YOUR FIREBASE CONFIG OBJECT HERE
const firebaseConfig = {
  apiKey: "AIzaSyB4qNTWzUVA3m8xKihEP4rT1JTtX_fX0kw",
  authDomain: "temp-a1437.firebaseapp.com",
  projectId: "temp-a1437",
  storageBucket: "temp-a1437.firebasestorage.app",
  messagingSenderId: "171016256749",
  appId: "1:171016256749:web:36629e9fc55658a89ca0e4",
  measurementId: "G-22R567RD5N"
};

// --- END OF CONFIG ---

const appId = typeof __app_id !== 'undefined' ? __app_id : 'e7-unit-7-quiz';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

let app;
let auth;
let db;

/**
 * Initializes the Firebase app and authenticates the user.
 * @returns {Promise<Object|null>} An object containing the db and auth services, or null on failure.
 */
export async function initializeFirebase() {
    if (!firebaseConfig.apiKey) {
        console.error("Firebase configuration is missing!");
        return null;
    }

    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        if (initialAuthToken) {
            await signInWithCustomToken(auth, initialAuthToken);
        } else {
            await signInAnonymously(auth);
        }
        
        console.log("Firebase initialized and user authenticated.");
        return { db, auth, appId };

    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return null;
    }
}
