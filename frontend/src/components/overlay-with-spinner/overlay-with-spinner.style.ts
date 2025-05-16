import styled, { keyframes } from 'styled-components';

export const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const LoadingCard = styled.div`
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Create the rotation animation
export const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Apply the animation to your ColorfulSpinner component
export const Spinner = styled.div`
  animation: ${rotate} 1.5s linear infinite;
`;
