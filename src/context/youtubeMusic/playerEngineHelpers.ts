import { safeStorage } from "../../utils/safeStorage";
import {
  extractYouTubeVideoId,
  MusicPreset,
  MUSIC_PRESETS,
  PlaylistItem,
} from "../../utils/youtubeHelper";
import { STORAGE_KEY_URL } from "./types";

export const DEFAULT_MUSIC_URL = "https://www.youtube.com/watch?v=rFZHOHl-L8A";
export const DEFAULT_VIDEO_ID = "rFZHOHl-L8A";

export function getInitialVideoUrl(): string {
  const saved = safeStorage.getItem(STORAGE_KEY_URL);
  if (saved && saved.includes("jfKfPfyJRdk")) {
    safeStorage.setItem(STORAGE_KEY_URL, DEFAULT_MUSIC_URL);
    return DEFAULT_MUSIC_URL;
  }
  return saved || DEFAULT_MUSIC_URL;
}

export function getInitialVideoId(): string {
  const savedUrl = safeStorage.getItem(STORAGE_KEY_URL);
  if (savedUrl && savedUrl.includes("jfKfPfyJRdk")) {
    return DEFAULT_VIDEO_ID;
  }
  return (savedUrl ? extractYouTubeVideoId(savedUrl) : null) || DEFAULT_VIDEO_ID;
}

export function resolveTrackTitle(
  extractedId: string,
  playlist: PlaylistItem[],
  explicitTitle?: string
): string {
  if (explicitTitle) return explicitTitle;
  const inPlaylist = playlist.find((p) => p.videoId === extractedId);
  if (inPlaylist) return inPlaylist.title;
  const foundPreset = MUSIC_PRESETS.find((p) => p.videoId === extractedId);
  if (foundPreset) return foundPreset.title;
  return "YouTube Music Track";
}

export function getNextTrackIndex(
  list: PlaylistItem[],
  currentTrackId: string | null,
  currentVideoId: string | null
): number {
  if (list.length === 0) return -1;
  const currentIndex = list.findIndex(
    (item) => item.id === currentTrackId || item.videoId === currentVideoId
  );
  return currentIndex === -1 ? 0 : (currentIndex + 1) % list.length;
}

export function getPreviousTrackIndex(
  list: PlaylistItem[],
  currentTrackId: string | null,
  currentVideoId: string | null
): number {
  if (list.length === 0) return -1;
  const currentIndex = list.findIndex(
    (item) => item.id === currentTrackId || item.videoId === currentVideoId
  );
  return currentIndex === -1
    ? list.length - 1
    : (currentIndex - 1 + list.length) % list.length;
}
