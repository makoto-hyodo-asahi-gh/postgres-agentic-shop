/* eslint-disable no-constant-condition */
import React, { useState, useRef, useEffect } from 'react';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import { AIIcon } from 'constants/icon-svgs';
import ReactMarkdown from 'react-markdown';
import { BASE_URL } from 'constants/constants';
import { SEARCH_API } from 'constants/api-urls';
import { getUserIdFromSession } from 'utils/common-functions';
import {
  ChatContainer,
  ChatHeader,
  ChatInput,
  ChatInputContainer,
  ChatMessages,
  ChatTitle,
  HeaderActions,
  IconButton,
  Message,
  SendButton,
} from './chat-interface.style';
import { ChatInterfaceProps, ChatMessage } from './chat-interface.types';

const ChatInterface = ({ isOpen, setIsOpen, productId }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Retrieve userId from sessionStorage
  const userId = getUserIdFromSession();

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      // Set initial height based on any default content
      const target = inputRef.current;
      target.style.height = 'auto';
      target.style.height = `${Math.min(target.scrollHeight + 2, 150)}px`;
    }
  }, [inputValue]);
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage: ChatMessage = {
        id: messages.length + 1,
        text: inputValue,
        isUser: true,
      };

      setMessages([...messages, userMessage]);
      setInputValue('');

      const botMessage: ChatMessage = {
        id: messages.length + 2,
        text: '',
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);

      try {
        const response = await fetch(`${BASE_URL}${SEARCH_API}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId, product_id: productId, user_message: userMessage.text }),
        });

        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1] = {
              ...updatedMessages[updatedMessages.length - 1],
              text: updatedMessages[updatedMessages.length - 1].text + chunk,
            };
            return updatedMessages;
          });
        }
      } catch (error) {
        console.error('Error fetching response:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Auto-resize textarea based on content
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { target } = e;
    setInputValue(target.value);

    // Reset height to auto to get the correct scrollHeight
    target.style.height = 'auto';

    // Set the height to scrollHeight to fit the content
    // Add a small buffer (2px) to prevent slight scrolling in some browsers
    target.style.height = `${Math.min(target.scrollHeight + 2, 150)}px`;
  };

  return (
    <ChatContainer isOpen={isOpen}>
      <ChatHeader>
        <ChatTitle>
          <AIIcon />
          What are you looking for on this page?
        </ChatTitle>
        <HeaderActions>
          <IconButton onClick={toggleChat}>
            <CloseOutlined />
          </IconButton>
        </HeaderActions>
      </ChatHeader>

      <>
        <ChatMessages>
          {messages.map((message) => (
            <Message key={message.id} $isUser={message.isUser}>
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </Message>
          ))}
          <div ref={messagesEndRef} />
        </ChatMessages>

        <ChatInputContainer>
          <ChatInput
            ref={inputRef}
            placeholder="Ask me anything about this page..."
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyPress}
          />
          <SendButton onClick={handleSendMessage}>
            <SendOutlined />
          </SendButton>
        </ChatInputContainer>
      </>
    </ChatContainer>
  );
};

export default ChatInterface;
