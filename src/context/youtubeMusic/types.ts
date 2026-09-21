import React from "react";
import { PlaylistItem, MusicPreset } from "../../utils/youtubeHelper";

export interface AddToPlaylistResult {
  success: boolean;
  message: string;
  item?: PlaylistItem;
}

export interface YouTubeMusicContextValue {
  videoUrl: string;
  videoId: string | null;
  hasStarted: boolean;
  isPlaying: boolean;
  isBuffering: boolean;
  volume: number;
  isMuted: boolean;
  trackTitle: string;
  activePresetId: string | null;
  activeTrackId: string | null;
  errorMessage: string | null;
  showFloatingWidget: boolean;
  playlist: PlaylistItem[];
  autoAdvance: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  setVideoUrl: (url: string) => void;
  play: (
    targetUrlOrId?: string,
    title?: string,
    presetId?: string,
    trackId?: string
  ) => void;
  pause: () => void;
  togglePlay: () => void;
  stop: () => void;
  setVolume: (newVolume: number) => void;
  toggleMute: () => void;
  loadPreset: (preset: MusicPreset) => void;
  setShowFloatingWidget: (val: boolean) => void;
  setAutoAdvance: (val: boolean) => void;
  addToPlaylist: (url: string, customTitle?: string) => AddToPlaylistResult;
  removeFromPlaylist: (id: string) => void;
  updatePlaylistItemTitle: (id: string, newTitle: string) => void;
  playTrack: (item: PlaylistItem) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlaylist: () => void;
  resetDefaultPlaylist: () => void;
}

export const STORAGE_KEY_URL = "my_hippocampus_yt_music_url";
export const STORAGE_KEY_VOL = "my_hippocampus_yt_music_volume";
export const STORAGE_KEY_MUTED = "my_hippocampus_yt_music_muted";
export const STORAGE_KEY_FLOATING = "my_hippocampus_yt_music_show_floating";
export const STORAGE_KEY_PLAYLIST = "my_hippocampus_yt_music_playlist";
export const STORAGE_KEY_AUTO_ADVANCE = "my_hippocampus_yt_music_auto_advance";
export const STORAGE_KEY_ACTIVE_TRACK = "my_hippocampus_yt_music_active_track";
