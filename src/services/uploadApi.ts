import api, { API_BASE_URL } from './api';
import { getOptimizedMediaUrl, getThumbnailUrl, getVideoPosterUrl, isCloudinaryUrl } from '../utils/cloudinary';

export interface UploadResponse {
  success: boolean;
  message?: string;
  url: string;
  urls: string[];
  data?: {
    urls: string[];
    primaryUrl: string;
    url?: string;
    files?: Array<{
      filename: string;
      originalName: string;
      size: number;
      mimetype: string;
      url: string;
      secureUrl?: string;
      optimizedUrl?: string;
      thumbnailUrl?: string;
      posterUrl?: string;
      resourceType?: string;
    }>;
  };
}

/**
 * Normalise image URL returned from backend
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const backendHost = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${backendHost}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Convert a File object to base64 Data URL fallback
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Upload base64 image data to Cloudinary via Backend
 */
export const uploadBase64Image = async (base64: string): Promise<string> => {
  if (!base64 || !base64.startsWith('data:image/')) return base64;
  try {
    const response = await api.post<UploadResponse>('/upload/base64', { image: base64 }, {
      timeout: 60000,
    });
    const rawUrl =
      response.data?.url ||
      response.data?.data?.primaryUrl ||
      response.data?.urls?.[0];
    if (rawUrl) {
      return normalizeImageUrl(rawUrl);
    }
    throw new Error(response.data?.message || 'No URL returned from server');
  } catch (error: any) {
    const errMsg = error?.response?.data?.message || error?.message || 'Base64 image upload failed';
    console.warn('[uploadBase64Image] Cloudinary base64 upload failed:', errMsg);
    throw new Error(errMsg);
  }
};

/**
 * Upload single image file to Cloudinary via Backend
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
      timeout: 60000,
    });

    const rawUrl =
      response.data?.url ||
      response.data?.data?.primaryUrl ||
      response.data?.data?.url ||
      response.data?.urls?.[0];

    if (rawUrl) {
      return normalizeImageUrl(rawUrl);
    }
    throw new Error('No URL returned from server');
  } catch (error) {
    console.warn('[uploadImage] Server multipart upload failed, attempting base64 upload:', error);
    try {
      const b64 = await fileToBase64(file);
      const cdnUrl = await uploadBase64Image(b64);
      if (cdnUrl && !cdnUrl.startsWith('data:')) {
        return cdnUrl;
      }
      return b64;
    } catch {
      return await fileToBase64(file);
    }
  }
};

/**
 * Upload multiple image files to Cloudinary via Backend
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<UploadResponse>('/upload', formData, {
      timeout: 90000,
    });

    const rawUrls =
      response.data?.urls ||
      response.data?.data?.urls ||
      (response.data?.url ? [response.data.url] : []) ||
      (response.data?.data?.primaryUrl ? [response.data.data.primaryUrl] : []);

    if (rawUrls && rawUrls.length > 0) {
      return rawUrls.map(normalizeImageUrl);
    }
    throw new Error('No URLs returned from server');
  } catch (error) {
    console.warn('[uploadImages] Server upload failed, falling back to local base64:', error);
    return await Promise.all(files.map(fileToBase64));
  }
};

/**
 * Upload video file to Cloudinary via Backend (returns CDN videoUrl + auto-extracted posterUrl)
 */
export const uploadVideo = async (
  file: File
): Promise<{ videoUrl: string; posterUrl: string; thumbnailUrl: string }> => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await api.post<UploadResponse>('/upload', formData, {
    timeout: 180000, // 3 minutes timeout for video processing
  });

  const rawUrl =
    response.data?.url ||
    response.data?.data?.primaryUrl ||
    response.data?.urls?.[0];

  const fileData = response.data?.data?.files?.[0];
  const posterUrl = fileData?.posterUrl || (rawUrl ? getVideoPosterUrl(rawUrl) : '');
  const thumbnailUrl = fileData?.thumbnailUrl || posterUrl || '';

  if (rawUrl) {
    return {
      videoUrl: normalizeImageUrl(rawUrl),
      posterUrl: posterUrl ? normalizeImageUrl(posterUrl) : '',
      thumbnailUrl: thumbnailUrl ? normalizeImageUrl(thumbnailUrl) : '',
    };
  }
  throw new Error('No video URL returned from server');
};

export {
  getOptimizedMediaUrl,
  getThumbnailUrl,
  getVideoPosterUrl,
  isCloudinaryUrl,
};

export default {
  uploadImage,
  uploadImages,
  uploadBase64Image,
  uploadVideo,
  normalizeImageUrl,
  fileToBase64,
  getOptimizedMediaUrl,
  getThumbnailUrl,
  getVideoPosterUrl,
};
