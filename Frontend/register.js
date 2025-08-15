async function registerUser(e) {
  e.preventDefault();

  const userData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    role: document.getElementById('role').value // donor or recipient
  };

  const res = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });

  const result = await res.json();
  alert(result.message);
}
