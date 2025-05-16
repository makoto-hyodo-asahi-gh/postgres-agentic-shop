import styled from 'styled-components';

export const Gallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.background};
`;

export const MainImage = styled.img`
  width: 100%;
  height: 355px;
  object-fit: contain;
`;

export const ThumbnailsContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

export const ThumbnailButton = styled.button<{ active: boolean }>`
  position: relative;
  aspect-ratio: 1;
  width: 5rem;
  min-width: 5rem;
  overflow: hidden;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.background};
  border: 2px solid ${(props) => (props.active ? props.theme.colors.primary : 'transparent')};
  cursor: pointer;
  padding: 0;
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
