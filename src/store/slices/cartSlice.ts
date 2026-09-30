import { CartItem } from '../../types/order.types';
import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_cart_v3';
const PURE_HONEY_IMG = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80';

export const getInitialCart = (): CartItem[] => {
  const cart = storage.get<CartItem[]>(STORAGE_KEY, [
    {
      id: 'cart-init-1',
      productId: 'prod-wild-forest',
      name: 'Madhuvan Sundarbans Wild Forest Honey',
      slug: 'sundarbans-wild-forest-honey',
      image: PURE_HONEY_IMG,
      size: '500g',
      price: 649,
      originalPrice: 850,
      quantity: 1,
      stock: 45
    }
  ]);
  return cart.map((item) => ({
    ...item,
    image: item.image && item.image.includes('photo-1587049352846') ? PURE_HONEY_IMG : item.image,
  }));
};

export const saveCart = (items: CartItem[]) => {
  storage.set(STORAGE_KEY, items);
};
