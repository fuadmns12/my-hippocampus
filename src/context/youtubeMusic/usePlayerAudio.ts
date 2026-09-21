import { useState, useEffect, useCallback, RefObject } from "react";
import { STORAGE_KEY_VOL, STORAGE_KEY_MUTED } from "./types";
import { safeStorage } from "../../utils/safeStorage";

interface UsePlayerAudioProps {
  iframeRef: RefObject<HTMLIFrameElement>;
  isPlaying: boolean;
}

export function usePlayerAudio({ iframeRef, isPlaying }: UsePlayerAudioProps) {
  const [volume, setVolumeState] = useState<number>(() => {
    const savedVol = safeStorage.getItem(STORAGE_KEY_VOL);
    return savedVol !== null
      ? Math.max(0, Math.min(100, Number(savedVol)))
      : 50;
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return safeStorage.getItem(STORAGE_KEY_MUTED) === "true";
  });

  const postCommand = useCallback(
    (func: string, args: any[] = []) => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: "command",
              func: func,
              args: args,
            }),
            "*"
          );
        } catch {
          // Suppress cross-origin messaging error
        }
      }
    },
    [iframeRef]
  );

  const setVolume = useCallback(
    (newVol: number) => {
      const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
      setVolumeState(clamped);
      safeStorage.setItem(STORAGE_KEY_VOL, String(clamped));
      postCommand("setVolume", [clamped]);
      if (isMuted && clamped > 0) {
        setIsMuted(false);
        safeStorage.setItem(STORAGE_KEY_MUTED, "false");
        postCommand("unMute");
      }
    },
    [isMuted, postCommand]
  );

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    safeStorage.setItem(STORAGE_KEY_MUTED, String(nextMuted));
    if (nextMuted) {
      postCommand("mute");
    } else {
      postCommand("unMute");
      postCommand("setVolume", [volume]);
    }
  }, [isMuted, volume, postCommand]);

  // Synchronize volume and mute whenever player starts playing
  useEffect(() => {
    if (isPlaying) {
      postCommand("setVolume", [volume]);
      if (isMuted) {
        postCommand("mute");
      } else {
        postCommand("unMute");
      }
    }
  }, [isPlaying, volume, isMuted, postCommand]);

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    postCommand,
  };
}
