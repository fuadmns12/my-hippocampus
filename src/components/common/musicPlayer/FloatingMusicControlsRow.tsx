import React, { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Square,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";

interface FloatingMusicControlsRowProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  hasMultipleTracks: boolean;
  onPrevious: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onStop: () => void;
  onToggleMute: () => void;
  onSetVolume: (vol: number) => void;
}

export const FloatingMusicControlsRow: React.FC<FloatingMusicControlsRowProps> = ({
  isPlaying,
  isMuted,
  volume,
  hasMultipleTracks,
  onPrevious,
  onTogglePlay,
  onNext,
  onStop,
  onToggleMute,
  onSetVolume,
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  return (
    <div className="flex items-center justify-between gap-1.5">
      <div className="flex items-center gap-1">
        {/* Previous Track */}
        <button
          id="floating-music-prev"
          type="button"
          onClick={() => {
            soundFx.play("click");
            onPrevious();
          }}
          disabled={!hasMultipleTracks}
          title="Lagu sebelumnya"
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-all active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Play / Pause */}
        <button
          id="floating-music-toggle-play"
          type="button"
          onClick={() => {
            soundFx.play("click");
            onTogglePlay();
          }}
          title={isPlaying ? "Jeda musik" : "Putar musik"}
          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-semibold transition-all active:scale-95 cursor-pointer shadow-sm ${
            isPlaying
              ? "bg-black text-white border border-cyan-400 hover:bg-neutral-900"
              : "bg-black text-white border border-neutral-700 hover:bg-neutral-900"
          }`}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Next Track */}
        <button
          id="floating-music-next"
          type="button"
          onClick={() => {
            soundFx.play("click");
            onNext();
          }}
          disabled={!hasMultipleTracks}
          title="Lagu berikutnya"
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-all active:scale-95 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Stop */}
        <button
          id="floating-music-stop"
          type="button"
          onClick={() => {
            soundFx.play("delete");
            onStop();
          }}
          title="Hentikan musik"
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-black hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-rose-500/40 transition-all active:scale-95 cursor-pointer"
        >
          <Square className="w-3 h-3" />
        </button>
      </div>

      {/* Volume & Mute Controls */}
      <div className="flex items-center gap-1.5 relative">
        <button
          id="floating-music-volume-button"
          type="button"
          onClick={() => setShowVolumeSlider(!showVolumeSlider)}
          onContextMenu={(e) => {
            e.preventDefault();
            soundFx.play("toggle");
            onToggleMute();
          }}
          className="inline-flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 hover:text-white px-2 py-1 rounded bg-black hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer active:scale-95"
          title={
            isMuted
              ? "Volume dibisukan (Klik untuk atur volume, klik kanan untuk bunyikan)"
              : "Atur persentase volume (Klik kanan untuk bisukan)"
          }
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-white" />
          )}
          <span>{isMuted ? "MUTE" : `${volume}%`}</span>
        </button>

        {showVolumeSlider && (
          <div className="absolute right-0 bottom-full mb-2 p-2 bg-black border border-cyan-500/40 rounded-xl shadow-xl flex items-center gap-2 z-40">
            <button
              id="floating-music-popup-mute"
              type="button"
              onClick={() => {
                soundFx.play("toggle");
                onToggleMute();
              }}
              title={isMuted ? "Bunyikan kembali" : "Bisukan"}
              className="p-1 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => onSetVolume(Number(e.target.value))}
              className="w-24 h-1.5 accent-cyan-400 bg-neutral-700 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] font-mono text-white w-7 text-right">
              {volume}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
