const API_URL = "https://socialcore-backend.onrender.com/iammafah/api/admin/contacts";
const DOWNLOAD_URL = "https://socialcore-backend.onrender.com/iammafah/api/admin/contacts/download";

let allContacts = [];
let visibleCount = 10;

function showMessage(text, type = "error") {
  let box = document.getElementById("adminMessage");

  if (!box) {
    box = document.createElement("div");
    box.id = "adminMessage";
    box.style.marginBottom = "10px";
    box.style.padding = "10px";
    box.style.borderRadius = "8px";
    box.style.fontWeight = "500px";
    box.style.position = "relative";

    document.querySelector(".card").prepend(box);
  }

  box.style.background = type === "error" ? "#ffe5e5" : "#e7f7e7";
  box.innerHTML = `
    ${text}
    <span style="float:right; cursor:pointer;" onclick="this.parentElement.remove()">✖</span>
  `;
}

async function loadContacts() {
  const adminId = document.getElementById("adminIdInput").value;
  const loader = document.getElementById("loader");

  if (!adminId) {
    showMessage("Admin id required");
    return;
  }

  loader.style.display = "block";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_id: Number(adminId) })
    });

    const data = await res.json();
    loader.style.display = "none";

    if (!Array.isArray(data)) {
      showMessage(data.error || "Invalid admin");
      return;
    }

    allContacts = data.reverse();
    visibleCount = 10;
    renderContacts();

    showMessage("Contacts loaded successfully", "success");

  } catch (err) {
    loader.style.display = "none";
    console.error(err);
    showMessage("Server error");
  }
}

function renderContacts() {
  const tableBody = document.getElementById("contactTableBody");
  tableBody.innerHTML = "";

  allContacts.slice(0, visibleCount).forEach(contact => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${contact.FullName}</td>
      <td>${contact.Email}</td>
      <td>${contact.Message}</td>
      <td>${contact.country}</td>
      <td>${new Date(contact.created_at).toLocaleString()}</td>
    `;

    tableBody.appendChild(row);
  });

  document.getElementById("loadMoreBtn").style.display =
    visibleCount < allContacts.length ? "block" : "none";
}

function loadMore() {
  visibleCount += 10;
  renderContacts();
}

/* ================= CSV DOWNLOAD ================= */
function downloadCSV() {
  const adminId = document.getElementById("adminIdInput").value;

  if (!adminId) {
    showMessage("Enter admin id first");
    return;
  }

  window.location.href = `${DOWNLOAD_URL}?admin_id=${adminId}`;
}
