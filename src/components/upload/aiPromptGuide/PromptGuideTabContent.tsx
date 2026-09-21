import React from "react";
import { GEMINI_PROMPT_TEMPLATE, SAMPLE_JSON } from "./promptGuideTemplates";

interface PromptGuideTabContentProps {
  activeTab: "prompt" | "json";
}

export const PromptGuideTabContent: React.FC<PromptGuideTabContentProps> = ({
  activeTab,
}) => {
  if (activeTab === "prompt") {
    return (
      <div className="space-y-2">
        <div className="px-3 py-2 rounded-xl bg-black border border-cyan-500/40 flex items-center justify-between text-[11px] shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-white">Peran AI:</span>
            <span className="font-semibold text-white">
              Senior Information Architect & Mind Map Specialist
            </span>
          </div>
          <span className="text-[10px] text-neutral-300 hidden sm:inline">
            Struktur hierarki presisi & kaya konteks
          </span>
        </div>
        <div className="relative">
          <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl max-h-72 overflow-y-auto font-mono text-[11px] text-neutral-300 leading-relaxed whitespace-pre-wrap select-text">
            {GEMINI_PROMPT_TEMPLATE}
          </div>
          <p className="mt-2 text-[11px] text-neutral-400">
            💡 <strong className="text-cyan-300">Tips:</strong> Di Gemini, Anda cukup menempelkan teks ini lalu melampirkan file dokumen materi Anda (Word / PDF) atau menempelkan teks dokumen tepat di bagian bawah prompt.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl max-h-72 overflow-y-auto font-mono text-[11px] text-cyan-300/90 leading-relaxed whitespace-pre select-text">
        {SAMPLE_JSON}
      </div>
      <p className="mt-2 text-[11px] text-neutral-400">
        💡 Format ini 100% didukung parser unggahan. Komponen <code className="text-white">notes</code> otomatis dimuat ke dalam kartu catatan setiap node.
      </p>
    </div>
  );
};
