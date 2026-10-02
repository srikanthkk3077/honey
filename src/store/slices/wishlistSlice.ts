import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_wishlist_v3';

try {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('madhuvan_wishlist');
    localStorage.removeItem('madhuvan_wishlist_v1');
    localStorage.removeItem('madhuvan_wishlist_v2');
  }
} catch {}

export const getInitialWishlist = (): string[] => {
  const wishlist = storage.get<string[]>(STORAGE_KEY, []);
  const clean = wishlist.filter((id) => id && !id.startsWith('prod-'));
  if (clean.length !== wishlist.length) {
    storage.set(STORAGE_KEY, clean);
  }
  return clean;
};

export const saveWishlist = (ids: string[]) => {
  const clean = ids.filter((id) => id && !id.startsWith('prod-'));
  storage.set(STORAGE_KEY, clean);
};
