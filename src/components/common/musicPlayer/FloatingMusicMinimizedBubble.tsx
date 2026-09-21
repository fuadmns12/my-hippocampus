import React from "react";
import { Radio, ChevronUp } from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";

interface FloatingMusicMinimizedBubbleProps {
  trackTitle: string;
  isPlaying: boolean;
  currentTrackIndex: number;
  totalTracks: number;
  onExpand: () => void;
}

export const FloatingMusicMinimizedBubble: React.FC<FloatingMusicMinimizedBubbleProps> = ({
  trackTitle,
  isPlaying,
  currentTrackIndex,
  totalTracks,
  onExpand,
}) => {
  return (
    <button
      type="button"
      onClick={() => {
        soundFx.play("toggle");
        onExpand();
      }}
      title={`Musik YouTube: ${trackTitle} (${isPlaying ? "Sedang Memutar" : "Dijeda"}) - Klik untuk membuka kontrol`}
      className={`flex items-center gap-2 px-3 py-2 rounded-2xl border backdrop-blur-md shadow-2xl transition-all cursor-pointer group active:scale-95 ${
        isPlaying
          ? "bg-black border-cyan-500/50 text-white shadow-cyan-950/50"
          : "bg-black border-neutral-700/70 text-neutral-400 hover:text-white"
      }`}
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        <Radio className={`w-4 h-4 ${isPlaying ? "text-white animate-pulse" : "text-neutral-400"}`} />
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        )}
      </div>
      <span className="text-[11px] font-semibold tracking-wider max-w-[130px] truncate text-white">
        {trackTitle}
      </span>
      {currentTrackIndex !== -1 && (
        <span className="text-[9px] font-mono text-white bg-black px-1.5 py-0.5 rounded border border-cyan-500/40">
          {currentTrackIndex + 1}/{totalTracks}
        </span>
      )}
      <ChevronUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
    </button>
  );
};
