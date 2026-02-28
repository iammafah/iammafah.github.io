import { auth } from "./firebase-init.js"; // Firebase auth instance
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"; // Firebase providers

/* ================= SEND TOKEN TO BACKEND ================= */
async function sendToken(user) { // Backend login function

  const token = await user.getIdToken(); // Firebase ID token lo

  const response = await fetch("https://identity-gateway-service-production.up.railway.app/auth/login", { // Backend endpoint
    method: "POST", // POST request
    headers: {
      "Authorization": `Bearer ${token}` // Token header me bhej rahe ho
    },
    credentials: "include" // Important agar backend cookie set kare
  });

  const data = await response.json(); // Response parse karo (sirf ek baar)

  if (!response.ok) { // Agar backend error de
    alert(data.error || "Login failed"); // Error show karo
    return;
  }
  window.location.href = "/redirect/"; // Next step redirect
}

/* ================= GOOGLE LOGIN ================= */
window.googleLogin = async () => { // Button se call hoga
  try {
    const provider = new GoogleAuthProvider(); // Google provider
    const result = await signInWithPopup(auth, provider); // Popup login
    await sendToken(result.user); // Backend login
  } catch (err) {
    alert(err.message); // Error show
  }
};

/* ================= FACEBOOK LOGIN ================= */
window.facebookLogin = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await sendToken(result.user);
  } catch (err) {
    alert(err.message);
  }
};