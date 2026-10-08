import api from './api';
import { Product, Category, ProductReview } from '../types/product.types';
import { Testimonial } from '../data/testimonials';

// ─── Backend shapes ───────────────────────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    products?: T[];
    categories?: T[];
    items?: T[];
    total?: number;
    page?: number;
    pages?: number;
  };
}

// ─── Helper: normalise backend product → frontend Product ─────────────────────
function normaliseProduct(raw: any): Product {
  return {
    id: raw._id || raw.id || '',
    name: raw.name || '',
    slug: raw.slug || '',
    tagline: raw.tagline || '',
    description: raw.description || '',
    story: raw.story || '',
    category: raw.category?.name || raw.category || '',
    categorySlug: raw.category?.slug || raw.categorySlug || '',
    price: raw.price || 0,
    originalPrice: raw.originalPrice || raw.price || 0,
    discountPercent: raw.discountPercent || 0,
    rating: raw.rating || 0,
    reviewsCount: raw.reviewsCount || raw.numReviews || 0,
    stock: raw.stock || raw.countInStock || 0,
    images: Array.isArray(raw.images)
      ? raw.images
      : raw.image
      ? [raw.image]
      : [],
    sizes: Array.isArray(raw.sizes)
      ? raw.sizes
      : [
          {
            size: '500g',
            price: raw.price || 0,
            originalPrice: raw.originalPrice || raw.price || 0,
            stock: raw.stock || 0,
            sku: raw.sku || '',
          },
        ],
    origin: raw.origin || '',
    nectarSource: raw.nectarSource || '',
    harvestSeason: raw.harvestSeason || '',
    purityScore: raw.purityScore || 0,
    benefits: Array.isArray(raw.benefits) ? raw.benefits : [],
    nutritionFacts: raw.nutritionFacts || {
      energy: '',
      carbohydrates: '',
      naturalSugars: '',
      proteins: '',
      antioxidants: '',
    },
    isFeatured: raw.isFeatured || false,
    isBestSeller: raw.isBestSeller || false,
    isOrganicCertified: raw.isOrganicCertified || false,
    badge: raw.badge || '',
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

// ─── Helper: normalise backend category → frontend Category ──────────────────
function normaliseCategory(raw: any): Category {
  return {
    id: raw._id || raw.id || '',
    name: raw.name || '',
    slug: raw.slug || '',
    description: raw.description || '',
    image: raw.image || '',
    productCount: raw.productCount || 0,
  };
}

// ─── Product query params ─────────────────────────────────────────────────────
export interface ProductQueryParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

// ─── Product API ──────────────────────────────────────────────────────────────
export const productApi = {
  /** GET /api/products */
  getAll: async (params?: ProductQueryParams): Promise<Product[]> => {
    const { data } = await api.get<any>('/products', { params });
    const raw = data.data?.products || data.data || [];
    return Array.isArray(raw) ? raw.map(normaliseProduct) : [];
  },

  /** GET /api/products/:id */
  getById: async (id: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<any>>(`/products/${id}`);
    return normaliseProduct(data.data);
  },

  /** GET /api/products/slug/:slug */
  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get<ApiResponse<any>>(`/products/slug/${slug}`);
    return normaliseProduct(data.data);
  },

  /** GET /api/products/:id/related */
  getRelated: async (id: string): Promise<Product[]> => {
    const { data } = await api.get<any>(`/products/${id}/related`);
    const raw = data.data || [];
    return Array.isArray(raw) ? raw.map(normaliseProduct) : [];
  },

  /** GET /api/categories */
  getCategories: async (): Promise<Category[]> => {
    const { data } = await api.get<any>('/categories');
    const raw = data.data?.categories || data.data || [];
    return Array.isArray(raw) ? raw.map(normaliseCategory) : [];
  },

  // ── Admin mutations ─────────────────────────────────────────────────────────

  /** POST /api/products (admin) */
  create: async (productData: Partial<Product>): Promise<Product> => {
    const { data } = await api.post<ApiResponse<any>>('/products', productData);
    return normaliseProduct(data.data);
  },

  /** PUT /api/products/:id (admin) */
  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const { data } = await api.put<ApiResponse<any>>(`/products/${id}`, updates);
    return normaliseProduct(data.data);
  },

  /** DELETE /api/products/:id (admin) */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  /** POST /api/products/:id/reviews */
  addReview: async (
    productId: string,
    review: { userName: string; rating: number; comment: string; userRole?: string; location?: string; avatar?: string }
  ): Promise<ProductReview> => {
    const { data } = await api.post<ApiResponse<any>>(
      `/products/${productId}/reviews`,
      review
    );
    return data.data;
  },

  /** GET /api/products/reviews/all (admin/public) */
  getAllReviews: async (): Promise<ProductReview[]> => {
    const { data } = await api.get<ApiResponse<ProductReview[]>>('/products/reviews/all');
    return data.data || [];
  },

  /** GET /api/products/reviews/home (customer home page) */
  getHomeReviews: async (): Promise<Testimonial[]> => {
    const { data } = await api.get<ApiResponse<Testimonial[]>>('/products/reviews/home');
    return data.data || [];
  },

  /** PATCH /api/products/:productId/reviews/:reviewId/toggle-home (admin) */
  toggleReviewHome: async (
    productId: string,
    reviewId: string,
    showOnHome?: boolean
  ): Promise<{ success: boolean; showOnHome: boolean; reviewId: string; productId: string }> => {
    const { data } = await api.patch<ApiResponse<any>>(
      `/products/${productId}/reviews/${reviewId}/toggle-home`,
      { showOnHome }
    );
    return data.data;
  },

  /** DELETE /api/products/:productId/reviews/:reviewId (admin) */
  deleteReview: async (productId: string, reviewId: string): Promise<void> => {
    await api.delete(`/products/${productId}/reviews/${reviewId}`);
  },

  // ── Admin category mutations ────────────────────────────────────────────────

  /** POST /api/categories (admin) */
  createCategory: async (
    categoryData: Partial<Category>
  ): Promise<Category> => {
    const { data } = await api.post<ApiResponse<any>>(
      '/categories',
      categoryData
    );
    return normaliseCategory(data.data);
  },

  /** PUT /api/categories/:id (admin) */
  updateCategory: async (
    id: string,
    updates: Partial<Category>
  ): Promise<Category> => {
    const { data } = await api.put<ApiResponse<any>>(
      `/categories/${id}`,
      updates
    );
    return normaliseCategory(data.data);
  },

  /** DELETE /api/categories/:id (admin) */
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};

export default productApi;
