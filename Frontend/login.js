document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/login", {   // 👈 important
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert("✅ Login successful!");
      window.location.href = "dashboard.html"; // redirect after login
    } else {
      alert("❌ " + data.message);
    }
  } catch (err) {
    alert("⚠️ Could not connect to server");
    console.error(err);
  }
});
