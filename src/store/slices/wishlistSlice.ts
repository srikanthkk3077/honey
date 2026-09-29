import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_wishlist';

export const getInitialWishlist = (): string[] => {
  return storage.get<string[]>(STORAGE_KEY, ['prod-wild-forest', 'prod-raw-honeycomb']);
};

export const saveWishlist = (ids: string[]) => {
  storage.set(STORAGE_KEY, ids);
};
