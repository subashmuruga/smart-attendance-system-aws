const roleSelect = document.getElementById("role");
const regNoInput = document.getElementById("regNo");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const form = document.getElementById("registerForm");
const message = document.getElementById("message");

/* ---------------------------
   REGISTER NUMBER VISIBILITY
---------------------------- */
roleSelect.addEventListener("change", () => {
  if (roleSelect.value === "Student") {
    regNoInput.style.display = "block";
    regNoInput.required = true;
  } else {
    regNoInput.style.display = "none";
    regNoInput.required = false;
    regNoInput.value = "";
  }
});

/* ---------------------------
   PASSWORD TOGGLE (FIXED)
---------------------------- */
let passwordVisible = false; // explicit state

passwordInput.type = "password";
togglePassword.textContent = "👁";

togglePassword.addEventListener("click", () => {
  passwordVisible = !passwordVisible;

  if (passwordVisible) {
    passwordInput.type = "text";
    togglePassword.textContent = "🙈";
    togglePassword.title = "Hide password";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "👁";
    togglePassword.title = "Show password";
  }
});

/* ---------------------------
   FORM SUBMIT
---------------------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  message.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;
  const role = roleSelect.value;
  const regNo = regNoInput.value.trim();

  if (!name || !email || !password || !role) {
    message.textContent = "All fields are required";
    return;
  }

  if (role === "Student" && !regNo) {
    message.textContent = "Register Number is required for students";
    return;
  }

  sessionStorage.setItem("name", name);
  sessionStorage.setItem("email", email);
  sessionStorage.setItem("password", password);
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("regNo", regNo);

  window.location.href = "register-face.html";
});
