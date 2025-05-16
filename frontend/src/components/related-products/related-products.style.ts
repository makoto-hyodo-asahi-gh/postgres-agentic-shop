import styled from 'styled-components';

export const Section = styled.section`
  margin: 4rem 0;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 2rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

export const ProductCard = styled.a`
  display: block;
  text-decoration: none;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  background: ${(props) => props.theme.colors.background};
`;

export const ProductInfo = styled.div`
  padding: 1rem;
`;

export const ProductName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

export const ProductCategory = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.secondary};
  margin-bottom: 1rem;
`;

export const ProductPrice = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;
