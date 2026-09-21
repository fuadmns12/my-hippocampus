import { useEffect, type MutableRefObject } from "react";
import { PlaylistItem } from "../../utils/youtubeHelper";

interface UseYouTubeIframeListenerProps {
  setIsPlaying: (val: boolean) => void;
  setIsBuffering: (val: boolean) => void;
  autoAdvanceRef: MutableRefObject<boolean>;
  playlistRef: MutableRefObject<PlaylistItem[]>;
  activeTrackIdRef: MutableRefObject<string | null>;
  videoIdRef: MutableRefObject<string | null>;
  playTrack: (item: PlaylistItem) => void;
}

export function useYouTubeIframeListener({
  setIsPlaying,
  setIsBuffering,
  autoAdvanceRef,
  playlistRef,
  activeTrackIdRef,
  videoIdRef,
  playTrack,
}: UseYouTubeIframeListenerProps) {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data === "string") {
          const data = JSON.parse(event.data);
          if (data.event === "onStateChange") {
            // YouTube states: 1 = PLAYING, 2 = PAUSED, 3 = BUFFERING, 0 = ENDED
            if (data.info === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
            } else if (data.info === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (data.info === 3) {
              setIsBuffering(true);
            } else if (data.info === 0) {
              setIsPlaying(false);
              setIsBuffering(false);

              // Auto-advance to next song in playlist if enabled!
              if (autoAdvanceRef.current && playlistRef.current.length > 0) {
                const list = playlistRef.current;
                const currentIndex = list.findIndex(
                  (item) =>
                    item.id === activeTrackIdRef.current ||
                    item.videoId === videoIdRef.current
                );
                const nextIndex =
                  currentIndex === -1 ? 0 : (currentIndex + 1) % list.length;
                const nextItem = list[nextIndex];
                if (nextItem) {
                  playTrack(nextItem);
                }
              }
            }
          } else if (data.event === "onError") {
            // Error occurred in YouTube player (e.g. video unavailable, embed blocked)
            setIsPlaying(false);
            setIsBuffering(false);
          }
        }
      } catch {
        // Not a JSON message from YouTube, ignore
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    setIsPlaying,
    setIsBuffering,
    autoAdvanceRef,
    playlistRef,
    activeTrackIdRef,
    videoIdRef,
    playTrack,
  ]);
}
