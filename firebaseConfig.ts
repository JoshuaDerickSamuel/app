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
  apiKey: "AIzaSyBBZFhJ73ghMZNIL-gjCiLHaYMpg6wgiXM",
  authDomain: "bibleaudio-f0ed8.firebaseapp.com",
  projectId: "bibleaudio-f0ed8",
  storageBucket: "bibleaudio-f0ed8.firebasestorage.app",
  messagingSenderId: "846245652608",
  appId: "1:846245652608:web:2083187a9d6fc85af05e65",
  measurementId: "G-P6GMLG8466"
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
