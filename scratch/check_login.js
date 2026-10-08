async function checkLogin() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@madhuvanhoney.com', password: 'adminhoney123' })
  });
  console.log(await loginRes.json());
}
checkLogin();
