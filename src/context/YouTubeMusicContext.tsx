import React, { createContext, useContext, ReactNode } from "react";
import {
  AddToPlaylistResult,
  YouTubeMusicContextValue,
} from "./youtubeMusic/types";
import { usePlaylistManager } from "./youtubeMusic/usePlaylistManager";
import { usePlayerEngine } from "./youtubeMusic/usePlayerEngine";
import { useYouTubeIframeListener } from "./youtubeMusic/useYouTubeIframeListener";

export type { AddToPlaylistResult, YouTubeMusicContextValue };

const YouTubeMusicContext = createContext<YouTubeMusicContextValue | undefined>(
  undefined
);

export const YouTubeMusicProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    playlist,
    activeTrackId,
    setActiveTrackId,
    autoAdvance,
    setAutoAdvance,
    playlistRef,
    autoAdvanceRef,
    activeTrackIdRef,
    addToPlaylist,
    removeFromPlaylist,
    updatePlaylistItemTitle,
    clearPlaylist,
    resetDefaultPlaylist,
  } = usePlaylistManager();

  const {
    videoUrl,
    videoId,
    videoIdRef,
    hasStarted,
    isPlaying,
    setIsPlaying,
    isBuffering,
    setIsBuffering,
    volume,
    isMuted,
    trackTitle,
    activePresetId,
    errorMessage,
    showFloatingWidget,
    iframeRef,
    setVideoUrl,
    setShowFloatingWidget,
    play,
    pause,
    togglePlay,
    stop,
    setVolume,
    toggleMute,
    loadPreset,
    playTrack,
    playNext,
    playPrevious,
  } = usePlayerEngine({
    playlistRef,
    activeTrackIdRef,
    setActiveTrackId,
  });

  // Listen to postMessage from YouTube IFrame
  useYouTubeIframeListener({
    setIsPlaying,
    setIsBuffering,
    autoAdvanceRef,
    playlistRef,
    activeTrackIdRef,
    videoIdRef,
    playTrack,
  });

  const value: YouTubeMusicContextValue = {
    videoUrl,
    videoId,
    hasStarted,
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
    iframeRef,
    setVideoUrl,
    play,
    pause,
    togglePlay,
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
    clearPlaylist,
    resetDefaultPlaylist,
  };

  return (
    <YouTubeMusicContext.Provider value={value}>
      {children}
    </YouTubeMusicContext.Provider>
  );
};

export const useYouTubeMusic = (): YouTubeMusicContextValue => {
  const context = useContext(YouTubeMusicContext);
  if (!context) {
    throw new Error(
      "useYouTubeMusic must be used within a YouTubeMusicProvider"
    );
  }
  return context;
};
