import React from "react";
import { useAIAssistant } from "../../context/AIAssistantContext";
import { soundFx } from "../../utils/soundEffects";

export const AIAssistantFAB: React.FC = () => {
  const { settings, isChatOpen, setIsChatOpen } = useAIAssistant();

  // Hanya tampilkan jika diaktifkan
  if (!settings.isEnabled) {
    return null;
  }

  // Jika jendela chat sedang terbuka, sembunyikan FAB
  if (isChatOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <button
        id="ga-fab-website-guide-bot"
        type="button"
        aria-label="Tanya Bot Panduan Website"
        data-testid="mate-guide-fab"
        onClick={() => {
          soundFx.play("click");
          setIsChatOpen(true);
        }}
        className="group relative flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-black hover:bg-neutral-900 text-white border border-cyan-500/40 hover:border-cyan-400 shadow-xl shadow-cyan-950/40 transition-all duration-200 active:scale-95 cursor-pointer backdrop-blur-md"
      >
        {/* Avatar Wrap with Online indicator */}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 via-cyan-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-500/30 flex items-center justify-center shrink-0">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            <img
              src="/bot_geuwat_avatar.webp"
              alt="Bot Geuwat"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Badge Online */}
          <span
            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-black ring-1 ring-emerald-400/50 animate-pulse"
            aria-hidden="true"
          />
        </div>

        {/* Label and Subtitle */}
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs font-bold text-white tracking-wide">
            Panduan Website
          </span>
          <span className="text-[10px] text-white font-medium">
            Tanya Cara Pakai Fitur
          </span>
        </div>
      </button>
    </div>
  );
};
