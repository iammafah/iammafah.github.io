import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAikK-IpJA32RbScGPpYg9mbAMO9eye41w",
  authDomain: "singup-backend.firebaseapp.com",
  projectId: "singup-backend",
  storageBucket: "singup-backend.firebasestorage.app",
  messagingSenderId: "669712336591",
  appId: "1:669712336591:web:f0e06d7311d5b2feccd9ba",
  measurementId: "G-BGD19K9STW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
