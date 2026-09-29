import { User } from '../types/auth.types';
import { ADMIN_CREDENTIALS } from '../utils/constants';

export const authApi = {
  login: async (email: string, pass: string): Promise<User> => {
    await new Promise((res) => setTimeout(res, 400));
    if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
      return {
        id: 'admin-01',
        name: 'Master Beekeeper',
        email,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
    }
    return {
      id: 'cust-' + Date.now(),
      name: email.split('@')[0],
      email,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
  },

  register: async (name: string, email: string, phone: string): Promise<User> => {
    await new Promise((res) => setTimeout(res, 500));
    return {
      id: 'cust-' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
  }
};
