import { useStore } from '../store/store';

export const useProducts = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
    getProductById,
    addCategory,
    deleteCategory
  } = useStore();

  return {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductBySlug,
    getProductById,
    addCategory,
    deleteCategory
  };
};
