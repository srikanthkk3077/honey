import { Order } from '../../types/order.types';
import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_orders_v3';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'MDH-8821',
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@example.com',
    customerPhone: '+91 98201 44521',
    shippingAddress: {
      fullName: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      phone: '+91 98201 44521',
      addressLine1: 'Flat 402, Honeycomb Heights',
      addressLine2: 'Koramangala 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560034',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-wild-forest',
        productName: 'Madhuvan Sundarbans Wild Forest Honey',
        size: '500g',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
        price: 649,
        quantity: 2
      },
      {
        productId: 'prod-tulsi-infused',
        productName: 'Madhuvan Vedic Holy Tulsi Infused Raw Honey',
        size: '500g',
        image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=600&q=80',
        price: 699,
        quantity: 1
      }
    ],
    subtotal: 1997,
    discount: 100,
    shippingFee: 0,
    total: 1897,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'DELHIVERY-77492019',
    createdAt: '2026-03-27T11:42:00Z'
  },
  {
    id: 'ord-1002',
    orderNumber: 'MDH-8822',
    customerName: 'Pooja Iyer',
    customerEmail: 'pooja.iyer@example.com',
    customerPhone: '+91 97112 33412',
    shippingAddress: {
      fullName: 'Pooja Iyer',
      email: 'pooja.iyer@example.com',
      phone: '+91 97112 33412',
      addressLine1: 'B-12, Green Glen Layout',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110016',
      country: 'India'
    },
    items: [
      {
        productId: 'prod-raw-honeycomb',
        productName: 'Madhuvan 100% Virgin Raw Honeycomb Frame',
        size: '350g Comb',
        image: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=600&q=80',
        price: 899,
        quantity: 1
      }
    ],
    subtotal: 899,
    discount: 0,
    shippingFee: 79,
    total: 978,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingNumber: 'BLUEDART-99218274',
    createdAt: '2026-03-24T09:15:00Z',
    deliveredAt: '2026-03-28T14:30:00Z'
  }
];

export const getInitialOrders = (): Order[] => {
  return storage.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS);
};

export const saveOrders = (orders: Order[]) => {
  storage.set(STORAGE_KEY, orders);
};
