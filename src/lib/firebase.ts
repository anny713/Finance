
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth'; // Add if you use Firebase Auth features beyond custom

// IMPORTANT:
// 1. Ensure you have a Firebase project created at https://console.firebase.google.com/
// 2. Register a Web App in your Firebase project settings.
// 3. Enable Firestore Database (in Native mode) in your Firebase project.
// 4. Create a .env.local file in the root of your Next.js project.
// 5. Copy the configuration values from your Firebase project's Web App settings
//    (Project settings > General > Your apps > Web app > SDK setup and configuration)
//    into your .env.local file, using the keys provided in the .env template file.
//    Example .env.local content:
//    NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
//    NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
//    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ (Optional)

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let db: Firestore;
// let auth: Auth; // Uncomment if using Firebase Auth

if (getApps().length === 0) {
  // Check if all required config values are present
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    console.error("Firebase configuration is missing or incomplete. Please check your .env.local file.");
    // Fallback or throw error, for now, db might remain undefined or app init might fail
    // This will likely lead to errors downstream if db is used without proper init.
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

// auth = getAuth(app); // Uncomment if using Firebase Auth

export { app, db /*, auth */ };
