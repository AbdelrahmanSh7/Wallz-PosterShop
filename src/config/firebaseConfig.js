// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDbXnV4r3kDBrV_OpbKSfnf8p0vCYEpcKk",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "wallz-edc33.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "wallz-edc33",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "wallz-edc33.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "272258313663",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:272258313663:web:c0af764ea6d55aeed7c50a",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-JR4B7002ST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;

// Instructions for setting up Firebase:
/*
1. Go to https://console.firebase.google.com/
2. Create a new project or select existing one
3. Go to Project Settings → General
4. Scroll down to "Your apps" section
5. Click "Add app" → Web app
6. Register your app with a nickname
7. Copy the config object and replace the values above
8. Go to Firestore Database → Create database
9. Choose "Start in test mode" for now
10. Select a location for your database
11. Your Firebase setup is complete!
*/
