import { Product } from '../types/product.types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-wild-forest',
    name: 'Madhuvan Sundarbans Wild Forest Honey',
    slug: 'sundarbans-wild-forest-honey',
    tagline: 'Dark, multi-floral raw honey harvested by traditional Mowals from deep mangrove forests',
    description: 'Our Sundarbans Wild Forest Honey is 100% raw, unheated, and unpasteurized. Collected by traditional indigenous honey collectors (Mowals) from giant wild Apis dorsata honeybees deep in the UNESCO biosphere. It features a bold woody undertone, high bee-pollen content, and rich antioxidant properties.',
    story: 'Every spring, brave tribal collectors journey deep into the pristine mangrove sanctuaries. We partner directly with forest communities ensuring ethical harvesting where colonies remain unharmed.',
    category: 'Wild Forest Honey',
    categorySlug: 'wild-forest-honey',
    price: 649,
    originalPrice: 850,
    discountPercent: 24,
    rating: 4.9,
    reviewsCount: 148,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '250g', price: 349, originalPrice: 450, stock: 30, sku: 'MV-SND-250' },
      { size: '500g', price: 649, originalPrice: 850, stock: 45, sku: 'MV-SND-500' },
      { size: '1kg', price: 1199, originalPrice: 1599, stock: 20, sku: 'MV-SND-1000' }
    ],
    selectedSize: '500g',
    origin: 'Sundarbans Biosphere Reserve, West Bengal',
    nectarSource: 'Wild Mangrove Blossom, Khalsi, Goran & Gewa',
    harvestSeason: 'March - May (Spring Bloom)',
    purityScore: 99.8,
    benefits: [
      'High in naturally occurring polyphenols and flavonoids',
      'Zero added sucrose, syrup, or artificial coloring',
      'Retains live beneficial enzymes (Diastase & Invertase)',
      'Natural remedy for cough, throat irritation & immunity'
    ],
    nutritionFacts: {
      energy: '304 kcal per 100g',
      carbohydrates: '82.4g',
      naturalSugars: '80.1g (Fructose 40%, Glucose 35%)',
      proteins: '0.3g',
      antioxidants: 'Rich in Pinocembrin & Chrysin'
    },
    isFeatured: true,
    isBestSeller: true,
    isOrganicCertified: true,
    createdAt: '2026-01-15T10:00:00Z',
    reviews: [
      {
        id: 'rev-1',
        userName: 'Ananya Sharma',
        rating: 5,
        comment: 'You can smell the raw forest flora the moment you open the lid. Very authentic and thick.',
        date: '2026-03-10',
        verified: true
      },
      {
        id: 'rev-2',
        userName: 'Vikramaditya Verma',
        rating: 5,
        comment: 'Tested it with water and flame - passed with flying colors. Madhuvan is genuine raw honey.',
        date: '2026-03-02',
        verified: true
      }
    ]
  },
  {
    id: 'prod-kashmir-acacia',
    name: 'Madhuvan Kashmir Valley Acacia Honey',
    slug: 'kashmir-valley-acacia-honey',
    tagline: 'Water-clear delicate nectar from high altitude Kashmir Himalayan Robinia blooms',
    description: 'Renowned as the queen of honeys, our Kashmir Acacia honey is harvested at 6,000+ feet in the valleys of Jammu & Kashmir. It has a light golden hue, mild floral aroma, low glycemic index, and rarely crystallizes over time due to naturally high fructose content.',
    story: 'Sourced from nomadic beekeepers who follow seasonal blooming patterns across the Pir Panjal ranges during early summer.',
    category: 'Single Flora Honey',
    categorySlug: 'single-flora',
    price: 799,
    originalPrice: 999,
    discountPercent: 20,
    rating: 4.8,
    reviewsCount: 112,
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '250g', price: 420, originalPrice: 520, stock: 25, sku: 'MV-ACA-250' },
      { size: '500g', price: 799, originalPrice: 999, stock: 38, sku: 'MV-ACA-500' },
      { size: '1kg', price: 1499, originalPrice: 1899, stock: 15, sku: 'MV-ACA-1000' }
    ],
    selectedSize: '500g',
    origin: 'Kashmir Valley & Anantnag, J&K',
    nectarSource: 'Robinia Pseudoacacia (Black Locust)',
    harvestSeason: 'May - June',
    purityScore: 99.9,
    benefits: [
      'Low Glycemic Index compared to standard honeys',
      'Exceptionally mild taste, ideal for green tea and children',
      'Promotes digestive wellness and gut microbiome',
      '100% cold-extracted without fine ultra-filtration'
    ],
    nutritionFacts: {
      energy: '302 kcal per 100g',
      carbohydrates: '81.8g',
      naturalSugars: '79.5g (High Fructose)',
      proteins: '0.2g',
      antioxidants: 'Bioflavonoids & Ascorbic Acid'
    },
    isFeatured: true,
    isBestSeller: true,
    isOrganicCertified: true,
    createdAt: '2026-02-01T10:00:00Z',
    reviews: [
      {
        id: 'rev-3',
        userName: 'Dr. Rohan Iyer',
        rating: 5,
        comment: 'Crystal clear and does not overpower my morning green tea. Exceptional quality.',
        date: '2026-02-28',
        verified: true
      }
    ]
  },
  {
    id: 'prod-jamun-blossom',
    name: 'Madhuvan Organic Jamun Blossom Honey',
    slug: 'organic-jamun-blossom-honey',
    tagline: 'Bittersweet dark amber honey from native Indian Blackberry orchards',
    description: 'Unique bittersweet flavor profile with an enticing dark mahogany color. Collected when Indian blackberry (Jamun) trees are in full bloom. Known traditionally in Ayurveda for aiding blood sugar balance, metabolism, and digestive soothing.',
    story: 'Harvested from certified organic orchards in Madhya Pradesh where wild bees feast solely on Jamun blossoms for two concentrated weeks.',
    category: 'Single Flora Honey',
    categorySlug: 'single-flora',
    price: 599,
    originalPrice: 750,
    discountPercent: 20,
    rating: 4.7,
    reviewsCount: 89,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '250g', price: 320, originalPrice: 399, stock: 20, sku: 'MV-JAM-250' },
      { size: '500g', price: 599, originalPrice: 750, stock: 28, sku: 'MV-JAM-500' },
      { size: '1kg', price: 1099, originalPrice: 1399, stock: 12, sku: 'MV-JAM-1000' }
    ],
    selectedSize: '500g',
    origin: 'Hoshangabad, Madhya Pradesh',
    nectarSource: 'Syzygium Cumini (Black Plum / Jamun Bloom)',
    harvestSeason: 'June - July',
    purityScore: 99.6,
    benefits: [
      'Traditional Ayurvedic support for glucose metabolism',
      'High natural zinc, iron, and potassium content',
      'Distinctive woody, bittersweet aftertaste',
      'Calms stomach acid and improves gut health'
    ],
    nutritionFacts: {
      energy: '298 kcal per 100g',
      carbohydrates: '79.2g',
      naturalSugars: '77.0g',
      proteins: '0.4g',
      antioxidants: 'Rich in Anthocyanins and Gallic acid'
    },
    isFeatured: true,
    isBestSeller: false,
    isOrganicCertified: true,
    createdAt: '2026-02-10T10:00:00Z',
    reviews: [
      {
        id: 'rev-4',
        userName: 'Meera Deshmukh',
        rating: 5,
        comment: 'Has that authentic Jamun flavor. Not overly sugary, wonderful earthy note.',
        date: '2026-03-05',
        verified: true
      }
    ]
  },
  {
    id: 'prod-tulsi-infused',
    name: 'Madhuvan Vedic Holy Tulsi Infused Raw Honey',
    slug: 'vedic-holy-tulsi-infused-raw-honey',
    tagline: 'Raw forest honey slow-infused with Krishna & Rama Tulsi holy basil',
    description: 'An Ayurvedic powerhouse combining wild raw multi-floral honey with sun-dried Holy Basil (Tulsi) leaves. Known as the Elixir of Life, this infusion offers a refreshing herbal fragrance and strong adaptogenic immunity support.',
    story: 'Prepared using classical Ayurvedic methods of cold sun-infusion over 21 days so the botanical essential oils enrich the raw honey without heating.',
    category: 'Ayurvedic & Herbal Infusions',
    categorySlug: 'ayurvedic-infused',
    price: 699,
    originalPrice: 899,
    discountPercent: 22,
    rating: 4.9,
    reviewsCount: 164,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '250g', price: 380, originalPrice: 480, stock: 25, sku: 'MV-TLS-250' },
      { size: '500g', price: 699, originalPrice: 899, stock: 50, sku: 'MV-TLS-500' },
      { size: '1kg', price: 1299, originalPrice: 1699, stock: 18, sku: 'MV-TLS-1000' }
    ],
    selectedSize: '500g',
    origin: 'Vrindavan & Haridwar foothills, Uttarakhand',
    nectarSource: 'Ocimum Sanctum & Wild Himalayan flora',
    harvestSeason: 'Year-Round Slow Solar Infusion',
    purityScore: 99.9,
    benefits: [
      'Adaptogenic support to ease seasonal allergies and stress',
      'Soothes chest congestion, seasonal flu & sore throat',
      'Rich in Eugenol and natural antioxidants',
      'Can be taken directly or with warm herbal decoctions'
    ],
    nutritionFacts: {
      energy: '308 kcal per 100g',
      carbohydrates: '82.0g',
      naturalSugars: '79.0g',
      proteins: '0.4g',
      antioxidants: 'Eugenol, Apigenin, Rosmarinic Acid'
    },
    isFeatured: true,
    isBestSeller: true,
    isOrganicCertified: true,
    createdAt: '2026-02-15T10:00:00Z',
    reviews: [
      {
        id: 'rev-5',
        userName: 'Suresh Menon',
        rating: 5,
        comment: 'Cured my persistent dry cough within two days. The basil aroma is intoxicating.',
        date: '2026-03-12',
        verified: true
      }
    ]
  },
  {
    id: 'prod-raw-honeycomb',
    name: 'Madhuvan 100% Virgin Raw Honeycomb Frame',
    slug: 'virgin-raw-honeycomb-frame',
    tagline: 'Untouched edible wax honeycomb submerged in pure liquid mountain nectar',
    description: 'The purest form of honey on Earth. Straight from the bee hive into food-grade wooden gift boxes without any human touch or machine processing. Chew the nutritious natural beeswax, loaded with propolis, bee pollen, and golden nectar.',
    story: 'Each honeycomb is cut by hand with heated stainless steel knives from select hives located in organic mountain sanctuaries.',
    category: 'Honeycomb & Gourmet',
    categorySlug: 'honeycomb-gourmet',
    price: 899,
    originalPrice: 1199,
    discountPercent: 25,
    rating: 5.0,
    reviewsCount: 76,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '350g Comb', price: 899, originalPrice: 1199, stock: 22, sku: 'MV-CMB-350' },
      { size: '700g Comb', price: 1699, originalPrice: 2199, stock: 10, sku: 'MV-CMB-700' }
    ],
    selectedSize: '350g Comb',
    origin: 'Kullu Valley, Himachal Pradesh',
    nectarSource: 'Mountain Meadow Wildflowers & Apple Blossoms',
    harvestSeason: 'Autumn Harvest (October)',
    purityScore: 100.0,
    benefits: [
      '100% unadulterated directly from the hive cells',
      'Natural chewable beeswax full of beneficial bee propolis',
      'Gourmet culinary presentation for cheese boards and fruits',
      'Zero heat, zero filtering, 100% bee-sealed freshness'
    ],
    nutritionFacts: {
      energy: '315 kcal per 100g',
      carbohydrates: '81.5g',
      naturalSugars: '80.0g',
      proteins: '0.6g (including Bee Pollen & Propolis)',
      antioxidants: 'Maximum crude enzyme retention'
    },
    isFeatured: true,
    isBestSeller: false,
    isOrganicCertified: true,
    createdAt: '2026-02-20T10:00:00Z',
    reviews: [
      {
        id: 'rev-6',
        userName: 'Chef Karan Malhotra',
        rating: 5,
        comment: 'Chewing raw honeycomb with artisanal aged cheddar is heaven. Packaging is stunning!',
        date: '2026-03-14',
        verified: true
      }
    ]
  },
  {
    id: 'prod-mustard-blossom',
    name: 'Madhuvan Creamed Mustard Blossom Honey',
    slug: 'creamed-mustard-blossom-honey',
    tagline: 'Velvety smooth, naturally crystallised golden cream honey for toast and smoothies',
    description: 'Golden yellow, rich, and velvety smooth. Mustard blossom honey naturally crystallizes rapidly due to high dextrose. We carefully churn it at cold temperatures into a luscious, butter-like spread without any chemicals or dairy.',
    story: 'Harvested during the breathtaking yellow winter mustard blooms of rural Punjab and Rajasthan.',
    category: 'Honeycomb & Gourmet',
    categorySlug: 'honeycomb-gourmet',
    price: 499,
    originalPrice: 650,
    discountPercent: 23,
    rating: 4.7,
    reviewsCount: 63,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: [
      { size: '250g', price: 280, originalPrice: 350, stock: 25, sku: 'MV-MST-250' },
      { size: '500g', price: 499, originalPrice: 650, stock: 35, sku: 'MV-MST-500' },
      { size: '1kg', price: 899, originalPrice: 1199, stock: 15, sku: 'MV-MST-1000' }
    ],
    selectedSize: '500g',
    origin: 'Bharatpur, Rajasthan & Punjab Plains',
    nectarSource: 'Brassica Juncea (Yellow Mustard Flowers)',
    harvestSeason: 'December - January (Winter Bloom)',
    purityScore: 99.7,
    benefits: [
      'Natural spreadable texture that does not drip',
      'Warm digestive qualities as per traditional medicine',
      'Rich in warming minerals and plant sterols',
      'Ideal dairy-free natural replacement for jams and butter'
    ],
    nutritionFacts: {
      energy: '304 kcal per 100g',
      carbohydrates: '82.3g',
      naturalSugars: '81.0g (High natural dextrose)',
      proteins: '0.3g',
      antioxidants: 'Glucosinolates and polyphenols'
    },
    isFeatured: false,
    isBestSeller: false,
    isOrganicCertified: true,
    createdAt: '2026-02-25T10:00:00Z',
    reviews: [
      {
        id: 'rev-7',
        userName: 'Pooja Bhatt',
        rating: 5,
        comment: 'Kids love spreading it on toast! Tastes like sweet whipped butter.',
        date: '2026-03-01',
        verified: true
      }
    ]
  }
];
