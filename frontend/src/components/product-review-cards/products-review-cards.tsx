import React from 'react';
import NoDataState from 'components/no-data-state/no-data-state';
import SearchInputField from 'components/search-input/search-input';
import {
  Container,
  LoadMore,
  ProductReviewCardsStyled,
  ReviewCard,
  ReviewText,
  ReviewTitle,
  StarIcon,
  StarOutlineIcon,
  Stars,
} from './products-review-cards.style';
import { ProductReviewsProps } from './product-review-cards.types';

const STAR_COUNT = 5;

const ProductReviews = ({
  reviews,
  hasMore,
  loadMoreReviews,
  isLoadingMore,
  searchQuery,
  onSearchChange,
}: ProductReviewsProps) => (
  <ProductReviewCardsStyled>
    <div className="search-input-wrapper">
      <SearchInputField searchString={searchQuery} onSearch={onSearchChange} searchPlaceholder="Search in reviews" />
    </div>
    <Container>
      {!reviews.length ? (
        <NoDataState message="No reviews yet" />
      ) : (
        reviews.map((review) => (
          <ReviewCard key={review.id}>
            <Stars>
              {[...Array(STAR_COUNT)].map((_, index) => {
                const isFilled = review.rating > index;
                return isFilled ? <StarIcon key={`star-${index}`} /> : <StarOutlineIcon key={`star-${index}`} />;
              })}
            </Stars>
            <ReviewTitle>{`${review.user_name}`}</ReviewTitle>
            <ReviewText>{review.review_text}</ReviewText>
          </ReviewCard>
        ))
      )}

      {hasMore && (
        <LoadMore type="button" onClick={loadMoreReviews} disabled={isLoadingMore} aria-label="Load more reviews">
          {isLoadingMore ? 'Loading...' : 'Load More'}
        </LoadMore>
      )}
    </Container>
  </ProductReviewCardsStyled>
);

export default ProductReviews;
