'use strict';

/* ==================================================
   COMMON UTILS
================================================== */

function toggleActive(el) {
  if (el) el.classList.toggle('active');
}

/* ==================================================
   SIDEBAR
================================================== */

function initSidebar() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sidebar-btn]');
    if (!btn) return;

    const moreInfo = document.querySelector('.sidebar-info_more');
    if (moreInfo) {
      moreInfo.classList.toggle('active');
    }
  });
}

/* ==================================================
   TESTIMONIAL MODAL
================================================== */

function initTestimonials() {
  const items = document.querySelectorAll('[data-testimonials-item]');
  const modal = document.querySelector('[data-modal-container]');
  const closeBtn = document.querySelector('[data-modal-close-btn]');
  const overlay = document.querySelector('[data-overlay]');

  const modalImg = document.querySelector('[data-modal-img]');
  const modalTitle = document.querySelector('[data-modal-title]');
  const modalText = document.querySelector('[data-modal-text]');

  if (!modal || !overlay) return;

  function toggleModal() {
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const avatar = item.querySelector('[data-testimonials-avatar]');
      const title = item.querySelector('[data-testimonials-title]');
      const text = item.querySelector('[data-testimonials-text]');

      if (!avatar || !title || !text) return;

      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
      modalTitle.innerHTML = title.innerHTML;
      modalText.innerHTML = text.innerHTML;

      toggleModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', toggleModal);
  overlay.addEventListener('click', toggleModal);
}

/* ==================================================
   PORTFOLIO FILTER
================================================== */

function initPortfolioFilter() {
  const selectBox = document.querySelector('[data-select]');
  const selectItems = document.querySelectorAll('[data-select-item]');
  const selectValue = document.querySelector('[data-select-value]');
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  const projectItems = document.querySelectorAll('[data-filter-item]');

  function filterProjects(category) {
    projectItems.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  if (selectBox) {
    selectBox.addEventListener('click', () => toggleActive(selectBox));
  }

  selectItems.forEach(item => {
    item.addEventListener('click', () => {
      const value = item.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = item.innerText;
      selectBox.classList.remove('active');
      filterProjects(value);
    });
  });

  let lastBtn = filterButtons[0];

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.innerText.toLowerCase();
      if (selectValue) selectValue.innerText = btn.innerText;

      filterProjects(value);

      if (lastBtn) lastBtn.classList.remove('active');
      btn.classList.add('active');
      lastBtn = btn;
    });
  });
}

function initContactForm() {
  const form = document.querySelector('[data-form]'); // contact form
  const inputs = document.querySelectorAll('[data-form-input]'); // form inputs
  const btn = document.querySelector('[data-form-btn]'); // submit button
  const status = document.querySelector('[data-form-status]'); // status text

  if (!form || !btn || !inputs.length) return; // safety check

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      form.checkValidity()
        ? btn.removeAttribute('disabled') // enable button
        : btn.setAttribute('disabled', ''); // disable button
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // stop page reload

    status.textContent = "";
    btn.setAttribute('disabled', '');
    btn.querySelector("span").innerText = "Sending...";

    if (!TURNSTILE_TOKEN) { // captcha check
      status.textContent = "Please complete verification.";
      status.className = "form-status error";
      btn.removeAttribute('disabled');
      btn.querySelector("span").innerText = "Send Message";
      return;
    }

    const payload = {
      FullName: form.fullname.value.trim(), // name
      Email: form.email.value.trim(), // email
      Message: form.message.value.trim(), // message
      token: TURNSTILE_TOKEN // captcha token
    };

    try {
      const res = await fetch(
        "https://socialcore-backend.onrender.com/iammafah/api/contacts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      status.textContent = "Your message was sent successfully.";
      status.className = "form-status success";

      form.reset(); // reset form
      TURNSTILE_TOKEN = null; // clear token

      if (window.turnstile) {
        turnstile.reset(); // reset widget
      }

      btn.querySelector("span").innerText = "Send Message";
      btn.setAttribute('disabled', '');

    } catch (err) {
      status.textContent = err.message;
      status.className = "form-status error";
      btn.querySelector("span").innerText = "Send Message";
      btn.removeAttribute('disabled');
    }
  });
}




/* ==================================================
   LOAD PARTIALS
================================================== */

async function loadLayout() {
  const base = window.BASE_PATH || ".";

  try {
    const headerEl = document.getElementById("header");
    if (headerEl) {
      const res = await fetch(`${base}/partials/header.html`);
      headerEl.innerHTML = await res.text();
    }

    const footerEl = document.getElementById("footer");
    if (footerEl) {
      const res = await fetch(`${base}/partials/footer.html`);
      footerEl.innerHTML = await res.text();
    }

    // COOKIE BANNER LOAD
    let cookieContainer = document.getElementById("cookie-container");

    if (!cookieContainer) {
      cookieContainer = document.createElement("div");
      cookieContainer.id = "cookie-container";
      document.body.appendChild(cookieContainer);
    }

    const cookieRes = await fetch(`${base}/partials/cookie-banner.html`);
    cookieContainer.innerHTML = await cookieRes.text();

    // INIT COOKIE SYSTEM
    if (window.initCookieSystem) {
      initCookieSystem();
    }

  } catch (err) {
    console.error("Layout load failed:", err);
  }
}




/* ==================================================
   APP INIT
================================================== */
document.addEventListener('DOMContentLoaded', async () => {
  await loadLayout(); // wait until header/footer load

  initSidebar();
  initTestimonials();
  initPortfolioFilter();
  initContactForm();
});
