// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nebula-8c178.firebaseapp.com",
  projectId: "nebula-8c178",
  storageBucket: "nebula-8c178.appspot.com",
  messagingSenderId: "568794718358",
  appId: "1:568794718358:web:641336de78239bfd9822b7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
