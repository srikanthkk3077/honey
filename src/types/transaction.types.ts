import { Order, PaymentMethodType, PaymentStatus, OrderStatus } from './order.types';

export interface Transaction {
  id: string;
  transactionId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  utrNumber?: string;
  paymentScreenshot?: string;
  paymentVerifiedAt?: string;
  paymentRejectedReason?: string;
  createdAt: string;
  itemsCount: number;
  shippingCity: string;
  shippingState: string;
  order: Order;
}

export interface TransactionStatsSummary {
  totalRevenue: number;
  settledCount: number;
  pendingVerificationCount: number;
  pendingVerificationAmount: number;
  codPendingCount: number;
  codPendingAmount: number;
  rejectedCount: number;
  rejectedAmount: number;
}
