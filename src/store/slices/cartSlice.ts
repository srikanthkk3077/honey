import { CartItem } from '../../types/order.types';
import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_cart';

export const getInitialCart = (): CartItem[] => {
  return storage.get<CartItem[]>(STORAGE_KEY, [
    {
      id: 'cart-init-1',
      productId: 'prod-wild-forest',
      name: 'Madhuvan Sundarbans Wild Forest Honey',
      slug: 'sundarbans-wild-forest-honey',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
      size: '500g',
      price: 649,
      originalPrice: 850,
      quantity: 1,
      stock: 45
    }
  ]);
};

export const saveCart = (items: CartItem[]) => {
  storage.set(STORAGE_KEY, items);
};
