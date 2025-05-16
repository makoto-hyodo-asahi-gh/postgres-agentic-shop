import styled from 'styled-components';

export const Section = styled.div`
  background: linear-gradient(
    298deg,
    rgba(154, 0, 205, -5.9) 0%,
    rgba(11, 66, 204, 0.1) 50%,
    rgba(0, 192, 164, 0.1) 100%
  );
  border-radius: 1.25rem;
  padding: 1.5rem;
  .right-align {
    display: flex;
    justify-content: flex-end;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Dot = styled.div`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.primary};
`;

export const Heading = styled.h2`
  font-size: 1rem;
  font-weight: 400;
  color: ${(props) => props.theme.colors.primary};
`;

export const CustomizeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;

  &:hover {
    color: ${(props) => props.theme.colors.primaryDark};
  }
`;
export const ComponentCardWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;
export const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

export const WhyLink = styled.button`
  color: ${(props) => props.theme.colors.hover};
  text-decoration: underline;
  margin-top: 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  background: none;
  cursor: pointer;
`;
