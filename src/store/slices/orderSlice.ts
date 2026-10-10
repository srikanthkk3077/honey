import { Order } from '../../types/order.types';
import { storage } from '../../utils/storage';

const STORAGE_KEY = 'madhuvan_orders_v6';

export const INITIAL_ORDERS: Order[] = [];

export const getInitialOrders = (): Order[] => {
  return storage.get<Order[]>(STORAGE_KEY, INITIAL_ORDERS);
};

export const saveOrders = (orders: Order[]) => {
  storage.set(STORAGE_KEY, orders);
};
