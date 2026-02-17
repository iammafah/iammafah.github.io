import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const BACKEND_URL = "https://identity-gateway-service.onrender.com";

async function sendToken(user) {
  try {
    const token = await user.getIdToken();

    await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
  } catch (err) {
    console.error("Backend login failed:", err);
  }

  // redirect always hona chahiye
  window.location.href = "https://iammafah.site/";
}

/* EMAIL SIGNUP */
window.signup = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await sendEmailVerification(cred.user);
    await sendToken(cred.user);

  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      alert("Account already exists. Please login.");
    } else {
      alert(err.message);
    }
  }
};

/* EMAIL LOGIN */
window.login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await sendToken(cred.user);
  } catch (err) {
    alert(err.message);
  }
};

/* GOOGLE LOGIN */
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await sendToken(result.user);
};

/* FACEBOOK LOGIN */
window.facebookLogin = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await sendToken(result.user);
};
