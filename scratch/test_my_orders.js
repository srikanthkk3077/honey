async function testGetMyOrders() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@madhuvanhoney.com', password: '123456' })
  });
  const loginData = await loginRes.json();
  const token = loginData.data?.token || loginData.data?.user?.token;
  
  const myOrdersRes = await fetch('http://localhost:5000/api/orders/my-orders', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const myOrdersData = await myOrdersRes.json();
  console.log('My orders count:', myOrdersData.data?.orders?.length || myOrdersData.data?.length);
  const list = myOrdersData.data?.orders || myOrdersData.data || [];
  list.forEach(o => console.log(o.orderNumber, o.orderStatus, o.customerName));
}
testGetMyOrders();
