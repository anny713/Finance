
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth'; // Import Firebase Auth

// Your web app's Firebase configuration
// This configuration is now hardcoded as per your request.
// For production, consider moving these back to environment variables.
// You can find these values in your Firebase project settings:
// Project settings > General > Your apps > Web app > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "AIzaSyD1A3k5ibx7QJEbmiataDIf3iRTsj8rF7I",
  authDomain: "my-finance-flow-app.firebaseapp.com",
  databaseURL: "https://my-finance-flow-app-default-rtdb.firebaseio.com",
  projectId: "my-finance-flow-app",
  storageBucket: "my-finance-flow-app.firebasestorage.app", 
  messagingSenderId: "200371624913",
  appId: "1:200371624913:web:0e4cee6ff394c302ca5ef0"
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth; 

if (getApps().length === 0) {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app); // Initialize Firebase Auth
  } else {
    console.error("Firebase configuration is missing or incomplete. Please check the hardcoded firebaseConfig object.");
    // Fallback or throw error, for now, db might remain undefined or app init might fail.
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
  auth = getAuth(app); // Get Auth instance for existing app
}

export { app, db, auth };
