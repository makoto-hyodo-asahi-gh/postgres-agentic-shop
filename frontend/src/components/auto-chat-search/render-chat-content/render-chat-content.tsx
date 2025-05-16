import React, { useEffect, useRef } from 'react';
import { SendOutlined } from '@ant-design/icons';
import { AIIcon } from 'constants/icon-svgs';
import {
  AssistantIcon,
  AssistantMessage,
  AssistantMessageContainer,
  ChatInput,
  InputContainer,
  MessageContainer,
  SendButton,
  UserMessage,
} from './render-chat-content.style';
import { MessageType } from '../auto-chat-search.type';

interface RenderChatContentProps {
  messages: MessageType[];
  onClose?: () => void;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (inputString: string) => Promise<void>;
}
// Chat content that's shared between both views
const RenderChatContent = ({ messages, onClose, inputValue, setInputValue, handleSubmit }: RenderChatContentProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Close the chat when clicking outside the MessageContainer with a 20px buffer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatContainerRef.current) {
        const rect = chatContainerRef.current.getBoundingClientRect();
        const buffer = 150;

        // Check if the click is outside the element plus buffer area
        const isOutside =
          event.clientX < rect.left - 0 ||
          event.clientX > rect.right + 0 ||
          event.clientY < rect.top - buffer ||
          event.clientY > rect.bottom + buffer;

        if (isOutside) {
          onClose?.(); // Call the onClose prop to close the chat
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  // This effect runs whenever the messages array changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <MessageContainer ref={chatContainerRef}>
        {messages.map((message) =>
          message.role === 'user' ? (
            <UserMessage key={message.id}>{message.content}</UserMessage>
          ) : (
            <AssistantMessageContainer key={message.id}>
              <AssistantIcon>
                <AIIcon />
              </AssistantIcon>
              {message.isLoading ? '...' : <AssistantMessage>{message.content}</AssistantMessage>}
            </AssistantMessageContainer>
          ),
        )}
      </MessageContainer>

      <form>
        <InputContainer>
          <ChatInput
            type="text"
            placeholder="Ask a follow-up question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <SendButton type="submit" disabled={!inputValue.trim()} onClick={() => handleSubmit(inputValue)}>
            <SendOutlined />
          </SendButton>
        </InputContainer>
      </form>
    </>
  );
};
export default RenderChatContent;
