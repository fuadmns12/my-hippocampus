import React from "react";
import { Plus } from "lucide-react";
import {
  MUSIC_PRESETS,
  MusicPreset,
} from "../../../utils/youtubeHelper";
import { soundFx } from "../../../utils/soundEffects";

interface YouTubePresetsGridProps {
  activePresetId: string | null;
  videoId: string | null;
  loadPreset: (preset: MusicPreset) => void;
  onAddPresetToPlaylist: (preset: MusicPreset, e: React.MouseEvent) => void;
}

export const YouTubePresetsGrid: React.FC<YouTubePresetsGridProps> = ({
  activePresetId,
  videoId,
  loadPreset,
  onAddPresetToPlaylist,
}) => {
  return (
    <div className="space-y-2 pt-1 border-t border-neutral-800/80">
      <div className="flex items-center justify-between text-[11px] text-neutral-400">
        <span className="font-semibold text-neutral-300">
          Rekomendasi Musik Fokus:
        </span>
        <span className="text-[10px] text-neutral-500 hidden sm:inline">
          Klik kartu untuk memutar, atau klik (+) untuk menyimpan ke playlist
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MUSIC_PRESETS.map((preset) => {
          const isSelected =
            activePresetId === preset.id || videoId === preset.videoId;
          return (
            <div
              key={preset.id}
              id={`btn-music-preset-${preset.id}`}
              onClick={() => {
                soundFx.play("click");
                loadPreset(preset);
              }}
              className={`p-2 rounded-xl text-left border transition-all duration-150 active:scale-95 cursor-pointer shadow-sm group relative flex flex-col justify-between ${
                isSelected
                  ? "bg-black border-cyan-500/60 text-white ring-1 ring-cyan-500/40"
                  : "bg-black border-neutral-800 text-neutral-300 hover:bg-neutral-800 hover:border-neutral-700 hover:text-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white group-hover:text-white truncate">
                    {preset.category}
                  </span>
                  {/* Add to playlist button */}
                  <button
                    type="button"
                    onClick={(e) => onAddPresetToPlaylist(preset, e)}
                    title="Tambahkan trek ini ke Playlist Anda"
                    className="p-1 rounded bg-black hover:bg-neutral-900 hover:text-white text-white border border-neutral-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-white" />
                  </button>
                </div>
                <p className="text-[11px] font-bold truncate leading-snug">
                  {preset.title}
                </p>
                <p className="text-[9px] text-neutral-500 truncate mt-0.5">
                  {preset.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
