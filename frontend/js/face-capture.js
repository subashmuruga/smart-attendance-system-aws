const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const submitBtn = document.getElementById("submitBtn");
const preview = document.getElementById("preview");
const message = document.getElementById("message");

// 🔴 YOUR API URL
const API_URL = "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/register";

// ----------------------------
// Start Camera
// ----------------------------
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(() => {
    message.textContent = "Camera access denied. Please allow camera.";
  });

// ----------------------------
// Capture Image
// ----------------------------
captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  preview.src = canvas.toDataURL("image/png");

  preview.style.display = "block";
  video.style.display = "none";

  captureBtn.style.display = "none";
  retakeBtn.style.display = "block";
  submitBtn.style.display = "block";

  message.textContent = "Face captured successfully";
});

// ----------------------------
// Retake Image
// ----------------------------
retakeBtn.addEventListener("click", () => {
  preview.style.display = "none";
  video.style.display = "block";

  captureBtn.style.display = "block";
  retakeBtn.style.display = "none";
  submitBtn.style.display = "none";

  message.textContent = "";
});

// ----------------------------
// Submit Image → AWS API
// ----------------------------
submitBtn.addEventListener("click", async () => {
  submitBtn.disabled = true;
  submitBtn.innerText = "Registering...";
  message.textContent = "";
  message.style.color = "";

  const payload = {
    name: sessionStorage.getItem("name"),
    email: sessionStorage.getItem("email"),
    password: sessionStorage.getItem("password"),
    role: sessionStorage.getItem("role"),
    regNo: sessionStorage.getItem("regNo"),
    faceImage: canvas.toDataURL("image/png")
  };

  try {
    const res = await fetch(
      "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    // ❌ ERROR CASE
    if (!res.ok) {
      message.style.color = "red";
      message.textContent = data.message || "Registration failed";

      // ✅ If already registered → auto redirect
      if (
        data.message &&
        data.message.toLowerCase().includes("already registered")
      ) {
        setTimeout(() => {
          window.location.href = "login.html"; // step 1
          // OR login directly
          // window.location.href = "login.html";
        }, 3000);
      }

      submitBtn.disabled = false;
      submitBtn.innerText = "Submit";
      return;
    }

    // ✅ SUCCESS CASE
    message.style.color = "green";
    message.textContent = "Registration successful. Redirecting to login...";

    // Clear temp registration data
    sessionStorage.clear();

    // ✅ Redirect after delay
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);

  } catch (err) {
    message.style.color = "red";
    message.textContent = "Registration failed. Please try again.";
    submitBtn.disabled = false;
    submitBtn.innerText = "Submit";
  }
});

