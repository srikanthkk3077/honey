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

  const categoriesCollection = db.collection('categories');
  const productsCollection = db.collection('products');

  // Define the 4 target categories matching the honey varieties
  const targetCategories = [
    {
      name: 'Ajwain Honey',
      slug: 'ajwain-honey',
      description: 'Pure raw Ajwain honey extracted from medicinal blossom nectar with soothing digestive benefits.',
      image: 'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/41f2883491daa97b85ec25b7966b46-1790994886966?_a=BAMAROhM0',
      productCount: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Tulasi Honey',
      slug: 'tulasi-honey',
      description: 'Single-origin Holy Basil (Tulsi) raw blossom honey known for natural immunity and herbal aroma.',
      image: 'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/photo-1587049352851-8d4e891339-1790994925314?_a=BAMAROhM0',
      productCount: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Sunflower Honey',
      slug: 'sunflower-honey',
      description: 'Golden sunflower blossom raw honey rich in active enzymes, floral warmth, and pure nutrients.',
      image: 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042827/madhuvan_honey/products/sebdv5xkzd5k2f38kmoq.jpg',
      productCount: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Multifloral Honey',
      slug: 'multifloral-honey',
      description: 'Pure wildflower multi-floral raw honey hand-harvested from diverse pristine forest flora.',
      image: 'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/WhatsApp-Image-2026-10-04-at-2-1791104189486?_a=BAMAROhM0',
      productCount: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Remove old categories
  const deleteResult = await categoriesCollection.deleteMany({});
  console.log('Cleared old categories:', deleteResult.deletedCount);

  // Insert the 4 new categories
  const insertResult = await categoriesCollection.insertMany(targetCategories);
  console.log('Inserted new categories:', insertResult.insertedCount);

  // Retrieve new categories with their IDs
  const createdCats = await categoriesCollection.find({}).toArray();
  const catMap = {};
  for (const c of createdCats) {
    catMap[c.slug] = c._id;
  }
  console.log('New category IDs:', catMap);

  // Update products to point to their corresponding category
  // 1. Madhuvan Ajwain Honey
  await productsCollection.updateOne(
    { name: { $regex: /ajwain/i } },
    {
      $set: {
        category: catMap['ajwain-honey'],
        categorySlug: 'ajwain-honey',
        updatedAt: new Date()
      }
    }
  );
  console.log('Updated Madhuvan Ajwain Honey');

  // 2. Tulasi Honey
  await productsCollection.updateOne(
    { name: { $regex: /tulasi|tulsi/i } },
    {
      $set: {
        category: catMap['tulasi-honey'],
        categorySlug: 'tulasi-honey',
        updatedAt: new Date()
      }
    }
  );
  console.log('Updated Tulasi Honey');

  // 3. Sunflower
  await productsCollection.updateOne(
    { name: { $regex: /sunflower/i } },
    {
      $set: {
        category: catMap['sunflower-honey'],
        categorySlug: 'sunflower-honey',
        updatedAt: new Date()
      }
    }
  );
  console.log('Updated Sunflower');

  // 4. Multifloral
  await productsCollection.updateOne(
    { name: { $regex: /multifloral/i } },
    {
      $set: {
        category: catMap['multifloral-honey'],
        categorySlug: 'multifloral-honey',
        updatedAt: new Date()
      }
    }
  );
  console.log('Updated Multifloral');

  // Verify updated products
  const updatedProducts = await productsCollection.find({}).project({ name: 1, categorySlug: 1, category: 1 }).toArray();
  console.log('Verified products:', JSON.stringify(updatedProducts, null, 2));

  await mongoose.disconnect();
  console.log('Done!');
}

run().catch(console.error);
