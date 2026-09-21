import React from "react";
import { Trash2 } from "lucide-react";
import { soundFx } from "../../utils/soundEffects";

interface HistoryDrawerFooterProps {
  totalCount: number;
  onClearAllHistory: () => void;
}

export const HistoryDrawerFooter: React.FC<HistoryDrawerFooterProps> = ({
  totalCount,
  onClearAllHistory,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="p-4 border-t border-cyan-500/30 bg-black flex justify-between items-center text-xs text-white select-none">
      <span className="text-white text-[11px]">
        Total: <strong className="text-white font-mono">{totalCount}</strong> Mind Map Tersimpan
      </span>
      <button
        type="button"
        onClick={() => {
          soundFx.play("delete");
          onClearAllHistory();
        }}
        className="p-2 rounded-xl bg-black text-red-500 hover:text-red-400 border border-red-500/50 hover:border-red-400 hover:bg-red-950/40 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center"
        title="Kosongkan Semua Mind Map"
        aria-label="Kosongkan Semua Mind Map"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
};
