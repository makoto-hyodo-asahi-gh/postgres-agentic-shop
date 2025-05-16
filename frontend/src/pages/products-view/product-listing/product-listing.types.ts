export type ProductImage = {
  id: number;
  image_url: string;
  created_at: string;
};

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  average_rating: number;
  images: ProductImage[];
};

export interface ProductListingProps {
  products: Product[];
}
