import { DeliveryZone, DeliveryConfig } from '../types/customer.types';
import { ShippingAddress } from '../types/order.types';

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', deliveryDays: '1-2 business days', isCodAvailable: true, isActive: true, notes: 'Express Metro Delivery' },
  { pincode: '560034', city: 'Bengaluru (Koramangala)', state: 'Karnataka', deliveryDays: '1-2 business days', isCodAvailable: true, isActive: true },
  { pincode: '560100', city: 'Bengaluru (Electronic City)', state: 'Karnataka', deliveryDays: '1-2 business days', isCodAvailable: true, isActive: true },
  { pincode: '110001', city: 'New Delhi (Connaught Place)', state: 'Delhi', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '110020', city: 'New Delhi (Okhla)', state: 'Delhi', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '122001', city: 'Gurugram', state: 'Haryana', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '400001', city: 'Mumbai (Fort)', state: 'Maharashtra', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '400050', city: 'Mumbai (Bandra)', state: 'Maharashtra', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '411001', city: 'Pune', state: 'Maharashtra', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '500001', city: 'Hyderabad', state: 'Telangana', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '500081', city: 'Hyderabad (HITEC City)', state: 'Telangana', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', deliveryDays: '2-4 business days', isCodAvailable: true, isActive: true },
  { pincode: '700001', city: 'Kolkata', state: 'West Bengal', deliveryDays: '3-4 business days', isCodAvailable: true, isActive: true },
  { pincode: '302001', city: 'Jaipur', state: 'Rajasthan', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '248001', city: 'Dehradun', state: 'Uttarakhand', deliveryDays: '1-2 business days', isCodAvailable: true, isActive: true, notes: 'Near Apiary Reserve' },
  { pincode: '263153', city: 'Ramnagar (Jim Corbett)', state: 'Uttarakhand', deliveryDays: '1 business day', isCodAvailable: true, isActive: true, notes: 'Home Apiary Origin' },
  { pincode: '226001', city: 'Lucknow', state: 'Uttar Pradesh', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '160017', city: 'Chandigarh', state: 'Punjab', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
  { pincode: '682001', city: 'Kochi', state: 'Kerala', deliveryDays: '3-4 business days', isCodAvailable: true, isActive: true },
  { pincode: '452001', city: 'Indore', state: 'Madhya Pradesh', deliveryDays: '2-3 business days', isCodAvailable: true, isActive: true },
];

export const DEFAULT_DELIVERY_CONFIG: DeliveryConfig = {
  serviceabilityMode: 'restricted_pincodes', // strictly validates matching areas as requested
  serviceablePincodes: DEFAULT_DELIVERY_ZONES,
  defaultDeliveryDays: '2-4 business days',
  codAvailableDefault: true,
};

// ─── Fast Offline Indian Metro Pincode Dictionary ───────────────────────────
const OFFLINE_METRO_MAP: Record<string, { city: string; state: string }> = {
  '560001': { city: 'Bengaluru', state: 'Karnataka' },
  '560034': { city: 'Bengaluru', state: 'Karnataka' },
  '560100': { city: 'Bengaluru', state: 'Karnataka' },
  '110001': { city: 'New Delhi', state: 'Delhi' },
  '110020': { city: 'New Delhi', state: 'Delhi' },
  '122001': { city: 'Gurugram', state: 'Haryana' },
  '201301': { city: 'Noida', state: 'Uttar Pradesh' },
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '400050': { city: 'Mumbai', state: 'Maharashtra' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '500081': { city: 'Hyderabad', state: 'Telangana' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '248001': { city: 'Dehradun', state: 'Uttarakhand' },
  '263153': { city: 'Ramnagar', state: 'Uttarakhand' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh' },
  '160017': { city: 'Chandigarh', state: 'Punjab' },
  '682001': { city: 'Kochi', state: 'Kerala' },
  '452001': { city: 'Indore', state: 'Madhya Pradesh' },
};

// ─── Live Indian Postal Pincode Lookup with Cache ────────────────────────────
const pincodeCache = new Map<string, { city: string; state: string }>();

export const fetchPincodeDetails = async (
  pincode: string
): Promise<{ city: string; state: string } | null> => {
  const clean = pincode.replace(/\D/g, '').slice(0, 6);
  if (clean.length !== 6) return null;

  // 1. Check in-memory cache
  if (pincodeCache.has(clean)) {
    return pincodeCache.get(clean)!;
  }

  // 2. Check offline dictionary
  if (OFFLINE_METRO_MAP[clean]) {
    pincodeCache.set(clean, OFFLINE_METRO_MAP[clean]);
    return OFFLINE_METRO_MAP[clean];
  }

  // 3. Online lookup via api.postalpincode.in
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
      const po = data[0].PostOffice[0];
      const result = {
        city: po.District || po.Division || po.Block || po.Circle || 'City',
        state: po.State || 'State',
      };
      pincodeCache.set(clean, result);
      return result;
    }
  } catch {
    // Graceful fallback
  }

  return null;
};

// ─── Pincode Serviceability Validation ──────────────────────────────────────
export interface PincodeCheckResult {
  isServiceable: boolean;
  zone?: DeliveryZone;
  city?: string;
  state?: string;
  deliveryDays: string;
  isCodAvailable: boolean;
  message: string;
}

export const checkPincodeServiceability = (
  pincode: string,
  config?: DeliveryConfig
): PincodeCheckResult => {
  const clean = pincode.replace(/\D/g, '').slice(0, 6);
  if (!clean || clean.length !== 6) {
    return {
      isServiceable: false,
      deliveryDays: '',
      isCodAvailable: false,
      message: 'Please enter a valid 6-digit PIN code.',
    };
  }

  const activeConfig = config || DEFAULT_DELIVERY_CONFIG;
  const list = activeConfig.serviceablePincodes || DEFAULT_DELIVERY_ZONES;

  // Find exact matching zone
  const matched = list.find((z) => z.pincode === clean && z.isActive !== false);

  if (activeConfig.serviceabilityMode === 'all_india') {
    return {
      isServiceable: true,
      zone: matched,
      city: matched?.city,
      state: matched?.state,
      deliveryDays: matched?.deliveryDays || activeConfig.defaultDeliveryDays || '2-4 business days',
      isCodAvailable: matched ? matched.isCodAvailable : activeConfig.codAvailableDefault,
      message: matched
        ? `Delivery available! Express arrival in ${matched.deliveryDays}.`
        : `All-India delivery available! Estimated arrival in ${activeConfig.defaultDeliveryDays || '2-4 days'}.`,
    };
  }

  // Restricted mode: must match an approved zone
  if (matched) {
    return {
      isServiceable: true,
      zone: matched,
      city: matched.city,
      state: matched.state,
      deliveryDays: matched.deliveryDays,
      isCodAvailable: matched.isCodAvailable,
      message: `Delivery available to ${matched.city}! Estimated arrival in ${matched.deliveryDays}.`,
    };
  }

  return {
    isServiceable: false,
    deliveryDays: '',
    isCodAvailable: false,
    message: `Sorry, delivery is currently not serviceable to PIN code ${clean}. We are expanding rapidly!`,
  };
};

// ─── Convert Address to Clickable Google Maps URL ────────────────────────────
export const generateGoogleMapsLink = (address?: Partial<ShippingAddress> | null): string => {
  if (!address) return '#';
  if (address.googleMapsLink && address.googleMapsLink.trim().startsWith('http')) {
    return address.googleMapsLink.trim();
  }

  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.pincode,
    'India',
  ].filter((p) => p && typeof p === 'string' && p.trim().length > 0);

  if (parts.length === 0) return '#';
  const query = parts.join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};
