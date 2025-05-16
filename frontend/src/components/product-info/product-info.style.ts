import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

export const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Reviews = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.secondary};
`;

export const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.25rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
`;

export const PrimaryButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  border: none;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

export const IconButton = styled(Button)`
  padding: 0.75rem;
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.border};
  &:hover {
    background-color: ${(props) => props.theme.colors.background};
  }
`;
