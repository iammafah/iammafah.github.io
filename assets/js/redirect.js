import { auth } from "./firebase-init.js";

async function completeLogin() {
  const user = auth.currentUser;

  if (!user) {
    window.location.href = "/";
    return;
  }

  try {
    const token = await user.getIdToken();

    await fetch("https://identity-gateway-service.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    });
  } catch (err) {
    console.error("Backend login failed:", err);
  }

  window.location.href = "https://iammafah.site/";
}

completeLogin();
