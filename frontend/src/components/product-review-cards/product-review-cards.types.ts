export type Review = {
  id: number;
  user_name: string;
  review_text: string;
  rating: number;
  created_at: string;
};

export interface ProductReviewsProps {
  reviews: Review[];
  hasMore?: boolean;
  loadMoreReviews?: () => void;
  isLoadingMore?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
