import { CartItem } from '../../types/order.types';
import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_cart_v5';

// Purge any old cart versions that contained mock 'prod-wild-forest'
try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('madhuvan_cart_v3');
    localStorage.removeItem('madhuvan_cart_v2');
    localStorage.removeItem('madhuvan_cart_v1');
    localStorage.removeItem('madhuvan_cart');
  }
} catch {}

export const getInitialCart = (): CartItem[] => {
  const cart = storage.get<CartItem[]>(STORAGE_KEY, []);
  // Strip out any legacy mock items with fake IDs like 'prod-wild-forest'
  const clean = cart.filter(
    (item) => item.productId && !item.productId.startsWith('prod-')
  );
  if (clean.length !== cart.length) {
    storage.set(STORAGE_KEY, clean);
  }
  return clean;
};

export const saveCart = (items: CartItem[]) => {
  // Only save genuine items with real IDs
  const clean = items.filter(
    (item) => item.productId && !item.productId.startsWith('prod-')
  );
  storage.set(STORAGE_KEY, clean);
};
