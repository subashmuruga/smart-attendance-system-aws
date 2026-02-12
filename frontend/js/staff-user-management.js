// 🔐 STAFF ROLE PROTECTION
if (sessionStorage.getItem("role") !== "Staff") {
  alert("Access denied");
  window.location.href = "login.html";
}

const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/users";

const usersBody = document.getElementById("usersBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

let allUsers = [];

// ============================
// LOAD USERS
// ============================
async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    // ❌ REMOVE ADMINS
    allUsers = data.filter(
      u => u.role === "Staff" || u.role === "Student"
    );

    renderUsers(allUsers);
  } catch {
    usersBody.innerHTML =
      "<tr><td colspan='4'>Failed to load users</td></tr>";
  }
}

// ============================
// RENDER TABLE
// ============================
function renderUsers(users) {
  usersBody.innerHTML = "";

  if (users.length === 0) {
    usersBody.innerHTML =
      "<tr><td colspan='4'>No users found</td></tr>";
    return;
  }

  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.registerNumber || "-"}</td>
    `;
    usersBody.appendChild(tr);
  });
}

// ============================
// SEARCH + FILTER
// ============================
function applyFilters() {
  const text = searchInput.value.toLowerCase();
  const role = roleFilter.value;

  const filtered = allUsers.filter(u => {
    const matchText =
      u.name.toLowerCase().includes(text) ||
      u.email.toLowerCase().includes(text);

    const matchRole = role === "" || u.role === role;
    return matchText && matchRole;
  });

  renderUsers(filtered);
}

searchInput.addEventListener("input", applyFilters);
roleFilter.addEventListener("change", applyFilters);

// ============================
// BACK
// ============================
function goBack() {
  window.location.href = "staff-dashboard.html";
}

// INIT
loadUsers();
