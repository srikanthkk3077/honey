import { User } from '../../types/auth.types';
import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_auth_user';

export const getInitialUser = (): User | null => {
  return storage.get<User | null>(STORAGE_KEY, null);
};

export const saveUser = (user: User | null) => {
  if (user) {
    storage.set(STORAGE_KEY, user);
  } else {
    storage.remove(STORAGE_KEY);
  }
};
