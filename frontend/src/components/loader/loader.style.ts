import styled, { keyframes } from 'styled-components';

//  spinning animation
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

// The spinner element with gradient
export const Spinner = styled.div`
  width: 3.125rem;
  height: 3.125rem;
  border-radius: 50%;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 5px solid transparent;
    border-top: 5px solid;
    border-left: 5px solid;
    border-image: linear-gradient(to right, #0ab3cf, #a855f7) 1;
    animation: ${rotate} 1s ease-in-out infinite;
  }
`;
