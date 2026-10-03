async function testAllMedia() {
  const apis = [
    'http://localhost:5000/api/products',
    'http://localhost:5000/api/videos',
    'http://localhost:5000/api/sliders',
    'http://localhost:5000/api/categories',
  ];
  const items = [];

  for (const api of apis) {
    const res = await fetch(api).then((r) => r.json());
    const data = res.data;
    if (data.products)
      data.products.forEach((p) =>
        p.images.forEach((img) => items.push({ type: 'product', name: p.name, url: img }))
      );
    if (data.videos)
      data.videos.forEach((v) => {
        items.push({ type: 'video-src', name: v.title, url: v.videoUrl });
        items.push({ type: 'video-thumb', name: v.title, url: v.thumbnailUrl });
      });
    if (data.sliders)
      data.sliders.forEach((s) => {
        if (s.videoUrl) items.push({ type: 'slider-video', name: s.title, url: s.videoUrl });
        if (s.imageUrl) items.push({ type: 'slider-image', name: s.title, url: s.imageUrl });
      });
    if (data.categories)
      data.categories.forEach((c) =>
        items.push({ type: 'category', name: c.name, url: c.image })
      );
  }

  // Story and Blog items
  items.push({
    type: 'story',
    name: 'banner',
    url: 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042835/madhuvan_honey/story/rltg7m2mjkzew63tm3y9.jpg',
  });
  items.push({
    type: 'story',
    name: 'beekeeper',
    url: 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042836/madhuvan_honey/story/tguzgnb7fv6qxw0wl9qw.jpg',
  });
  items.push({
    type: 'blog',
    name: 'post1',
    url: 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042838/madhuvan_honey/blog/voq7qls5nx0vnhteluka.jpg',
  });
  items.push({
    type: 'blog',
    name: 'post2',
    url: 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042839/madhuvan_honey/blog/j89uwmwhg6i9ipu3xlmh.jpg',
  });
  items.push({
    type: 'blog',
    name: 'post3',
    url: 'https://res.cloudinary.com/kisnodzz/image/upload/v1791042841/madhuvan_honey/blog/ax7eoncr3jf3cxwmvcne.jpg',
  });

  console.log('Testing', items.length, 'media assets across the platform:\n');
  let successCount = 0;
  let failCount = 0;

  for (const item of items) {
    try {
      const resp = await fetch(item.url, { method: 'HEAD' });
      const isOk = resp.status >= 200 && resp.status < 400;
      const isCld = item.url.includes('res.cloudinary.com');
      if (isOk && isCld) {
        successCount++;
        console.log(`[PASS ${resp.status}] [Cloudinary ${item.type}] ${item.name} -> ${item.url.slice(0, 80)}...`);
      } else {
        failCount++;
        console.error(`[FAIL ${resp.status}] [isCloudinary: ${isCld}] [${item.type}] ${item.name} -> ${item.url}`);
      }
    } catch (e) {
      failCount++;
      console.error(`[ERR] [${item.type}] ${item.name}: ${e.message}`);
    }
  }

  console.log('\n=======================================');
  console.log('--- CLOUDINARY AUDIT RESULT ---');
  console.log(`Total Assets Checked: ${items.length}`);
  console.log(`All Verified on Cloudinary (HTTP 200 OK): ${successCount}`);
  console.log(`Failed / Non-Cloudinary: ${failCount}`);
  console.log('=======================================');
}

testAllMedia().catch(console.error);
