import { auth } from "./firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function sendToken(user) {
  const token = await user.getIdToken();

  await fetch("https://identity-gateway-service.onrender.com/auth/login", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    }
  });

  window.location.href = "https://iammafah.site/";
}

/* EMAIL SIGNUP (auto login + verification mail) */
window.signup = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // verification mail send
    await sendEmailVerification(cred.user);

    // auto login
    await sendToken(cred.user);

  } catch (err) {
    alert(err.message);
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
