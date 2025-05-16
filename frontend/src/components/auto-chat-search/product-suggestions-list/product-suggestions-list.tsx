import React from 'react';
import { BASE_URL } from 'constants/constants';
import { ProductSuggestionsProps } from './product-suggestions-list.type';
import {
  Header,
  ProductCard,
  ProductImageWrapper,
  ProductList,
  ProductName,
  Title,
  ViewMoreLink,
} from './product-suggestions-list.style';

const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
  title,
  products,
  onViewMore,
  viewMoreLink = '/products',
}) => (
  <>
    <Header>
      <Title>{title}</Title>
    </Header>

    <ProductList>
      {products?.map((product) => (
        <ProductCard key={product?.id} href="">
          <ProductImageWrapper>
            <img src={`${BASE_URL}}`} alt={product?.name} width={70} height={70} style={{ objectFit: 'contain' }} />
          </ProductImageWrapper>
          <ProductName>
            {product?.name.length > 40 ? `${product?.name.split('').slice(0, 40).join('')}...` : product?.name}
          </ProductName>
        </ProductCard>
      ))}
    </ProductList>

    <ViewMoreLink
      href={viewMoreLink}
      onClick={(e) => {
        if (onViewMore) {
          e.preventDefault();
          onViewMore();
        }
      }}
    >
      View more suggestions
    </ViewMoreLink>
  </>
);

export default ProductSuggestions;
