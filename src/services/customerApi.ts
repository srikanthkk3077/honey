import { Customer } from '../types/customer.types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '+91 98201 44521',
    totalOrders: 3,
    totalSpent: 4290,
    lastOrderDate: '2026-03-27',
    status: 'active',
    joinedDate: '2025-11-12',
    city: 'Bengaluru'
  },
  {
    id: 'cust-2',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@example.com',
    phone: '+91 97112 33412',
    totalOrders: 2,
    totalSpent: 2150,
    lastOrderDate: '2026-03-24',
    status: 'active',
    joinedDate: '2026-01-08',
    city: 'New Delhi'
  },
  {
    id: 'cust-3',
    name: 'Vikramaditya Verma',
    email: 'vikram.verma@example.com',
    phone: '+91 98722 11983',
    totalOrders: 5,
    totalSpent: 8740,
    lastOrderDate: '2026-03-19',
    status: 'active',
    joinedDate: '2025-08-20',
    city: 'Chandigarh'
  }
];

export const customerApi = {
  getAll: async (): Promise<Customer[]> => {
    return INITIAL_CUSTOMERS;
  }
};
