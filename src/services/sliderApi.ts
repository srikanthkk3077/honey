import api from './api';

export interface SliderItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  linkUrl: string;
  ctaText?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function normaliseSlider(raw: any): SliderItem {
  return {
    id: raw._id || raw.id || '',
    title: raw.title || '',
    subtitle: raw.subtitle || '',
    badge: raw.badge || '',
    imageUrl: raw.imageUrl || '',
    videoUrl: raw.videoUrl || '',
    mediaType: raw.mediaType || 'image',
    linkUrl: raw.linkUrl || '/shop',
    ctaText: raw.ctaText || 'Shop Collection',
    secondaryCtaText: raw.secondaryCtaText || '',
    secondaryCtaLink: raw.secondaryCtaLink || '',
    order: typeof raw.order === 'number' ? raw.order : 0,
    isActive: raw.isActive !== undefined ? raw.isActive : true,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export const sliderApi = {
  /** GET /api/sliders */
  getAll: async (all = false): Promise<SliderItem[]> => {
    const { data } = await api.get<any>('/sliders', {
      params: all ? { all: 'true' } : undefined,
    });
    const raw = data.data || [];
    return Array.isArray(raw) ? raw.map(normaliseSlider) : [];
  },

  /** GET /api/sliders/:id */
  getById: async (id: string): Promise<SliderItem> => {
    const { data } = await api.get<ApiResponse<any>>(`/sliders/${id}`);
    return normaliseSlider(data.data);
  },

  /** POST /api/sliders (admin) */
  create: async (sliderData: Partial<SliderItem>): Promise<SliderItem> => {
    const { data } = await api.post<ApiResponse<any>>('/sliders', sliderData);
    return normaliseSlider(data.data);
  },

  /** PUT /api/sliders/:id (admin) */
  update: async (id: string, updates: Partial<SliderItem>): Promise<SliderItem> => {
    const { data } = await api.put<ApiResponse<any>>(`/sliders/${id}`, updates);
    return normaliseSlider(data.data);
  },

  /** DELETE /api/sliders/:id (admin) */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/sliders/${id}`);
  },
};

export default sliderApi;
