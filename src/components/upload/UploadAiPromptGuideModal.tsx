import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";
import { copyToClipboard } from "../../utils/clipboardHelper";
import {
  GEMINI_PROMPT_TEMPLATE,
  SAMPLE_JSON,
  PromptGuideStepsGrid,
  PromptGuideTabContent,
  PromptGuideTabSelector,
} from "./aiPromptGuide";

interface UploadAiPromptGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadAiPromptGuideModal: React.FC<UploadAiPromptGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<"prompt" | "json">("prompt");

  if (!isOpen) return null;

  const handleCopyPrompt = async () => {
    soundFx.play("click");
    const success = await copyToClipboard(GEMINI_PROMPT_TEMPLATE);
    if (success) {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2500);
    }
  };

  const handleCopyJson = async () => {
    soundFx.play("click");
    const success = await copyToClipboard(SAMPLE_JSON);
    if (success) {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2500);
    }
  };

  const handleTabChange = (tab: "prompt" | "json") => {
    soundFx.play("click");
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-2xl bg-black border border-cyan-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ring-1 ring-cyan-500/30">
        {/* Header Modal */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-cyan-500/30 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                Petunjuk Ekstrak Materi via Gemini AI
              </h2>
              <p className="text-[11px] text-neutral-400">
                Ubah materi Word, PDF, atau artikel menjadi Mind Map JSON siap impor
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundFx.play("click");
              onClose();
            }}
            title="Tutup panduan"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-xs text-neutral-200">
          {/* 3 Langkah Mudah */}
          <PromptGuideStepsGrid />

          {/* Tab Selector: Prompt vs Format JSON */}
          <PromptGuideTabSelector
            activeTab={activeTab}
            onTabChange={handleTabChange}
            copiedPrompt={copiedPrompt}
            copiedJson={copiedJson}
            onCopyPrompt={handleCopyPrompt}
            onCopyJson={handleCopyJson}
          />

          {/* Area Konten Aktif */}
          <PromptGuideTabContent activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};
