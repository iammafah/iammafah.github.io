'use strict';

/* ==================================================
   COMMON UTILS
================================================== */

// Toggle "active" class safely
function toggleActive(element) {
  if (element) element.classList.toggle('active');
}

/* ==================================================
   SIDEBAR TOGGLE
================================================== */

const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => {
    toggleActive(sidebar);
  });
}

/* ==================================================
   TESTIMONIAL MODAL
================================================== */

const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

function toggleTestimonialsModal() {
  if (!modalContainer || !overlay) return;
  modalContainer.classList.toggle('active');
  overlay.classList.toggle('active');
}

testimonialsItems.forEach(item => {
  item.addEventListener('click', () => {
    if (!modalImg || !modalTitle || !modalText) return;

    const avatar = item.querySelector('[data-testimonials-avatar]');
    const title = item.querySelector('[data-testimonials-title]');
    const text = item.querySelector('[data-testimonials-text]');

    modalImg.src = avatar.src;
    modalImg.alt = avatar.alt;
    modalTitle.innerHTML = title.innerHTML;
    modalText.innerHTML = text.innerHTML;

    toggleTestimonialsModal();
  });
});

if (modalCloseBtn) modalCloseBtn.addEventListener('click', toggleTestimonialsModal);
if (overlay) overlay.addEventListener('click', toggleTestimonialsModal);

/* ==================================================
   PORTFOLIO FILTER
================================================== */

const selectBox = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectValue = document.querySelector('[data-select-value]');
const filterButtons = document.querySelectorAll('[data-filter-btn]');
const projectItems = document.querySelectorAll('[data-filter-item]');

// Mobile dropdown toggle
if (selectBox) {
  selectBox.addEventListener('click', () => {
    toggleActive(selectBox);
  });
}

// Core filter logic
function filterProjects(category) {
  projectItems.forEach(item => {
    const itemCategory = item.dataset.category;

    if (category === 'all' || itemCategory === category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Dropdown selection
selectItems.forEach(item => {
  item.addEventListener('click', () => {
    const value = item.innerText.toLowerCase();

    if (selectValue) selectValue.innerText = item.innerText;
    if (selectBox) selectBox.classList.remove('active');

    filterProjects(value);
  });
});

// Desktop buttons
let lastActiveBtn = filterButtons.length ? filterButtons[0] : null;

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = btn.innerText.toLowerCase();

    if (selectValue) selectValue.innerText = btn.innerText;

    filterProjects(value);

    if (lastActiveBtn) lastActiveBtn.classList.remove('active');
    btn.classList.add('active');
    lastActiveBtn = btn;
  });
});

/* ==================================================
   CONTACT FORM VALIDATION
================================================== */

const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

if (form && formBtn && formInputs.length) {
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      if (form.checkValidity()) {
        formBtn.removeAttribute('disabled');
      } else {
        formBtn.setAttribute('disabled', '');
      }
    });
  });
}
