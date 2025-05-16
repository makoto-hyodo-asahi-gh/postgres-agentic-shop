import React from 'react';
import Rating from 'components/rating/rating';
import { HeartOutlined, ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import { ProductVariant } from 'src/types/product.type';
import { Actions, Container, IconButton, Price, PrimaryButton, RatingContainer, Title } from './product-info.style';
import ProductVariants from './product-variants/product-variants';

interface ProductInfoProps {
  title: string;
  price: number;
  rating?: number;
  variants?: ProductVariant[];
}
const ProductInfo: React.FC<ProductInfoProps> = ({ title, price, rating, variants }) => (
  <Container>
    <Title>{title}</Title>
    <RatingContainer>
      <Rating value={rating} />
    </RatingContainer>
    <Price>${price.toFixed(2)}</Price>
    <ProductVariants variants={variants} />

    <Actions>
      <PrimaryButton>Buy Now</PrimaryButton>
      <IconButton>
        <HeartOutlined size={20} />
      </IconButton>
      <IconButton>
        <ShoppingCartOutlined size={20} />
      </IconButton>
      <IconButton>
        <EyeOutlined size={20} />
      </IconButton>
    </Actions>
  </Container>
);

export default ProductInfo;
