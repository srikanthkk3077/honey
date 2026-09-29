import { Product, Category } from '../types/product.types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_CATEGORIES } from '../data/categories';

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    return INITIAL_PRODUCTS;
  },
  getCategories: async (): Promise<Category[]> => {
    return INITIAL_CATEGORIES;
  }
};
