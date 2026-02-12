// 🔐 STUDENT ROLE PROTECTION
if (sessionStorage.getItem("role") !== "Student") {
  alert("Access denied");
  window.location.href = "login.html";
}

// 🔗 API URL
const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/attendance-percentage";

// ELEMENTS
const nameInput = document.getElementById("nameInput");
const regInput = document.getElementById("regInput");

const totalDaysEl = document.getElementById("totalDays");
const presentDaysEl = document.getElementById("presentDays");
const absentDaysEl = document.getElementById("absentDays");
const percentageEl = document.getElementById("percentage");
const statusMessageEl = document.getElementById("statusMessage");

let chart;

// ===============================
// CHECK STUDENT ATTENDANCE
// ===============================
async function checkAttendance() {
  const name = nameInput.value.trim();
  const regNo = regInput.value.trim();

  if (!name && !regNo) {
    alert("Enter Student Name or Register Number");
    return;
  }

  let url = `${API_URL}?role=Student&`;
  if (name) url += `name=${encodeURIComponent(name)}&`;
  if (regNo) url += `registerNumber=${encodeURIComponent(regNo)}&`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "No data found");
      return;
    }

    totalDaysEl.textContent = data.totalDays;
    presentDaysEl.textContent = data.presentDays;
    absentDaysEl.textContent = data.absentDays;
    percentageEl.textContent = `${data.percentage}%`;

    statusMessageEl.textContent = data.message;
    statusMessageEl.style.color =
      data.percentage < 70 ? "red" : "green";

    renderChart(data.presentDays, data.absentDays);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// ===============================
// CHART
// ===============================
function renderChart(present, absent) {
  const ctx = document.getElementById("attendanceChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Present", "Absent"],
      datasets: [{
        data: [present, absent],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    }
  });
}

// ===============================
// BACK
// ===============================
function goBack() {
  window.location.href = "student-dashboard.html";
}
