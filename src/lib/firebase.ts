// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "constructo-dih57",
  "appId": "1:297813107124:web:e784c5b11bef87704312e1",
  "storageBucket": "constructo-dih57.firebasestorage.app",
  "apiKey": "AIzaSyBHUNObK6JDORGDGdV5x24ChgtL1Hg3nJ8",
  "authDomain": "constructo-dih57.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "297813107124"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
