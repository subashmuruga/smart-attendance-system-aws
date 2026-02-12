/* ============================= */
/* NAVIGATION */
/* ============================= */

function goToMarkAttendance() {
  window.location.href = "student-mark-attendance.html";
}
function goToAttendanceRecords() {
  window.location.href = "student-attendance-records.html";
}
function goToUserManagement() {
  window.location.href = "student-user-management.html";
}
function goToPage(page) {
  window.location.href = page;
}

/* ============================= */
/* ROLE CHECK */
/* ============================= */

const role = sessionStorage.getItem("role");
if (role !== "Student") {
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

document.getElementById("studentName").textContent =
  sessionStorage.getItem("name") || "Student";

/* ============================= */
/* LOGOUT */
/* ============================= */

function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

/* ============================= */
/* PROFILE PHOTO (LOCAL STORAGE) */
/* ============================= */

const profileImg = document.getElementById("profileImg");
const photoInput = document.getElementById("photoInput");
const saveBtn = document.getElementById("savePhotoBtn");
const cancelBtn = document.getElementById("cancelPhotoBtn");
const changeBtn = document.getElementById("changePhotoBtn");

let tempPhoto = null;
let savedPhotoUrl = localStorage.getItem("studentProfilePhoto");

// Load saved photo
if (savedPhotoUrl && profileImg) {
  profileImg.src = savedPhotoUrl;
}

// Open file picker
if (changeBtn && photoInput) {
  changeBtn.addEventListener("click", () => {
    photoInput.click();
  });
}

// Preview selected photo
if (photoInput) {
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
}

// Save photo
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    if (!tempPhoto) return;
    localStorage.setItem("studentProfilePhoto", tempPhoto);
    savedPhotoUrl = tempPhoto;
    tempPhoto = null;
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
  });
}

// Cancel photo
if (cancelBtn) {
  cancelBtn.addEventListener("click", () => {
    profileImg.src = savedPhotoUrl || "assets/default-avatar.png";
    tempPhoto = null;
    saveBtn.style.display = "none";
    cancelBtn.style.display = "none";
  });
}

/* ============================= */
/* PROFILE IMAGE PREVIEW MODAL */
/* ============================= */

const modal = document.getElementById("imgModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

if (profileImg && modal && modalImg && closeModal) {

  // Open preview
  profileImg.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = profileImg.src;
    modalImg.classList.remove("zoomed");
  });

  // Close (X)
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close on background click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // ESC close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.style.display = "none";
    }
  });

  // Zoom toggle
  modalImg.addEventListener("click", (e) => {
    e.stopPropagation();
    modalImg.classList.toggle("zoomed");
  });
}

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

function rotateQuote() {
  const textEl = document.getElementById("quoteText");
  const iconEl = document.getElementById("quoteIcon");

  if (!textEl || !iconEl) return;

  textEl.textContent = quotes[quoteIndex].text;
  iconEl.textContent = quotes[quoteIndex].icon;
  quoteIndex = (quoteIndex + 1) % quotes.length;
}

rotateQuote();
setInterval(rotateQuote, 4000);

/* ============================= */
/* SAFETY: CLOSE MODAL ON LOAD */
/* ============================= */

window.addEventListener("DOMContentLoaded", () => {
  if (modal) modal.style.display = "none";
});
