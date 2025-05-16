import { ProductImage } from 'pages/products-view/product-listing/product-listing.types';

export interface ProductCardProps {
  id: number;
  name: string;
  category: string;
  price: number;
  averageRating?: number;
  images: ProductImage[];
  onClick?: () => void;
}
