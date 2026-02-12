const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");

const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const markBtn = document.getElementById("markBtn");
const message = document.getElementById("message");

// 🔴 SAME BACKEND API
const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/mark-attendance";

// 🔐 STRICT STAFF ROLE CHECK
if (sessionStorage.getItem("role") !== "Staff") {
  alert("Access denied");
  window.location.href = "login.html";
}

// ============================
// START CAMERA
// ============================
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    message.textContent = "❌ Camera access denied";
    message.style.color = "red";
  });

// ============================
// CAPTURE FACE
// ============================
captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  preview.src = canvas.toDataURL("image/png");

  video.hidden = true;
  preview.hidden = false;

  captureBtn.hidden = true;
  retakeBtn.hidden = false;
  markBtn.hidden = false;

  markBtn.disabled = false;

  message.textContent = "Face captured. Ready to mark attendance.";
  message.style.color = "#2c3e50";
});

// ============================
// RETAKE
// ============================
retakeBtn.addEventListener("click", () => {
  video.hidden = false;
  preview.hidden = true;

  captureBtn.hidden = false;
  retakeBtn.hidden = true;
  markBtn.hidden = true;

  markBtn.disabled = false;
  message.textContent = "";
});

// ============================
// MARK ATTENDANCE
// ============================
markBtn.addEventListener("click", async () => {
  if (markBtn.disabled) return;

  markBtn.disabled = true;
  message.textContent = "⏳ Marking attendance...";
  message.style.color = "blue";

  const imageData = canvas.toDataURL("image/png");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        faceImage: imageData,
        pageRole: "Staff"   // ✅ REQUIRED FOR SECURITY
      })
    });

    const data = await res.json();

    if (!res.ok) {
      message.textContent = data.message || "Attendance failed";
      message.style.color = "red";
      markBtn.disabled = false;
      return;
    }

    message.textContent = "✅ " + data.message;
    message.style.color = "green";

    // Allow next attempt only after retake
    markBtn.disabled = false;

  } catch (err) {
    console.error(err);
    message.textContent = "❌ Server error. Try again.";
    message.style.color = "red";
    markBtn.disabled = false;
  }
});

// ============================
// BACK
// ============================
function goBack() {
  window.location.href = "staff-dashboard.html";
}
