import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSaiEbxgKc5y7ZMkC6wDjxW7s4oCaon04",
  authDomain: "ics4u-c5db2.firebaseapp.com",
  projectId: "ics4u-c5db2",
  storageBucket: "ics4u-c5db2.appspot.com",
  messagingSenderId: "362635239545",
  appId: "1:362635239545:web:9c241d0e99eca3466934a8"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

export { auth, firestore, storage }
