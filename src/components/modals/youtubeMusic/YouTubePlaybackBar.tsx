import React from "react";
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { soundFx } from "../../../utils/soundEffects";
import { extractYouTubeVideoId } from "../../../utils/youtubeHelper";

interface YouTubePlaybackBarProps {
  trackTitle: string;
  currentPlaylistIndex: number;
  totalPlaylistCount: number;
  isPlaying: boolean;
  isBuffering: boolean;
  videoId: string | null;
  videoUrl: string;
  volume: number;
  isMuted: boolean;
  playlistCount: number;
  onPlayClicked: () => void;
  onStopClicked: () => void;
  playPrevious: () => void;
  playNext: () => void;
  toggleMute: () => void;
  setVolume: (val: number) => void;
}

export const YouTubePlaybackBar: React.FC<YouTubePlaybackBarProps> = ({
  trackTitle,
  currentPlaylistIndex,
  totalPlaylistCount,
  isPlaying,
  videoId,
  videoUrl,
  volume,
  isMuted,
  playlistCount,
  onPlayClicked,
  onStopClicked,
  playPrevious,
  playNext,
  toggleMute,
  setVolume,
}) => {
  const isCurrentIdValid = Boolean(extractYouTubeVideoId(videoUrl));

  return (
    <div className="bg-black p-3 rounded-2xl border border-neutral-800 space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 shrink-0">
            Sedang Dimainkan:
          </span>
          <span className="font-bold text-white truncate max-w-[240px] sm:max-w-[340px]">
            {trackTitle}
          </span>
        </div>
        {currentPlaylistIndex !== -1 && (
          <span className="text-[10px] font-mono text-white bg-black border border-cyan-500/40 px-2 py-0.5 rounded-full shrink-0">
            Trek {currentPlaylistIndex + 1} dari {totalPlaylistCount}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        {/* Controls: Prev, Play/Pause, Next, Stop */}
        <div className="flex items-center gap-1.5">
          {/* Previous Track */}
          <button
            id="btn-youtube-prev-track"
            type="button"
            onClick={() => {
              soundFx.play("click");
              playPrevious();
            }}
            disabled={playlistCount <= 1}
            title="Putar lagu sebelumnya di playlist"
            className="p-2.5 rounded-xl bg-black hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4 text-white" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            id="btn-youtube-toggle-play"
            type="button"
            onClick={onPlayClicked}
            disabled={!isCurrentIdValid && !videoId}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-150 active:scale-95 shadow-md cursor-pointer ${
              isPlaying
                ? "bg-black hover:bg-neutral-900 text-white border border-cyan-400"
                : "bg-black hover:bg-neutral-900 text-white border border-cyan-500/50 hover:border-cyan-400 shadow-cyan-950/50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-cyan-400 fill-current" />
                <span>JEDA</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-current" />
                <span>PUTAR MUSIK</span>
              </>
            )}
          </button>

          {/* Next Track */}
          <button
            id="btn-youtube-next-track"
            type="button"
            onClick={() => {
              soundFx.play("click");
              playNext();
            }}
            disabled={playlistCount <= 1}
            title="Putar lagu berikutnya di playlist"
            className="p-2.5 rounded-xl bg-black hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/80 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4 text-white" />
          </button>

          {/* Stop Button */}
          <button
            id="btn-youtube-stop"
            type="button"
            onClick={onStopClicked}
            disabled={!isPlaying && !videoId}
            title="Hentikan pemutaran musik"
            className="p-2.5 rounded-xl bg-black hover:bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-700/80 hover:border-rose-500/50 transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Square className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2.5 bg-black px-3 py-2 rounded-xl border border-neutral-800">
          <button
            id="btn-youtube-toggle-mute"
            type="button"
            onClick={() => {
              soundFx.play("toggle");
              toggleMute();
            }}
            title={isMuted ? "Bunyikan kembali" : "Bisukan musik"}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-cyan-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>

          <input
            id="slider-youtube-volume"
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Atur volume musik YouTube"
            className="flex-1 h-1.5 accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer"
          />

          <span className="text-[11px] font-mono text-white w-9 text-right shrink-0">
            {isMuted ? "MUTE" : `${volume}%`}
          </span>
        </div>
      </div>
    </div>
  );
};
