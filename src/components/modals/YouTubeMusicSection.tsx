import React, { useState } from "react";
import { Music, CheckCircle2 } from "lucide-react";
import { useYouTubeMusic } from "../../context/YouTubeMusicContext";
import { MusicPreset } from "../../utils/youtubeHelper";
import { soundFx } from "../../utils/soundEffects";
import { AIAssistantSection } from "./AIAssistantSection";
import { YouTubeUrlInputBar } from "./youtubeMusic/YouTubeUrlInputBar";
import { YouTubePlaybackBar } from "./youtubeMusic/YouTubePlaybackBar";
import { YouTubePlaylistView } from "./youtubeMusic/YouTubePlaylistView";
import { YouTubePresetsGrid } from "./youtubeMusic/YouTubePresetsGrid";
import { NeoToggle } from "../common/NeoToggle";

export const YouTubeMusicSection: React.FC = () => {
  const {
    videoUrl,
    videoId,
    isPlaying,
    isBuffering,
    volume,
    isMuted,
    trackTitle,
    activePresetId,
    activeTrackId,
    errorMessage,
    showFloatingWidget,
    playlist,
    autoAdvance,
    setVideoUrl,
    play,
    pause,
    stop,
    setVolume,
    toggleMute,
    loadPreset,
    setShowFloatingWidget,
    setAutoAdvance,
    addToPlaylist,
    removeFromPlaylist,
    updatePlaylistItemTitle,
    playTrack,
    playNext,
    playPrevious,
    resetDefaultPlaylist,
  } = useYouTubeMusic();

  const [, setPresetToastMsg] = useState<string | null>(null);

  const handlePlayClicked = () => {
    soundFx.play("click");
    if (isPlaying) {
      pause();
    } else {
      play(videoUrl);
    }
  };

  const handleStopClicked = () => {
    soundFx.play("delete");
    stop();
  };

  const handleAddPresetToPlaylist = (
    preset: MusicPreset,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    soundFx.play("click");
    const res = addToPlaylist(preset.url, preset.title);
    if (res.success) {
      soundFx.play("success");
      setPresetToastMsg(`"${preset.title}" ditambahkan ke playlist!`);
      setTimeout(() => setPresetToastMsg(null), 3000);
    }
  };

  // Determine current playing track index in playlist
  const currentPlaylistIndex = playlist.findIndex(
    (p) => p.id === activeTrackId || p.videoId === videoId
  );

  return (
    <div
      id="settings-youtube-music-section"
      className="p-4 rounded-2xl bg-black border border-cyan-500/30 text-white space-y-4 shadow-lg shadow-black/40"
    >
      {/* Section Header */}
      <div className="pb-3 border-b border-neutral-800">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black border border-cyan-500/50 flex items-center justify-center shrink-0 text-white shadow-sm shadow-cyan-950 mt-0.5">
            <Music className="w-4 h-4 text-white" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
              Musik Latar Belakang & Playlist YouTube
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black text-white border border-cyan-500/40">
                Online Audio
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400">
              Salin link YouTube, simpan sebagai daftar putar (playlist), dan
              dengarkan sambil memetakan ide
            </p>

            {/* Live Status Badge */}
            <div className="pt-0.5">
              {isPlaying ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wider bg-black text-white border border-emerald-500/50 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {isBuffering ? "MEMUAT..." : "SEDANG MEMUTAR"}
                </span>
              ) : videoId ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wider bg-black text-white border border-amber-500/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  DIJEDA
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-semibold tracking-wider bg-black text-neutral-400 border border-neutral-700">
                  BELUM AKTIF
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* URL Input & Title Input Area */}
      <YouTubeUrlInputBar
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        addToPlaylist={addToPlaylist}
        errorMessage={errorMessage}
      />

      {/* Main Playback Bar with Prev / Play / Next */}
      <YouTubePlaybackBar
        trackTitle={trackTitle}
        currentPlaylistIndex={currentPlaylistIndex}
        totalPlaylistCount={playlist.length}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        videoId={videoId}
        videoUrl={videoUrl}
        volume={volume}
        isMuted={isMuted}
        playlistCount={playlist.length}
        onPlayClicked={handlePlayClicked}
        onStopClicked={handleStopClicked}
        playPrevious={playPrevious}
        playNext={playNext}
        toggleMute={toggleMute}
        setVolume={setVolume}
      />

      {/* Playlist / Daftar Putar Tersimpan Section */}
      <YouTubePlaylistView
        playlist={playlist}
        activeTrackId={activeTrackId}
        videoId={videoId}
        isPlaying={isPlaying}
        autoAdvance={autoAdvance}
        setAutoAdvance={setAutoAdvance}
        resetDefaultPlaylist={resetDefaultPlaylist}
        updatePlaylistItemTitle={updatePlaylistItemTitle}
        removeFromPlaylist={removeFromPlaylist}
        playTrack={playTrack}
        pause={pause}
      />

      {/* Quick Curated Presets */}
      <YouTubePresetsGrid
        activePresetId={activePresetId}
        videoId={videoId}
        loadPreset={loadPreset}
        onAddPresetToPlaylist={handleAddPresetToPlaylist}
      />

      {/* Floating Widget Toggle & Background Persistence Guarantee */}
      <div className="pt-2 border-t border-neutral-800/80 space-y-2">
        <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="space-y-0.5">
            <span className="text-xs font-medium text-white block">
              Kontrol Musik Mengambang
            </span>
            <span className="text-[11px] text-neutral-400 block">
              Tampilkan kontrol musik mengambang di pojok kanvas
            </span>
          </div>
          <NeoToggle
            id="toggle-floating-music-widget"
            checked={showFloatingWidget}
            onChange={(checked) => setShowFloatingWidget(checked)}
            title={showFloatingWidget ? "Widget Musik Mengambang Aktif" : "Widget Musik Mengambang Nonaktif"}
            aria-label="Toggle Widget Musik Mengambang"
          />
        </div>

        {/* Persistence highlight reassuring the user */}
        <div className="p-2.5 rounded-xl bg-black border border-emerald-500/30 flex items-start gap-2 text-[11px] text-white leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <p>
            <strong>Musik & Playlist tetap berjalan:</strong> Anda dapat menutup
            jendela pengaturan ini kapan saja, dan playlist Anda akan terus
            berlanjut di latar belakang.
          </p>
        </div>

        {/* Section 5: Bot Panduan Website Configuration */}
        <AIAssistantSection />
      </div>
    </div>
  );
};
