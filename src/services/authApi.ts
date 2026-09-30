import api, { setToken, removeToken } from './api';
import { User } from '../types/auth.types';

// ─── Response shapes from backend ────────────────────────────────────────────
interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id?: string;
      id?: string;
      name: string;
      email: string;
      phone?: string;
      role: 'customer' | 'admin';
      createdAt: string;
      address?: {
        street: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
      };
    };
    token: string;
  };
}

interface ProfileResponse {
  success: boolean;
  data: AuthResponse['data']['user'];
}

// ─── Helper: normalise backend user → frontend User ──────────────────────────
function normaliseUser(raw: AuthResponse['data']['user']): User {
  return {
    id: raw._id || raw.id || '',
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    role: raw.role,
    createdAt: raw.createdAt,
    address: raw.address,
  };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  /** Customer login – POST /api/auth/login */
  login: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    setToken(data.data.token);
    return normaliseUser(data.data.user);
  },

  /** Admin login – POST /api/auth/admin-login */
  adminLogin: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<AuthResponse>('/auth/admin-login', {
      email,
      password,
    });
    setToken(data.data.token);
    return normaliseUser(data.data.user);
  },

  /** Customer register – POST /api/auth/register */
  register: async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<User> => {
    const { data } = await api.post<AuthResponse>('/auth/register', {
      name,
      email,
      phone,
      password,
    });
    setToken(data.data.token);
    return normaliseUser(data.data.user);
  },

  /** Get logged-in user profile – GET /api/auth/me */
  getProfile: async (): Promise<User> => {
    const { data } = await api.get<ProfileResponse>('/auth/me');
    return normaliseUser(data.data);
  },

  /** Update profile – PUT /api/auth/profile */
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const { data } = await api.put<ProfileResponse>('/auth/profile', updates);
    return normaliseUser(data.data);
  },

  /** Change password – PUT /api/auth/change-password */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  /** Logout – clears token locally (no backend endpoint needed) */
  logout: (): void => {
    removeToken();
  },
};

export default authApi;
