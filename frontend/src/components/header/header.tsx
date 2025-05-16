import React from 'react';
import { SettingOutlined } from '@ant-design/icons';
import { DebugModeIcon } from 'constants/icon-svgs';
// import ChatSearchInterface from 'components/auto-chat-search/auto-chat-search';
// import { ChildRefHandle } from 'components/auto-chat-search/auto-chat-search.type';
import {
  Container,
  DebugMode,
  InfoMessageContainer,
  Logo,
  SearchButton,
  SearchContainer,
  SearchForm,
  SearchInput,
} from './header.style';

interface HeaderProps {
  logo: string | React.ReactNode;
  buttonLabel: string;
  onButtonClick: () => void;
  handleSearch?: (e: React.FormEvent, searchQuery: string) => void;
  infoMessage?: { successMessage?: string; streamingMessage?: string; memoryMessage?: string; icon?: JSX.Element };
  initialSearchString?: string;
}

const Header: React.FC<HeaderProps> = ({
  logo,
  buttonLabel,
  onButtonClick,
  handleSearch,
  infoMessage,
  initialSearchString,
}) => {
  const [searchQuery, setSearchQuery] = React.useState(initialSearchString || '');

  React.useEffect(() => {
    if (initialSearchString !== undefined) {
      setSearchQuery(initialSearchString);
    }
  }, [initialSearchString]);

  return (
    <Container>
      <Logo href="/products">{logo}</Logo>

      <SearchContainer>
        <SearchForm onSubmit={(e) => handleSearch && handleSearch(e, searchQuery)}>
          <SearchInput
            placeholder="Search products or generate personalized content"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit" aria-label="Search">
            <SettingOutlined />
          </SearchButton>
        </SearchForm>
        {/* {showChat && <ChatSearchInterface ref={chatRef} onClose={handleCloseChat} />} */}
        {infoMessage?.successMessage && (
          <InfoMessageContainer>
            {infoMessage.icon && infoMessage.icon}
            {infoMessage?.successMessage}
            {infoMessage?.memoryMessage}
          </InfoMessageContainer>
        )}
      </SearchContainer>

      <DebugMode onClick={onButtonClick}>
        <DebugModeIcon />
        <span>{buttonLabel}</span>
      </DebugMode>
    </Container>
  );
};

export default Header;
