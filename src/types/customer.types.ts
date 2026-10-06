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

export interface DeliveryZone {
  id?: string;
  pincode: string;
  city: string;
  state: string;
  deliveryDays: string; // e.g. "1-2 business days", "2-3 business days"
  isCodAvailable: boolean;
  isActive: boolean;
  notes?: string;
}

export interface DeliveryConfig {
  serviceabilityMode: 'all_india' | 'restricted_pincodes';
  serviceablePincodes: DeliveryZone[];
  defaultDeliveryDays: string;
  codAvailableDefault: boolean;
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
  deliveryConfig?: DeliveryConfig;
  heroConfig?: HeroConfig;
}

export interface HeroBadge {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
}

export interface HeroConfig {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  storyVideoUrl?: string;
  heroImageUrl: string;
  calloutBadgeText: string;
  showCalloutBadge: boolean;
  trustBadges: HeroBadge[];
  showBotanicalAccent: boolean;
  backgroundColor?: string;
  isActive?: boolean;
}

export const DEFAULT_HERO_CONFIG: HeroConfig = {
  eyebrow: 'FROM FOREST TO FAMILY',
  titleLine1: 'More Than Honey',
  titleLine2: 'A Healthier Lifestyle',
  subtitle: "Pure honey, collected from forest flowers for your family's better health.",
  primaryCtaText: 'SHOP RAW HONEY',
  primaryCtaLink: '/shop',
  secondaryCtaText: 'Watch Our Story',
  secondaryCtaLink: '/videos',
  storyVideoUrl:
    'https://res.cloudinary.com/kisnodzz/video/upload/f_auto,q_auto/v1/madhuvan_honey/videos/WhatsApp-Video-2026-10-02-at-1-1790995078981.mp4',
  heroImageUrl: '/images/brand/hero_illustration_feathered.png',
  calloutBadgeText: 'Pure Honey\nStronger Communities',
  showCalloutBadge: true,
  trustBadges: [
    { id: 'natural', label: '100% Natural', icon: 'natural', isActive: true },
    { id: 'no-sugar', label: 'No Added Sugar', icon: 'no-sugar', isActive: true },
    { id: 'beekeepers', label: 'Supports Beekeepers', icon: 'beekeepers', isActive: true },
  ],
  showBotanicalAccent: true,
  backgroundColor: '#FDDCC3',
  isActive: true,
};
