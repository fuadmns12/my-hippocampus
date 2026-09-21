import React from "react";
import { FileText, Code2, Copy, Check } from "lucide-react";

interface PromptGuideTabSelectorProps {
  activeTab: "prompt" | "json";
  onTabChange: (tab: "prompt" | "json") => void;
  copiedPrompt: boolean;
  copiedJson: boolean;
  onCopyPrompt: () => void;
  onCopyJson: () => void;
}

export const PromptGuideTabSelector: React.FC<PromptGuideTabSelectorProps> = ({
  activeTab,
  onTabChange,
  copiedPrompt,
  copiedJson,
  onCopyPrompt,
  onCopyJson,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onTabChange("prompt")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "prompt"
              ? "bg-black text-white border border-cyan-400 shadow-xs"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span className={activeTab === "prompt" ? "text-white" : ""}>Prompt untuk Gemini AI</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange("json")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === "json"
              ? "bg-black text-white border border-cyan-400 shadow-xs"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent"
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className={activeTab === "json" ? "text-white" : ""}>Struktur Contoh JSON</span>
        </button>
      </div>

      {activeTab === "prompt" ? (
        <button
          type="button"
          id="btn-copy-gemini-prompt"
          onClick={onCopyPrompt}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          {copiedPrompt ? (
            <>
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              <span>PROMPT TERSALIN!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>SALIN PROMPT</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          id="btn-copy-sample-json"
          onClick={onCopyJson}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide bg-black text-white border border-cyan-500/40 hover:bg-neutral-900 hover:border-cyan-400 hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
        >
          {copiedJson ? (
            <>
              <Check className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON TERSALIN!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>SALIN CONTOH JSON</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};
