import styled from 'styled-components';

export const FooterContainer = styled.footer`
  padding: 2.5rem 0;
  color: ${(props) => props.theme.colors.text};
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12rem;
  margin-bottom: 2.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    padding: 0 1.25rem;
  }
`;

export const Logo = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

export const SocialIcons = styled.div`
  display: flex;
  gap: 1.25rem;
`;

export const SocialIcon = styled.a`
  color: ${(props) => props.theme.colors.primary};
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: ${(props) => props.theme.colors.border};
  margin: 0 12rem 2.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    margin: 0 1.25rem 2.5rem;
  }
`;

export const ContentSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 12rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 2.5rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    padding: 0 1.25rem;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    gap: 1.25rem;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    flex: 0 0 calc(50% - 0.625rem);
  }

  @media (max-width: ${(props) => props.theme.breakpoints.xs}) {
    flex: 0 0 100%;
  }
`;

export const ColumnTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 5px;
`;

export const ColumnLink = styled.a`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`;

export const SubscribeSection = styled.div`
  width: 31.25rem;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: 100%;
  }
`;

export const SubscribeForm = styled.form`
  display: flex;
  margin-top: 1.25rem;
`;

export const EmailInput = styled.input`
  flex: 1;
  padding: 15px;
  border: 1px solid #e6e6e6;
  border-right: none;
  font-size: 0.875rem;
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

export const SubscribeButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.white};
  border: none;
  padding: 15px 25px;
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
  }
`;

export const SmallText = styled.p`
  font-size: 0.75rem;
  color: ${(props) => props.theme.colors.secondary};
  margin-top: 0.625rem;
`;

export const BottomSection = styled.div`
  padding: 0 12rem;

  @media (max-width: ${(props) => props.theme.breakpoints.lg}) {
    padding: 0 1.25rem;
  }
`;

export const Copyright = styled.p`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  margin: 0;
`;
