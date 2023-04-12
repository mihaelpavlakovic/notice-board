// firebase imports
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnPuw7C0yqchDd8FN5jrOgSvO6JBJYMRM",
  authDomain: "notice-board-90513.firebaseapp.com",
  projectId: "notice-board-90513",
  storageBucket: "notice-board-90513.appspot.com",
  messagingSenderId: "892560959378",
  appId: "1:892560959378:web:9b799debc5c4ad3433834b",
  measurementId: "G-N72C9EYJT8",
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore();

export { app, analytics, auth, storage, db };
