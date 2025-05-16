import React from 'react';
import { SearchContainer, SearchInputStyled } from './search-input.style';

interface SearchInputProps {
  searchPlaceholder?: string;
  searchString: string;
  onSearch: (value: string) => void;
}

const SearchInputField = ({ searchPlaceholder, searchString, onSearch }: SearchInputProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <SearchContainer>
      <SearchInputStyled placeholder={searchPlaceholder} value={searchString} onChange={handleInputChange} />
    </SearchContainer>
  );
};

export default SearchInputField;
