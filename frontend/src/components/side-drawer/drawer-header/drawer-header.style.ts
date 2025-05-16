import styled from 'styled-components';

const DrawerHeaderStyled = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  column-gap: 0.4rem;
  padding: 1rem 1rem 1rem 6rem;
  border-bottom: 1px solid #e5e7eb;

  .apply-button {
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    border: none;
    box-shadow: none;
  }
`;
export default DrawerHeaderStyled;
