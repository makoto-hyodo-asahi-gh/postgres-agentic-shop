import React from 'react';
import parse from 'html-react-parser';
import { BASE_URL } from 'constants/constants';
import { ImageContainer, ProductDescriptionStyled } from './product-description.style';

interface ProductDescriptionProps {
  description: string;
  image?: string;
}

const ProductDescription = ({ description, image }: ProductDescriptionProps) => (
  <ProductDescriptionStyled>
    <p>{parse(description)}</p>
    <ImageContainer>
      <img src={`${BASE_URL}${image}`} alt="" style={{ objectFit: 'contain' }} />
    </ImageContainer>
  </ProductDescriptionStyled>
);

export default ProductDescription;
