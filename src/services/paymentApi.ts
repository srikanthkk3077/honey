export const paymentApi = {
  processPayment: async (method: string, amount: number): Promise<{ success: boolean; transactionId: string }> => {
    // Simulate gateway processing (UPI / Razorpay / Stripe mock)
    await new Promise((res) => setTimeout(res, 800));
    return {
      success: true,
      transactionId: 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase()
    };
  }
};
