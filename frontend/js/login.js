const form = document.getElementById("loginForm");
const message = document.getElementById("message");
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
const loginBtn = form.querySelector("button");

// ----------------------------
// Show / Hide password
// ----------------------------
// ----------------------------
// Show / Hide password
// ----------------------------
// ----------------------------
// Show / Hide password
// ----------------------------
let passwordVisible = false;

passwordInput.type = "password";
togglePassword.textContent = "👁";

togglePassword.addEventListener("click", () => {
  passwordVisible = !passwordVisible;

  if (passwordVisible) {
    passwordInput.type = "text";
    togglePassword.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "👁";
  }
});

// ----------------------------
// Login Submit
// ----------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  message.textContent = "";
  message.style.color = "";

  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    message.style.color = "red";
    message.textContent = "Please enter email and password";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerText = "Logging in...";

  try {
    const res = await fetch(
      "https://z7wjtz6jc8.execute-api.ap-south-1.amazonaws.com/prod/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      message.style.color = "red";
      message.textContent = data.message || "Login failed";
      loginBtn.disabled = false;
      loginBtn.innerText = "Login";
      return;
    }

    // ✅ Save session
    sessionStorage.setItem("name", data.name);
    sessionStorage.setItem("role", data.role);
    sessionStorage.setItem("email", data.email);

    // ✅ Show success message
    message.style.color = "green";
    message.textContent = "Login successful. Redirecting...";

    // ✅ Redirect after delay
    setTimeout(() => {
      if (data.role === "Admin") {
        window.location.href = "admin-dashboard.html";
      } else if (data.role === "Staff") {
        window.location.href = "staff-dashboard.html";
      } else {
        window.location.href = "student-dashboard.html";
      }
    }, 2000);

  } catch (err) {
    message.style.color = "red";
    message.textContent = "Login failed. Please try again.";
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
  }
});
