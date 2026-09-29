import { Product, Category } from '../../types/product.types';
import { INITIAL_PRODUCTS } from '../../data/products';
import { INITIAL_CATEGORIES } from '../../data/categories';
import { storage } from '../../utils/storage';

const PRODUCTS_KEY = 'madhuvan_products';
const CATEGORIES_KEY = 'madhuvan_categories';

export const getInitialProducts = (): Product[] => {
  return storage.get<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS);
};

export const saveProducts = (products: Product[]) => {
  storage.set(PRODUCTS_KEY, products);
};

export const getInitialCategories = (): Category[] => {
  return storage.get<Category[]>(CATEGORIES_KEY, INITIAL_CATEGORIES);
};

export const saveCategories = (categories: Category[]) => {
  storage.set(CATEGORIES_KEY, categories);
};
