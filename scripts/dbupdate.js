// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

import {doc, setDoc, deleteDoc, addDoc, collection}
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {getTemplate} from "./perf-entry.js";
import {auth, db, provider, getPerformances} from "../scripts/firebaseCall.js";


//   const firebaseConfig = {
//     apiKey: "AIzaSyAhXlU_15Or2ufrJ3Xd2X4SGvrX5yMXEbs",
//     authDomain: "trhs-performances.firebaseapp.com",
//     databaseURL: "https://trhs-performances-default-rtdb.firebaseio.com",
//     projectId: "trhs-performances",
//     storageBucket: "trhs-performances.firebasestorage.app",
//     messagingSenderId: "246170206797",
//     appId: "1:246170206797:web:cf2c155d4284389d079204",
//     measurementId: "G-EFBX76XZ89"
//   };

let message = document.querySelector(".updateMessage");
let container = document.querySelector('#performance-list');
let main = document.querySelector('main');
let performances = [];

  

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore();
// const provider = new GoogleAuthProvider();



// 🔐 ALLOWED GOOGLE PROFILE (change this to the allowed email)
const ALLOWED_USER = "samsmithsmusic@gmail.com";

// 🚀 Sign in with Google
document.getElementById("login-btn").addEventListener("click", () => {
  message.innerText = "Logging In...";
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      if (user.email === ALLOWED_USER) {
        message.innerText = "Success!";
        console.log("Access Granted:", user.email);
        document.getElementById("status").textContent = `Welcome, ${user.displayName}!`;
        document.getElementById("login-btn").classList.add("hidden");
        document.getElementById("logout-btn").style.display ="inline";
        loadPerformances();
      } else {
        // alert("Access Denied. Unauthorized user.");
        signOut(auth); // Log them out immediately
      }
    })
    .catch((error) => {
      message.innerText = "Login Failed";
      console.log("Login Failed", error)
    });
    });

// 🔑 Check authentication state
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user.email);
    document.getElementById("login-btn").classList.add("hidden");
    document.getElementById("logout-btn").style.display ="inline";

    if (user.email == ALLOWED_USER) {
      clearPerformances();
      // loadPerformances();
    }
  } else if (user !== ALLOWED_USER && user !== null){
    clearPerformances();
    
    message.innerText = "Access Denied. Unauthorized user.";
    
    signOut(auth);
    
  }
    else {
      clearPerformances();
      message.innerText = "Login to See Performances";

    console.log("No user is signed in.");
  }
});

// 🚪 Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("User signed out.");
    document.getElementById("status").textContent = "Logged Out!";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("login-btn").classList.remove("hidden");
    // message.innerText = "Login to See Performances";
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

// Load Performances on Login
async function loadPerformances() {
  const user = auth.currentUser;
  if (user == null || user.email !== ALLOWED_USER) {
    return;
  }

  message.innerText = "Loading Performances...";

  performances = await getPerformances(); 
if (performances != null) {
  performances.forEach(performance => {
    displayPerformance(performance, container);
  });
  message.innerText = "";
}
else {
  message.innerText = "No Performances Found";
}

}

async function displayPerformance(performance, container) {

  let perfCard = document.createElement("div");
  perfCard.classList.add("performance-card");

  perfCard.innerHTML = getTemplate(performance);

  let modDiv = document.createElement("div");
  modDiv.classList.add("modifiers");

  let edit = document.createElement("img");
  edit.classList.add("edit");
  edit.src = "../media/pencil.webp";
  edit.alt = "edit symbol";
  edit.addEventListener("click", () => editPerformance(performance));

  let del = document.createElement("img");
  del.classList.add("delete");
  del.src = "../media/delete.webp";
  del.alt = "delete symbol";
  del.addEventListener("click", () => deletePerformance(performance));

  modDiv.appendChild(edit);
  modDiv.appendChild(del);

  perfCard.appendChild(modDiv);

  container.appendChild(perfCard);
  
}

function clearPerformances() {
  document.querySelectorAll(".performance-card").forEach(card => {
    card.remove();
  })
}

function editPerformance(performance) {
  buildLightBox();
  edit(performance);
  console.log("Edit:", performance.Song);
}

function deletePerformance(performance) {
  buildLightBox();
  
  let warning = document.createElement('h2');
  warning.innerHTML = `Are you sure you want to delete:<br> ${performance.Song}?<br>This <b>cannot</b> be undone!!`;
  document.querySelector('.editBox').append(warning);

  let proceed = document.createElement('div');
  proceed.setAttribute('id', 'deleteBtn');
  proceed.innerHTML = "Proceed";

  let alerts = document.createElement('label');
  alerts.setAttribute('class', 'alerts');
  document.querySelector('.editBox').append(alerts);
  
  document.querySelector('.editBox').append(proceed);

  proceed.addEventListener('click', async () => {
  alerts.innerText = "Deleting...";
  console.log("Delete:", performance.Song);
  await deleteData(performance);
  });
}

function buildLightBox() {
  document.querySelector('body').setAttribute('style', 'overflow: hidden;');

  let lightBox = document.createElement("div");
  let Xit = document.createElement("span");
  
  lightBox.classList.add("editBack");
  Xit.classList.add("exitBtn");
  Xit.innerText = "X";

  let editBox = document.createElement("div");
  editBox.classList.add("editBox");

  lightBox.append(Xit);
  lightBox.append(editBox);
  main.append(lightBox);

  document.querySelector(".exitBtn").addEventListener("click", destroyLightBox);
}

function destroyLightBox() {
  document.querySelector('body').setAttribute('style', 'overflow: show');

  document.querySelector('.editBack').remove();
}


function edit(performance) {

  let {choirs, concerts, years} = getUniqueValues(performances);

  let form = document.createElement("form");
  form.setAttribute('id', 'editForm');

  form.innerHTML = getFormStructure(performance, choirs, concerts, years);

  

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".alerts").innerText = "Submitting...";
    await submitEdits(Object.fromEntries(new FormData(e.target).entries()), performance);
});

  document.querySelector(".editBox").append(form);

  //Concert DropDown
  document.querySelector(".dropDownLabel.concert .new-concert").addEventListener("click", () => {
    let newConcert = document.createElement("input");
    newConcert.setAttribute("type", "text");
    newConcert.setAttribute("id", "concert");
    newConcert.setAttribute("name", "Concert");
    newConcert.setAttribute("required", "");
    
    document.querySelector(".dropDownLabel.concert select").remove();
    document.querySelector(".dropDownLabel.concert").append(newConcert);
    document.querySelector(".dropDownLabel.concert .new-concert").remove();
    
  });

  //Choir Dropdown
  document.querySelector(".dropDownLabel.choir .new-choir").addEventListener("click", () => {
    let newChoir = document.createElement("input");
    newChoir.setAttribute("type", "text");
    newChoir.setAttribute("id", "choir");
    newChoir.setAttribute("name", "Choir");
    newChoir.setAttribute("required", "");
    
    document.querySelector(".dropDownLabel.choir select").remove();
    document.querySelector(".dropDownLabel.choir").append(newChoir);
    document.querySelector(".dropDownLabel.choir .new-choir").remove();
    
  });

  //Year Dropdown
  document.querySelector(".dropDownLabel.year .new-year").addEventListener("click", () => {
    let newYear = document.createElement("input");
    newYear.setAttribute("type", "text");
    newYear.setAttribute("id", "year");
    newYear.setAttribute("name", "Year");
    newYear.setAttribute("required", "");
    
    document.querySelector(".dropDownLabel.year select").remove();
    document.querySelector(".dropDownLabel.year").append(newYear);
    document.querySelector(".dropDownLabel.year .new-year").remove();
    
  });

}

function getUniqueValues(performances) {
  let choirs = new Set();
  let concerts = new Set();
  let years = new Set();

  performances.forEach(performance => {
    choirs.add(performance.Choir);
    concerts.add(performance.Concert);
    years.add(performance.Year);
  });

  return {
    choirs: Array.from(choirs),
    concerts: Array.from(concerts),
    years: Array.from(years)
  };
}

function getFormStructure(performance, choirs, concerts, years) {
  return `
  <form id="editForm">
              <h2>Performance Details <br>Editor</h2>
  
              <label for="song">Song:</label>
              <input type="text" id="song" name="Song" value="${performance.Song || ""}" required>

              <label for="credit">Credit:</label>
              <input type="text" id="credit" name="Credit" value="${performance.Credit || ""}" required>
  
              <label for="source">Source:</label>
              <input type="text" id="source" name="Source" value="${performance.Source || ""}" required>

              <label for="choir">Choir: </label>
              <div class="dropDownLabel choir"> <select list="choirs" id="choir" name="Choir" value="${performance.Choir || ''}" required>
                  ${choirs.map(choir => `<option value="${choir}" ${choir === performance.Choir ? "selected" : ""}>${choir}</option>`).join("")}
                  </select> <p class="new-choir">New</p></div>
  
              <label for="concert">Concert: </label>
              <div class="dropDownLabel concert"> <select list="concerts" id="concert" name="Concert" value="${performance.Concert || ''}" required>
                  ${concerts.map(concert => `<option value="${concert}" ${concert === performance.Concert ? "selected" : ""}>${concert}</option>`).join("")}
                  </select> <p class="new-concert">New</p></div>
              
              <label for="year">Year: </label>
              <div class="dropDownLabel year"> <select list="years" id="year" name="Year" value="${performance.Year || ''}" required>
                  ${years.map(year => `<option value="${year}" ${year === performance.Year ? "selected" : ""}>${year}</option>`).join("")}
                  </select> <p class="new-year">New</p></div>

              <label class="alerts"></label>        
              <input id="submitBtn" type="submit" value="Save">
              </form>
  `
}

async function submitEdits(data,performance) {
  const user = auth.currentUser;
  if (user && user.email === ALLOWED_USER) {
    try {
      let docRef = doc(db, "performances", performance.id);
      await setDoc(docRef, data);
      alert("Changes Saved!");
      destroyLightBox();
      clearPerformances();
      loadPerformances();
    }
    catch (e) {
      console.log(e);
      alert("Error Processing Data");
    }
  } else {
    alert("Unauthorized action!");
  }
}

async function deleteData(performance) {
  const user = auth.currentUser;
  if (user && user.email === ALLOWED_USER) {
    try {
      let docRef = doc(db, "performances", performance.id);
      await deleteDoc(docRef);
      alert("Document Deleted Successfully!");
      destroyLightBox();
      clearPerformances();
      loadPerformances();
    }
    catch (e) {
      console.log(e);
      alert("Error Processing Data");
    }
  } else {
    alert("Unauthorized action!");
  }
}

function createEntry() {
  const user = auth.currentUser;
  if (user == null || user.email !== ALLOWED_USER) {
    message.innerText = "Unauthorized Request.";
    return;
  }
  else {
    buildLightBox();
      console.log("Create Entry");

      let {choirs, concerts, years} = getUniqueValues(performances);

    let form = document.createElement("form");
    form.setAttribute('id', 'editForm');

    form.innerHTML = getFormStructure(performance, choirs, concerts, years);

    document.querySelector(".editBox").append(form);


    //Concert DropDown
  document.querySelector(".dropDownLabel.concert .new-concert").addEventListener("click", () => {
    let newConcert = document.createElement("input");
    newConcert.setAttribute("type", "text");
    newConcert.setAttribute("id", "concert");
    newConcert.setAttribute("name", "Concert");
    newConcert.setAttribute("required", "");
    
    document.querySelector(".dropDownLabel.concert select").remove();
    document.querySelector(".dropDownLabel.concert").append(newConcert);
    document.querySelector(".dropDownLabel.concert .new-concert").remove();
    
  });

  //Choir Dropdown
  document.querySelector(".dropDownLabel.choir .new-choir").addEventListener("click", () => {
    let newChoir = document.createElement("input");
    newChoir.setAttribute("type", "text");
    newChoir.setAttribute("id", "choir");
    newChoir.setAttribute("name", "Choir");
    newChoir.setAttribute("required", "");
    
    document.querySelector(".dropDownLabel.choir select").remove();
    document.querySelector(".dropDownLabel.choir").append(newChoir);
    document.querySelector(".dropDownLabel.choir .new-choir").remove();
    
  });

  //Year Dropdown
  document.querySelector(".dropDownLabel.year .new-year").addEventListener("click", () => {
    let newYear = document.createElement("input");
    newYear.setAttribute("type", "text");
    newYear.setAttribute("id", "year");
    newYear.setAttribute("name", "Year");
    newYear.setAttribute("required", "");
    
    document.querySelector(".dropDownLabel.year select").remove();
    document.querySelector(".dropDownLabel.year").append(newYear);
    document.querySelector(".dropDownLabel.year .new-year").remove();
    
  });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      document.querySelector(".alerts").innerText = "Submitting...";
      await submitNew(Object.fromEntries(new FormData(e.target).entries()));
  });

  
}
}

async function submitNew(data) {
  const user = auth.currentUser;
  if (user && user.email === ALLOWED_USER) {
    try {
      await addDoc(collection(db, "performances"), data);
      console.log("Performance Added!");
      destroyLightBox();
      clearPerformances();
      loadPerformances();
    }
    catch (e) {
      console.log(e);
      alert("Error Processing Data");
    }
  } else {
    alert("Unauthorized action!");
  }
}

async function addJson() {
  const response = await fetch('../media/performances.json');
  let carList = await response.json()
  carList.forEach(car => {
    console.log(car);
    submitNew(car);
  }
)}


window.onload = function() {
  document.querySelector(".updateMessage").innerText = "Attempting to Load Performances...";
  setTimeout(loadPerformances, 1500)
};


document.getElementById("write-btn").addEventListener("click", writeData);
document.getElementById("read-btn").addEventListener("click", readData);
document.querySelector("p.add").addEventListener("click", () => {createEntry();});

// document.querySelector(".edit").addEventListener("click", () => {
// console.log(this.title)})












