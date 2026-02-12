// 🔐 Admin protection
if (sessionStorage.getItem("role") !== "Admin") {
  alert("Access denied");
  window.location.href = "login.html";
}

// ============================
// CONFIG
// ============================
const API_URL =
  "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/users";

// ============================
// DOM ELEMENTS
// ============================
const usersBody = document.getElementById("usersBody");
const totalUsersEl = document.getElementById("totalUsers");
const studentCountEl = document.getElementById("studentCount");
const staffCountEl = document.getElementById("staffCount");

const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

let allUsers = [];
let chart = null;

// ============================
// LOAD USERS
// ============================
async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API error");

    allUsers = await res.json();
    renderUsers(allUsers);
  } catch (err) {
    console.error(err);
    usersBody.innerHTML =
      "<tr><td colspan='5'>Failed to load users</td></tr>";
  }
}

// ============================
// RENDER USERS
// ============================
function renderUsers(users) {
  usersBody.innerHTML = "";

  let students = 0;
  let staff = 0;

  users.forEach(u => {
    if (u.role === "Student") students++;
    if (u.role === "Staff") staff++;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.registerNumber || "-"}</td>
      <td>
        <button class="action edit"
          onclick="openEditUser(
            '${u.email}',
            '${u.name.replace(/'/g, "\\'")}',
            '${u.role}',
            '${u.registerNumber || ""}'
          )">Edit</button>

        <button class="action delete"
          onclick="deleteUser('${u.email}')">Delete</button>
      </td>
    `;

    usersBody.appendChild(tr);
  });

  totalUsersEl.textContent = users.length;
  studentCountEl.textContent = students;
  staffCountEl.textContent = staff;

  renderChart(students, staff);
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
// DELETE USER (SAFE)
// ============================
async function deleteUser(email) {
  if (!confirm("Delete this user permanently?")) return;

  try {
    const res = await fetch(`${API_URL}?email=${email}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Delete failed");

    loadUsers();
  } catch (err) {
    alert("Delete failed");
    console.error(err);
  }
}

// ============================
// EDIT USER (MODAL OPEN)
// ============================
function openEditUser(email, name, role, regNo) {
  document.getElementById("editEmail").value = email;
  document.getElementById("editName").value = name;
  document.getElementById("editRole").value = role;
  document.getElementById("editRegNo").value = regNo;

  toggleEditReg(role);

  document.getElementById("editUserModal").style.display = "flex";
}

// SHOW / HIDE REGISTER NO
function toggleEditReg(role) {
  const regGroup = document.getElementById("editRegGroup");
  const regInput = document.getElementById("editRegNo");

  if (role === "Student") {
    regGroup.style.display = "block";
  } else {
    regGroup.style.display = "none";
    regInput.value = "";
  }
}


// ROLE CHANGE HANDLER
document.getElementById("editRole")?.addEventListener("change", e => {
  toggleEditReg(e.target.value);
});

// CLOSE MODAL
function closeEdit() {
  document.getElementById("editUserModal").style.display = "none";
}

// ============================
// UPDATE USER (PUT)
// ============================
async function updateUser() {
  const email = document.getElementById("editEmail").value;
  const name = document.getElementById("editName").value.trim();
  const role = document.getElementById("editRole").value;
  const regNo = document.getElementById("editRegNo").value.trim();

  if (!name) {
    alert("Name is required");
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        role,
        registerNumber: role === "Student" ? regNo : ""
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    closeEdit();
    loadUsers();
  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}

// ============================
// CHART (FIXED SIZE)
// ============================
function renderChart(students, staff) {
  const canvas = document.getElementById("userChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Students", "Staff"],
      datasets: [
        {
          data: [students, staff],
          backgroundColor: ["#2ecc71", "#f39c12"]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

// ============================
// BACK
// ============================
function goBack() {
  window.location.href = "admin-dashboard.html";
}

// ============================
// INIT
// ============================
loadUsers();
