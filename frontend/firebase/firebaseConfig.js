// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBb51npaNuRPXl02ebqZPvNjQ0MFAdWnNA",
    authDomain: "perfume-99d04.firebaseapp.com",
    projectId: "perfume-99d04",
    storageBucket: "perfume-99d04.firebasestorage.app",
    messagingSenderId: "596696731116",
    appId: "1:596696731116:web:df14e5078f724592be44c9",
    measurementId: "G-H185JRLEJE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);




