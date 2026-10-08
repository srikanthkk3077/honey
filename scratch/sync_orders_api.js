async function sync() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@madhuvanhoney.com', password: 'adminhoney123' })
  });
  const loginData = await loginRes.json();
  console.log('Login success:', loginData.success);
  const token = loginData.data?.token || loginData.data?.user?.token;
  console.log('Token received:', !!token);

  if (!token) return;

  // Let's get MDH-8951 and MDH-2331
  const o1 = await (await fetch('http://localhost:5000/api/orders/track/MDH-8951')).json();
  const o2 = await (await fetch('http://localhost:5000/api/orders/track/MDH-2331')).json();

  if (o1.data?._id) {
    const r1 = await fetch(`http://localhost:5000/api/orders/${o1.data._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderStatus: 'shipped' })
    });
    console.log('Updated MDH-8951 to shipped:', r1.status);
  }

  if (o2.data?._id) {
    const r2 = await fetch(`http://localhost:5000/api/orders/${o2.data._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderStatus: 'delivered' })
    });
    console.log('Updated MDH-2331 to delivered:', r2.status);
  }
}

sync().catch(console.error);
