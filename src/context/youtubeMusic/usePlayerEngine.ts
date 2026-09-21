import React, { useState, useRef, useCallback } from "react";
import {
  extractYouTubeVideoId,
  MusicPreset,
  PlaylistItem,
} from "../../utils/youtubeHelper";
import {
  STORAGE_KEY_URL,
  STORAGE_KEY_FLOATING,
  STORAGE_KEY_ACTIVE_TRACK,
} from "./types";
import { usePlayerAudio } from "./usePlayerAudio";
import { safeStorage } from "../../utils/safeStorage";
import {
  getInitialVideoUrl,
  getInitialVideoId,
  resolveTrackTitle,
  getNextTrackIndex,
  getPreviousTrackIndex,
} from "./playerEngineHelpers";

interface UsePlayerEngineProps {
  playlistRef: React.MutableRefObject<PlaylistItem[]>;
  activeTrackIdRef: React.MutableRefObject<string | null>;
  setActiveTrackId: (id: string | null) => void;
}

export function usePlayerEngine({
  playlistRef,
  activeTrackIdRef,
  setActiveTrackId,
}: UsePlayerEngineProps) {
  const [videoUrl, setVideoUrlState] = useState<string>(getInitialVideoUrl);
  const [videoId, setVideoId] = useState<string | null>(getInitialVideoId);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [trackTitle, setTrackTitle] = useState<string>(
    "Lofi Girl (Study & Relax Beats)"
  );
  const [activePresetId, setActivePresetId] = useState<string | null>(
    "lofi-girl"
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFloatingWidget, setShowFloatingWidgetState] = useState<boolean>(
    () => {
      return safeStorage.getItem(STORAGE_KEY_FLOATING) !== "false";
    }
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoIdRef = useRef(videoId);
  videoIdRef.current = videoId;

  const { volume, isMuted, setVolume, toggleMute, postCommand } =
    usePlayerAudio({
      iframeRef,
      isPlaying,
    });

  const setVideoUrl = useCallback((url: string) => {
    setVideoUrlState(url);
    setErrorMessage(null);
  }, []);

  const setShowFloatingWidget = useCallback((val: boolean) => {
    setShowFloatingWidgetState(val);
    safeStorage.setItem(STORAGE_KEY_FLOATING, String(val));
  }, []);

  const play = useCallback(
    (
      targetUrlOrId?: string,
      title?: string,
      presetId?: string,
      trackId?: string
    ) => {
      const input = targetUrlOrId ?? videoUrl;
      const extractedId = extractYouTubeVideoId(input);

      if (!extractedId) {
        setErrorMessage(
          "Link YouTube tidak valid. Mohon periksa kembali link Anda."
        );
        return;
      }

      setErrorMessage(null);
      safeStorage.setItem(STORAGE_KEY_URL, input);
      setHasStarted(true);

      if (extractedId !== videoId) {
        setVideoId(extractedId);
        setVideoUrlState(input);
        setIsPlaying(true);
        setIsBuffering(true);
      } else {
        postCommand("playVideo");
        setIsPlaying(true);
      }

      setTrackTitle(resolveTrackTitle(extractedId, playlistRef.current, title));
      setActivePresetId(presetId ?? null);

      if (trackId) {
        setActiveTrackId(trackId);
        safeStorage.setItem(STORAGE_KEY_ACTIVE_TRACK, trackId);
      } else {
        const found = playlistRef.current.find(
          (p) => p.videoId === extractedId
        );
        if (found) {
          setActiveTrackId(found.id);
          safeStorage.setItem(STORAGE_KEY_ACTIVE_TRACK, found.id);
        }
      }
    },
    [videoUrl, videoId, postCommand, playlistRef, setActiveTrackId]
  );

  const pause = useCallback(() => {
    postCommand("pauseVideo");
    setIsPlaying(false);
  }, [postCommand]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const stop = useCallback(() => {
    postCommand("stopVideo");
    setIsPlaying(false);
    setIsBuffering(false);
  }, [postCommand]);

  const playTrack = useCallback(
    (item: PlaylistItem) => {
      setVideoUrlState(item.url);
      setTrackTitle(item.title);
      setActiveTrackId(item.id);
      safeStorage.setItem(STORAGE_KEY_ACTIVE_TRACK, item.id);
      play(item.url, item.title, undefined, item.id);
    },
    [play, setActiveTrackId]
  );

  const playNext = useCallback(() => {
    const list = playlistRef.current;
    const nextIndex = getNextTrackIndex(
      list,
      activeTrackIdRef.current,
      videoIdRef.current
    );
    if (nextIndex >= 0) {
      playTrack(list[nextIndex]);
    }
  }, [playTrack, playlistRef, activeTrackIdRef, videoIdRef]);

  const playPrevious = useCallback(() => {
    const list = playlistRef.current;
    const prevIndex = getPreviousTrackIndex(
      list,
      activeTrackIdRef.current,
      videoIdRef.current
    );
    if (prevIndex >= 0) {
      playTrack(list[prevIndex]);
    }
  }, [playTrack, playlistRef, activeTrackIdRef, videoIdRef]);

  const loadPreset = useCallback(
    (preset: MusicPreset) => {
      setVideoUrlState(preset.url);
      setTrackTitle(preset.title);
      setActivePresetId(preset.id);
      play(preset.url, preset.title, preset.id);
    },
    [play]
  );

  return {
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
    setTrackTitle,
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
  };
}
