import styled from 'styled-components';
import { StarFilled, StarOutlined } from '@ant-design/icons';

export const ProductReviewCardsStyled = styled.div`
  .search-input-wrapper {
    margin-bottom: 1rem;
  }
`;
export const Container = styled.div`
  display: flex;
  column-gap: 1rem;
  flex-wrap: wrap;
`;

export const ReviewCard = styled.div`
  padding: 2rem;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 8px;
  margin-bottom: 1rem;
  max-width: 365px;
`;
export const StarIcon = styled(StarFilled)`
  color: ${({ theme }) => theme.colors.star};
  font-size: 1.25rem;
`;

export const StarOutlineIcon = styled(StarOutlined)`
  color: ${({ theme }) => theme.colors.star};
  font-size: 1.25rem;
`;
export const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

export const ReviewTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const ReviewText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.secondary};
`;

export const LoadMore = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
  background: none;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  margin: 2rem auto;

  &:hover {
    text-decoration: underline;
  }
`;
