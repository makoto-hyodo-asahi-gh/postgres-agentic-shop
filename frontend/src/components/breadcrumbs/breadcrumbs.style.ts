import styled from 'styled-components';

export const BreadcrumbContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.text};
  margin: 1.25rem 0;
`;

export const BreadcrumbItem = styled.span`
  &:not(:last-child)::after {
    content: '>';
    margin-left: 0.5rem;
    color: ${(props) => props.theme.colors.secondary};
  }
  a {
    color: ${(props) => props.theme.colors.text};
  }
`;
