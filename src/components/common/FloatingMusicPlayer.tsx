import React, { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useYouTubeMusic } from "../../context/YouTubeMusicContext";
import { soundFx } from "../../utils/soundEffects";
import { FloatingMusicMinimizedBubble } from "./musicPlayer/FloatingMusicMinimizedBubble";
import { FloatingMusicControlsRow } from "./musicPlayer/FloatingMusicControlsRow";

export const FloatingMusicPlayer: React.FC = () => {
  const {
    videoId,
    isPlaying,
    isBuffering,
    volume,
    isMuted,
    trackTitle,
    showFloatingWidget,
    playlist,
    activeTrackId,
    togglePlay,
    stop,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
  } = useYouTubeMusic();

  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // If no track is loaded or widget is explicitly hidden, don't show
  if (!videoId || !showFloatingWidget) {
    return null;
  }

  const handleOpenSettings = () => {
    soundFx.play("click");
    window.dispatchEvent(new CustomEvent("open-settings-modal"));
  };

  const currentTrackIndex = playlist.findIndex(
    (p) => p.id === activeTrackId || p.videoId === videoId
  );

  return (
    <div
      id="floating-youtube-music-player"
      className="fixed bottom-4 left-4 z-30 select-none animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {isMinimized ? (
        <FloatingMusicMinimizedBubble
          trackTitle={trackTitle}
          isPlaying={isPlaying}
          currentTrackIndex={currentTrackIndex}
          totalTracks={playlist.length}
          onExpand={() => setIsMinimized(false)}
        />
      ) : (
        <div className="flex flex-col bg-black backdrop-blur-md border border-cyan-500/40 rounded-2xl shadow-2xl p-2.5 max-w-[340px] text-white">
          {/* Top Bar: Title & Status */}
          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Equalizer animation when playing */}
              <div className="flex items-end gap-[2px] h-4 w-4 shrink-0 justify-center">
                {isPlaying ? (
                  <>
                    <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: "600ms" }} />
                    <span className="w-0.5 h-4 bg-cyan-300 rounded-full animate-bounce" style={{ animationDuration: "400ms" }} />
                    <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDuration: "700ms" }} />
                  </>
                ) : (
                  <>
                    <span className="w-0.5 h-1.5 bg-neutral-600 rounded-full" />
                    <span className="w-0.5 h-2.5 bg-neutral-600 rounded-full" />
                    <span className="w-0.5 h-1 bg-neutral-600 rounded-full" />
                  </>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-[11px] font-bold text-white truncate leading-tight">
                    {trackTitle}
                  </p>
                  {currentTrackIndex !== -1 && (
                    <span className="text-[9px] font-mono text-white bg-black px-1 py-0.2 rounded border border-cyan-500/40 shrink-0">
                      {currentTrackIndex + 1}/{playlist.length}
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-white font-mono leading-tight">
                  {isBuffering ? "Memuat..." : isPlaying ? "Memutar di latar belakang" : "Dijeda"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleOpenSettings}
                title="Buka pengaturan playlist & musik lengkap"
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.play("toggle");
                  setIsMinimized(true);
                }}
                title="Perkecil ke tombol mini"
                className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Controls Row */}
          <FloatingMusicControlsRow
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            hasMultipleTracks={playlist.length > 1}
            onPrevious={playPrevious}
            onTogglePlay={togglePlay}
            onNext={playNext}
            onStop={stop}
            onToggleMute={toggleMute}
            onSetVolume={setVolume}
          />
        </div>
      )}
    </div>
  );
};
