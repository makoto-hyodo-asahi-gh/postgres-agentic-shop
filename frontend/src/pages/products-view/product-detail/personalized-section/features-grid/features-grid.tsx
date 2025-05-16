import React from 'react';
import { FeatureCard, FeatureDescription, FeatureTitle, FeatureValue, StyledFeaturesGrid } from './features-grid.style';

interface Feature {
  type?: string;
  title?: string;
  text?: string;
  value?: string;
}

interface FeaturesGridProps {
  features: Feature[];
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ features }) => (
  <StyledFeaturesGrid>
    {features.map((feature, index) => (
      <FeatureCard key={index}>
        <FeatureTitle>{feature.title}</FeatureTitle>
        <FeatureValue>{feature.value}</FeatureValue>
        <FeatureDescription>{feature.text}</FeatureDescription>
      </FeatureCard>
    ))}
  </StyledFeaturesGrid>
);

export default FeaturesGrid;
