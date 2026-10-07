import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ─── Base URL ─────────────────────────────────────────────────────────────────
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  } catch { }
  return null;
};
export const setToken = (token: string): void =>
  localStorage.setItem(TOKEN_KEY, token);
export const removeToken = (): void => localStorage.removeItem(TOKEN_KEY);

// ─── Axios instance ───────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If payload is FormData, remove Content-Type so Axios/browser sets boundary automatically
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ─── Error Message Formatter ──────────────────────────────────────────────────
export const formatApiErrorMessage = (error: AxiosError<any>): string => {
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return `Request Timeout: Server at ${API_BASE_URL} took too long to respond (timeout 30s).`;
    }
    if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
      return `Network Error: Cannot connect to backend server at ${API_BASE_URL}. Ensure your server is running on port 5000.`;
    }
    return `Connection Failed: ${error.message || 'Unable to connect to backend server.'}`;
  }

  const { status, data } = error.response;
  let detailMsg = '';

  if (typeof data === 'string') {
    detailMsg = data.length < 150 ? data : `HTTP ${status} response`;
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      detailMsg = data.errors
        .map((e: any) => (typeof e === 'string' ? e : e.msg || e.message || JSON.stringify(e)))
        .join(', ');
    } else if (data.message) {
      detailMsg = data.message;
    } else if (data.error) {
      detailMsg = typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error);
    }
  }

  if (status === 400) {
    return `Validation Error (400): ${detailMsg || 'Invalid request parameters'}`;
  }
  if (status === 401) {
    return `Authentication Error (401): ${detailMsg || 'Session expired. Please log in again.'}`;
  }
  if (status === 403) {
    return `Access Denied (403): ${detailMsg || 'You do not have permission to perform this action.'}`;
  }
  if (status === 404) {
    return `Resource Not Found (404): ${detailMsg || error.config?.url || 'Requested endpoint not found'}`;
  }
  if (status === 413) {
    return 'Payload Too Large (413): The uploaded image or payload exceeds the server limit.';
  }
  if (status === 500) {
    return `Server Error (500): ${detailMsg || 'Internal server error occurred.'}`;
  }
  if (status >= 502 && status <= 504) {
    return `Backend Unavailable (${status}): Server is temporarily offline or unreachable.`;
  }

  return detailMsg || error.message || `Request failed with HTTP status ${status}.`;
};

// ─── Global Error Dispatcher with Deduplication ──────────────────────────────
let lastErrorMsg = '';
let lastErrorTime = 0;

export const dispatchApiError = (message: string, status?: number, url?: string, method?: string) => {
  const now = Date.now();
  // Prevent repeating identical error within 3 seconds
  if (message === lastErrorMsg && now - lastErrorTime < 3000) {
    return;
  }
  lastErrorMsg = message;
  lastErrorTime = now;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('madhuvan_api_error', {
        detail: { message, status, url, method },
      })
    );
  }
};

// ─── Response interceptor: unwrap data / handle 401 & surface errors ──────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string; errors?: any }>) => {
    const status = error.response?.status;
    if (status === 401) {
      // Clear stale credentials
      removeToken();
      localStorage.removeItem('madhuvan_auth_user');

      // If session expired while on admin console, smoothly route to login
      if (
        typeof window !== 'undefined' &&
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.includes('/admin/login')
      ) {
        window.location.href = '/admin/login';
      }
    }

    // Format a comprehensive, user-friendly error message
    const detailedMessage = formatApiErrorMessage(error);
    const enriched = new Error(detailedMessage) as any;
    enriched.status = status;
    enriched.response = error.response;
    enriched.rawError = error;

    // Dispatch global toast event unless explicitly silenced in request config
    if (!(error.config as any)?.silent) {
      dispatchApiError(detailedMessage, status, error.config?.url, error.config?.method?.toUpperCase());
    }

    return Promise.reject(enriched);
  }
);

export default api;
