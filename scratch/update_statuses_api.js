async function updateStatuses() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@madhuvanhoney.com', password: '123456' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token || loginData.data?.user?.token;
  console.log('Admin token acquired:', !!token);

  const o1 = await (await fetch('http://localhost:5000/api/orders/track/MDH-8951')).json();
  const o2 = await (await fetch('http://localhost:5000/api/orders/track/MDH-2331')).json();
  const o0 = await (await fetch('http://localhost:5000/api/orders/track/MDH-4012')).json();

  if (o0.data?._id) {
    const res0 = await fetch(`http://localhost:5000/api/orders/${o0.data._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderStatus: 'processing' })
    });
    console.log('MDH-4012 status updated to processing:', (await res0.json()).success);
  }

  if (o1.data?._id) {
    const res1 = await fetch(`http://localhost:5000/api/orders/${o1.data._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderStatus: 'shipped' })
    });
    console.log('MDH-8951 status updated to shipped:', (await res1.json()).success);
  }

  if (o2.data?._id) {
    const res2 = await fetch(`http://localhost:5000/api/orders/${o2.data._id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ orderStatus: 'delivered' })
    });
    console.log('MDH-2331 status updated to delivered:', (await res2.json()).success);
  }
}

updateStatuses().catch(console.error);
