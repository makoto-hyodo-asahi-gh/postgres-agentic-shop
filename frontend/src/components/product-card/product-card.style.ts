import styled from 'styled-components';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 15.625rem;
  height: 28.125rem;
  margin: 0 auto;
  border-radius: 0.5rem;
  padding: 1rem;
  cursor: pointer;
`;

export const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  width: 100%;
  height: 13.75rem;
  margin-bottom: 1rem;
  img {
    width: 100%;
    height: 100%;
  }
`;

export const ContentContainer = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ProductName = styled.h2`
  color: ${(props) => props.theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.25rem;
  height: 3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ProductDescription = styled.p`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 1rem;
  height: 1.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

export const Price = styled.span<{ isOriginal?: boolean }>`
  color: ${(props) => (props.isOriginal ? '#bdbdbd' : props.theme.colors.text)};
  font-size: ${(props) => (props.isOriginal ? '1rem' : '1.25rem')};
  font-weight: ${(props) => (props.isOriginal ? '400' : '700')};
  text-decoration: ${(props) => (props.isOriginal ? 'line-through' : 'none')};
`;
export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
