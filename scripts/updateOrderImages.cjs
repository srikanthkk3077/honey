const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const mongoose = require('../../madhuvan_honey-backend/node_modules/mongoose');
const uri = 'mongodb+srv://srikanthkk3077_db_user:srikanth.1997@srikanth.16asjrt.mongodb.net/madhuvan_honey?retryWrites=true&w=majority&appName=Srikanth';

const productImages = {
  '6abcdc26185fd6ccd4965e84': 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042814/madhuvan_honey/products/t6l1edtfc4xg0wmxb8we.jpg',
  '6abcdc26185fd6ccd4965e87': 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042826/madhuvan_honey/products/k2uixjenvf4dcvj69j3p.jpg',
  '6abcdc26185fd6ccd4965e89': 'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/WhatsApp-Image-2026-10-02-at-1-1790994970658?_a=BAMAROhM0',
  '6abcdc26185fd6ccd4965e8b': 'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/8733d029f07377e468cb8e5092888a-1790994948272?_a=BAMAROhM0',
  '6abcdc26185fd6ccd4965e8d': 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042827/madhuvan_honey/products/sebdv5xkzd5k2f38kmoq.jpg',
  '6abcdc27185fd6ccd4965e8f': 'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/photo-1587049352851-8d4e891339-1790994925314?_a=BAMAROhM0',
  '6abdc58ebc4b1a26faa02162': 'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/41f2883491daa97b85ec25b7966b46-1790994886966?_a=BAMAROhM0'
};

function getCloudinaryFor(productId, name) {
  if (productId && productImages[productId.toString()]) {
    return productImages[productId.toString()];
  }
  const n = (name || '').toLowerCase();
  if (n.includes('mustard') || n.includes('creamed')) {
    return productImages['6abcdc27185fd6ccd4965e8f'];
  }
  if (n.includes('acacia') || n.includes('kashmir')) {
    return productImages['6abcdc26185fd6ccd4965e87'];
  }
  if (n.includes('jamun')) {
    return productImages['6abcdc26185fd6ccd4965e89'];
  }
  if (n.includes('tulsi') || n.includes('vedic')) {
    return productImages['6abcdc26185fd6ccd4965e8b'];
  }
  if (n.includes('honeycomb') || n.includes('frame')) {
    return productImages['6abcdc26185fd6ccd4965e8d'];
  }
  if (n.includes('sundarban')) {
    return productImages['6abcdc26185fd6ccd4965e84'];
  }
  if (n.includes('wild forest')) {
    return productImages['6abdc58ebc4b1a26faa02162'];
  }
  return productImages['6abcdc26185fd6ccd4965e84'];
}

async function updateOrders() {
  await mongoose.connect(uri);
  const orders = await mongoose.connection.collection('orders').find({}).toArray();
  console.log(`Found ${orders.length} orders in MongoDB.`);

  let updatedCount = 0;
  for (const o of orders) {
    let changed = false;
    const items = o.orderItems || o.items || [];
    const newItems = items.map((item) => {
      const pId = item.productId || item.product;
      const pName = item.productName || item.name;
      const cImg = getCloudinaryFor(pId, pName);
      if (item.image !== cImg) {
        changed = true;
      }
      return {
        ...item,
        image: cImg,
      };
    });

    if (changed) {
      await mongoose.connection.collection('orders').updateOne(
        { _id: o._id },
        {
          $set: {
            orderItems: newItems,
            items: newItems,
          },
        }
      );
      updatedCount++;
      console.log(`  Updated order #${o.orderNumber}`);
    }
  }

  console.log(`Done! Successfully updated ${updatedCount} orders with verified Cloudinary URLs.`);
  await mongoose.disconnect();
}

updateOrders().catch((err) => {
  console.error('Update failed:', err);
  process.exit(1);
});
