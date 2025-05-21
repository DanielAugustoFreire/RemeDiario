// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg4qDLkCb3J3pgRwIUJgQUBhUjVdMOfLg",
  authDomain: "todolistdm-b437b.firebaseapp.com",
  databaseURL: "https://todolistdm-b437b-default-rtdb.firebaseio.com",
  projectId: "todolistdm-b437b",
  storageBucket: "todolistdm-b437b.firebasestorage.app",
  messagingSenderId: "945969869352",
  appId: "1:945969869352:web:4956cec1e50d33c7943b1d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app); //

export { db };