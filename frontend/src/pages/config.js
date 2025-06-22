
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // eslint-disable-next-line no-restricted-globals
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

const firebaseConfig = {
  apiKey: "AIzaSyBcYJ1QevHTfHRbdoGeppHSZG-vOBHgxhk",
  authDomain: "kasavu-aalayam-a1acc.firebaseapp.com",
  projectId: "kasavu-aalayam-a1acc",
  storageBucket: "kasavu-aalayam-a1acc.firebasestorage.app",
  messagingSenderId: "1098820290372",
  appId: "1:1098820290372:web:0705e726d5cea16cba7911",
  measurementId: "G-YP15GVJ51W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LdcqWkrAAAAAA-S8sS1yE6GwIqXMkqxrEJFQHs0'),
  isTokenAutoRefreshEnabled: true
});

export { app, auth, analytics };

