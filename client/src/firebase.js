// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "renteyestate.firebaseapp.com",
  projectId: "renteyestate",
  storageBucket: "renteyestate.appspot.com",
  messagingSenderId: "168637707035",
  appId: "1:168637707035:web:1d9f7f47555a86222059be",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
