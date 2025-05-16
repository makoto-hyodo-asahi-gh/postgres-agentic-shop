import { Product } from 'pages/products-view/product-listing/product-listing.types';

export interface ProductSuggestionsProps {
  title: string;
  products: Product[];
  onViewMore?: () => void;
  viewMoreLink?: string;
}
