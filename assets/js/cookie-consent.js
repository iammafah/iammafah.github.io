(function () {
  const CONSENT_KEY = "cookieConsent";
  const GA_ID = "G-152PY8RBTJ";

  function loadAnalytics() {
    if (window.gaLoaded) return;
    window.gaLoaded = true;

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());

    gtag("config", GA_ID, {
      anonymize_ip: true,
    });
  }

  function initCookieSystem() {
    const banner = document.getElementById("cookie-banner");
    const btn = document.getElementById("accept-cookies");
    const declineBtn = document.getElementById("decline-cookies"); // ← added

    if (!banner || !btn) {
      console.log("Cookie banner not ready yet");
      return;
    }

    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === "accepted") {
      banner.style.display = "none";
      loadAnalytics();
      return;
    }

    if (consent === "declined") {
      // ← added
      banner.style.display = "none";
      return;
    }

    setTimeout(() => {
      banner.style.display = "flex";
    }, 1000);

    btn.addEventListener("click", function () {
      localStorage.setItem(CONSENT_KEY, "accepted");
      banner.style.display = "none";
      loadAnalytics();
    });

    if (declineBtn) {
      // ← added
      declineBtn.addEventListener("click", function () {
        localStorage.setItem(CONSENT_KEY, "declined");
        banner.style.display = "none";
      });
    }
  }

  window.initCookieSystem = initCookieSystem;
})();
