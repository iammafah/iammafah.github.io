import { auth } from "./firebase-init.js"; // Firebase auth
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; // Auth listener

onAuthStateChanged(auth, (user) => { // Firebase state ready hone pe

  if (!user) { // Agar login nahi hai
    window.location.href = "/"; // Login page pe bhej do
    return; // Stop execution
  }

  // Agar user hai → backend already login ho chuka hai
  // Yaha backend call nahi karna

  window.location.href = "/"; // Final protected page
});

