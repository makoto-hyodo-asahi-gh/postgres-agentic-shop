import styled from 'styled-components';

const FlowContainer = styled.div`
  width: 100%;
  height: 80vh;
  .navigation-wrapper {
    max-width: 9rem;
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;
    position: absolute;
    z-index: 10;
    .navigation {
      display: flex;
      justify-content: center;
      column-gap: 1rem;
      align-items: center;
      span {
        padding: 1rem;
        border-radius: 0.6rem;
        border: 1px solid ${({ theme }) => theme.colors.border};
      }
    }
    .navigation-text {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.colors.secondary};
      text-transform: uppercase;
      text-align: center;
      texts-selection: none;
    }
  }
  .active-level {
    border-radius: 1rem;
    box-shadow: 0 0 10px rgba(128, 0, 128, 0.5);
    transform: scale(1.05);
    z-index: 10;
  }
  .dimmed-level {
    filter: grayscale(100%);
  }
`;
export default FlowContainer;
