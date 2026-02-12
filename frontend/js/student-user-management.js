// 🔐 STUDENT ROLE PROTECTION (page access)
if (sessionStorage.getItem("role") !== "Student") {
  alert("Access denied");
  window.location.href = "login.html";
}

const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/users";

const usersBody = document.getElementById("usersBody");
const searchInput = document.getElementById("searchInput");

let allStudents = [];

// ============================
// LOAD STUDENTS ONLY
// ============================
async function loadStudents() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // ✅ ONLY STUDENTS
    allStudents = data.filter(u => u.role === "Student");

    renderUsers(allStudents);
  } catch {
    usersBody.innerHTML =
      "<tr><td colspan='3'>Failed to load students</td></tr>";
  }
}

// ============================
// RENDER TABLE
// ============================
function renderUsers(users) {
  usersBody.innerHTML = "";

  if (users.length === 0) {
    usersBody.innerHTML =
      "<tr><td colspan='3'>No students found</td></tr>";
    return;
  }

  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.registerNumber || "-"}</td>
    `;
    usersBody.appendChild(tr);
  });
}

// ============================
// SEARCH (NAME / EMAIL ONLY)
// ============================
function applySearch() {
  const text = searchInput.value.toLowerCase();

  const filtered = allStudents.filter(u =>
    u.name.toLowerCase().includes(text) ||
    u.email.toLowerCase().includes(text)
  );

  renderUsers(filtered);
}

searchInput.addEventListener("input", applySearch);

// ============================
// BACK
// ============================
function goBack() {
  window.location.href = "student-dashboard.html";
}

// INIT
loadStudents();
