export interface ProductVariant {
  id: number;
  price: number;
  in_stock: number;
  attributes: { attribute_name: string; attribute_value: string }[];
}
export interface ProductDetailResponse {
  id: number;
  name: string;
  category: string;
  price: number;
  brand?: string;
  colors?: string[];
  description?: string;
  specifications?: Record<string, string>;
  features?: string[];
  created_at?: string;
  average_rating?: number;
  reviews?: {
    id: number;
    user_id: number;
    review_text: string;
    rating: number;
    created_at: string;
  }[];
  images: {
    id: number;
    image_url: string;
    created_at: string;
  }[];
  variants?: ProductVariant[];
}

export interface ReviewResponse {
  page: number;
  page_size: number;
  reviews: {
    id: number;
    user_name: string;
    review_text: string;
    rating: number;
    created_at: string;
  }[];
  total: number;
}

export interface ReviewType {
  id: number;
  user_name: string;
  review_text: string;
  rating: number;
  created_at: string;
}
