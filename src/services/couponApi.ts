import api from './api';

export type DiscountType = 'percentage' | 'flat';
export type CouponStatus = 'active' | 'inactive' | 'expired';

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  status: CouponStatus;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppliedCoupon {
  couponId: string;
  code: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  maxDiscountAmount?: number;
  minOrderAmount: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Customer: Validate & Apply Coupon ───────────────────────────────────────
export const couponApi = {
  /** POST /api/coupons/validate — customer applies coupon at checkout */
  validate: async (
    code: string,
    cartTotal: number,
    userEmail?: string
  ): Promise<AppliedCoupon> => {
    const { data } = await api.post<ApiResponse<AppliedCoupon>>('/coupons/validate', {
      code,
      cartTotal,
      userEmail,
    });
    return data.data;
  },

  /** GET /api/coupons/active — public list of currently active coupons for customers */
  getActive: async (): Promise<Coupon[]> => {
    const { data } = await api.get<ApiResponse<Coupon[]>>('/coupons/active');
    return data.data || [];
  },

  // ─── Admin CRUD ────────────────────────────────────────────────────────────

  /** GET /api/coupons — list all coupons */
  getAll: async (params?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ coupons: Coupon[]; total: number; page: number; pages: number }> => {
    const { data } = await api.get<ApiResponse<any>>('/coupons', { params });
    return data.data;
  },

  /** GET /api/coupons/:id */
  getById: async (id: string): Promise<Coupon> => {
    const { data } = await api.get<ApiResponse<Coupon>>(`/coupons/${id}`);
    return data.data;
  },

  /** POST /api/coupons */
  create: async (payload: Partial<Coupon>): Promise<Coupon> => {
    const { data } = await api.post<ApiResponse<Coupon>>('/coupons', payload);
    return data.data;
  },

  /** PUT /api/coupons/:id */
  update: async (id: string, payload: Partial<Coupon>): Promise<Coupon> => {
    const { data } = await api.put<ApiResponse<Coupon>>(`/coupons/${id}`, payload);
    return data.data;
  },

  /** DELETE /api/coupons/:id */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/coupons/${id}`);
  },

  /** PATCH /api/coupons/:id/toggle — toggle active/inactive */
  toggle: async (id: string): Promise<Coupon> => {
    const { data } = await api.patch<ApiResponse<Coupon>>(`/coupons/${id}/toggle`);
    return data.data;
  },
};

export default couponApi;
