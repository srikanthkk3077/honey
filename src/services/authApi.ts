import api, { setToken, removeToken } from './api';
import { User } from '../types/auth.types';

// ─── Response shapes from backend ────────────────────────────────────────────
export interface AuthResponse {
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

export interface ProfileResponse {
  success: boolean;
  data: AuthResponse['data']['user'];
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    message: string;
    otp?: string;
    resetToken?: string;
  };
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data?: {
    valid: boolean;
    email: string;
    resetToken?: string;
    message?: string;
  };
}

// ─── Helper: normalise backend user → frontend User ──────────────────────────
export function normaliseUser(raw: any): User {
  return {
    id: raw._id || raw.id || '',
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    role: raw.role || 'customer',
    createdAt: raw.createdAt || new Date().toISOString(),
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
    if (data.data?.token) {
      setToken(data.data.token);
    }
    return normaliseUser(data.data.user);
  },

  /** Admin login – POST /api/auth/admin-login */
  adminLogin: async (email: string, password: string): Promise<User> => {
    const { data } = await api.post<AuthResponse>('/auth/admin-login', {
      email,
      password,
    });
    if (data.data?.token) {
      setToken(data.data.token);
    }
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
    if (data.data?.token) {
      setToken(data.data.token);
    }
    return normaliseUser(data.data.user);
  },

  /** Request password reset OTP – POST /api/auth/forgot-password */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const { data } = await api.post<ForgotPasswordResponse>('/auth/forgot-password', {
      email,
    });
    return data;
  },

  /** Verify OTP code – POST /api/auth/verify-otp */
  verifyResetOtp: async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const { data } = await api.post<VerifyOtpResponse>('/auth/verify-otp', {
      email,
      otp,
    });
    return data;
  },

  /** Reset password – POST /api/auth/reset-password */
  resetPassword: async (
    email: string,
    otpOrToken: string,
    newPassword: string
  ): Promise<{ user: User; token: string; message: string }> => {
    const { data } = await api.post<any>('/auth/reset-password', {
      email,
      otp: otpOrToken,
      resetToken: otpOrToken,
      newPassword,
    });

    if (data.data?.token) {
      setToken(data.data.token);
    }

    return {
      user: normaliseUser(data.data?.user || data.data),
      token: data.data?.token || '',
      message: data.message || 'Password reset successfully',
    };
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
