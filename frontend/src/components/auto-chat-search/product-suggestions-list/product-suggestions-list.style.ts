import styled from 'styled-components';

export const Container = styled.div`
  background: linear-gradient(to bottom right, #f0f4ff, #f0f8ff);
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 34.375rem;
  width: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const IconWrapper = styled.div`
  color: ${(props) => props.theme.colors.primary};
  flex-shrink: 0;
`;

export const Title = styled.h3`
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
  line-height: 1.4;
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ProductCard = styled.a`
  display: flex;
  align-items: center;
  border-radius: 0.75rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.secondary};
  padding: 0.5rem;
  text-decoration: none;
  transition:
    transform ${(props) => props.theme.transitions.default},
    box-shadow ${(props) => props.theme.transitions.default};

  &:hover {
    transform: translateY(-0.125rem);
    box-shadow: ${(props) => props.theme.shadows.md};
  }
`;

export const ProductImageWrapper = styled.div`
  width: 3.375rem;
  height: 3.375rem;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ProductName = styled.span`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text};
  margin-left: 1rem;
`;

export const ViewMoreLink = styled.a`
  display: inline-block;
  margin-top: 1.25rem;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
