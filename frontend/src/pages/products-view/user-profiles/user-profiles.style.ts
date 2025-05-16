import styled from 'styled-components';

export const MainContainer = styled.main`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background-color: ${(props) => props.theme.colors.white};
`;

export const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 4rem;
`;

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 64rem;
  width: 100%;

  @media (min-width: 48rem) {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
`;

export const ProfileLink = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
`;

export const AvatarContainer = styled.div`
  border-radius: 50%;
  overflow: hidden;
  width: 6rem;
  height: 6rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;

  @media (min-width: 48rem) {
    width: 8rem;
    height: 8rem;
  }

  ${ProfileLink}:hover & {
    transform: scale(1.05);
  }
`;

export const ProfileName = styled.span`
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
`;
