import { Order } from '../../types/order.types';
import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_orders_v6';

export const INITIAL_ORDERS: Order[] = [
  {
    id: '6ac62ab59455aa8ecbafea59',
    orderNumber: 'MDH-4012',
    customerName: 'Master Beekeeper',
    customerEmail: 'admin@madhuvanhoney.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      fullName: 'Master Beekeeper',
      email: 'admin@madhuvanhoney.com',
      phone: '+91 98765 43210',
      addressLine1: 'West Godavari',
      city: 'West Godavari',
      state: 'Andhra Pradesh',
      pincode: '534126',
      country: 'India',
    },
    items: [
      {
        productId: '6abcdc26185fd6ccd4965e8d',
        productName: 'Sunflower Honey',
        size: '500g',
        image: '/images/products/sunflower_honey.jpg',
        price: 899,
        quantity: 1,
      },
    ],
    subtotal: 899,
    discount: 0,
    shippingFee: 0,
    total: 899,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    orderStatus: 'processing',
    trackingNumber: 'MDH-TRK-763715',
    createdAt: '2026-10-07T11:19:17.121Z',
  },
  {
    id: '6ac39237ec130332a2c0e0fd',
    orderNumber: 'MDH-8951',
    customerName: 'Master Beekeeper',
    customerEmail: 'admin@madhuvanhoney.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      fullName: 'Master Beekeeper',
      email: 'admin@madhuvanhoney.com',
      phone: '+91 98765 43210',
      addressLine1: 'Borabanda',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      country: 'India',
    },
    items: [
      {
        productId: '6abdc58ebc4b1a26faa02162',
        productName: 'Ajwain Honey',
        size: '500g',
        image: '/images/products/ajwain_honey.jpg',
        price: 634,
        quantity: 1,
      },
    ],
    subtotal: 634,
    discount: 0,
    shippingFee: 0,
    total: 634,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'shipped',
    trackingNumber: 'MDH-TRK-640272',
    createdAt: '2026-10-05T12:04:07.233Z',
  },
  {
    id: '6ac0ab458530d333350841a1',
    orderNumber: 'MDH-2331',
    customerName: 'Master Beekeeper',
    customerEmail: 'admin@madhuvanhoney.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      fullName: 'Master Beekeeper',
      email: 'admin@madhuvanhoney.com',
      phone: '+91 98765 43210',
      addressLine1: 'MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
    },
    items: [
      {
        productId: '6abcdc26185fd6ccd4965e8d',
        productName: 'Honeycomb Frame',
        size: '350g',
        image: '/images/products/honeycomb_frame.jpg',
        price: 2297,
        quantity: 1,
      },
    ],
    subtotal: 2297,
    discount: 0,
    shippingFee: 0,
    total: 2297,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    trackingNumber: 'MDH-TRK-622305',
    createdAt: '2026-10-03T07:14:13.713Z',
    deliveredAt: '2026-10-06T15:30:00.000Z',
  },
];

export const getInitialOrders = (): Order[] => {
  return storage.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS);
};

export const saveOrders = (orders: Order[]) => {
  storage.set(STORAGE_KEY, orders);
};
