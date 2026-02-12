// 🔐 Role protection
if (sessionStorage.getItem("role") !== "Admin") {
  alert("Access denied");
  window.location.href = "login.html";
}

const attendanceBody = document.getElementById("attendanceBody");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const roleFilter = document.getElementById("roleFilter");
const searchInput = document.getElementById("searchInput");

// 🔴 YOUR REAL API ENDPOINT
const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/attendance-records";

// ----------------------------
// Render table
// ----------------------------
function renderTable(data) {
  attendanceBody.innerHTML = "";

  if (!data.length) {
    attendanceBody.innerHTML =
      `<tr><td colspan="6">No records found</td></tr>`;
    return;
  }

  data.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${r.name}</td>
      <td>${r.role}</td>
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
// Fetch records (DATE RANGE)
// ----------------------------
async function fetchRecords() {
  const from = fromDate.value;
  const to = toDate.value;

  if (!from || !to) {
    attendanceBody.innerHTML =
      `<tr><td colspan="6">Please select date range</td></tr>`;
    return;
  }

  attendanceBody.innerHTML =
    `<tr><td colspan="6">Loading...</td></tr>`;

  try {
    const allResults = [];

    // Convert to Date objects
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
        allResults.push(...data);
      }

      current.setDate(current.getDate() + 1);
    }

    applyFilters(allResults);

  } catch (err) {
    attendanceBody.innerHTML =
      `<tr><td colspan="6">Server error</td></tr>`;
  }
}


// ----------------------------
// Apply role & search filters
// ----------------------------
function applyFilters(records) {
  let filtered = [...records];

  if (roleFilter.value) {
    filtered = filtered.filter(r => r.role === roleFilter.value);
  }

  if (searchInput.value.trim()) {
    const q = searchInput.value.toLowerCase();
    filtered = filtered.filter(
      r =>
        r.name.toLowerCase().includes(q) ||
        (r.registerNumber || "").toLowerCase().includes(q)
    );
  }

  renderTable(filtered);
}

// ----------------------------
// Event listeners
// ----------------------------
fromDate.addEventListener("change", fetchRecords);
toDate.addEventListener("change", fetchRecords);
roleFilter.addEventListener("change", fetchRecords);
searchInput.addEventListener("input", fetchRecords);

// Initial empty state
attendanceBody.innerHTML =
  `<tr><td colspan="6">Please select date range</td></tr>`;

// Back navigation
function goBack() {
  window.location.href = "admin-dashboard.html";
}
