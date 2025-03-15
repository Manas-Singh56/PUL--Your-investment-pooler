// src/firebase.js - Firebase configuration file
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAJUTjtZAiskSD2mrGInS_M_IJZFUQ3zy4",
  authDomain: "pul-6f508.firebaseapp.com",
  projectId: "pul-6f508",
  storageBucket: "pul-6f508.firebasestorage.app",
  messagingSenderId: "572279923197",
  appId: "1:572279923197:web:d7cb3bc96783a8c45a7994",
  measurementId: "G-3JHDM51WH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAJUTjtZAiskSD2mrGInS_M_IJZFUQ3zy4",
//   authDomain: "pul-6f508.firebaseapp.com",
//   projectId: "pul-6f508",
//   storageBucket: "pul-6f508.firebasestorage.app",
//   messagingSenderId: "572279923197",
//   appId: "1:572279923197:web:d7cb3bc96783a8c45a7994",
//   measurementId: "G-3JHDM51WH3"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);