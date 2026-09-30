import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/auth.types';
import { Product, Category } from '../types/product.types';
import { CartItem, Order, OrderStatus, ShippingAddress, PaymentMethodType } from '../types/order.types';
import { VideoItem } from '../types/video.types';

// ─── Slices (local storage persistence) ──────────────────────────────────────
import { getInitialUser, saveUser } from './slices/authSlice';
import { getInitialCart, saveCart } from './slices/cartSlice';
import { getInitialProducts, saveProducts, getInitialCategories, saveCategories } from './slices/productSlice';
import { getInitialOrders, saveOrders } from './slices/orderSlice';
import { getInitialWishlist, saveWishlist } from './slices/wishlistSlice';
import { getInitialVideos, saveVideos } from './slices/videoSlice';

// ─── API Services ─────────────────────────────────────────────────────────────
import authApi from '../services/authApi';
import productApi from '../services/productApi';
import orderApi, { CreateOrderPayload } from '../services/orderApi';
import { wishlistApi } from '../services/customerApi';

// ─── Constants ────────────────────────────────────────────────────────────────
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../utils/constants';

// ─── Local data (fallback) ────────────────────────────────────────────────────
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_CATEGORIES } from '../data/categories';
import { INITIAL_VIDEOS } from '../data/videos';

// ─── Token helper ─────────────────────────────────────────────────────────────
import { getToken } from '../services/api';

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
  isAuthLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;

  // Products
  products: Product[];
  categories: Category[];
  isProductsLoading: boolean;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Categories
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

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
  isOrdersLoading: boolean;
  refreshOrders: () => Promise<void>;
  placeOrder: (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethodType,
    paymentDetails?: { utrNumber?: string; paymentScreenshot?: string }
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  verifyPayment: (orderId: string) => Promise<void>;
  rejectPayment: (orderId: string, reason?: string) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Videos
  videos: VideoItem[];
  addVideo: (video: Omit<VideoItem, 'id' | 'views' | 'createdAt'>) => VideoItem;
  updateVideo: (id: string, updates: Partial<VideoItem>) => void;
  deleteVideo: (id: string) => void;
  incrementVideoViews: (id: string) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // UI
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ─── State ──────────────────────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [products, setProducts] = useState<Product[]>(getInitialProducts);
  const [categories, setCategories] = useState<Category[]>(getInitialCategories);
  const [cart, setCart] = useState<CartItem[]>(getInitialCart);
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);
  const [wishlist, setWishlist] = useState<string[]>(getInitialWishlist);
  const [videos, setVideos] = useState<VideoItem[]>(getInitialVideos);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);

  // ─── Persist to localStorage ────────────────────────────────────────────────
  useEffect(() => { saveUser(user); }, [user]);
  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveCategories(categories); }, [categories]);
  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveVideos(videos); }, [videos]);

  // ─── On mount: load products and restore user session ──────────────────────
  useEffect(() => {
    loadProducts();
    if (getToken()) {
      authApi.getProfile().then(setUser).catch(() => {
        // Token expired or invalid – clear it silently
        setUser(null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Load orders when user changes ──────────────────────────────────────────
  useEffect(() => {
    if (user && user.role === 'customer') {
      loadCustomerOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ─── Toast ──────────────────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // ─── Products ───────────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setIsProductsLoading(true);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        productApi.getAll(),
        productApi.getCategories(),
      ]);
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        // Fallback to local seed data if backend returns nothing
        setProducts(INITIAL_PRODUCTS);
      }
      if (fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      } else {
        setCategories(INITIAL_CATEGORIES);
      }
    } catch {
      // Silently fall back to local seed data (backend may be offline)
      setProducts(INITIAL_PRODUCTS);
      setCategories(INITIAL_CATEGORIES);
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  const refreshProducts = loadProducts;

  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newProduct = await productApi.create(prodData);
    setProducts((prev) => [newProduct, ...prev]);
    showToast('New honey product listed!', 'success');
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await productApi.update(id, updates);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = async (id: string) => {
    await productApi.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted from inventory', 'info');
  };

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
  const getProductById = (id: string) => products.find((p) => p.id === id);

  // ─── Categories ─────────────────────────────────────────────────────────────
  const addCategory = async (categoryData: Omit<Category, 'id' | 'productCount'>) => {
    const newCat = await productApi.createCategory(categoryData);
    setCategories((prev) => [...prev, newCat]);
    showToast('Category added', 'success');
  };

  const deleteCategory = async (id: string) => {
    await productApi.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed', 'info');
  };

  // ─── Auth ───────────────────────────────────────────────────────────────────
  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const loggedInUser = await authApi.login(email, pass);
      setUser(loggedInUser);
      showToast(`Welcome back, ${loggedInUser.name}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const adminUser = await authApi.adminLogin(email, pass);
      if (adminUser.role !== 'admin') {
        showToast('Access denied. Admin credentials required.', 'error');
        return false;
      }
      setUser(adminUser);
      showToast('Welcome to Madhuvan Honey Admin Portal', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Invalid admin credentials.', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const register = async (name: string, email: string, phone: string, pass: string): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const newUser = await authApi.register(name, email, phone, pass);
      setUser(newUser);
      showToast(`Account created! Welcome to Madhuvan Honey, ${name}!`, 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setOrders([]);
    showToast('You have been logged out safely.', 'info');
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await authApi.updateProfile(updates);
    setUser(updated);
    showToast('Profile updated successfully!', 'success');
  };

  // ─── Cart calculations ───────────────────────────────────────────────────────
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
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
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
          quantity,
          stock: sizeOption.stock,
        },
      ];
    });
    showToast(`Added ${quantity}x ${product.name} (${sizeOption.size}) to cart!`, 'success');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => { setCart([]); };

  // ─── Orders ──────────────────────────────────────────────────────────────────
  const loadCustomerOrders = useCallback(async () => {
    setIsOrdersLoading(true);
    try {
      const fetched = await orderApi.getMyOrders();
      setOrders(fetched);
    } catch {
      // Keep local orders if API fails
    } finally {
      setIsOrdersLoading(false);
    }
  }, []);

  const refreshOrders = loadCustomerOrders;

  const placeOrder = async (
    shippingAddress: ShippingAddress,
    paymentMethod: PaymentMethodType,
    paymentDetails?: { utrNumber?: string; paymentScreenshot?: string }
  ): Promise<Order> => {
    const payload: CreateOrderPayload = {
      shippingAddress,
      paymentMethod,
      items: cart.map((c) => ({
        productId: c.productId,
        productName: c.name,
        size: c.size,
        image: c.image,
        price: c.price,
        quantity: c.quantity,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartShippingFee,
      total: cartTotal,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone,
      notes: shippingAddress.notes,
      utrNumber: paymentDetails?.utrNumber,
    };

    try {
      const newOrder = await orderApi.create(payload);
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      if (paymentMethod === 'upi') {
        showToast(`Order ${newOrder.orderNumber} placed! Payment verification pending.`, 'info');
      } else {
        showToast(`Order ${newOrder.orderNumber} placed successfully!`, 'success');
      }
      return newOrder;
    } catch (err: any) {
      // Fallback: create order locally if backend fails
      const fallbackOrder: Order = {
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
          quantity: c.quantity,
        })),
        subtotal: cartSubtotal,
        discount: cartDiscount,
        shippingFee: cartShippingFee,
        total: cartTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'verification_pending',
        orderStatus: 'pending',
        utrNumber: paymentDetails?.utrNumber,
        paymentScreenshot: paymentDetails?.paymentScreenshot,
        trackingNumber: 'MDH-TRK-' + Math.floor(100000 + Math.random() * 900000),
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [fallbackOrder, ...prev]);
      clearCart();
      showToast(`Order ${fallbackOrder.orderNumber} placed (offline mode).`, 'success');
      return fallbackOrder;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await orderApi.updateStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Order status updated to ${status}`, 'success');
    } catch {
      // Optimistic update fallback
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)));
      showToast(`Order status updated to ${status}`, 'success');
    }
  };

  const verifyPayment = async (orderId: string) => {
    try {
      const updated = await orderApi.updateStatus(orderId, 'processing');
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...updated, paymentStatus: 'paid', paymentVerifiedAt: new Date().toISOString() }
            : o
        )
      );
    } catch {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, paymentStatus: 'paid', orderStatus: 'processing', paymentVerifiedAt: new Date().toISOString() }
            : o
        )
      );
    }
    showToast('Payment verified successfully! Order is confirmed.', 'success');
  };

  const rejectPayment = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: 'rejected', paymentRejectedReason: reason || 'Payment transaction not found' }
          : o
      )
    );
    showToast('Payment marked as rejected. Customer will be notified.', 'error');
  };

  const getOrderById = (orderId: string) =>
    orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  // ─── Wishlist ─────────────────────────────────────────────────────────────────
  const toggleWishlist = async (productId: string) => {
    const exists = wishlist.includes(productId);
    // Optimistic update immediately
    setWishlist((prev) =>
      exists ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    showToast(exists ? 'Removed from wishlist' : 'Saved to wishlist ❤️', exists ? 'info' : 'success');

    // Sync with backend if authenticated
    if (user) {
      try {
        await wishlistApi.toggle(productId);
      } catch {
        // Revert optimistic update on error
        setWishlist((prev) =>
          exists ? [...prev, productId] : prev.filter((id) => id !== productId)
        );
        showToast('Could not update wishlist. Please try again.', 'error');
      }
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // ─── Videos (local-only; no backend video endpoint used for CRUD) ────────────
  const addVideo = (videoData: Omit<VideoItem, 'id' | 'views' | 'createdAt'>): VideoItem => {
    const newVideo: VideoItem = {
      ...videoData,
      id: 'vid-' + Date.now(),
      views: 1,
      createdAt: new Date().toISOString(),
    };
    setVideos((prev) => [newVideo, ...prev]);
    showToast('Video published successfully!', 'success');
    return newVideo;
  };

  const updateVideo = (id: string, updates: Partial<VideoItem>) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    showToast('Video updated successfully!', 'success');
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    showToast('Video removed from library', 'info');
  };

  const incrementVideoViews = (id: string) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, views: v.views + 1 } : v)));
  };

  // ─── Context value ────────────────────────────────────────────────────────────
  return (
    <StoreContext.Provider
      value={{
        // Auth
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAuthLoading,
        login,
        adminLogin,
        register,
        logout,
        updateProfile,

        // Products
        products,
        categories,
        isProductsLoading,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductBySlug,
        getProductById,

        // Categories
        addCategory,
        deleteCategory,

        // Cart
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

        // Orders
        orders,
        isOrdersLoading,
        refreshOrders,
        placeOrder,
        updateOrderStatus,
        verifyPayment,
        rejectPayment,
        getOrderById,

        // Wishlist
        wishlist,
        toggleWishlist,
        isWishlisted,

        // Videos
        videos,
        addVideo,
        updateVideo,
        deleteVideo,
        incrementVideoViews,

        // Toast
        toasts,
        showToast,
        removeToast,

        // UI
        mobileMenuOpen,
        setMobileMenuOpen,
        cartDrawerOpen,
        setCartDrawerOpen,
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
