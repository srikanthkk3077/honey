import { Product, Category } from '../../types/product.types';
import { INITIAL_PRODUCTS } from '../../data/products';
import { INITIAL_CATEGORIES } from '../../data/categories';
import { storage } from '../../utils/storage';

const PRODUCTS_KEY = 'madhuvan_products_v4';
const CATEGORIES_KEY = 'madhuvan_categories_v4';

const PURE_HONEY_IMG = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1000&q=80';

export const getInitialProducts = (): Product[] => {
  const products = storage.get<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
  return products.map((p) => ({
    ...p,
    images: p.images.map((img) =>
      img && img.includes('photo-1587049352846') ? PURE_HONEY_IMG : img
    ),
  }));
};

export const saveProducts = (products: Product[]) => {
  storage.set(PRODUCTS_KEY, products);
};

export const getInitialCategories = (): Category[] => {
  const categories = storage.get<Category[]>(CATEGORIES_KEY, INITIAL_CATEGORIES);
  return categories.map((c) => ({
    ...c,
    image: c.image && c.image.includes('photo-1587049352846') ? PURE_HONEY_IMG : c.image,
  }));
};

export const saveCategories = (categories: Category[]) => {
  storage.set(CATEGORIES_KEY, categories);
};
