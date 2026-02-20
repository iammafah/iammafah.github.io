import { auth } from "./firebase-init.js";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ================= SEND TOKEN TO BACKEND ================= */
async function sendToken(user) {
  const token = await user.getIdToken(); // Firebase ID token lo

  const response = await fetch("https://identity-gateway-service.onrender.com/auth/login", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}` // Backend header expect karta hai
    }
  });

  if (!response.ok) {
    const errData = await response.json();
    alert(errData.error || "Login failed");
    return;
  }

  const data = await response.json();
  console.log("Backend user:", data);

  // Success hone ke baad hi redirect karo
  window.location.href = "/redirect/";
}

/* ================= GOOGLE LOGIN ================= */
window.googleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await sendToken(result.user);
  } catch (err) {
    alert(err.message);
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
