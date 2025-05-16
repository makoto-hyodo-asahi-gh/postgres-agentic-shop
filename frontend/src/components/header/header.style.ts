import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  background-color: ${(props) => props.theme.colors.white};
`;

export const Container = styled.div`
  max-width: 75rem;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const Logo = styled.a`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
`;

export const DebugMode = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${(props) => props.theme.colors.text};
  background: ${(props) => props.theme.colors.background};
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: none;
  cursor: pointer;

  &:hover {
    border: 1px solid ${(props) => props.theme.colors.primary};
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  margin: 0 1rem;
  max-width: 50rem;
`;

export const SearchForm = styled.form`
  display: flex;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${(props) => props.theme.colors.border};
  border-right: none;
  border-radius: 0.25rem 0 0 0.25rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};
  background-color: ${(props) => props.theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.text};
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.secondary};
  }
`;

export const SearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #434343;
  color: ${(props) => props.theme.colors.white};
  border: none;
  border-radius: 0 0.25rem 0.25rem 0;
  padding: 0 1rem;
  cursor: pointer;
`;
export const InfoMessageContainer = styled.div`
  display: flex;
  align-items: center;
  column-gap: 6px;
  font-size: 14px;
  position: absolute;
  margin-top: 12px;
  background-color: #2dc07110;
  padding: 6px;
  border-radius: 25px;
  min-width: 300px;
  border: 1px solid #2dc071;
`;
