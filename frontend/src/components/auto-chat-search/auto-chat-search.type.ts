import { Product } from 'pages/products-view/product-listing/product-listing.types';

export interface ChatResponse {
  agent_action?: string;
  products?: Product[];
  redirect_url?: string;
  message?: string;
}
export type MessageType = {
  id: string;
  content: string | JSX.Element;
  role: 'user' | 'assistant';
  isLoading?: boolean;
};

export interface ChatInterfaceProps {
  onClose?: () => void;
}

export interface ChildRefHandle {
  handleSubmit: (val: string) => void;
}
export interface ChatSearchInterfaceRef {
  handleSubmit: (inputString: string) => Promise<void>;
}
