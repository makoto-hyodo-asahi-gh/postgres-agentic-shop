import styled from 'styled-components';

export const NavList = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
`;

export const NavLink = styled.a<{ active?: boolean }>`
  padding: 1rem 0;
  color: ${(props) => (props.active ? props.theme.colors.text : props.theme.colors.secondary)};
  text-decoration: none;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  border-bottom: 2px solid ${(props) => (props.active ? props.theme.colors.primary : 'transparent')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${(props) => props.theme.colors.text};
  }
`;

export const Count = styled.span`
  color: ${(props) => props.theme.colors.secondary};
  margin-left: 0.5rem;
`;
