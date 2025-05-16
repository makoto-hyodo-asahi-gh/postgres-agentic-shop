import styled from 'styled-components';

export const TitleWithTextStyled = styled.div`
  display: grid;
  grid-template-columns: auto;
  gap: 1rem;
  margin-bottom: 2rem;
`;
export const TextCard = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.08);
  padding: 2rem;
  max-width: 37.5rem;
  width: 100%;
  margin: 0 auto;
`;

export const TextCardTitle = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const CardText = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 0.875rem;
  line-height: 1.6;
  font-weight: 400;
`;
