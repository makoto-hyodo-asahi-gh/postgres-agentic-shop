import React, { useState, useEffect } from 'react';
import { ExpandOutlined, DeleteOutlined, MinusOutlined } from '@ant-design/icons';
import { postWithUserId } from 'services/api-callers';
import { SEARCH_API } from 'constants/api-urls';
import { useParams } from 'react-router-dom';
import {
  ChatContainer,
  CloseButton,
  SidePanelContainer,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelTitle,
  UtilityButton,
  UtilityButtons,
  UtilityContainer,
} from './auto-chat-search.style';
import { ChatInterfaceProps, ChatResponse, MessageType } from './auto-chat-search.type';
import ProductSuggestions from './product-suggestions-list/product-suggestions-list';
import RenderChatContent from './render-chat-content/render-chat-content';
import setMessageLoading from './auto-chat-search.utils';

const ChatSearchInterface = React.forwardRef(({ onClose }: ChatInterfaceProps, ref: React.Ref<unknown> | undefined) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { productId } = useParams();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (inputString = '') => {
    if (!inputString.trim()) return;

    const id = Date.now().toString();

    // Add user message immediately and completely
    const newUserMessage = [
      {
        id,
        content: inputString,
        role: 'user' as const,
      },
      {
        id,
        content: '...',
        role: 'assistant' as const,
        isLoading: true,
      },
    ];

    setMessages((prev) => [...prev, ...newUserMessage]);
    setInputValue('');

    const body = { product_id: productId, user_message: inputString };

    try {
      const response: ChatResponse = await postWithUserId(SEARCH_API, body);

      // Create the appropriate message content based on agent action
      let messageContent: string | JSX.Element = response?.message || 'No message available';

      if (response?.agent_action === 'product_search') {
        messageContent = (
          <ProductSuggestions
            title="Product Suggestions"
            products={response?.products || []}
            onViewMore={() => window.open(response?.redirect_url ?? '/products', '_blank')}
          />
        );
      }

      // Update messages with the appropriate content
      setMessages((prev) => [
        ...setMessageLoading(
          prev,
          id,
          {
            id: Date.now().toString(),
            content: messageContent,
            role: 'assistant',
          },
          false,
        ),
      ]);

      // Additional handling for personalization if needed
      if (response?.agent_action === 'personalization') {
        // Handle personalization action by accepting the SSE event here
      }
    } catch (error) {
      setMessages((prev) => [
        ...setMessageLoading(
          prev,
          id,
          {
            id: Date.now().toString(),
            content: String(error) || 'Failed to fetch response. Please try again later.',
            role: 'assistant',
          },
          false,
        ),
      ]);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  // Expose handleSubmit to parent via ref
  React.useImperativeHandle(ref, () => ({
    handleSubmit,
  }));

  const chatContainerRef = React.useRef<HTMLDivElement>(null);

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
  // Dropdown view
  const renderDropdownChat = () => (
    <ChatContainer ref={chatContainerRef}>
      <RenderChatContent
        messages={messages}
        onClose={onClose}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
      />

      <UtilityContainer>
        <UtilityButtons>
          <UtilityButton aria-label="Expand" onClick={toggleExpand}>
            <ExpandOutlined />
          </UtilityButton>
          <UtilityButton aria-label="Clear chat" onClick={handleClearChat}>
            <DeleteOutlined />
          </UtilityButton>
        </UtilityButtons>
        {/* <MemoryStatus>Memory Updated</MemoryStatus> */}
      </UtilityContainer>
    </ChatContainer>
  );

  // Side panel view
  const renderSidePanel = () => {
    if (!isMounted) return null;

    return (
      <SidePanelContainer>
        <SidePanelHeader>
          <SidePanelTitle>Chat</SidePanelTitle>
          <CloseButton onClick={toggleExpand}>
            <MinusOutlined />
          </CloseButton>
        </SidePanelHeader>

        <SidePanelContent ref={chatContainerRef}>
          <RenderChatContent
            messages={messages}
            onClose={onClose}
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={handleSubmit}
          />
        </SidePanelContent>

        <SidePanelFooter>
          <UtilityContainer>
            <UtilityButtons>
              <UtilityButton aria-label="Clear chat" onClick={handleClearChat}>
                <DeleteOutlined />
              </UtilityButton>
            </UtilityButtons>
            {/* <MemoryStatus>Memory Updated</MemoryStatus> */}
          </UtilityContainer>
        </SidePanelFooter>
      </SidePanelContainer>
    );
  };

  return (
    <>
      {!isExpanded && renderDropdownChat()}
      {isExpanded && renderSidePanel()}
    </>
  );
});

export default ChatSearchInterface;
