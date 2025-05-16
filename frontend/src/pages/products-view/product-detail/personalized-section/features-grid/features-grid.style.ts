import styled from 'styled-components';

export const StyledFeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const FeatureCard = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const FeatureTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

export const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.secondary};
`;
export const FeatureValue = styled.h3`
  color: ${(props) => props.theme.colors.text};
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;
