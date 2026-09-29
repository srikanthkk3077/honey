export interface ProductSizeOption {
  size: string; // e.g. "250g", "500g", "1kg"
  price: number;
  originalPrice: number;
  stock: number;
  sku: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  story: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  images: string[];
  sizes: ProductSizeOption[];
  selectedSize?: string;
  origin: string;
  nectarSource: string;
  harvestSeason: string;
  purityScore: number; // e.g., 99.8
  benefits: string[];
  nutritionFacts: {
    energy: string;
    carbohydrates: string;
    naturalSugars: string;
    proteins: string;
    antioxidants: string;
  };
  isFeatured: boolean;
  isBestSeller: boolean;
  isOrganicCertified: boolean;
  reviews: ProductReview[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}
