import styled from 'styled-components';

export const Section = styled.section`
  margin-bottom: 4rem;
  scroll-margin-top: 6.25rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 2rem;
`;
