import api from './api';
import { VideoItem, VideoCategory } from '../types/video.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

function normaliseVideo(raw: any): VideoItem {
  return {
    id: raw._id || raw.id || '',
    title: raw.title || '',
    description: raw.description || '',
    videoUrl: raw.videoUrl || '',
    thumbnailUrl: raw.thumbnailUrl || '',
    category: (raw.category as VideoCategory) || 'story',
    duration: raw.duration || '1:00',
    taggedProductId: raw.taggedProductId || '',
    taggedProductName: raw.taggedProductName || '',
    taggedProductSlug: raw.taggedProductSlug || '',
    views: typeof raw.views === 'number' ? raw.views : 0,
    featuredOnHome: Boolean(raw.featuredOnHome),
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export const videoApi = {
  /** GET /api/videos */
  getAll: async (category?: string): Promise<VideoItem[]> => {
    const params = category && category !== 'all' ? { category } : undefined;
    const { data } = await api.get<any>('/videos', { params });
    const raw = data.data?.videos || data.data || [];
    return Array.isArray(raw) ? raw.map(normaliseVideo) : [];
  },

  /** GET /api/videos/:id */
  getById: async (id: string): Promise<VideoItem> => {
    const { data } = await api.get<ApiResponse<any>>(`/videos/${id}`);
    return normaliseVideo(data.data);
  },

  /** POST /api/videos (admin) */
  create: async (videoData: Partial<VideoItem>): Promise<VideoItem> => {
    const { data } = await api.post<ApiResponse<any>>('/videos', videoData);
    return normaliseVideo(data.data);
  },

  /** PUT /api/videos/:id (admin) */
  update: async (id: string, updates: Partial<VideoItem>): Promise<VideoItem> => {
    const { data } = await api.put<ApiResponse<any>>(`/videos/${id}`, updates);
    return normaliseVideo(data.data);
  },

  /** DELETE /api/videos/:id (admin) */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/videos/${id}`);
  },

  /** POST /api/videos/:id/view */
  incrementViews: async (id: string): Promise<void> => {
    try {
      await api.post(`/videos/${id}/view`);
    } catch {
      // Non-blocking view count tracking
    }
  },
};

export default videoApi;
