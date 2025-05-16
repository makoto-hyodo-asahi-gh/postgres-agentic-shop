export interface ChatMessage {
  id: number;
  text: string;
  isUser: boolean;
}

export interface ChatInterfaceProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productId?: string;
}
