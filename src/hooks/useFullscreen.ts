import { useState, useEffect, useCallback } from "react";
import { device } from "../utils/deviceDetection";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (!device.needsPseudoFullscreen && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // Fallback to in-app pseudo fullscreen if rejected by browser
          setIsFullscreen(true);
        });
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.body.classList.add("fullscreen-active");
      document.documentElement.classList.add("fullscreen-active");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("fullscreen-active");
      document.documentElement.classList.remove("fullscreen-active");
    }
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("fullscreen-active");
      document.documentElement.classList.remove("fullscreen-active");
    };
  }, [isFullscreen]);

  return {
    isFullscreen,
    setIsFullscreen,
    handleToggleFullscreen,
  };
}
