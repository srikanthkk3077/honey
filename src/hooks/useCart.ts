import { useStore } from '../store/store';

export const useCart = () => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    cartDrawerOpen,
    setCartDrawerOpen
  } = useStore();

  return {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
    cartDrawerOpen,
    setCartDrawerOpen
  };
};
