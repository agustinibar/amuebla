import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyCOsjCtBOEIXOlFD9Gk5iyTFUfZebTZ6mA",
    authDomain: "amuebla-6a3f2.firebaseapp.com",
    projectId: "amuebla-6a3f2",
    storageBucket: "amuebla-6a3f2.appspot.com",
    messagingSenderId: "600239772605",
    appId: "1:600239772605:web:efb9441534598fd38db8d4",
    measurementId: "G-3YT8DDZ6RF"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(app);
export const db = getFirestore(app);
export const storage = getStorage(app);