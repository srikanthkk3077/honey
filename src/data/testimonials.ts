export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  comment: string;
  rating: number;
  productMentioned: string;
}

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Radhika Singhania',
    role: 'Ayurvedic Nutritionist',
    location: 'Mumbai',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    comment: 'Most store-bought honeys are adulterated with invert sugar syrup. Madhuvan honey is one of the few brands that passed my clinic’s refractometer test with zero adulteration. The Sundarbans raw honey is truly therapeutic!',
    rating: 5,
    productMentioned: 'Madhuvan Sundarbans Wild Forest Honey'
  },
  {
    id: 'test-2',
    name: 'Harish Chandra Pant',
    role: 'Traditional Beekeeper & Forest Ranger',
    location: 'Nainital, Uttarakhand',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    comment: 'I have worked with the Madhuvan team for 4 seasons. They follow ethical non-destructive harvesting where bees are fed and hives remain flourishing. You taste the true essence of forest blooms.',
    rating: 5,
    productMentioned: 'Kashmir Valley Acacia Honey'
  },
  {
    id: 'test-3',
    name: 'Siddharth & Priya Nair',
    role: 'Fitness Enthusiasts & Parents',
    location: 'Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    comment: 'We replaced processed white sugar in our house completely with Madhuvan raw honey. The Holy Tulsi honey keeps the whole family immune against seasonal colds. Cannot recommend enough!',
    rating: 5,
    productMentioned: 'Vedic Holy Tulsi Infused Raw Honey'
  }
];
