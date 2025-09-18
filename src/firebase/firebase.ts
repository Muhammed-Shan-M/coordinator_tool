
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyDNb3mL5yp-9_m5MFuQ7a6YqjMum0m10wE",
  authDomain: "coordinator-tool.firebaseapp.com",
  projectId: "coordinator-tool",
  storageBucket: "coordinator-tool.firebasestorage.app",
  messagingSenderId: "1060347363849",
  appId: "1:1060347363849:web:cae7104796f5950ce7aed8",
  measurementId: "G-8D1BZL1CXP"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)