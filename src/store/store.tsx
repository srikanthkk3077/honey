import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth.types';
import { Product, Category } from '../types/product.types';
import { CartItem, Order, OrderStatus, ShippingAddress, PaymentMethodType } from '../types/order.types';
import { getInitialUser, saveUser } from './slices/authSlice';
import { getInitialCart, saveCart } from './slices/cartSlice';
import { getInitialProducts, saveProducts, getInitialCategories, saveCategories } from './slices/productSlice';
import { getInitialOrders, saveOrders } from './slices/orderSlice';
import { getInitialWishlist, saveWishlist } from './slices/wishlistSlice';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, ADMIN_CREDENTIALS } from '../utils/constants';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => boolean;
  adminLogin: (email: string, pass: string) => boolean;
  register: (name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;

  // Products
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Categories
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: PaymentMethodType) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Mobile menu / UI state
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [products, setProducts] = useState<Product[]>(getInitialProducts);
  const [categories, setCategories] = useState<Category[]>(getInitialCategories);
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);
  const [wishlist, setWishlist] = useState<string[]>(getInitialWishlist);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveWishlist(wishlist);
  }, [wishlist]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth
  const login = (email: string, _pass: string): boolean => {
    const newUser: User = {
      id: 'cust-' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
    return true;
  };

  const adminLogin = (email: string, pass: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && pass === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: 'admin-01',
        name: 'Master Beekeeper (Admin)',
        email: email,
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      showToast('Welcome to Madhuvan Honey Admin Portal', 'success');
      return true;
    }
    showToast('Invalid admin credentials. Use admin@madhuvanhoney.com / adminhoney123', 'error');
    return false;
  };

  const register = (name: string, email: string, phone: string, _pass: string): boolean => {
    const newUser: User = {
      id: 'cust-' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    showToast(`Account created! Welcome to Madhuvan Honey, ${name}!`, 'success');
    return true;
  };

  const logout = () => {
    setUser(null);
    showToast('You have been logged out safely.', 'info');
  };

  // Cart calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartDiscount = cart.reduce((acc, item) => acc + (item.originalPrice - item.price) * item.quantity, 0);
  const cartShippingFee = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const cartTotal = cartSubtotal + cartShippingFee;

  const addToCart = (product: Product, size: string, quantity = 1) => {
    const sizeOption = product.sizes.find((s) => s.size === size) || product.sizes[0];
    const itemId = `${product.id}-${sizeOption.size}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          image: product.images[0],
          size: sizeOption.size,
          price: sizeOption.price,
          originalPrice: sizeOption.originalPrice,
          quantity: quantity,
          stock: sizeOption.stock
        }
      ];
    });

    showToast(`Added ${quantity}x ${product.name} (${sizeOption.size}) to cart!`, 'success');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Orders
  const placeOrder = (shippingAddress: ShippingAddress, paymentMethod: PaymentMethodType): Order => {
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: 'MDH-' + Math.floor(1000 + Math.random() * 9000),
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone,
      shippingAddress,
      items: cart.map((c) => ({
        productId: c.productId,
        productName: c.name,
        size: c.size,
        image: c.image,
        price: c.price,
        quantity: c.quantity
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartShippingFee,
      total: cartTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'processing',
      trackingNumber: 'MDH-TRK-' + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast(`Order ${newOrder.orderNumber} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    showToast(`Order status updated to ${status}`, 'success');
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('New honey product listed!', 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from inventory', 'info');
  };

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Categories CRUD
  const addCategory = (categoryData: Omit<Category, 'id' | 'productCount'>) => {
    const newCat: Category = {
      ...categoryData,
      id: 'cat-' + Date.now(),
      productCount: 0
    };
    setCategories((prev) => [...prev, newCat]);
    showToast('Category added', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed', 'info');
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  return (
    <StoreContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        adminLogin,
        register,
        logout,
        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        getProductById,
        addCategory,
        deleteCategory,
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
        orders,
        placeOrder,
        updateOrderStatus,
        getOrderById,
        wishlist,
        toggleWishlist,
        isWishlisted,
        toasts,
        showToast,
        removeToast,
        mobileMenuOpen,
        setMobileMenuOpen,
        cartDrawerOpen,
        setCartDrawerOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
