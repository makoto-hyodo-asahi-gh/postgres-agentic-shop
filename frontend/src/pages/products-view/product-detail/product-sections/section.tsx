import React from 'react';
import { Section as StyledSection, SectionTitle } from './product-sections.style';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => (
  <StyledSection id={id}>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </StyledSection>
);

export default Section;
