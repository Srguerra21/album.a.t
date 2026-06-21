import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { getFirestore }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



const firebaseConfig = {

  apiKey: "AIzaSyDiGgMTWkJmEImLpCJxZNC6VkEwn21CWGw",

  authDomain: "albumat.firebaseapp.com",

  projectId: "albumat",

  messagingSenderId: "639445489743",

  appId: "1:639445489743:web:720572fb2a40c7ff82b23a"

};



const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);