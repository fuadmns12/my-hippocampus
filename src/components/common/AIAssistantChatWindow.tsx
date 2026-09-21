import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAIAssistant } from "../../context/AIAssistantContext";
import { ChatMarkdownText } from "./ChatMarkdownText";
import { AIChatHeader } from "./aiChat/AIChatHeader";
import { AIChatQuickQuestions } from "./aiChat/AIChatQuickQuestions";
import { AIChatInputFooter } from "./aiChat/AIChatInputFooter";
import { ConfirmDeleteModal } from "../modals/ConfirmDeleteModal";

export const AIAssistantChatWindow: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    messages,
    sendMessage,
    clearChat,
    isLoading,
  } = useAIAssistant();

  const [inputText, setInputText] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen, isLoading]);

  // Focus input when open
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isChatOpen]);

  if (!isChatOpen) {
    return null;
  }

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) {
      return;
    }

    setInputText("");
    await sendMessage(text);
  };

  return (
    <>
      <div
        id="website-guide-bot-chat-modal"
        className="fixed bottom-4 right-4 z-50 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-black border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <AIChatHeader
          onClearChat={() => setShowClearConfirm(true)}
          onClose={() => setIsChatOpen(false)}
        />

        {/* Quick FAQ Chips */}
        <AIChatQuickQuestions
          isLoading={isLoading}
          onSelectQuestion={(q) => handleSend(q)}
        />

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            const isSystem = msg.sender === "system";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isUser
                    ? "items-end"
                    : isSystem
                    ? "items-center"
                    : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? "bg-cyan-950/80 text-cyan-100 border border-cyan-500/40 shadow-sm"
                      : isSystem
                      ? "bg-black text-white text-[11px] border border-cyan-500/20 text-center"
                      : "bg-black text-white border border-neutral-800 shadow-sm"
                  }`}
                >
                  <ChatMarkdownText content={msg.text} />
                </div>
                <span className="text-[9px] text-neutral-500 px-1 mt-1 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-white p-2 bg-black border border-neutral-800 rounded-xl w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Mencari jawaban di panduan website...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Footer Input Area */}
        <AIChatInputFooter
          inputText={inputText}
          setInputText={setInputText}
          isLoading={isLoading}
          onSend={() => handleSend()}
          inputRef={inputRef}
        />
      </div>

      {/* Popup Konfirmasi Bersihkan Obrolan */}
      <ConfirmDeleteModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearChat();
          setShowClearConfirm(false);
        }}
        title="Bersihkan Obrolan"
        description="Apakah Anda yakin ingin menghapus semua percakapan panduan website ini?"
        confirmLabel="BERSIHKAN OBROLAN"
      />
    </>
  );
};
