import React from 'react';
import { BASE_URL } from 'constants/constants';
import { useNavigate } from 'react-router-dom';
import Rating from 'components/rating/rating';
import {
  Card,
  ContentContainer,
  ImageContainer,
  Price,
  PriceContainer,
  ProductDescription,
  ProductName,
  RatingContainer,
} from './product-card.style';
import { ProductCardProps } from './product-card.types';

const ProductCard = ({ id, name, category, price, images, onClick, averageRating }: ProductCardProps) => {
  const navigate = useNavigate();

  const onProductClick = () => {
    navigate(`/products/${id}`);
  };
  return (
    <Card onClick={onClick ?? onProductClick}>
      <ImageContainer>
        <img src={`${BASE_URL}${images[0]?.image_url}`} alt={name} style={{ objectFit: 'contain' }} />
      </ImageContainer>

      <ContentContainer>
        <ProductName>{name}</ProductName>
        <ProductDescription>{category}</ProductDescription>
        <RatingContainer>
          <Rating value={averageRating} />
        </RatingContainer>
        <PriceContainer>
          <Price>${price.toFixed(2)}</Price>
        </PriceContainer>
      </ContentContainer>
    </Card>
  );
};

export default ProductCard;
