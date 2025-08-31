document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginData = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const data = await res.json();

    if (res.status === 200) {
      alert("✅ " + data.message);
      localStorage.setItem("token", data.token);
      window.location.href = "donor.html";
    } else {
      alert("❌ " + (data.message || "Invalid login"));
    }
  } catch (err) {
    console.error("❌ Error:", err);
    alert("⚠️ Could not connect to server");
  }
});

