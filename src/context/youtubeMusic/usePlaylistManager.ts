import { useState, useCallback, useRef } from "react";
import {
  PlaylistItem,
  DEFAULT_PLAYLIST,
  extractYouTubeVideoId,
  MUSIC_PRESETS,
} from "../../utils/youtubeHelper";
import {
  AddToPlaylistResult,
  STORAGE_KEY_PLAYLIST,
  STORAGE_KEY_ACTIVE_TRACK,
  STORAGE_KEY_AUTO_ADVANCE,
} from "./types";
import { safeStorage } from "../../utils/safeStorage";

export function usePlaylistManager() {
  const [playlist, setPlaylist] = useState<PlaylistItem[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_PLAYLIST);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Auto-migrate legacy expired stream IDs (like dead jfKfPfyJRdk -> live rFZHOHl-L8A)
          let hasMigrated = false;
          const updated = parsed.map((item: PlaylistItem) => {
            if (item.videoId === "jfKfPfyJRdk" || (item.url && item.url.includes("jfKfPfyJRdk"))) {
              hasMigrated = true;
              return {
                ...item,
                videoId: "rFZHOHl-L8A",
                url: "https://www.youtube.com/watch?v=rFZHOHl-L8A",
              };
            }
            return item;
          });
          if (hasMigrated) {
            safeStorage.setItem(STORAGE_KEY_PLAYLIST, JSON.stringify(updated));
          }
          return updated;
        }
      }
    } catch {
      // ignore JSON parse error
    }
    return DEFAULT_PLAYLIST;
  });

  const [activeTrackId, setActiveTrackId] = useState<string | null>(() => {
    return safeStorage.getItem(STORAGE_KEY_ACTIVE_TRACK) || "pl-lofi-girl";
  });

  const [autoAdvance, setAutoAdvanceState] = useState<boolean>(() => {
    const saved = safeStorage.getItem(STORAGE_KEY_AUTO_ADVANCE);
    return saved !== "false"; // default true
  });

  const playlistRef = useRef(playlist);
  playlistRef.current = playlist;
  const autoAdvanceRef = useRef(autoAdvance);
  autoAdvanceRef.current = autoAdvance;
  const activeTrackIdRef = useRef(activeTrackId);
  activeTrackIdRef.current = activeTrackId;

  const savePlaylistToStorage = useCallback((newList: PlaylistItem[]) => {
    setPlaylist(newList);
    safeStorage.setItem(STORAGE_KEY_PLAYLIST, JSON.stringify(newList));
  }, []);

  const setAutoAdvance = useCallback((val: boolean) => {
    setAutoAdvanceState(val);
    safeStorage.setItem(STORAGE_KEY_AUTO_ADVANCE, String(val));
  }, []);

  const addToPlaylist = useCallback(
    (url: string, customTitle?: string): AddToPlaylistResult => {
      const extractedId = extractYouTubeVideoId(url);
      if (!extractedId) {
        return {
          success: false,
          message: "Format tautan YouTube tidak valid.",
        };
      }

      // Check if already in playlist
      const existing = playlistRef.current.find(
        (p) => p.videoId === extractedId
      );
      if (existing) {
        return {
          success: false,
          message: `Lagu "${existing.title}" sudah ada di playlist Anda.`,
          item: existing,
        };
      }

      // Derive title
      let title = customTitle?.trim();
      if (!title) {
        const foundPreset = MUSIC_PRESETS.find(
          (p) => p.videoId === extractedId
        );
        if (foundPreset) {
          title = foundPreset.title;
        } else {
          title = `YouTube Music (${extractedId})`;
        }
      }

      const newItem: PlaylistItem = {
        id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        url: url.trim(),
        videoId: extractedId,
        addedAt: Date.now(),
      };

      const nextList = [...playlistRef.current, newItem];
      savePlaylistToStorage(nextList);

      return {
        success: true,
        message: `Lagu "${title}" berhasil ditambahkan ke playlist!`,
        item: newItem,
      };
    },
    [savePlaylistToStorage]
  );

  const removeFromPlaylist = useCallback(
    (id: string) => {
      const nextList = playlistRef.current.filter((item) => item.id !== id);
      savePlaylistToStorage(nextList);
    },
    [savePlaylistToStorage]
  );

  const updatePlaylistItemTitle = useCallback(
    (id: string, newTitle: string) => {
      if (!newTitle.trim()) return;
      const nextList = playlistRef.current.map((item) => {
        if (item.id === id) {
          return { ...item, title: newTitle.trim() };
        }
        return item;
      });
      savePlaylistToStorage(nextList);
    },
    [savePlaylistToStorage]
  );

  const clearPlaylist = useCallback(() => {
    savePlaylistToStorage([]);
  }, [savePlaylistToStorage]);

  const resetDefaultPlaylist = useCallback(() => {
    savePlaylistToStorage(DEFAULT_PLAYLIST);
  }, [savePlaylistToStorage]);

  return {
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
  };
}
