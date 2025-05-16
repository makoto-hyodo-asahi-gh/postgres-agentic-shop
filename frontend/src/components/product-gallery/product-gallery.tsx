import React, { useState } from 'react';
import { BASE_URL } from 'constants/constants';
import {
  Gallery,
  MainImage,
  MainImageContainer,
  ThumbnailButton,
  ThumbnailImage,
  ThumbnailsContainer,
} from './product-gallery.style';

interface ProductGalleryProps {
  images: {
    id: number;
    image_url: string;
    created_at: string;
  }[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <Gallery>
      <MainImageContainer>
        <MainImage src={`${BASE_URL}${images[activeImage]?.image_url}`} alt="Product image" />
      </MainImageContainer>
      <ThumbnailsContainer>
        {images?.map((image, index) => (
          <ThumbnailButton key={index} onClick={() => setActiveImage(index)} active={activeImage === index}>
            <ThumbnailImage src={`${BASE_URL}${image?.image_url}`} alt={`Product thumbnail ${index + 1}`} />
          </ThumbnailButton>
        ))}
      </ThumbnailsContainer>
    </Gallery>
  );
};

export default ProductGallery;
