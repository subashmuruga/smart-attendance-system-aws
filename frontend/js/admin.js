/* ============================= */
/* NAVIGATION */
/* ============================= */

function goToMarkAttendance() {
  window.location.href = "mark-attendance.html";
}
function goToAttendanceRecords() {
  window.location.href = "attendance-records.html";
}
function goToUserManagement() {
  window.location.href = "user-management.html";
}
function goToPage(page) {
  window.location.href = page;
}



function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

/* ============================= */
/* ROLE CHECK */
/* ============================= */

const role = sessionStorage.getItem("role");
if (role !== "Admin") {
  alert("Access denied");
  window.location.href = "login.html";
}

/* ============================= */
/* LOAD USER DETAILS */
/* ============================= */

document.getElementById("name").textContent =
  sessionStorage.getItem("name") || "-";

document.getElementById("email").textContent =
  sessionStorage.getItem("email") || "-";

document.getElementById("role").textContent = role;
document.getElementById("adminName").textContent =
  sessionStorage.getItem("name") || "Admin";

/* ============================= */
/* LOGOUT */
/* ============================= */

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

/* ============================= */
/* PROFILE PHOTO */
/* ============================= */

const profileImg = document.getElementById("profileImg");
const photoInput = document.getElementById("photoInput");
const saveBtn = document.getElementById("savePhotoBtn");
const cancelBtn = document.getElementById("cancelPhotoBtn");
const changeBtn = document.getElementById("changePhotoBtn");

let tempPhoto = null;
let savedPhotoUrl = localStorage.getItem("profilePhotoUrl");

if (savedPhotoUrl) {
  profileImg.src = savedPhotoUrl;
}

// Open file picker
changeBtn.addEventListener("click", () => {
  photoInput.click();
});

// Preview selected photo
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    tempPhoto = reader.result;
    profileImg.src = tempPhoto;

    saveBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
  };
  reader.readAsDataURL(file);
});

// Save photo
saveBtn.addEventListener("click", () => {
  if (!tempPhoto) return;

  localStorage.setItem("profilePhotoUrl", tempPhoto);
  savedPhotoUrl = tempPhoto;

  tempPhoto = null;
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
});

// Cancel change
cancelBtn.addEventListener("click", () => {
  profileImg.src = savedPhotoUrl || "assets/default-avatar.png";

  tempPhoto = null;
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
});

/* ============================= */
/* IMAGE PREVIEW MODAL */
/* ============================= */

const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

// Open preview
profileImg.addEventListener("click", () => {
  modal.style.display = "flex";
  modalImg.src = profileImg.src;
  modalImg.classList.remove("zoomed");
});

// Close preview (X)
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close on background click ONLY
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ESC key close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.style.display = "none";
  }
});

// Zoom toggle
modalImg.addEventListener("click", (e) => {
  e.stopPropagation(); // prevent modal close
  modalImg.classList.toggle("zoomed");
});

/* ============================= */
/* MOTIVATION QUOTES */
/* ============================= */

const quotes = [
  { text: "Be present. Be powerful.", icon: "🔥" },
  { text: "Every day counts. Make sure you’re counted today.", icon: "🎯" },
  { text: "Consistency Builds Excellence.", icon: "🏆" },
  { text: "Early is on time. On time is late.", icon: "🚀" },
  { text: "Your future is created by what you do today, not tomorrow.", icon: "💎" }
];

let quoteIndex = 0;
const quoteText = document.getElementById("quoteText");
const quoteIcon = document.getElementById("quoteIcon");

function rotateQuote() {
  quoteText.textContent = quotes[quoteIndex].text;
  quoteIcon.textContent = quotes[quoteIndex].icon;
  quoteIndex = (quoteIndex + 1) % quotes.length;
}

rotateQuote();
setInterval(rotateQuote, 3500);

/* ============================= */
/* FIX: CLOSE MODAL ON BACK / RELOAD */
/* ============================= */

window.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imgModal");
  if (modal) modal.style.display = "none";
});

window.addEventListener("pageshow", (event) => {
  const modal = document.getElementById("imgModal");
  if (modal) modal.style.display = "none";
});
