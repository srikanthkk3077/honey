import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ─── Base URL ─────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = 'madhuvan_auth_token';

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  try {
    const userStr = localStorage.getItem('madhuvan_auth_user');
    if (userStr) {
      const u = JSON.parse(userStr);
      if (u.token) {
        localStorage.setItem(TOKEN_KEY, u.token);
        return u.token;
      }
    }
  } catch {}
  return null;
};
export const setToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

// ─── Axios instance ───────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Response interceptor: unwrap data / handle 401 ──────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response?.status === 401) {
      // Clear stale credentials without a hard redirect so UI can handle it
      removeToken();
      localStorage.removeItem('madhuvan_auth_user');
    }
    // Bubble up a clean Error with the backend message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
