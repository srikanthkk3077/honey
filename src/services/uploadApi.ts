import api, { API_BASE_URL } from './api';

export interface UploadResponse {
  success: boolean;
  message?: string;
  url: string;
  urls: string[];
  data?: {
    urls: string[];
    primaryUrl: string;
    url?: string;
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
 * Upload single image file
 */
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    const rawUrl =
      response.data?.url ||
      response.data?.data?.url ||
      response.data?.data?.primaryUrl ||
      response.data?.urls?.[0] ||
      response.data?.data?.urls?.[0];

    if (rawUrl) {
      return normalizeImageUrl(rawUrl);
    }
    throw new Error('No URL returned from server');
  } catch (error) {
    console.warn('[uploadImage] Server upload failed, falling back to local base64 preview:', error);
    return await fileToBase64(file);
  }
};

/**
 * Upload multiple image files
 */
export const uploadImages = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];

  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 45000,
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

export default {
  uploadImage,
  uploadImages,
  normalizeImageUrl,
  fileToBase64,
};
