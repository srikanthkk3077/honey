import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types/auth.types';
import { Product, Category, ProductReview } from '../types/product.types';
import { CartItem, Order, OrderStatus, ShippingAddress, PaymentMethodType } from '../types/order.types';
import { VideoItem } from '../types/video.types';
import { SliderItem } from '../types/slider.types';
import { StoreSettings, HeroConfig, DEFAULT_HERO_CONFIG, ShopConfig, DEFAULT_SHOP_CONFIG } from '../types/customer.types';

// ─── Slices (local storage persistence) ──────────────────────────────────────
import { getInitialUser, saveUser } from './slices/authSlice';
import { getInitialCart, saveCart } from './slices/cartSlice';
import { getInitialProducts, saveProducts, getInitialCategories, saveCategories } from './slices/productSlice';
import { getInitialOrders, saveOrders } from './slices/orderSlice';
import { getInitialWishlist, saveWishlist } from './slices/wishlistSlice';
import { getInitialVideos, saveVideos } from './slices/videoSlice';
import { getInitialSliders, saveSliders } from './slices/sliderSlice';
import { storage } from '../utils/storage';

// ─── API Services ─────────────────────────────────────────────────────────────
import authApi from '../services/authApi';
import productApi from '../services/productApi';
import orderApi, { CreateOrderPayload } from '../services/orderApi';
import { wishlistApi, settingsApi } from '../services/customerApi';
import videoApi from '../services/videoApi';
import sliderApi from '../services/sliderApi';

// ─── Constants ────────────────────────────────────────────────────────────────
import {
  APP_NAME,
  BRAND_TAGLINE,
  CONTACT_INFO,
  SOCIAL_LINKS,
  GST_PERCENTAGE,
  BUSINESS_PAYMENT_DETAILS,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from '../utils/constants';
import { DEFAULT_DELIVERY_CONFIG } from '../utils/delivery';

// ─── Types & Models ───────────────────────────────────────────────────────────
import { Testimonial, INITIAL_TESTIMONIALS } from '../data/testimonials';

// ─── Token helper ─────────────────────────────────────────────────────────────
import { getToken, removeToken } from '../services/api';

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
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyResetOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string; resetToken?: string }>;
  resetPassword: (email: string, otpOrToken: string, newPassword: string) => Promise<boolean>;
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

  // Videos (Reels & Short clips)
  videos: VideoItem[];
  isVideosLoading: boolean;
  addVideo: (video: Omit<VideoItem, 'id' | 'views' | 'createdAt'>) => Promise<VideoItem>;
  updateVideo: (id: string, updates: Partial<VideoItem>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  incrementVideoViews: (id: string) => void;

  // Sliders (Home Page Hero Banners)
  sliders: SliderItem[];
  isSlidersLoading: boolean;
  refreshSliders: () => Promise<void>;
  addSlider: (sliderData: Partial<SliderItem>) => Promise<SliderItem>;
  updateSlider: (id: string, updates: Partial<SliderItem>) => Promise<SliderItem>;
  deleteSlider: (id: string) => Promise<void>;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // UI
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;

  // Store Settings
  settings: StoreSettings;
  isSettingsLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  updateHeroConfig: (heroUpdates: Partial<HeroConfig>) => Promise<void>;
  updateShopConfig: (shopUpdates: Partial<ShopConfig>) => Promise<void>;

  // Reviews & Testimonials
  homeReviews: Testimonial[];
  isHomeReviewsLoading: boolean;
  refreshHomeReviews: () => Promise<void>;
  allReviews: ProductReview[];
  isAllReviewsLoading: boolean;
  refreshAllReviews: () => Promise<void>;
  toggleReviewHome: (productId: string, reviewId: string, showOnHome?: boolean) => Promise<boolean>;
  deleteReview: (productId: string, reviewId: string) => Promise<boolean>;
  submitReview: (
    productId: string,
    review: { userName: string; rating: number; comment: string; userRole?: string; location?: string; avatar?: string }
  ) => Promise<ProductReview>;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: APP_NAME,
  brandTagline: BRAND_TAGLINE,
  phone: CONTACT_INFO.phone,
  whatsapp: CONTACT_INFO.whatsapp,
  email: CONTACT_INFO.email,
  salesEmail: CONTACT_INFO.salesEmail,
  address: CONTACT_INFO.address,
  hours: CONTACT_INFO.hours,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  shippingFee: STANDARD_SHIPPING_FEE,
  gstPercentage: GST_PERCENTAGE,
  socialLinks: SOCIAL_LINKS,
  paymentConfig: {
    upiId: BUSINESS_PAYMENT_DETAILS.upiId,
    accountHolderName: BUSINESS_PAYMENT_DETAILS.accountName,
    accountNumber: BUSINESS_PAYMENT_DETAILS.accountNumber,
    ifscCode: BUSINESS_PAYMENT_DETAILS.ifscCode,
    bankName: BUSINESS_PAYMENT_DETAILS.bankName,
    branchName: BUSINESS_PAYMENT_DETAILS.branch,
    isUpiActive: true,
    isBankTransferActive: true,
    isCodActive: true,
  },
  deliveryConfig: DEFAULT_DELIVERY_CONFIG,
  heroConfig: DEFAULT_HERO_CONFIG,
  shopConfig: DEFAULT_SHOP_CONFIG,
};

const SETTINGS_STORAGE_KEY = 'madhuvan_store_settings_v1';
const getInitialSettings = (): StoreSettings => {
  const loaded = storage.get<StoreSettings>(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
  if (!loaded.deliveryConfig) {
    loaded.deliveryConfig = DEFAULT_DELIVERY_CONFIG;
  }
  if (!loaded.heroConfig) {
    loaded.heroConfig = DEFAULT_HERO_CONFIG;
  }
  if (!loaded.shopConfig) {
    loaded.shopConfig = DEFAULT_SHOP_CONFIG;
  }
  return loaded;
};
const saveSettings = (s: StoreSettings) => {
  try {
    storage.set(SETTINGS_STORAGE_KEY, s);
  } catch (err) {
    console.warn('[saveSettings] Storage write skipped:', err);
  }
  try {
    window.dispatchEvent(new CustomEvent('madhuvan_settings_updated', { detail: s }));
  } catch {
    // Ignore in non-window env
  }
};

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
  const [sliders, setSliders] = useState<SliderItem[]>(getInitialSliders);
  const [settings, setSettings] = useState<StoreSettings>(getInitialSettings);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(false);
  const [isSlidersLoading, setIsSlidersLoading] = useState(false);
  const [isVideosLoading, setIsVideosLoading] = useState(false);

  // ─── Persist to localStorage ────────────────────────────────────────────────
  useEffect(() => { saveUser(user); }, [user]);
  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveCategories(categories); }, [categories]);
  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveWishlist(wishlist); }, [wishlist]);
  useEffect(() => { saveVideos(videos); }, [videos]);
  useEffect(() => { saveSliders(sliders); }, [sliders]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  // ─── On mount: load products, settings, sliders and restore user session ──────────
  useEffect(() => {
    loadProducts();
    loadSettings();
    loadSliders();
    const token = getToken();
    const cachedUser = getInitialUser(); // what's already in localStorage

    if (token) {
      // Use a 5-second timeout specifically for the profile call —
      // we don't want the user to see a stale flash for 15 seconds.
      const controller = new AbortController();
      const profileTimeout = setTimeout(() => controller.abort(), 5000);

      authApi.getProfile()
        .then((profileUser) => {
          // ── Role consistency guard ──────────────────────────────────────────
          // If the profile returned a DIFFERENT role than the cached user
          // (e.g., old admin token returning admin when a customer is expected),
          // that token is stale/wrong — discard it and keep the cached session.
          if (cachedUser && cachedUser.role !== profileUser.role) {
            removeToken();
            // Keep the cached user as-is; they'll be properly re-validated on
            // their next explicit login.
            return;
          }
          setUser(profileUser);
        })
        .catch((err: any) => {
          // Only clear the session on a genuine 401 (token actually invalid/expired).
          // Network errors, timeouts, and server errors are transient — keep session.
          const status =
            err?.response?.status ||
            err?.status ||
            (err?.message?.includes('401') ? 401 : 0);
          if (status === 401) {
            setUser(null);
          }
        })
        .finally(() => clearTimeout(profileTimeout));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleSettingsUpdated = (e: any) => {
      if (e?.detail) {
        setSettings(e.detail);
      } else {
        const fresh = storage.get<StoreSettings>(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
        if (fresh) setSettings(fresh);
      }
    };
    window.addEventListener('madhuvan_settings_updated', handleSettingsUpdated);
    window.addEventListener('storage', handleSettingsUpdated);
    return () => {
      window.removeEventListener('madhuvan_settings_updated', handleSettingsUpdated);
      window.removeEventListener('storage', handleSettingsUpdated);
    };
  }, []);

  // ─── Settings ───────────────────────────────────────────────────────────────
  const loadSettings = useCallback(async () => {
    setIsSettingsLoading(true);
    try {
      const data = await settingsApi.get();
      if (data) {
        setSettings((prev) => {
          const cached = storage.get<StoreSettings>(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
          const cachedHero: Partial<HeroConfig> = cached?.heroConfig || {};
        const loaded: StoreSettings = {
            ...prev,
            ...data,
            paymentConfig: {
              ...prev.paymentConfig,
              ...(data.paymentConfig || {}),
            },
            // Deep-merge deliveryConfig so serviceablePincodes & serviceabilityMode are never lost
            deliveryConfig: {
              ...DEFAULT_DELIVERY_CONFIG,
              ...(prev.deliveryConfig || {}),
              ...(data.deliveryConfig || {}),
              serviceablePincodes:
                Array.isArray(data.deliveryConfig?.serviceablePincodes) && data.deliveryConfig.serviceablePincodes.length > 0
                  ? data.deliveryConfig.serviceablePincodes
                  : (Array.isArray(prev.deliveryConfig?.serviceablePincodes) && prev.deliveryConfig.serviceablePincodes.length > 0
                      ? prev.deliveryConfig.serviceablePincodes
                      : DEFAULT_DELIVERY_CONFIG.serviceablePincodes),
            },
            heroConfig: {
              ...DEFAULT_HERO_CONFIG,
              ...cachedHero,
              ...(prev.heroConfig || {}),
              ...(data.heroConfig || {}),
              heroBannerSlides: Array.isArray(data.heroConfig?.heroBannerSlides)
                ? data.heroConfig.heroBannerSlides
                : (Array.isArray(cachedHero.heroBannerSlides)
                    ? cachedHero.heroBannerSlides
                    : (prev.heroConfig?.heroBannerSlides || [])),
              heroDisplayMode: data.heroConfig?.heroDisplayMode || cachedHero.heroDisplayMode || prev.heroConfig?.heroDisplayMode || 'hero',
            },
            shopConfig: {
              ...DEFAULT_SHOP_CONFIG,
              ...(cached?.shopConfig || {}),
              ...(prev.shopConfig || {}),
              ...(data.shopConfig || {}),
            },
          };
          saveSettings(loaded);
          return loaded;
        });
      }
    } catch {
      // Keep existing settings if offline
    } finally {
      setIsSettingsLoading(false);
    }
  }, []);

  const refreshSettings = loadSettings;

  const updateSettings = async (updates: Partial<StoreSettings>) => {
    const currentHero = settings.heroConfig || DEFAULT_HERO_CONFIG;
    const currentShop = settings.shopConfig || DEFAULT_SHOP_CONFIG;
    const optimisticHero = updates.heroConfig
      ? {
          ...DEFAULT_HERO_CONFIG,
          ...currentHero,
          ...updates.heroConfig,
          heroBannerSlides: updates.heroConfig.heroBannerSlides !== undefined
            ? updates.heroConfig.heroBannerSlides
            : (currentHero.heroBannerSlides || []),
          heroDisplayMode: updates.heroConfig.heroDisplayMode || currentHero.heroDisplayMode || 'hero',
        }
      : settings.heroConfig;
    const optimisticShop = updates.shopConfig
      ? {
          ...DEFAULT_SHOP_CONFIG,
          ...currentShop,
          ...updates.shopConfig,
        }
      : settings.shopConfig;

    // Immediate optimistic update & persist to localStorage
    const optimistic: StoreSettings = {
      ...settings,
      ...updates,
      paymentConfig: {
        ...settings.paymentConfig,
        ...(updates.paymentConfig || {}),
      },
      heroConfig: optimisticHero,
      shopConfig: optimisticShop,
    };
    setSettings(optimistic);
    saveSettings(optimistic);

    try {
      const result = await settingsApi.update(updates);
      if (result) {
        setSettings((prev) => {
          const finalSettings: StoreSettings = {
            ...prev,
            ...result,
            paymentConfig: {
              ...prev.paymentConfig,
              ...(result.paymentConfig || {}),
            },
            // Deep-merge deliveryConfig so admin's zones & mode survive the backend round-trip
            deliveryConfig: {
              ...DEFAULT_DELIVERY_CONFIG,
              ...(prev.deliveryConfig || {}),
              ...(result.deliveryConfig || {}),
              // Explicit client updates always take precedence over backend response
              ...(updates.deliveryConfig || {}),
              serviceablePincodes:
                Array.isArray(updates.deliveryConfig?.serviceablePincodes)
                  ? updates.deliveryConfig.serviceablePincodes
                  : (Array.isArray(result.deliveryConfig?.serviceablePincodes) && result.deliveryConfig.serviceablePincodes.length > 0
                      ? result.deliveryConfig.serviceablePincodes
                      : (Array.isArray(prev.deliveryConfig?.serviceablePincodes) && prev.deliveryConfig.serviceablePincodes.length > 0
                          ? prev.deliveryConfig.serviceablePincodes
                          : DEFAULT_DELIVERY_CONFIG.serviceablePincodes)),
            },
            heroConfig: {
              ...DEFAULT_HERO_CONFIG,
              ...(prev.heroConfig || {}),
              ...(result.heroConfig || {}),
              ...(updates.heroConfig || {}), // explicit client updates always take precedence
              heroBannerSlides: updates.heroConfig?.heroBannerSlides !== undefined
                ? updates.heroConfig.heroBannerSlides
                : (result.heroConfig?.heroBannerSlides || prev.heroConfig?.heroBannerSlides || []),
              heroDisplayMode: updates.heroConfig?.heroDisplayMode || result.heroConfig?.heroDisplayMode || prev.heroConfig?.heroDisplayMode || 'hero',
            },
            shopConfig: {
              ...DEFAULT_SHOP_CONFIG,
              ...(prev.shopConfig || {}),
              ...(result.shopConfig || {}),
              ...(updates.shopConfig || {}),
            },
          };
          saveSettings(finalSettings);
          return finalSettings;
        });
      }
      showToast('Store settings updated successfully!', 'success');
    } catch (err: any) {
      console.error('Settings update error:', err);
      showToast(`Saved locally, but backend sync failed: ${err.message}`, 'error');
      throw err;
    }
  };

  const updateHeroConfig = async (heroUpdates: Partial<HeroConfig>) => {
    const currentHero = settings.heroConfig || DEFAULT_HERO_CONFIG;
    const mergedHero: HeroConfig = {
      ...currentHero,
      ...heroUpdates,
      heroBannerSlides: heroUpdates.heroBannerSlides !== undefined
        ? heroUpdates.heroBannerSlides
        : (currentHero.heroBannerSlides || []),
    };
    await updateSettings({ heroConfig: mergedHero });
  };

  const updateShopConfig = async (shopUpdates: Partial<ShopConfig>) => {
    const currentShop = settings.shopConfig || DEFAULT_SHOP_CONFIG;
    const mergedShop: ShopConfig = {
      ...currentShop,
      ...shopUpdates,
    };
    await updateSettings({ shopConfig: mergedShop });
  };

  // ─── Load orders when user changes ──────────────────────────────────────────
  useEffect(() => {
    if (user && user.role === 'customer') {
      loadCustomerOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // ─── Toast ──────────────────────────────────────────────────────────────────
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => {
      // Prevent identical duplicate toast spam
      if (prev.some((t) => t.message === message)) return prev;
      return [...prev.slice(-2), { id, type, message }];
    });
    const duration = type === 'error' ? 8000 : 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // ─── Listen for Global API Errors ──────────────────────────────────────────
  useEffect(() => {
    const handleApiError = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) {
        showToast(detail.message, 'error');
      }
    };
    window.addEventListener('madhuvan_api_error', handleApiError);
    return () => {
      window.removeEventListener('madhuvan_api_error', handleApiError);
    };
  }, [showToast]);

  // ─── Products & Media ───────────────────────────────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setIsProductsLoading(true);
    setIsVideosLoading(true);
    try {
      const [fetchedProducts, fetchedCategories, fetchedVideos] = await Promise.all([
        productApi.getAll().catch(() => []),
        productApi.getCategories().catch(() => []),
        videoApi.getAll().catch(() => []),
      ]);
      if (Array.isArray(fetchedProducts) && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }
      if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      }
      if (Array.isArray(fetchedVideos) && fetchedVideos.length > 0) {
        setVideos(fetchedVideos);
      }
    } catch {
      // Backend offline or waking up - retain cached data from localStorage
    } finally {
      setIsProductsLoading(false);
      setIsVideosLoading(false);
    }
  }, []);

  const refreshProducts = loadProducts;

  const addProduct = async (prodData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    try {
      const newProduct = await productApi.create(prodData);
      setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
      showToast('New honey product listed!', 'success');
      return newProduct;
    } catch {
      const fallbackProduct: Product = {
        ...prodData,
        id: 'prod-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [fallbackProduct, ...prev]);
      showToast('New honey product listed!', 'success');
      return fallbackProduct;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Optimistically update local state immediately so UI updates without lag
    setProducts((prev) =>
      prev.map((p) => (p.id === id || p.slug === id ? { ...p, ...updates } : p))
    );
    showToast('Product updated successfully!', 'success');

    // Sync with backend API
    try {
      const updated = await productApi.update(id, updates);
      if (updated && updated.id) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id || p.id === updated.id || p.slug === id ? updated : p))
        );
      }
    } catch (err: any) {
      // Show error if backend explicitly rejects (not just offline)
      console.error('updateProduct API error:', err?.message);
      // Optimistic update remains in place so UI doesn't revert
    }
  };

  const deleteProduct = async (id: string) => {
    // Optimistically remove from state immediately
    setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
    showToast('Product deleted from inventory', 'info');

    // Sync with backend API
    try {
      await productApi.delete(id);
    } catch (err: any) {
      console.error('deleteProduct API error:', err?.message);
      // Already removed from local state - backend may be offline
    }
  };

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
  const getProductById = (id: string) => products.find((p) => p.id === id || p.slug === id);

  // ─── Categories ─────────────────────────────────────────────────────────────
  const addCategory = async (categoryData: Omit<Category, 'id' | 'productCount'>) => {
    try {
      const newCat = await productApi.createCategory(categoryData);
      setCategories((prev) => [...prev.filter((c) => c.id !== newCat.id), newCat]);
      showToast('Category added', 'success');
    } catch {
      const fallbackCat: Category = {
        ...categoryData,
        id: 'cat-' + Date.now(),
        productCount: 0,
      };
      setCategories((prev) => [...prev, fallbackCat]);
      showToast('Category added', 'success');
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Category removed', 'info');
    try {
      await productApi.deleteCategory(id);
    } catch { }
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

  const forgotPassword = async (email: string) => {
    setIsAuthLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      showToast(res.message || 'Verification code sent to your email!', 'success');
      return { success: true, message: res.message, otp: res.data?.otp };
    } catch (err: any) {
      showToast(err.message || 'Failed to request password reset code.', 'error');
      return { success: false, message: err.message || 'Failed to request reset' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const verifyResetOtp = async (email: string, otp: string) => {
    setIsAuthLoading(true);
    try {
      const res = await authApi.verifyResetOtp(email, otp);
      showToast(res.message || 'Verification code confirmed!', 'success');
      return { success: true, message: res.message, resetToken: res.data?.resetToken };
    } catch (err: any) {
      showToast(err.message || 'Invalid or expired verification code.', 'error');
      return { success: false, message: err.message || 'Invalid code' };
    } finally {
      setIsAuthLoading(false);
    }
  };

  const resetPassword = async (email: string, otpOrToken: string, newPass: string): Promise<boolean> => {
    setIsAuthLoading(true);
    try {
      const res = await authApi.resetPassword(email, otpOrToken, newPass);
      if (res.user) {
        setUser(res.user);
      }
      showToast('Password reset successfully! You are now signed in.', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to reset password. Please try again.', 'error');
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
      items: cart.map((c) => {
        const matched = products.find(
          (p) =>
            p.id === c.productId ||
            p.slug === c.slug ||
            p.name.toLowerCase() === c.name.toLowerCase()
        );
        const isObjectId = typeof c.productId === 'string' && /^[0-9a-fA-F]{24}$/.test(c.productId);
        const resolvedProductId = isObjectId ? c.productId : (matched?.id || c.productId);

        return {
          productId: resolvedProductId,
          productName: c.name,
          size: c.size,
          image: c.image,
          price: c.price,
          quantity: c.quantity,
        };
      }),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartShippingFee,
      total: cartTotal,
      customerName: shippingAddress.fullName,
      customerEmail: shippingAddress.email,
      customerPhone: shippingAddress.phone,
      notes: shippingAddress.notes,
      utrNumber: paymentDetails?.utrNumber,
      paymentScreenshot: paymentDetails?.paymentScreenshot,
    };

    const newOrder = await orderApi.create(payload);
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    if (paymentMethod === 'upi') {
      showToast(`Order ${newOrder.orderNumber} placed! Payment verification pending.`, 'info');
    } else {
      showToast(`Order ${newOrder.orderNumber} placed successfully!`, 'success');
    }
    return newOrder;
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
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: 'paid', paymentVerifiedAt: new Date().toISOString() }
          : o
      )
    );
    showToast('Payment verified! Order is confirmed.', 'success');
    try {
      const updated = await orderApi.verifyPayment(orderId);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch {
      // Keep optimistic update on failure
    }
  };

  const rejectPayment = async (orderId: string, reason?: string) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: 'rejected', paymentRejectedReason: reason || 'Payment not found' }
          : o
      )
    );
    showToast('Payment rejected. Customer will be notified.', 'error');
    try {
      const updated = await orderApi.rejectPayment(orderId, reason);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch {
      // Keep optimistic update on failure
    }
  };

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId || o.orderNumber === orderId),
    [orders]
  );

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

  // ─── Videos (Axios REST API with local fallback) ───────────────────────────
  const addVideo = async (videoData: Omit<VideoItem, 'id' | 'views' | 'createdAt'>): Promise<VideoItem> => {
    try {
      const created = await videoApi.create(videoData);
      setVideos((prev) => [created, ...prev]);
      showToast('Video published successfully!', 'success');
      return created;
    } catch {
      const fallbackVideo: VideoItem = {
        ...videoData,
        id: 'vid-' + Date.now(),
        views: 1,
        createdAt: new Date().toISOString(),
      };
      setVideos((prev) => [fallbackVideo, ...prev]);
      showToast('Video saved locally', 'info');
      return fallbackVideo;
    }
  };

  const updateVideo = async (id: string, updates: Partial<VideoItem>) => {
    try {
      const updated = await videoApi.update(id, updates);
      setVideos((prev) => prev.map((v) => (v.id === id ? updated : v)));
      showToast('Video updated successfully!', 'success');
    } catch {
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
      showToast('Video updated locally', 'info');
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await videoApi.delete(id);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      showToast('Video removed from library', 'info');
    } catch {
      setVideos((prev) => prev.filter((v) => v.id !== id));
      showToast('Video removed from library', 'info');
    }
  };

  const incrementVideoViews = (id: string) => {
    setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, views: v.views + 1 } : v)));
    videoApi.incrementViews(id);
  };

  // ─── Sliders (Home Page Hero Carousel) ──────────────────────────────────────
  const loadSliders = useCallback(async () => {
    setIsSlidersLoading(true);
    try {
      const fetched = await sliderApi.getAll(true);
      if (fetched && fetched.length > 0) {
        setSliders(fetched);
      } else {
        setSliders([]);
      }
    } catch {
      setSliders([]);
    } finally {
      setIsSlidersLoading(false);
    }
  }, []);

  const refreshSliders = loadSliders;

  const addSlider = async (sliderData: Partial<SliderItem>): Promise<SliderItem> => {
    try {
      const created = await sliderApi.create(sliderData);
      setSliders((prev) => [...prev, created]);
      showToast('Hero slider published successfully!', 'success');
      return created;
    } catch {
      const fallbackSlider: SliderItem = {
        id: 'slide-' + Date.now(),
        title: sliderData.title || '',
        subtitle: sliderData.subtitle || '',
        badge: sliderData.badge || '',
        imageUrl: sliderData.imageUrl || '',
        videoUrl: sliderData.videoUrl || '',
        mediaType: sliderData.mediaType || 'image',
        linkUrl: sliderData.linkUrl || '/shop',
        ctaText: sliderData.ctaText || 'Shop Collection',
        secondaryCtaText: sliderData.secondaryCtaText || '',
        secondaryCtaLink: sliderData.secondaryCtaLink || '',
        order: sliderData.order || sliders.length + 1,
        isActive: sliderData.isActive !== undefined ? sliderData.isActive : true,
        createdAt: new Date().toISOString(),
      };
      setSliders((prev) => [...prev, fallbackSlider]);
      showToast('Hero slider saved locally', 'info');
      return fallbackSlider;
    }
  };

  const updateSlider = async (id: string, updates: Partial<SliderItem>): Promise<SliderItem> => {
    try {
      const updated = await sliderApi.update(id, updates);
      setSliders((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast('Hero slider updated successfully!', 'success');
      return updated;
    } catch {
      let updatedFallback!: SliderItem;
      setSliders((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            updatedFallback = { ...s, ...updates };
            return updatedFallback;
          }
          return s;
        })
      );
      showToast('Hero slider updated locally', 'info');
      return updatedFallback;
    }
  };

  const deleteSlider = async (id: string) => {
    try {
      await sliderApi.delete(id);
      setSliders((prev) => prev.filter((s) => s.id !== id));
      showToast('Slider removed from library', 'info');
    } catch {
      setSliders((prev) => prev.filter((s) => s.id !== id));
      showToast('Slider removed from library', 'info');
    }
  };

  // ─── Reviews & Testimonials ──────────────────────────────────────────────────
  const [homeReviews, setHomeReviews] = useState<Testimonial[]>([]);
  const [isHomeReviewsLoading, setIsHomeReviewsLoading] = useState(false);
  const [allReviews, setAllReviews] = useState<ProductReview[]>([]);
  const [isAllReviewsLoading, setIsAllReviewsLoading] = useState(false);

  const loadHomeReviews = useCallback(async () => {
    setIsHomeReviewsLoading(true);
    try {
      const data = await productApi.getHomeReviews();
      if (data && data.length > 0) {
        // Strip out any product images erroneously stored in avatar
        const cleaned = data.map((item) => {
          const isProductPic =
            item.avatar &&
            (item.avatar.includes('Honey-Jar') ||
              item.avatar.includes('Honey-Stil') ||
              item.avatar.includes('products/') ||
              item.avatar.includes('Rustic-Ajwain') ||
              item.avatar.includes('Sunflower-Honey') ||
              item.avatar.includes('Raw-Forest-Honey') ||
              item.avatar.includes('IMG-6672'));
          return {
            ...item,
            avatar: isProductPic ? '' : (item.avatar || ''),
            productImage: isProductPic ? item.avatar : (item.productImage || ''),
          };
        });
        const sorted = [...cleaned].sort(
          (a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );
        setHomeReviews(sorted);
      } else {
        // Extract only real reviews that have showOnHome = true from loaded products
        const fromProducts: Testimonial[] = [];
        products.forEach((p) => {
          if (p.reviews && Array.isArray(p.reviews)) {
            p.reviews.forEach((r) => {
              if (r.showOnHome) {
                fromProducts.push({
                  id: r.id || (r as any)._id,
                  name: r.userName,
                  role: r.userRole || 'Verified Patron',
                  location: r.location || 'Verified Buyer',
                  avatar: r.avatar || '',
                  comment: r.comment,
                  rating: r.rating,
                  productMentioned: p.name,
                  productSlug: p.slug,
                  productId: p.id,
                  productImage: p.images?.[0] || '',
                  date: r.date,
                });
              }
            });
          }
        });
        fromProducts.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        setHomeReviews(fromProducts.length > 0 ? fromProducts : INITIAL_TESTIMONIALS);
      }
    } catch {
      setHomeReviews(INITIAL_TESTIMONIALS);
    } finally {
      setIsHomeReviewsLoading(false);
    }
  }, [products]);

  const loadAllReviews = useCallback(async () => {
    setIsAllReviewsLoading(true);
    try {
      const data = await productApi.getAllReviews();
      if (data && data.length > 0) {
        setAllReviews(data);
      } else {
        // Fallback: collect reviews across loaded products
        const flattened: ProductReview[] = [];
        products.forEach((p) => {
          if (p.reviews && Array.isArray(p.reviews)) {
            p.reviews.forEach((r) => {
              flattened.push({
                ...r,
                productId: p.id,
                productName: p.name,
                productSlug: p.slug,
                productImage: p.images[0] || '',
              });
            });
          }
        });
        setAllReviews(flattened);
      }
    } catch {
      // Offline fallback
      const flattened: ProductReview[] = [];
      products.forEach((p) => {
        if (p.reviews && Array.isArray(p.reviews)) {
          p.reviews.forEach((r) => {
            flattened.push({
              ...r,
              productId: p.id,
              productName: p.name,
              productSlug: p.slug,
              productImage: p.images[0] || '',
            });
          });
        }
      });
      setAllReviews(flattened);
    } finally {
      setIsAllReviewsLoading(false);
    }
  }, [products]);

  useEffect(() => {
    loadHomeReviews();
    loadAllReviews();
  }, [loadHomeReviews, loadAllReviews]);

  const toggleReviewHome = async (
    productId: string,
    reviewId: string,
    showOnHome?: boolean
  ): Promise<boolean> => {
    let nextState = showOnHome;
    let targetReview: ProductReview | undefined;

    setAllReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId || (r as any).reviewId === reviewId) {
          nextState = showOnHome !== undefined ? showOnHome : !r.showOnHome;
          targetReview = { ...r, showOnHome: nextState };
          return targetReview;
        }
        return r;
      })
    );

    // Optimistically update homeReviews so user sees it right away
    if (nextState && targetReview) {
      const newHomeItem: Testimonial = {
        id: targetReview.id,
        name: targetReview.userName,
        role: targetReview.userRole || 'Verified Patron',
        location: targetReview.location || 'Verified Buyer',
        avatar: targetReview.avatar || '',
        comment: targetReview.comment,
        rating: targetReview.rating,
        productMentioned: targetReview.productName || 'Madhuvan Pure Honey',
        productSlug: targetReview.productSlug,
        productId: targetReview.productId,
        date: targetReview.date,
      };
      setHomeReviews((prev) => [newHomeItem, ...prev.filter((p) => p.id !== reviewId)]);
    } else if (!nextState) {
      setHomeReviews((prev) => prev.filter((p) => p.id !== reviewId && (p as any).reviewId !== reviewId));
    }

    try {
      await productApi.toggleReviewHome(productId, reviewId, nextState);
      await loadHomeReviews();
      await refreshProducts();
      showToast(
        nextState
          ? 'Review is now showcased on the Customer Home page!'
          : 'Review removed from Customer Home page.',
        'success'
      );
      return true;
    } catch {
      await loadHomeReviews();
      await loadAllReviews();
      showToast('Review home display setting saved', 'info');
      return true;
    }
  };

  const deleteReview = async (productId: string, reviewId: string): Promise<boolean> => {
    try {
      await productApi.deleteReview(productId, reviewId);
      setAllReviews((prev) => prev.filter((r) => r.id !== reviewId && (r as any).reviewId !== reviewId));
      await loadHomeReviews();
      await refreshProducts();
      showToast('Review removed from system', 'info');
      return true;
    } catch {
      setAllReviews((prev) => prev.filter((r) => r.id !== reviewId && (r as any).reviewId !== reviewId));
      showToast('Review removed locally', 'info');
      return true;
    }
  };

  const submitReview = async (
    productId: string,
    review: { userName: string; rating: number; comment: string; userRole?: string; location?: string; avatar?: string }
  ): Promise<ProductReview> => {
    try {
      const created = await productApi.addReview(productId, review);
      await loadAllReviews();
      await refreshProducts();
      showToast('Thank you for sharing your experience with Madhuvan Honey!', 'success');
      return created;
    } catch {
      const fallback: ProductReview = {
        id: 'rev-' + Date.now(),
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString().split('T')[0],
        verified: true,
        showOnHome: false,
        userRole: review.userRole || 'Verified Patron',
        location: review.location || 'Verified Buyer',
        avatar: review.avatar || '',
        productId,
      };
      setAllReviews((prev) => [fallback, ...prev]);
      showToast('Review submitted locally.', 'info');
      return fallback;
    }
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
        forgotPassword,
        verifyResetOtp,
        resetPassword,
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

        // Videos (Reels & Short Clips)
        videos,
        isVideosLoading,
        addVideo,
        updateVideo,
        deleteVideo,
        incrementVideoViews,

        // Sliders (Home Page Hero Carousel)
        sliders,
        isSlidersLoading,
        refreshSliders,
        addSlider,
        updateSlider,
        deleteSlider,

        // Toast
        toasts,
        showToast,
        removeToast,

        // UI
        mobileMenuOpen,
        setMobileMenuOpen,
        cartDrawerOpen,
        setCartDrawerOpen,

        // Store Settings
        settings,
        isSettingsLoading,
        refreshSettings,
        updateSettings,
        updateHeroConfig,
        updateShopConfig,

        // Reviews & Testimonials
        homeReviews,
        isHomeReviewsLoading,
        refreshHomeReviews: loadHomeReviews,
        allReviews,
        isAllReviewsLoading,
        refreshAllReviews: loadAllReviews,
        toggleReviewHome,
        deleteReview,
        submitReview,
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
