// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAZCxF5vl4y700B5C7isql33RIdqy49oY",
  authDomain: "live-streaming-ns.firebaseapp.com",
  projectId: "live-streaming-ns",
  storageBucket: "live-streaming-ns.appspot.com",
  messagingSenderId: "77188037179",
  appId: "1:77188037179:web:027c221b3c0f69f23f3a1e",
  measurementId: "G-E3XQXL69XC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const initFirebase = () => {
    return app
}