import styled, { css, keyframes } from 'styled-components';

export const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideOut = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 40;
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  animation: ${(props) =>
    props.isOpen
      ? css`
          ${fadeIn} 0.2s ease-in
        `
      : css`
          ${fadeOut} 0.2s ease-out
        `};
`;

export const DrawerContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100%;
  max-width: 45vw;
  background-color: ${(props) => props.theme.colors.white};
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 50;
  animation: ${(props) =>
    props.isOpen
      ? css`
          ${slideIn} 0.3s ease-out
        `
      : css`
          ${slideOut} 0.3s ease-in
        `};
`;

export const DrawerContent = styled.div`
  padding: 1rem;
  height: 100%;
`;
