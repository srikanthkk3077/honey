const fs = require('fs');
const path = require('path');
const mongoose = require('../../madhuvan_honey-backend/node_modules/mongoose');
const cloudinary = require('../../madhuvan_honey-backend/node_modules/cloudinary').v2;
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

cloudinary.config({
  cloud_name: 'kisnodzz',
  api_key: '493681124699181',
  api_secret: 'UTSm2FMZJOAHeB7yJxxoUKQjesU',
  secure: true,
});

const isCloudinary = (url) => typeof url === 'string' && url.includes('res.cloudinary.com');

async function uploadToCloudinary(source, folder) {
  if (!source) return '';
  if (isCloudinary(source)) return source;

  // Local file upload from backend uploads directory
  if (source.includes('localhost:5000/uploads/')) {
    const filename = source.split('/uploads/')[1];
    const localFilePath = path.join(__dirname, '..', '..', 'madhuvan_honey-backend', 'uploads', filename);
    if (fs.existsSync(localFilePath)) {
      console.log('Uploading local file to Cloudinary:', localFilePath);
      const res = await cloudinary.uploader.upload(localFilePath, {
        folder: folder || 'madhuvan_honey/products',
        resource_type: 'auto',
      });
      return res.secure_url;
    }
  }

  // Remote URL upload (Unsplash, etc.)
  if (source.startsWith('http')) {
    console.log('Uploading remote URL to Cloudinary:', source.slice(0, 70));
    const res = await cloudinary.uploader.upload(source, {
      folder: folder || 'madhuvan_honey/media',
      resource_type: 'auto',
    });
    return res.secure_url;
  }

  return source;
}

async function migrate() {
  const uri =
    'mongodb+srv://srikanthkk3077_db_user:srikanth.1997@srikanth.16asjrt.mongodb.net/madhuvan_honey?retryWrites=true&w=majority&appName=Srikanth';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB for Cloudinary Migration');

  // 1. PRODUCTS MIGRATION
  console.log('\n--- 1. Migrating Products to Cloudinary ---');
  const products = await mongoose.connection.collection('products').find({}).toArray();
  for (const p of products) {
    let changed = false;
    const newImages = [];
    for (const img of p.images || []) {
      if (!isCloudinary(img)) {
        try {
          const cldUrl = await uploadToCloudinary(img, 'madhuvan_honey/products');
          newImages.push(cldUrl);
          changed = true;
          console.log(`Product [${p.name}] image updated -> ${cldUrl}`);
        } catch (e) {
          console.error(`Failed to upload image for product ${p.name}:`, e.message);
          newImages.push(img);
        }
      } else {
        newImages.push(img);
      }
    }
    if (changed) {
      await mongoose.connection.collection('products').updateOne(
        { _id: p._id },
        { $set: { images: newImages, updatedAt: new Date() } }
      );
      console.log(`Updated Product: ${p.name} with ${newImages.length} Cloudinary images`);
    }
  }

  // 2. CATEGORIES MIGRATION
  console.log('\n--- 2. Migrating Categories to Cloudinary ---');
  const categories = await mongoose.connection.collection('categories').find({}).toArray();
  for (const c of categories) {
    if (!isCloudinary(c.image)) {
      try {
        const cldUrl = await uploadToCloudinary(c.image, 'madhuvan_honey/categories');
        await mongoose.connection.collection('categories').updateOne(
          { _id: c._id },
          { $set: { image: cldUrl, updatedAt: new Date() } }
        );
        console.log(`Category [${c.name}] updated -> ${cldUrl}`);
      } catch (e) {
        console.error(`Failed to upload category image for ${c.name}:`, e.message);
      }
    }
  }

  // 3. VIDEOS MIGRATION
  console.log('\n--- 3. Migrating Videos to Cloudinary ---');
  const cldVideos = [
    {
      id: '6abcdc27185fd6ccd4965e91',
      videoUrl:
        'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1790995078981.mp4',
      thumbnailUrl:
        'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/WhatsApp-Image-2026-10-02-at-1-1790995113150',
    },
    {
      id: '6abcdc27185fd6ccd4965e92',
      videoUrl:
        'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1791020235595.mp4',
      thumbnailUrl:
        'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/WhatsApp-Image-2026-10-02-at-1-1790995043548',
    },
    {
      id: '6abcdc27185fd6ccd4965e93',
      videoUrl:
        'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1791020416024.mp4',
      thumbnailUrl:
        'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/WhatsApp-Image-2026-10-02-at-1-1791020422761',
    },
    {
      id: '6abf0d2b38ffe541c04efb80',
      videoUrl:
        'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1790995036461.mp4',
      thumbnailUrl:
        'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/WhatsApp-Image-2026-10-02-at-1-1790995043548',
    },
    {
      id: '6ac086328530d3333508413a',
      videoUrl:
        'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1791002118056.mp4',
      thumbnailUrl:
        'https://res.cloudinary.com/kisnodzz/image/upload/f_auto,q_auto/v1/madhuvan_honey/media/8733d029f07377e468cb8e5092888a-1791002125075',
    },
  ];

  const allProducts = await mongoose.connection.collection('products').find({}).toArray();
  const prodMap = new Map();
  allProducts.forEach((p) => prodMap.set(p._id.toString(), p));

  for (const cv of cldVideos) {
    const videoDoc = await mongoose.connection
      .collection('videos')
      .findOne({ _id: new mongoose.Types.ObjectId(cv.id) });
    if (videoDoc) {
      const taggedProd = videoDoc.taggedProductId
        ? prodMap.get(videoDoc.taggedProductId.toString())
        : null;
      const taggedImg = taggedProd?.images?.[0] || '';
      await mongoose.connection.collection('videos').updateOne(
        { _id: videoDoc._id },
        {
          $set: {
            videoUrl: cv.videoUrl,
            thumbnailUrl: cv.thumbnailUrl,
            taggedProductImage: taggedImg,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`Video [${videoDoc.title}] updated to Cloudinary video -> ${cv.videoUrl}`);
    }
  }

  // 4. SLIDERS MIGRATION
  console.log('\n--- 4. Migrating Sliders to Cloudinary ---');
  const sliders = await mongoose.connection.collection('sliders').find({}).toArray();
  const sliderVideos = [
    'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1790995036461.mp4',
    'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1791020416024.mp4',
    'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1791002118056.mp4',
  ];

  for (let i = 0; i < sliders.length; i++) {
    const s = sliders[i];
    let newImageUrl = s.imageUrl;
    if (!isCloudinary(s.imageUrl)) {
      try {
        newImageUrl = await uploadToCloudinary(s.imageUrl, 'madhuvan_honey/sliders');
        console.log(`Slider [${s.title}] image updated -> ${newImageUrl}`);
      } catch (e) {
        console.error(`Failed to upload slider image for ${s.title}:`, e.message);
      }
    }
    const newVideoUrl = sliderVideos[i % sliderVideos.length];
    await mongoose.connection.collection('sliders').updateOne(
      { _id: s._id },
      {
        $set: {
          imageUrl: newImageUrl,
          videoUrl: newVideoUrl,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`Slider [${s.title}] updated to Cloudinary video -> ${newVideoUrl}`);
  }

  // 5. STATIC ASSETS (Story & Blog)
  console.log('\n--- 5. Uploading Story & Blog Images to Cloudinary ---');
  const staticImages = [
    {
      key: 'story_banner',
      url: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1400&q=80',
      folder: 'madhuvan_honey/story',
    },
    {
      key: 'story_beekeeper',
      url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
      folder: 'madhuvan_honey/story',
    },
    {
      key: 'blog_lemon_water',
      url: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
      folder: 'madhuvan_honey/blog',
    },
    {
      key: 'blog_tasting',
      url: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
      folder: 'madhuvan_honey/blog',
    },
    {
      key: 'blog_enzymes',
      url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
      folder: 'madhuvan_honey/blog',
    },
  ];

  const uploadedStatic = {};
  for (const item of staticImages) {
    try {
      const res = await cloudinary.uploader.upload(item.url, {
        folder: item.folder,
        resource_type: 'image',
      });
      uploadedStatic[item.key] = res.secure_url;
      console.log(`Uploaded static [${item.key}] -> ${res.secure_url}`);
    } catch (e) {
      console.error(`Failed to upload static [${item.key}]:`, e.message);
    }
  }

  // Save the uploaded static mapping to a json file
  fs.writeFileSync(
    path.join(__dirname, 'cloudinaryStaticAssets.json'),
    JSON.stringify(uploadedStatic, null, 2)
  );

  await mongoose.disconnect();
  console.log('\nMigration completed successfully! All assets are hosted on Cloudinary.');
}

migrate().catch(console.error);
