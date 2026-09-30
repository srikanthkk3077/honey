import { Category } from '../types/product.types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-wild-forest',
    name: 'Wild Forest Honey',
    slug: 'wild-forest-honey',
    description: 'Dark, enzyme-rich raw nectar collected from deep forest flora & untouched wild hives.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    productCount: 4,
  },
  {
    id: 'cat-single-flora',
    name: 'Single Flora Honey',
    slug: 'single-flora',
    description: 'Monofloral honey harvested during specific seasonal flower blooms across regional valleys.',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
    productCount: 3,
  },
  {
    id: 'cat-ayurvedic-infused',
    name: 'Ayurvedic & Herbal Infusions',
    slug: 'ayurvedic-infused',
    description: 'Raw honey slow-infused with potent Vedic herbs like Tulsi, Ginger, Cinnamon & Ashwagandha.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    productCount: 3,
  },
  {
    id: 'cat-honeycomb-creamed',
    name: 'Honeycomb & Gourmet',
    slug: 'honeycomb-gourmet',
    description: 'Pure chewable raw comb frames and naturally churned crystal cream honey spreads.',
    image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=800&q=80',
    productCount: 2,
  },
];
