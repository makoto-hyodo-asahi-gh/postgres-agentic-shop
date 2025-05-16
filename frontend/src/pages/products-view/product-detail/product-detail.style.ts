import styled from 'styled-components';

export const Container = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: ${(props) => props.theme.colors.background};
  padding: 1rem;
  border-radius: 0.625rem;
  max-width: 43.75rem;
`;

export const CenteredNavigation = styled.div`
  display: flex;
  justify-content: center;
  margin: 4rem 0 2rem;
`;
