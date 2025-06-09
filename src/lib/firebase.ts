
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Add if you use Firebase Auth features beyond custom

// Your web app's Firebase configuration
// This configuration is now hardcoded as per your request.
// For production, consider moving these back to environment variables.
const firebaseConfig = {
  apiKey: "AIzaSyD1A3k5ibx7QJEbmiataDIf3iRTsj8rF7I",
  authDomain: "my-finance-flow-app.firebaseapp.com",
  databaseURL: "https://my-finance-flow-app-default-rtdb.firebaseio.com",
  projectId: "my-finance-flow-app",
  storageBucket: "my-finance-flow-app.firebasestorage.app", // Note: Original template used .appspot.com, ensure this is correct for your project
  messagingSenderId: "200371624913",
  appId: "1:200371624913:web:0e4cee6ff394c302ca5ef0"
  // measurementId is optional and was not provided in the new config.
};

let app: FirebaseApp;
let db: Firestore;
// let auth: Auth; // Uncomment if using Firebase Auth

if (getApps().length === 0) {
  // Check if all required config values are present (basic check)
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.error("Firebase configuration is missing or incomplete. Please check the hardcoded firebaseConfig object.");
    // Fallback or throw error, for now, db might remain undefined or app init might fail.
    // This will likely lead to errors downstream if db is used without proper init.
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

// auth = getAuth(app); // Uncomment if using Firebase Auth

export { app, db /*, auth */ };
