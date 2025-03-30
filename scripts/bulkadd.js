import {doc, setDoc, deleteDoc, addDoc, collection}
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {getTemplate} from "./perf-entry.js";
import {auth, db, provider, getPerformances} from "../scripts/firebaseCall.js";

async function addJson() {
    const response = await fetch('media/performances.json');
    carList = await response.json()
}