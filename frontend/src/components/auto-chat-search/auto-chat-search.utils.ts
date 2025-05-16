import { MessageType } from './auto-chat-search.type';

// place in utils
const setMessageLoading = (prev: MessageType[], id: string, updatedMessage: MessageType, loadingState: boolean) => {
  const updatedMessages = prev.map((message) => {
    if (message.id === id && message.role === 'assistant') {
      return { ...message, isLoading: loadingState, ...updatedMessage };
    }
    return message;
  });
  return updatedMessages;
};
export default setMessageLoading;
