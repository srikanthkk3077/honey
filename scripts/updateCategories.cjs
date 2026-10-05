const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('../../madhuvan_honey-backend/node_modules/mongoose');
const uri = 'mongodb+srv://srikanthkk3077_db_user:srikanth.1997@srikanth.16asjrt.mongodb.net/madhuvan_honey?retryWrites=true&w=majority&appName=Srikanth';

async function run() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;

  const categories = await db.collection('categories').find({}).toArray();
  console.log('Categories:', JSON.stringify(categories, null, 2));

  const products = await db.collection('products').find({}).project({ _id: 1, name: 1, slug: 1, category: 1, categorySlug: 1 }).toArray();
  console.log('Products:', JSON.stringify(products, null, 2));

  await mongoose.disconnect();
}

run().catch(console.error);
