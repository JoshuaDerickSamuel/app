// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqC5PwgBcnlg59pFq7Lwmb-msYzmghbh0",
  authDomain: "smartercloset.firebaseapp.com",
  projectId: "smartercloset",
  storageBucket: "smartercloset.firebasestorage.app",
  messagingSenderId: "277169453417",
  appId: "1:277169453417:web:4e98f857681cc72c2ae5f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

const auth = initializeAuth(app);
const db = getFirestore(app);


export { app, analytics, auth, db };
