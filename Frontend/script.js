document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const bloodGroup = document.getElementById("bloodGroup").value;
  const location = document.getElementById("location").value.trim();

  // Simple validation
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!name || !email || !password || !bloodGroup || !location) {
    alert("Please fill all fields!");
    return;
  }

  // Later: send to backend API
  console.log({
    name, email, password, bloodGroup, location
  });

  alert("Registration successful (frontend only for now)");
});
