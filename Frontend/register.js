document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault(); // stop page reload

  const userData = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    bloodGroup: document.getElementById("bloodGroup").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    role: document.querySelector('input[name="role"]:checked').value
  };

  try {
    const res = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();  // 👈 parse JSON
    console.log("✅ Registration response:", data);

    if (res.ok) {
      alert(data.message);
      window.location.href = "login.html"; // go to login
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("Server error");
  }
});
