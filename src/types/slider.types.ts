export type SliderMediaType = 'image' | 'video';

export interface SliderItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl: string;
  mobileImageUrl?: string;
  videoUrl?: string;
  mediaType: SliderMediaType;
  linkUrl: string;
  ctaText?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
