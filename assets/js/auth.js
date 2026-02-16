import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function sendToken(user) {
  const token = await user.getIdToken();

  await fetch("http://127.0.0.1:5000/auth/login", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  window.location.href = "/";
}

// EMAIL SIGNUP
window.signup = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendToken(cred.user);
};

// EMAIL LOGIN
window.login = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const cred = await signInWithEmailAndPassword(auth, email, password);
  await sendToken(cred.user);
};

// GOOGLE
window.googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await sendToken(result.user);
};

// FACEBOOK
window.facebookLogin = async () => {
  const provider = new FacebookAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await sendToken(result.user);
};
