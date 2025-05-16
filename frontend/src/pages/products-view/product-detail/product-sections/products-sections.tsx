import React, { useCallback, useEffect, useState } from 'react';
import FeaturesTable from 'components/features-table/features-table';
import ProductDescription from 'components/product-description/product-description';
import ProductReviews from 'components/product-review-cards/products-review-cards';
import { ProductDetailResponse, ReviewResponse, ReviewType } from 'src/types/product.type';
import { useFetch } from 'services/api-callers';
import { REVIEWS_API } from 'constants/api-urls';
import ErrorState from 'components/error-state/error-state';
import OverlayWithSpinner from 'components/overlay-with-spinner/overlay-with-spinner';
import Section from './section';

interface ProductSectionsProps {
  product: ProductDetailResponse;
}

const ProductSections = ({ product }: ProductSectionsProps) => {
  const [allReviews, setAllReviews] = useState<ReviewType[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewType[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<ReviewType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pageSize = 6;
  const { data, error, isLoading } = useFetch<ReviewResponse>(`reviews-${product.id}`, REVIEWS_API(product.id));

  // This function will update displayed reviews based on current page
  const updateDisplayedReviews = useCallback(
    (currentPage: number, reviewsSource: ReviewType[]) => {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const reviewsToDisplay = searchQuery ? reviewsSource : reviewsSource.slice(startIndex, endIndex);

      if (currentPage === 1) {
        setDisplayedReviews(reviewsToDisplay);
      } else {
        setDisplayedReviews((prev) => [...prev, ...reviewsToDisplay]);
      }
    },
    [searchQuery],
  );

  useEffect(() => {
    if (data) {
      setAllReviews(data.reviews);
      setFilteredReviews(data.reviews);
      if (searchQuery.trim() === '') {
        updateDisplayedReviews(1, data.reviews);
      }
      setIsLoadingMore(false);
    }
  }, [data, updateDisplayedReviews, searchQuery]);

  // Filter reviews based on search query
  useEffect(() => {
    if (allReviews.length) {
      let newFilteredReviews;

      if (searchQuery.trim() === '') {
        newFilteredReviews = allReviews;
      } else {
        // Filter reviews that match the search query in review_text
        newFilteredReviews = allReviews.filter((review) => {
          const reviewText = review.review_text.toLowerCase();
          const query = searchQuery.toLowerCase();
          return reviewText.includes(query);
        });
      }

      // Sort the filtered reviews by rating in descending order
      newFilteredReviews = newFilteredReviews.sort((a, b) => b.rating - a.rating);
      setFilteredReviews(newFilteredReviews);
      setPage(1);
      updateDisplayedReviews(1, newFilteredReviews);
    }
  }, [searchQuery, allReviews, updateDisplayedReviews]);

  // Update hasMore whenever displayed or filtered reviews change
  useEffect(() => {
    setHasMore(displayedReviews.length < filteredReviews.length);
  }, [displayedReviews.length, filteredReviews.length]);

  const loadMoreReviews = () => {
    if (hasMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      setTimeout(() => {
        updateDisplayedReviews(nextPage, filteredReviews);
        setIsLoadingMore(false);
      }, 300);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  if (isLoading) return <OverlayWithSpinner />;
  if (error) return <ErrorState />;

  const sections = [
    {
      id: 'description',
      title: 'Description',
      content: <ProductDescription description={product.description || ''} image={product?.images[0]?.image_url} />,
    },
    {
      id: 'details',
      title: 'Product Details',
      content: <FeaturesTable specifications={product.specifications} />,
    },
    {
      id: 'reviews',
      title: 'Reviews',
      content: (
        <ProductReviews
          reviews={displayedReviews}
          hasMore={hasMore}
          loadMoreReviews={loadMoreReviews}
          isLoadingMore={isLoadingMore}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />
      ),
    },
  ];

  return (
    <>
      {sections.map((section) => (
        <Section key={section.id} id={section.id} title={section.title}>
          {section.content}
        </Section>
      ))}
    </>
  );
};

export default ProductSections;
