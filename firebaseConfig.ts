// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqC5PwgBcnlg59pFq7Lwmb-msYzmghbh0",
  authDomain: "smartercloset.firebaseapp.com",
  projectId: "smartercloset",
  storageBucket: "smartercloset.firebasestorage.app",
  messagingSenderId: "277169453417",
  appId: "1:277169453417:web:4e98f857681cc72c2ae5f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Export the app instance
export { app, auth };
