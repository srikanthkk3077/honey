import { Order, OrderStatus } from '../types/order.types';
import { INITIAL_ORDERS } from '../store/slices/orderSlice';

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    return INITIAL_ORDERS;
  },
  updateStatus: async (orderId: string, status: OrderStatus): Promise<boolean> => {
    console.log(`Updated order ${orderId} to status ${status}`);
    return true;
  }
};
