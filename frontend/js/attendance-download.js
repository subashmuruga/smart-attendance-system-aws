// 🔐 Admin protection
if (sessionStorage.getItem("role") !== "Admin") {
  alert("Access denied");
  window.location.href = "login.html";
}

// 🔗 API URL
const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/attendance";

// ELEMENTS
const viewBtn = document.getElementById("viewBtn");
const previewSection = document.getElementById("previewSection");
const previewBody = document.getElementById("previewBody");

const csvBtn = document.getElementById("csvBtn");
const excelBtn = document.getElementById("excelBtn");
const pdfBtn = document.getElementById("pdfBtn");

const fromDateEl = document.getElementById("fromDate");
const toDateEl = document.getElementById("toDate");
const roleFilter = document.getElementById("roleFilter");
const statusFilter = document.getElementById("statusFilter");

let attendanceData = [];

// ===============================
// VIEW ATTENDANCE (JSON PREVIEW)
// ===============================
viewBtn.addEventListener("click", async () => {
  const fromDate = fromDateEl.value;
  const toDate = toDateEl.value;
  const role = roleFilter.value;
  const status = statusFilter.value;

  if (!fromDate || !toDate) {
    alert("Please select From Date and To Date");
    return;
  }

  const url =
    `${API_URL}?fromDate=${fromDate}` +
    `&toDate=${toDate}` +
    `&role=${role}` +
    `&status=${status}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to load attendance");
      return;
    }

    attendanceData = data;
    previewBody.innerHTML = "";

    data.forEach(a => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${a.date}</td>
        <td>${a.name}</td>
        <td>${a.role}</td>
        <td>${a.registerNumber || "-"}</td>
        <td style="color:${a.status === "Present" ? "green" : "red"}; font-weight:600">
          ${a.status.toUpperCase()}
        </td>
      `;
      previewBody.appendChild(tr);
    });

    previewSection.style.display = "block";
    csvBtn.disabled = false;
    excelBtn.disabled = false;
    pdfBtn.disabled = false;

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});

// ===============================
// CSV DOWNLOAD (CLIENT SIDE)
// ===============================
csvBtn.addEventListener("click", () => {
  if (attendanceData.length === 0) {
    alert("No data to download");
    return;
  }

  let csv = "Date,Name,Role,Register Number,Status\n";
  attendanceData.forEach(a => {
    csv += `${a.date},${a.name},${a.role},${a.registerNumber || "-"},${a.status}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// ===============================
// EXCEL DOWNLOAD (LAMBDA)
// ===============================
excelBtn.addEventListener("click", () => {
  downloadFile("excel", "attendance.xlsx");
});

// ===============================
// PDF DOWNLOAD (LAMBDA)
// ===============================
pdfBtn.addEventListener("click", () => {
  downloadFile("pdf", "attendance.pdf");
});

// ===============================
// GENERIC FILE DOWNLOAD
// ===============================
async function downloadFile(format, filename) {
  const fromDate = fromDateEl.value;
  const toDate = toDateEl.value;
  const role = roleFilter.value;
  const status = statusFilter.value;

  const url =
    `${API_URL}?fromDate=${fromDate}` +
    `&toDate=${toDate}` +
    `&role=${role}` +
    `&status=${status}` +
    `&format=${format}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      alert("Download failed");
      return;
    }

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  } catch (err) {
    console.error(err);
    alert("Download error");
  }
}

// ===============================
// BACK
// ===============================
function goBack() {
  window.location.href = "admin-dashboard.html";
}
