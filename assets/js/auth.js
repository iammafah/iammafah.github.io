import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* redirect to loader page */
async function sendToken(user) {
  window.location.href = "/redirect/";
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
