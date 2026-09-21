import React from "react";
import { PresetTemplate } from "../../../types";
import { soundFx } from "../../../utils/soundEffects";

interface PresetItemCardProps {
  preset: PresetTemplate;
  onSelect: (preset: PresetTemplate) => void;
  getPresetNoteCount: (p: PresetTemplate) => number;
  getLayoutLabel: (layout: string) => string;
}

export const PresetItemCard: React.FC<PresetItemCardProps> = ({
  preset,
  onSelect,
  getPresetNoteCount,
  getLayoutLabel,
}) => {
  const noteCount = getPresetNoteCount(preset);
  const isUmum = preset.folder === "Umum";
  const totalBadges = 3 + (preset.suggestedGroupingStrategy ? 1 : 0) + (preset.folder ? 1 : 0);
  const isDense = totalBadges >= 4;

  return (
    <button
      type="button"
      onClick={() => {
        soundFx.play("click");
        onSelect(preset);
      }}
      className="w-full max-w-full text-left p-3 sm:p-3.5 rounded-xl bg-black hover:bg-neutral-950 text-white flex flex-col gap-1.5 transition-all duration-150 border border-cyan-500/30 hover:border-cyan-400 cursor-pointer group shadow-sm box-border"
    >
      <div className="flex items-center justify-between gap-2 max-w-full">
        <span className="font-semibold text-white group-hover:text-cyan-300 transition-colors text-xs sm:text-sm truncate">
          {preset.title}
        </span>
        {noteCount > 0 && (
          <span className="shrink-0 inline-flex items-center gap-1 text-[9px] sm:text-[10px] text-white bg-black border border-cyan-500/40 px-1.5 py-0.5 rounded font-medium">
            📝 {noteCount} Catatan
          </span>
        )}
      </div>

      <span className="text-[10.5px] sm:text-[11px] text-white leading-snug line-clamp-2 break-words">
        {preset.subtitle}
      </span>

      <div
        className={`w-full flex flex-wrap items-center text-white pt-1 ${
          isDense
            ? "gap-1 text-[7.5px] sm:text-[8.5px]"
            : "gap-1.5 text-[8.5px] sm:text-[9.5px]"
        }`}
      >
        <span
          className={`bg-black rounded border border-cyan-500/30 text-white whitespace-nowrap leading-tight shrink-0 ${
            isDense ? "px-1.5 py-0.5 text-[7.5px] sm:text-[8.5px]" : "px-2 py-0.5 text-[8.5px] sm:text-[9.5px]"
          }`}
        >
          {preset.names.length} item
        </span>
        <span
          className={`bg-black rounded border border-cyan-500/30 text-white whitespace-nowrap leading-tight shrink-0 ${
            isDense ? "px-1.5 py-0.5 text-[7.5px] sm:text-[8.5px]" : "px-2 py-0.5 text-[8.5px] sm:text-[9.5px]"
          }`}
        >
          📐 {getLayoutLabel(preset.suggestedLayout)}
        </span>
        <span
          className={`bg-black rounded border border-cyan-500/30 capitalize text-white whitespace-nowrap leading-tight shrink-0 ${
            isDense ? "px-1.5 py-0.5 text-[7.5px] sm:text-[8.5px]" : "px-2 py-0.5 text-[8.5px] sm:text-[9.5px]"
          }`}
        >
          🎨 {preset.suggestedTheme}
        </span>
        {preset.suggestedGroupingStrategy && (
          <span
            className={`bg-black rounded border border-cyan-500/30 text-white whitespace-nowrap leading-tight shrink-0 ${
              isDense ? "px-1.5 py-0.5 text-[7.5px] sm:text-[8.5px]" : "px-2 py-0.5 text-[8.5px] sm:text-[9.5px]"
            }`}
          >
            {preset.suggestedGroupingStrategy === "flat-direct"
              ? "⚡ Spoke Langsung"
              : preset.suggestedGroupingStrategy === "balanced-spokes"
              ? preset.customConfig?.balancedBranchPrefix
                ? `⚖️ ${preset.customConfig.balancedBranchCount || 4} ${preset.customConfig.balancedBranchPrefix}`
                : "⚖️ Terbagi Seimbang"
              : "🔤 Abjad A-Z"}
          </span>
        )}
        <span
          className={`rounded border font-mono uppercase tracking-wider text-white bg-black border-cyan-500/40 whitespace-nowrap shrink-0 leading-tight ${
            isDense
              ? "px-1.5 py-0.5 text-[7px] sm:text-[8px]"
              : "px-1.5 py-0.5 text-[8px] sm:text-[8.5px]"
          }`}
        >
          {preset.folder}
        </span>
      </div>
    </button>
  );
};
