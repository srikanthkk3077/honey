export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  price: number;
  originalPrice: number;
  quantity: number;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  notes?: string;
  googleMapsLink?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethodType = 'upi' | 'cod' | 'card' | 'netbanking';
export type PaymentStatus = 'pending' | 'verification_pending' | 'paid' | 'rejected' | 'failed';

export interface OrderItem {
  productId: string;
  productName: string;
  size: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  utrNumber?: string;
  paymentScreenshot?: string;
  paymentVerifiedAt?: string;
  paymentRejectedReason?: string;
  trackingNumber?: string;
  createdAt: string;
  deliveredAt?: string;
}
