import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  ChatMessage,
  AIAssistantSettings,
  AIAssistantContextValue,
} from "../types/aiAssistant";
import { generateGuideResponse } from "../services/aiAssistantService";
import { soundFx } from "../utils/soundEffects";

const STORAGE_KEY_SETTINGS = "my_hippocampus_website_guide_settings";
const STORAGE_KEY_MESSAGES = "my_hippocampus_website_guide_messages";

const DEFAULT_SETTINGS: AIAssistantSettings = {
  isEnabled: true,
};

const INITIAL_GREETING: ChatMessage = {
  id: "greeting-1",
  sender: "assistant",
  text: "Halo! Saya **Bot Panduan Website** My Hippocampus. Saya siap menjawab pertanyaan Anda tentang cara menggunakan website ini, seperti cara membuat mind map, memilih tata letak & tema warna, ekspor data, mengelola catatan cabang, memutar musik latar, hingga tombol pintasan keyboard. Ada yang ingin Anda tanyakan seputar penggunaan website ini?",
  timestamp: Date.now(),
};

const AIAssistantContext = createContext<AIAssistantContextValue | null>(null);

interface AIAssistantProviderProps {
  children: ReactNode;
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({
  children,
}) => {
  // Load settings from localStorage
  const [settings, setSettings] = useState<AIAssistantSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Load chat messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return [INITIAL_GREETING];
  });

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore storage errors
    }
  }, [settings]);

  // Persist messages (max 50)
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_MESSAGES,
        JSON.stringify(messages.slice(-50))
      );
    } catch {
      // Ignore
    }
  }, [messages]);

  const updateSettings = useCallback(
    (newSettings: Partial<AIAssistantSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
    },
    []
  );

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: `greeting-${Date.now()}`,
        sender: "assistant",
        text: "Riwayat percakapan telah dibersihkan. Ada pertanyaan lain seputar cara menggunakan website ini?",
        timestamp: Date.now(),
      },
    ]);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setError(null);

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: text.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      soundFx.play("click");

      try {
        const response = await generateGuideResponse(text.trim());

        const botMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          text: response.replyText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, botMsg]);
        soundFx.play("success");
      } catch (err: any) {
        const errMsg = err.message || "Gagal memproses pertanyaan Anda.";
        setError(errMsg);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "system",
            text: `⚠️ Kendala: ${errMsg}`,
            timestamp: Date.now(),
          },
        ]);
        soundFx.play("toggle");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const value: AIAssistantContextValue = {
    settings,
    updateSettings,
    isChatOpen,
    setIsChatOpen,
    messages,
    sendMessage,
    clearChat,
    isLoading,
    error,
  };

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
};

export const useAIAssistant = (): AIAssistantContextValue => {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error(
      "useAIAssistant must be used within an AIAssistantProvider"
    );
  }
  return context;
};
