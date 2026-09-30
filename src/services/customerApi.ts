import api from './api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: any[];
  topProducts: any[];
  monthlySales: { month: string; revenue: number; orders: number }[];
}

// ─── Contact API ──────────────────────────────────────────────────────────────
export const contactApi = {
  /** POST /api/contact */
  submit: async (payload: ContactPayload): Promise<void> => {
    await api.post('/contact', payload);
  },

  /** POST /api/contact/newsletter */
  subscribeNewsletter: async (email: string, name?: string): Promise<void> => {
    await api.post('/contact/newsletter', { email, name });
  },

  // ── Admin ────────────────────────────────────────────────────────────────────

  /** GET /api/contact/inquiries (admin) */
  getInquiries: async (): Promise<any[]> => {
    const { data } = await api.get<ApiResponse<any>>('/contact/inquiries');
    return data.data || [];
  },

  /** PUT /api/contact/inquiries/:id (admin) */
  updateInquiryStatus: async (id: string, status: string): Promise<void> => {
    await api.put(`/contact/inquiries/${id}`, { status });
  },

  /** GET /api/contact/subscribers (admin) */
  getSubscribers: async (): Promise<any[]> => {
    const { data } = await api.get<ApiResponse<any>>('/contact/subscribers');
    return data.data || [];
  },
};

// ─── Dashboard API (admin) ────────────────────────────────────────────────────
export const dashboardApi = {
  /** GET /api/dashboard/stats */
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<any>>('/dashboard/stats');
    return data.data;
  },
};

// ─── Settings API ─────────────────────────────────────────────────────────────
export const settingsApi = {
  /** GET /api/settings */
  get: async (): Promise<any> => {
    const { data } = await api.get<ApiResponse<any>>('/settings');
    return data.data;
  },

  /** PUT /api/settings (admin) */
  update: async (settings: any): Promise<any> => {
    const { data } = await api.put<ApiResponse<any>>('/settings', settings);
    return data.data;
  },
};

// ─── Wishlist API (authenticated) ─────────────────────────────────────────────
export const wishlistApi = {
  /** GET /api/wishlist */
  get: async (): Promise<string[]> => {
    const { data } = await api.get<ApiResponse<any>>('/wishlist');
    const items = data.data?.products || data.data || [];
    return Array.isArray(items)
      ? items.map((p: any) => p._id || p.id || p)
      : [];
  },

  /** POST /api/wishlist/:productId */
  toggle: async (productId: string): Promise<{ added: boolean }> => {
    const { data } = await api.post<ApiResponse<any>>(`/wishlist/${productId}`);
    return { added: data.data?.added ?? true };
  },
};

// ─── Customer API (admin) ─────────────────────────────────────────────────────
export const customerApi = {
  /** GET /api/customers (admin) */
  getAll: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ customers: any[]; total: number }> => {
    const { data } = await api.get<any>('/customers', { params });
    const raw = data.data?.customers || data.data || [];
    return { customers: raw, total: data.data?.total || raw.length };
  },

  /** GET /api/customers/:id (admin) */
  getById: async (id: string): Promise<any> => {
    const { data } = await api.get<ApiResponse<any>>(`/customers/${id}`);
    return data.data;
  },
};
