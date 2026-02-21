const API_URL = "https://socialcore-backend.onrender.com/iammafah/api/admin/contacts";
const DOWNLOAD_BASE = "https://socialcore-backend.onrender.com/iammafah/api/admin/contacts/download";

let allContacts = [];
let visibleCount = 10;

/* ===== ELEMENTS ===== */
const adminInput = document.getElementById("adminIdInput");
const searchInput = document.getElementById("searchInput");
const loadBtn = document.getElementById("loadBtn");
const exportBtn = document.getElementById("exportBtn");
const exportMenu = document.getElementById("exportMenu");
const tableBody = document.getElementById("contactTableBody");
const loader = document.getElementById("loader");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const messageBox = document.getElementById("adminMessage");

/* ===== MESSAGE ===== */
function showMessage(text,type="error"){
messageBox.style.display="block";
messageBox.style.background = type==="error" ? "#fee2e2" : "#dcfce7";
messageBox.innerText = text;
}

/* ===== LOAD DATA ===== */
async function loadContacts(){

const adminId = adminInput.value;
if(!adminId){
showMessage("Admin ID required");
return;
}

loader.style.display="block";

try{

const res = await fetch(API_URL,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({admin_id:Number(adminId)})
});

const data = await res.json();
loader.style.display="none";

if(!Array.isArray(data)){
showMessage(data.error || "Invalid admin");
return;
}

allContacts = data.reverse();
visibleCount = 10;

renderContacts();
updateStats();
showMessage("Data Loaded","success");

}catch(err){
loader.style.display="none";
showMessage("Server Error");
}

}

/* ===== RENDER TABLE ===== */
function renderContacts(){

const query = searchInput.value.toLowerCase();

const filtered = allContacts.filter(c =>
c.FullName.toLowerCase().includes(query) ||
c.Email.toLowerCase().includes(query)
);

tableBody.innerHTML="";

filtered.slice(0,visibleCount).forEach(contact=>{

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

loadMoreBtn.style.display =
visibleCount < filtered.length ? "block" : "none";

document.getElementById("visibleCountText").innerText =
Math.min(visibleCount,filtered.length);

}

/* ===== LOAD MORE ===== */
function loadMore(){
visibleCount += 10;
renderContacts();
}

/* ===== UPDATE STATS ===== */
function updateStats(){
document.getElementById("totalCount").innerText = allContacts.length;
}

/* ===== EXPORT ===== */
function downloadFile(type){

const adminId = adminInput.value;
if(!adminId){
showMessage("Enter Admin ID first");
return;
}

let url="";
if(type==="csv") url=`${DOWNLOAD_BASE}?admin_id=${adminId}`;
if(type==="xlsx") url=`${DOWNLOAD_BASE}/xlsx?admin_id=${adminId}`;
if(type==="pdf") url=`${DOWNLOAD_BASE}/pdf?admin_id=${adminId}`;

window.location.href = url;
exportMenu.classList.remove("show");
}

/* ===== EVENTS ===== */
loadBtn.addEventListener("click",loadContacts);
searchInput.addEventListener("input",renderContacts);
loadMoreBtn.addEventListener("click",loadMore);

exportBtn.addEventListener("click",(e)=>{
e.stopPropagation();
exportMenu.classList.toggle("show");
});

document.querySelectorAll("#exportMenu div").forEach(item=>{
item.addEventListener("click",()=>{
downloadFile(item.dataset.type);
});
});

document.addEventListener("click",()=>{
exportMenu.classList.remove("show");
});