export interface ChatMessage {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
  timestamp: number;
}

export interface AIAssistantSettings {
  isEnabled: boolean;
}

export interface AIAssistantContextValue {
  settings: AIAssistantSettings;
  updateSettings: (newSettings: Partial<AIAssistantSettings>) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
  error: string | null;
}
