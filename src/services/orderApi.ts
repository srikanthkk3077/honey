import api from './api';
import {
  Order,
  OrderItem,
  ShippingAddress,
  PaymentMethodType,
  OrderStatus,
  PaymentStatus,
} from '../types/order.types';

// ─── Backend → frontend normaliser ───────────────────────────────────────────
function normaliseOrder(raw: any): Order {
  const items: OrderItem[] = (raw.items || raw.orderItems || []).map(
    (i: any) => ({
      productId: i.productId || i.product || i._id || '',
      productName: i.productName || i.name || '',
      size: i.size || '500g',
      image: i.image || '',
      price: i.price || 0,
      quantity: i.quantity || 1,
    })
  );

  // Map backend paymentStatus to frontend PaymentStatus
  const mapPaymentStatus = (s: string): PaymentStatus => {
    if (s === 'completed') return 'paid';
    if (s === 'pending' && raw.paymentMethod === 'upi') return 'verification_pending';
    return (s as PaymentStatus) || 'pending';
  };

  return {
    id: raw._id || raw.id || '',
    orderNumber: raw.orderNumber || '',
    customerName: raw.customerName || raw.shippingAddress?.fullName || '',
    customerEmail: raw.customerEmail || raw.shippingAddress?.email || '',
    customerPhone: raw.customerPhone || raw.shippingAddress?.phone || '',
    shippingAddress: raw.shippingAddress as ShippingAddress,
    items,
    subtotal: raw.subtotal || raw.itemsPrice || 0,
    discount: raw.discount || 0,
    shippingFee: raw.shippingFee || raw.shippingPrice || 0,
    total: raw.total || raw.totalPrice || 0,
    paymentMethod: raw.paymentMethod as PaymentMethodType,
    paymentStatus: mapPaymentStatus(raw.paymentStatus),
    orderStatus: (raw.orderStatus || 'pending') as OrderStatus,
    utrNumber: raw.paymentResult?.transactionId || undefined,
    trackingNumber: raw.trackingNumber || undefined,
    createdAt: raw.createdAt || new Date().toISOString(),
    deliveredAt: raw.deliveredAt,
  };
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ─── Create order payload ─────────────────────────────────────────────────────
export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethodType;
  items: {
    productId: string;
    productName: string;
    size: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  utrNumber?: string;
}

// ─── Order API ────────────────────────────────────────────────────────────────
export const orderApi = {
  /** POST /api/orders – place a new order (guest or authenticated) */
  create: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await api.post<ApiResponse<any>>('/orders', payload);
    return normaliseOrder(data.data);
  },

  /** GET /api/orders/my-orders – current customer's orders */
  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<any>('/orders/my-orders');
    const raw = data.data?.orders || data.data || [];
    return Array.isArray(raw) ? raw.map(normaliseOrder) : [];
  },

  /** GET /api/orders/:id – single order by id */
  getById: async (id: string): Promise<Order> => {
    const { data } = await api.get<ApiResponse<any>>(`/orders/${id}`);
    return normaliseOrder(data.data);
  },

  /** GET /api/orders/track/:query – track by order number / phone */
  track: async (query: string): Promise<Order> => {
    const { data } = await api.get<ApiResponse<any>>(
      `/orders/track/${encodeURIComponent(query)}`
    );
    return normaliseOrder(data.data);
  },

  /** PUT /api/orders/:id/cancel – cancel an order */
  cancel: async (id: string, reason?: string): Promise<Order> => {
    const { data } = await api.put<ApiResponse<any>>(`/orders/${id}/cancel`, {
      reason,
    });
    return normaliseOrder(data.data);
  },

  /** POST /api/orders/:id/pay – submit payment details */
  submitPayment: async (
    id: string,
    paymentMethod: PaymentMethodType,
    paymentResult?: { transactionId?: string; status?: string }
  ): Promise<Order> => {
    const { data } = await api.post<ApiResponse<any>>(`/orders/${id}/pay`, {
      paymentMethod,
      paymentResult,
    });
    return normaliseOrder(data.data);
  },

  // ── Admin-only endpoints ────────────────────────────────────────────────────

  /** GET /api/orders/admin/all – all orders (admin) */
  getAll: async (params?: {
    search?: string;
    status?: string;
    paymentStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number; page: number; pages: number }> => {
    const { data } = await api.get<any>('/orders/admin/all', { params });
    const raw = data.data?.orders || data.data || [];
    return {
      orders: Array.isArray(raw) ? raw.map(normaliseOrder) : [],
      total: data.data?.total || raw.length,
      page: data.data?.page || 1,
      pages: data.data?.pages || 1,
    };
  },

  /** PUT /api/orders/:id/status – update order status (admin) */
  updateStatus: async (
    id: string,
    orderStatus: OrderStatus,
    notes?: string
  ): Promise<Order> => {
    const { data } = await api.put<ApiResponse<any>>(`/orders/${id}/status`, {
      orderStatus,
      notes,
    });
    return normaliseOrder(data.data);
  },

  /** PUT /api/orders/:id/tracking – add tracking info (admin) */
  updateTracking: async (
    id: string,
    trackingNumber: string,
    trackingCourier?: string
  ): Promise<Order> => {
    const { data } = await api.put<ApiResponse<any>>(`/orders/${id}/tracking`, {
      trackingNumber,
      trackingCourier,
    });
    return normaliseOrder(data.data);
  },
};

export default orderApi;
