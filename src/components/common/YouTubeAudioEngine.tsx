import React, { useMemo } from "react";
import { useYouTubeMusic } from "../../context/YouTubeMusicContext";
import { buildYouTubeEmbedUrl } from "../../utils/youtubeHelper";

export const YouTubeAudioEngine: React.FC = () => {
  const { videoId, hasStarted, iframeRef } = useYouTubeMusic();

  const embedUrl = useMemo(() => {
    if (!videoId || !hasStarted) return null;
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    return buildYouTubeEmbedUrl(videoId, origin);
  }, [videoId, hasStarted]);

  // Keep iframe unmounted until the user explicitly clicks play for the first time
  if (!videoId || !hasStarted) {
    return null;
  }

  return (
    <div
      id="youtube-persistent-audio-engine"
      aria-hidden="true"
      className="fixed bottom-0 right-0 w-[1px] h-[1px] pointer-events-none opacity-[0.01] overflow-hidden -z-50 select-none"
    >
      {embedUrl && (
        <iframe
          key={videoId}
          ref={iframeRef}
          id="youtube-background-iframe"
          title="YouTube Background Audio Player"
          src={embedUrl}
          width="1"
          height="1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          tabIndex={-1}
        />
      )}
    </div>
  );
};
