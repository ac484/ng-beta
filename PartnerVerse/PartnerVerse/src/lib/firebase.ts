import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "partnerverse",
  appId: "1:411655822014:web:b615359ad3953f73c9dcef",
  storageBucket: "partnerverse.firebasestorage.app",
  apiKey: "AIzaSyApkRj7Wm87fF9eD1Gk_B1bNsTh1M2QxIc",
  authDomain: "partnerverse.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "411655822014"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
