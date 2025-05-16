import React from 'react';
import { BASE_URL } from 'constants/constants';
import {
  Grid,
  ProductCard,
  ProductCategory,
  ProductImage,
  ProductInfo,
  ProductName,
  ProductPrice,
  Section,
  Title,
} from './related-products.style';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => (
  <Section>
    <Title>Related Products</Title>
    <Grid>
      {products?.map((product) => (
        <ProductCard key={product?.id} href="#">
          <ProductImage src={`${BASE_URL}${product?.image}`} alt={product?.name} />
          <ProductInfo>
            <ProductName>{product?.name}</ProductName>
            <ProductCategory>{product?.category}</ProductCategory>
            <ProductPrice>${product?.price}</ProductPrice>
          </ProductInfo>
        </ProductCard>
      ))}
    </Grid>
  </Section>
);

export default RelatedProducts;
