import { useStore } from '../store/store';

export const useOrders = () => {
  const { orders, placeOrder, updateOrderStatus, getOrderById } = useStore();
  return {
    orders,
    placeOrder,
    updateOrderStatus,
    getOrderById
  };
};
