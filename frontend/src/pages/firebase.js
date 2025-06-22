// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3K2b6UsLRX8FzE_emtdK3cfxaf3BqkCk",
  authDomain: "kasavu-aalayam.firebaseapp.com",
  projectId: "kasavu-aalayam",
  storageBucket: "kasavu-aalayam.appspot.com",
  messagingSenderId: "1013946621358",
  appId: "1:1013946621358:web:bd59255db980c42a977c3f",
  measurementId: "G-7HMG54LZC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth }; // Export both app and auth instances