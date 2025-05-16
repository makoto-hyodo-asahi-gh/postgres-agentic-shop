import styled from 'styled-components';

const DropdownMenuStyled = styled.div`
  .ant-dropdown-trigger {
    cursor: pointer;
    background-color: ${(props) => props.theme.colors.background};
    padding: 0.5rem 1rem;
    border-radius: 5rem;
    font-size: 0.875rem;
    color: ${(props) => props.theme.colors.text};
  }
  .ant-space-item {
    height: 1rem;
  }
`;
export default DropdownMenuStyled;
