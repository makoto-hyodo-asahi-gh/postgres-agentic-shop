import styled from 'styled-components';

export const ChatContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: ${(props) => (props.isOpen ? '1.25rem' : '-37.5rem')};
  right: 1.25rem;
  width: 31.25rem;
  height: 28.125rem;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1.25rem rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 10;
  transition: bottom 0.3s ease-in-out;
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1rem;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`;

export const ChatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  color: ${(props) => props.theme.colors.text};
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
`;

export const ChatMessages = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Message = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 0.625rem 1.5rem;
  border-radius: 1rem;
  background: ${(props) =>
    props.$isUser
      ? props.theme.colors.primary
      : `linear-gradient(
    298deg,
    rgba(154, 0, 205, -5.9) 0%,
    rgba(11, 66, 204, 0.1) 50%,
    rgba(0, 192, 164, 0.1) 100%
  )`};
  color: ${(props) => (props.$isUser ? props.theme.colors.white : props.theme.colors.text)};
  align-self: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
  box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.1);
`;

export const ChatInputContainer = styled.div`
  display: flex;
  padding: 0.75rem 1rem;
  background-color: ${(props) => props.theme.colors.white};
  position: relative;
`;

export const ChatInput = styled.textarea`
  width: 100%;
  padding: 1rem 3.125rem 1rem 1rem;
  border-radius: 0.75rem;
  outline: none;
  font-size: 0.9375rem;
  resize: none;
  min-height: 3.5rem;
  max-height: 9.375rem;
  line-height: 1.5;
  color: ${(props) => props.theme.colors.text};
  font-family: inherit;
  overflow-y: hidden;
  box-sizing: border-box;

  &::placeholder {
    color: ${(props) => props.theme.colors.secondary};
  }

  &:focus {
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

export const SendButton = styled.button`
  background-color: transparent;
  color: ${(props) => props.theme.colors.text};
  border: none;
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  &:hover {
    background-color: ${(props) => props.theme.colors.primaryDark};
    color: ${(props) => props.theme.colors.white};
  }
`;
