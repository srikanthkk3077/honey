import api, { API_BASE_URL } from './api';

export interface UploadResponse {
  success: boolean;
  message?: string;
  url: string;
  urls: string[];
  data?: {
    urls: string[];
    primaryUrl: string;
  };
}

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

    const response = await api.post<UploadResponse>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    if (response.data?.url) {
      return response.data.url;
    }
    if (response.data?.urls?.[0]) {
      return response.data.urls[0];
    }
    throw new Error('No URL returned from server');
  } catch (error) {
    console.warn('[uploadImage] Server upload failed, falling back to local base64 preview:', error);
    // Graceful fallback to base64
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

    if (response.data?.urls && response.data.urls.length > 0) {
      return response.data.urls;
    }
    if (response.data?.url) {
      return [response.data.url];
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
  fileToBase64,
};
