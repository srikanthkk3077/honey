async function check() {
  const attempts = [
    { email: 'admin@gmail.com', password: '123456' },
    { email: 'admin@madhuvanhoney.com', password: '123456' },
    { email: 'aarav.patel@example.com', password: 'customer123' }
  ];
  for (const a of attempts) {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(a)
    });
    const d = await res.json();
    console.log(a.email, d.success ? 'SUCCESS!' : d.message);
  }
}
check();
