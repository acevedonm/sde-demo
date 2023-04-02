// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVWmoWfGz7pQXiWWCQTM11RTc_d89Y1dc",
  authDomain: "sde-demo-fca0f.firebaseapp.com",
  projectId: "sde-demo-fca0f",
  storageBucket: "sde-demo-fca0f.appspot.com",
  messagingSenderId: "544602591545",
  appId: "1:544602591545:web:faa68860c8d58df9a558e8",
  measurementId: "G-2JYL1NKVYJ",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
