import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNPIejG8T3mo7NMmXWeeqf3WzJvCvcmQc",
  authDomain: "chatdemo-92653.firebaseapp.com",
  projectId: "chatdemo-92653",
  storageBucket: "chatdemo-92653.appspot.com",
  messagingSenderId: "1023096704221",
  appId: "1:1023096704221:web:2d9235623d569f4c391f34"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()