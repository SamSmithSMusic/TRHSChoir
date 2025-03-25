// import firebase from 'firebase/app';
// import 'firebase/auth';

// const firebaseConfig = {
//   // Your Firebase project configuration
//   apiKey: "AIzaSyAhXlU_15Or2ufrJ3Xd2X4SGvrX5yMXEbs",
//   authDomain: "trhs-performances.firebaseapp.com",
//   // ... other config values
// };

// firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth(); // Get the Auth service interface

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } 
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
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();
const provider = new GoogleAuthProvider();

// 🔐 ALLOWED GOOGLE PROFILE (change this to the allowed email)
const ALLOWED_USER = "samsmithsmusic@gmail.com";

// 🚀 Sign in with Google
document.getElementById("login-btn").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (user.email === ALLOWED_USER) {
        console.log("Access Granted:", user.email);
        document.getElementById("status").textContent = `Welcome, ${user.displayName}!`;
        document.getElementById("login-btn").classList.add("hidden");
        document.getElementById("logout-btn").style.display ="inline";
      } else {
        // alert("Access Denied. Unauthorized user.");
        signOut(auth); // Log them out immediately
      }
    })
    .catch((error) => console.error("Login Failed", error));
});

// 🔑 Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.email);
    document.getElementById("login-btn").classList.add("hidden");
    document.getElementById("logout-btn").style.display ="inline";
    if (user.email !== ALLOWED_USER) {
      alert("Access Denied. Unauthorized user.");
      signOut(auth);
    }
  } else {
    console.log("No user is signed in.");
  }
});

// 🚪 Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("User signed out.");
    document.getElementById("status").textContent = "Logged Out!";
    document.getElementById("login-btn").classList.remove("hidden");
    document.getElementById("logout-btn").style.display = "none";
  });
});

// 📌 Firestore Read/Write (only if authorized)
async function writeData() {
  const user = auth.currentUser;
  if (user && user.email === ALLOWED_USER) {
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName,
      email: user.email,
      timestamp: new Date()
    });
    alert("Data written successfully!");
  } else {
    alert("Unauthorized action!");
  }
}

async function readData() {
  const user = auth.currentUser;
  if (user && user.email === ALLOWED_USER) {
    const docSnap = await getDoc(doc(db, "users", user.uid));
    if (docSnap.exists()) {
      console.log("User Data:", docSnap.data());
    } else {
      console.log("No data found.");
    }
  } else {
    alert("Unauthorized action!");
  }
}

document.getElementById("write-btn").addEventListener("click", writeData);
document.getElementById("read-btn").addEventListener("click", readData);


document.querySelector(".edit").addEventListener("click", () => {
console.log(this.title)})












