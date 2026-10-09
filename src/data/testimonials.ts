export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  comment: string;
  rating: number;
  productMentioned?: string;
  productId?: string;
  productSlug?: string;
  productImage?: string;
  date?: string;
}

export const INITIAL_TESTIMONIALS: Testimonial[] = [];
