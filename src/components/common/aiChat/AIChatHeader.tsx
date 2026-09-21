import React from "react";
import { Trash2, Eye } from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";

interface AIChatHeaderProps {
  onClearChat: () => void;
  onClose: () => void;
}

export const AIChatHeader: React.FC<AIChatHeaderProps> = ({
  onClearChat,
  onClose,
}) => {
  return (
    <div className="px-4 py-3 bg-black border-b border-neutral-800 flex items-center justify-between gap-2 select-none">
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-cyan-500 to-emerald-400 p-0.5 flex items-center justify-center shrink-0 shadow-sm">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            <img
              src="/bot_geuwat_avatar.webp"
              alt="Bot Geuwat"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-neutral-950" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-bold text-white tracking-wide">
              Bot Panduan Website
            </h3>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black text-white border border-cyan-500/30">
              PANDUAN
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 leading-tight">
            Khusus panduan cara pakai website ini
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Bersihkan Percakapan"
          aria-label="Bersihkan Percakapan"
          onClick={() => {
            soundFx.play("click");
            onClearChat();
          }}
          className="p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
        </button>
        <button
          type="button"
          title="Tutup"
          aria-label="Tutup Chat"
          onClick={() => {
            soundFx.play("click");
            onClose();
          }}
          className="p-1.5 rounded-lg bg-black border border-cyan-400 hover:border-cyan-300 text-cyan-400 hover:text-cyan-300 hover:bg-neutral-900 transition-colors cursor-pointer shadow-xs flex items-center justify-center"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </div>
  );
};
