const path = require('path');
const fs = require('fs');

const mongoose = require(path.join(__dirname, '../../madhuvan_honey-backend/node_modules/mongoose'));

async function run() {
  let mongoUri = 'mongodb://127.0.0.1:27017/madhuvan_honey';
  try {
    const envContent = fs.readFileSync(path.join(__dirname, '../../madhuvan_honey-backend/.env'), 'utf8');
    const match = envContent.match(/MONGODB_URI=(.+)/);
    if (match) mongoUri = match[1].trim();
  } catch (e) {
    console.log('Error reading backend .env', e.message);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
  
  const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
  
  const r1 = await Order.updateOne({ orderNumber: 'MDH-4012' }, { $set: { orderStatus: 'processing' } });
  const r2 = await Order.updateOne({ orderNumber: 'MDH-8951' }, { $set: { orderStatus: 'shipped' } });
  const r3 = await Order.updateOne({ orderNumber: 'MDH-2331' }, { $set: { orderStatus: 'delivered' } });
  
  console.log('Update results:', { MDH4012: r1.modifiedCount, MDH8951: r2.modifiedCount, MDH2331: r3.modifiedCount });
  console.log('Orders synced with screenshot statuses!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
