import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, getDocs, collection} 
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAhXlU_15Or2ufrJ3Xd2X4SGvrX5yMXEbs",
    authDomain: "trhs-performances.firebaseapp.com",
    databaseURL: "https://trhs-performances-default-rtdb.firebaseio.com",
    projectId: "trhs-performances",
    storageBucket: "trhs-performances.firebasestorage.app",
    messagingSenderId: "246170206797",
    appId: "1:246170206797:web:cf2c155d4284389d079204",
    measurementId: "G-EFBX76XZ89"
  };

  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore();
  export const provider = new GoogleAuthProvider();

export  async function getPerformances() {
  
    const user = auth.currentUser;
    let response = await getDocs(collection(db, "performances"));
    
    let performances = [];

    response.forEach(doc => {
        console.log(doc.data());
        let performace = doc.data();
        performace.id = doc.id;
        performances.push(performace);
      });
    
    if (performances != null) {
      return performances;
    }
    else {
      return null;
    }
  }