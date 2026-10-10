/**
 * Cloudinary Frontend Helper
 * Optimizes Cloudinary media URLs on the fly for responsive display and faster loading.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  gravity?: 'auto' | 'center' | 'face';
}

/**
 * Checks if a given URL is hosted on Cloudinary
 */
export const isCloudinaryUrl = (url?: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com');
};

/**
 * Injects transformation parameters into a Cloudinary URL (both images and videos)
 */
export const getOptimizedMediaUrl = (
  url?: string,
  options: CloudinaryTransformOptions = {}
): string => {
  if (!url || !isCloudinaryUrl(url)) return url || '';

  const {
    width,
    height,
    crop = width && height ? 'fill' : 'limit',
    quality = 'auto',
    format = 'auto',
    gravity = crop === 'fill' ? 'auto' : undefined,
  } = options;

  const transformations: string[] = ['f_' + format, 'q_' + quality];

  if (width) transformations.push('w_' + width);
  if (height) transformations.push('h_' + height);
  if (crop) transformations.push('c_' + crop);
  if (gravity) transformations.push('g_' + gravity);

  const transformString = transformations.join(',');

  if (url.includes('/upload/')) {
    // If already has this transformation string, return as is
    if (url.includes(`/upload/${transformString}/`)) return url;

    // If an existing transformation segment exists (e.g. /upload/f_auto,q_auto/ or /upload/w_400/), replace it
    if (/\/upload\/[a-z]_[^/]+\//i.test(url)) {
      return url.replace(/\/upload\/[a-z]_[^/]+\//i, `/upload/${transformString}/`);
    }

    // Otherwise insert immediately after /upload/
    return url.replace('/upload/', `/upload/${transformString}/`);
  }

  return url;
};

/**
 * Quick helper to get a cropped square thumbnail (e.g. for product cards or cart items)
 */
export const getThumbnailUrl = (url?: string, size = 400): string => {
  return getOptimizedMediaUrl(url, {
    width: size,
    height: size,
    crop: 'fill',
    gravity: 'auto',
  });
};

/**
 * Extracts a fast JPEG poster frame from a Cloudinary video URL
 */
export const getVideoPosterUrl = (videoUrl?: string): string => {
  if (!videoUrl || !isCloudinaryUrl(videoUrl)) return '';

  return videoUrl
    .replace(/\/video\/upload\/(?:[a-zA-Z0-9_,:]+\/)?/, '/video/upload/so_auto,f_auto,q_auto/')
    .replace(/\.[a-zA-Z0-9]+$/, '.jpg');
};
