import { VideoItem } from '../types/video.types';

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'Extracting Golden Amber Nectar from Sundarbans Wild Comb',
    description: 'Watch how tribal Mowals ethically harvest giant wild Apis dorsata honeycombs deep in the mangrove reserves without damaging the bee colony.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    category: 'harvest',
    duration: '0:15',
    taggedProductId: 'prod-wild-forest',
    taggedProductName: 'Madhuvan Sundarbans Wild Forest Honey',
    taggedProductSlug: 'sundarbans-wild-forest-honey',
    views: 1420,
    featuredOnHome: true,
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    id: 'vid-2',
    title: 'How to Do the Cold Water Purity Test at Home',
    description: 'See the exact difference between 100% pure raw unheated honey and adulterated commercial corn syrup in a single glass of water.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    category: 'purity',
    duration: '0:15',
    taggedProductId: 'prod-kashmir-acacia',
    taggedProductName: 'Madhuvan Kashmir Valley Acacia Honey',
    taggedProductSlug: 'kashmir-valley-acacia-honey',
    views: 2890,
    featuredOnHome: true,
    createdAt: '2026-03-18T12:00:00Z'
  },
  {
    id: 'vid-3',
    title: 'Nomadic Kashmiri Beekeeping in Robinia Acacia Valleys',
    description: 'Journey to 6,500 ft altitude in Jammu & Kashmir as our beekeepers follow the pristine white acacia blossom migration.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
    category: 'story',
    duration: '0:15',
    taggedProductId: 'prod-kashmir-acacia',
    taggedProductName: 'Madhuvan Kashmir Valley Acacia Honey',
    taggedProductSlug: 'kashmir-valley-acacia-honey',
    views: 1840,
    featuredOnHome: true,
    createdAt: '2026-03-20T14:30:00Z'
  },
  {
    id: 'vid-4',
    title: 'Ayurvedic Holy Tulsi Honey Decoction for Seasonal Immunity',
    description: 'Master beekeeper and herbalist Vaidya Joshi demonstrates brewing lukewarm Tulsi raw honey tea to soothe chest congestion.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    category: 'recipe',
    duration: '0:15',
    taggedProductId: 'prod-tulsi-infused',
    taggedProductName: 'Madhuvan Vedic Holy Tulsi Infused Raw Honey',
    taggedProductSlug: 'vedic-holy-tulsi-infused-raw-honey',
    views: 3120,
    featuredOnHome: true,
    createdAt: '2026-03-22T09:15:00Z'
  }
];
