import { Product, Category } from '../../types/product.types';
import { storage } from '../../utils/storage';

const PRODUCTS_KEY = 'madhuvan_products_v5';
const CATEGORIES_KEY = 'madhuvan_categories_v5';

export const getInitialProducts = (): Product[] => {
  return storage.get<Product[]>(PRODUCTS_KEY, []);
};

export const saveProducts = (products: Product[]) => {
  storage.set(PRODUCTS_KEY, products);
};

export const getInitialCategories = (): Category[] => {
  return storage.get<Category[]>(CATEGORIES_KEY, []);
};

export const saveCategories = (categories: Category[]) => {
  storage.set(CATEGORIES_KEY, categories);
};
