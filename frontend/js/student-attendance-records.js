// 🔐 STUDENT ROLE PROTECTION (page access only)
if (sessionStorage.getItem("role") !== "Student") {
  alert("Access denied");
  window.location.href = "login.html";
}

const attendanceBody = document.getElementById("attendanceBody");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const searchInput = document.getElementById("searchInput");

// API URL
const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/attendance-records";

let allStudentRecords = []; // store all students data

// ----------------------------
// Render table
// ----------------------------
function renderTable(data) {
  attendanceBody.innerHTML = "";

  if (!data.length) {
    attendanceBody.innerHTML =
      `<tr><td colspan="5">No records found</td></tr>`;
    return;
  }

  data.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.registerNumber || "-"}</td>
      <td>${r.date}</td>
      <td>${r.time || "-"}</td>
      <td class="${r.status === "PRESENT" ? "status-present" : "status-absent"}">
        ${r.status}
      </td>
    `;
    attendanceBody.appendChild(tr);
  });
}

// ----------------------------
// Apply search (FILTER ONLY)
// ----------------------------
function applySearch() {
  let filtered = [...allStudentRecords];

  if (searchInput.value.trim()) {
    const q = searchInput.value.toLowerCase();
    filtered = filtered.filter(
      r =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.registerNumber || "").toLowerCase().includes(q)
    );
  }

  renderTable(filtered);
}

// ----------------------------
// Fetch records
// ----------------------------
async function fetchRecords() {
  const from = fromDate.value;
  const to = toDate.value;

  if (!from || !to) {
    attendanceBody.innerHTML =
      `<tr><td colspan="5">Please select date range</td></tr>`;
    return;
  }

  attendanceBody.innerHTML =
    `<tr><td colspan="5">Loading...</td></tr>`;

  try {
    const results = [];

    let current = new Date(from);
    const end = new Date(to);

    while (current <= end) {
      const yyyy = current.getFullYear();
      const mm = String(current.getMonth() + 1).padStart(2, "0");
      const dd = String(current.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      const res = await fetch(`${API_URL}?date=${dateStr}`);
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        // ✅ FETCH ALL STUDENTS
        const students = data.filter(r => r.role === "Student");
        results.push(...students);
      }

      current.setDate(current.getDate() + 1);
    }

    allStudentRecords = results;
    applySearch();

  } catch (err) {
    console.error(err);
    attendanceBody.innerHTML =
      `<tr><td colspan="5">Server error</td></tr>`;
  }
}

// ----------------------------
// Events
// ----------------------------
fromDate.addEventListener("change", fetchRecords);
toDate.addEventListener("change", fetchRecords);
searchInput.addEventListener("input", applySearch);

// Back
function goBack() {
  window.location.href = "student-dashboard.html";
}
