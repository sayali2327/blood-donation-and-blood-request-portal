document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:5000/login', { // make sure matches backend route
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    alert('Login successful!');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.donor));

    // redirect to home page
    window.location.href = 'index.html'; // change to your desired page
  } else {
    alert(data.message);
  }
});
