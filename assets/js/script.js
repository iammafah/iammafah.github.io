'use strict';

// === GLOBAL CONFIG ===
// change ONLY this if structure changes


/* ==================================================
   COMMON UTILS
================================================== */

// Safe toggle
function toggleActive(el) {
  if (el) el.classList.toggle('active');
}

/* ==================================================
   HEADER / SIDEBAR INIT  (IMPORTANT)
================================================== */

function initSidebar() {
  const sidebar = document.querySelector('[data-sidebar]');
  const sidebarBtn = document.querySelector('[data-sidebar-btn]');

  if (sidebar && sidebarBtn) {
    sidebarBtn.addEventListener('click', () => {
      toggleActive(sidebar);
    });
  }
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

/* ==================================================
   CONTACT FORM
================================================== */

function initContactForm() {
  const form = document.querySelector('[data-form]');
  const inputs = document.querySelectorAll('[data-form-input]');
  const btn = document.querySelector('[data-form-btn]');
  const status = document.querySelector('[data-form-status]');

  if (!form || !btn || !inputs.length) return;

  const showError = (name, message) => {
    const el = document.querySelector(`[data-error="${name}"]`);
    if (el) el.textContent = message;
  };

  const clearErrors = () => {
    document.querySelectorAll('[data-error]')
      .forEach(e => e.textContent = "");
  };

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      form.checkValidity()
        ? btn.removeAttribute('disabled')
        : btn.setAttribute('disabled', '');
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    clearErrors();
    status.textContent = "";

    btn.setAttribute('disabled', '');
    btn.innerText = "Sending...";

    const payload = {
      FullName: form.fullname.value.trim(),
      Email: form.email.value.trim(),
      Message: form.message.value.trim()
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
        if (data.errors) {
          Object.entries(data.errors).forEach(([key, val]) => {
            showError(key.toLowerCase(), val);
          });
        }
        throw new Error(data.message || "Failed");
      }

      status.textContent = "Your message was sent successfully.";
      status.className = "form-status success";

      form.reset();
      btn.innerText = "Send Message";
      btn.setAttribute('disabled', '');

    } catch (err) {
      status.textContent = err.message;
      status.className = "form-status error";
      btn.innerText = "Send Message";
      btn.removeAttribute('disabled');
    }
  });
}


// Run after DOM load
document.addEventListener("DOMContentLoaded", initContactForm);






async function loadLayout() {

  // HEADER
  const headerEl = document.getElementById("header");
  if (headerEl) {
    const res = await fetch(`${window.BASE_PATH}/partials/header.html`);
    headerEl.innerHTML = await res.text();
    initSidebar(); // ✔ sirf header wale pages pe effect
  }

  // FOOTER
  const footerEl = document.getElementById("footer");
  if (footerEl) {
    const res = await fetch(`${window.BASE_PATH}/partials/footer.html`);
    footerEl.innerHTML = await res.text();
  }
}


/* ==================================================
   APP INIT
================================================== */

document.addEventListener('DOMContentLoaded', () => {
  loadLayout();          // header/footer
  initTestimonials();   // modal
  initPortfolioFilter();// portfolio
  initContactForm();    // contact form
});
