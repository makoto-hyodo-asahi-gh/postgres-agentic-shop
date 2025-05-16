import styled from 'styled-components';

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 0.375rem;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.background};
    border-radius: 0.625rem;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border};
    border-radius: 0.625rem;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) => props.theme.colors.secondary};
  }
`;

export const UserMessage = styled.div`
  align-self: flex-end;
  background-color: ${(props) => props.theme.colors.lightGreen};
  color: ${(props) => props.theme.colors.text};
  padding: 1rem;
  border-radius: 0.5rem;
  max-width: 80%;
  word-break: break-word;
`;

export const AssistantMessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  max-width: 75%;
  background: ${(props) => props.theme.colors.lightGradient};
  border-radius: 0.5rem;
  padding: 1rem 2rem 1rem 0.375rem;
`;

export const AssistantIcon = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.primary};
  flex-shrink: 0;
`;

export const AssistantMessage = styled.div`
  color: ${(props) => props.theme.colors.text};
  padding: 0.5rem 0;
  word-break: break-word;
  width: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  position: relative;
  margin-top: 1rem;
`;

export const ChatInput = styled.input`
  width: 100%;
  padding: 1rem;
  border: 0.0625rem solid ${(props) => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.text};
  }
`;

export const SendButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
`;
