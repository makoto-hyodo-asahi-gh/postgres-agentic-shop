import styled from 'styled-components';

export const Layout = styled.div`
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.white};
`;

export const Main = styled.main`
  width: 100%;
`;

export const BreadcrumbContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;
