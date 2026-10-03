export type VideoCategory = 'harvest' | 'purity' | 'recipe' | 'story';

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // Local blob URL, base64, direct MP4, or YouTube/Vimeo embed
  thumbnailUrl: string;
  category: VideoCategory;
  duration: string; // e.g. "0:45", "1:20"
  taggedProductId?: string;
  taggedProductName?: string;
  taggedProductSlug?: string;
  taggedProductPrice?: number;
  taggedProductOriginalPrice?: number;
  taggedProductImage?: string;
  taggedProductDescription?: string;
  taggedProductSize?: string;
  purityScore?: number;
  views: number;
  featuredOnHome: boolean;
  createdAt: string;
}
