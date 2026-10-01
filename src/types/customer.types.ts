export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  city: string;
}

export interface PaymentConfig {
  upiId?: string;
  upiQrCode?: string;
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  branchName?: string;
  accountType?: string;
  paymentInstructions?: string;
  isUpiActive?: boolean;
  isBankTransferActive?: boolean;
  isCodActive?: boolean;
}

export interface StoreSettings {
  storeName?: string;
  brandTagline?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  salesEmail?: string;
  address?: string;
  hours?: string;
  freeShippingThreshold?: number;
  shippingFee?: number;
  gstPercentage?: number;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  paymentConfig?: PaymentConfig;
}

