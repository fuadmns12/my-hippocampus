import React from "react";
import { Send } from "lucide-react";

interface AIChatInputFooterProps {
  inputText: string;
  setInputText: (val: string) => void;
  isLoading: boolean;
  onSend: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export const AIChatInputFooter: React.FC<AIChatInputFooterProps> = ({
  inputText,
  setInputText,
  isLoading,
  onSend,
  inputRef,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 bg-black border-t border-neutral-800 flex flex-col gap-2">
      <div className="flex items-end gap-2 bg-black border border-neutral-800 focus-within:border-cyan-500/60 rounded-xl p-1.5 transition-colors">
        <textarea
          ref={inputRef}
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tanyakan cara menggunakan website ini..."
          className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 resize-none outline-none px-2 py-1 leading-relaxed max-h-24"
        />

        <button
          type="button"
          disabled={!inputText.trim() || isLoading}
          onClick={onSend}
          title="Kirim Pertanyaan"
          aria-label="Kirim Pertanyaan"
          className="p-2 rounded-lg bg-black border border-cyan-500 hover:bg-neutral-900 text-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[10px] text-neutral-500 px-1">
        <span>Tekan <b>Enter</b> untuk kirim • <b>Shift+Enter</b> baris baru</span>
        <span className="text-white">Panduan Khusus Website</span>
      </div>
    </div>
  );
};
