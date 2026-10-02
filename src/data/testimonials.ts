export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  comment: string;
  rating: number;
  productMentioned: string;
  productId?: string;
  productSlug?: string;
  date?: string;
}

// Clean empty array - all reviews are dynamically loaded from live database/admin curation
export const INITIAL_TESTIMONIALS: Testimonial[] = [];
