import { auth } from "./firebase-init.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "/";
    return;
  }

  try {
    const token = await user.getIdToken();

    const response = await fetch("https://identity-gateway-service.onrender.com/auth/login", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!response.ok) {
      throw new Error("Backend login failed");
    }

  } catch (err) {
    console.error("Backend login failed:", err);
  }

  window.location.href = "/";
});