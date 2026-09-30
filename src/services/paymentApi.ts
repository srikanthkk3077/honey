import api from './api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const paymentApi = {
  /** POST /api/payment/process – initiate payment processing */
  processPayment: async (
    method: string,
    amount: number,
    orderId?: string
  ): Promise<{ success: boolean; transactionId: string }> => {
    const { data } = await api.post<ApiResponse<any>>('/payment/process', {
      method,
      amount,
      orderId,
    });
    return {
      success: data.success,
      transactionId:
        data.data?.transactionId || data.data?.id || 'TXN-' + Date.now(),
    };
  },

  /** POST /api/payment/verify – verify a payment (admin / webhook) */
  verifyPayment: async (payload: {
    orderId: string;
    transactionId: string;
    status: string;
  }): Promise<{ success: boolean }> => {
    const { data } = await api.post<ApiResponse<any>>(
      '/payment/verify',
      payload
    );
    return { success: data.success };
  },
};

export default paymentApi;
