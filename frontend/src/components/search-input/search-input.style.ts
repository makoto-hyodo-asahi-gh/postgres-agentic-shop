import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';

export const SearchContainer = styled.div`
  flex: 1;
  max-width: 37.5rem;
  position: relative;
`;

export const SearchInputStyled = styled.input`
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0.25rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const SearchIcon = styled(SearchOutlined)`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${(props) => props.theme.colors.white};
`;
