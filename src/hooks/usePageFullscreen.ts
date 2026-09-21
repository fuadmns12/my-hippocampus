import { useState, useEffect, useCallback } from "react";
import { device } from "../utils/deviceDetection";
import {
  FULLSCREEN_CHANGE_EVENTS,
  exitNativeFullscreen,
  isPageFullscreenActive,
  lockLandscapeOrientation,
  requestElementFullscreen,
  scheduleLandscapeRelock,
} from "../utils/fullscreenHelper";

/**
 * Hook FULLSCREEN SELURUH HALAMAN (page fullscreen) — tombol `#btn-fullscreen-page` di header.
 *
 * Mengaktifkan layar penuh native pada `document.documentElement`, sehingga SELURUH HALAMAN
 * (header, panel input, kanvas, drawer) ikut penuh dan tidak ada elemen aplikasi yang
 * disembunyikan. Berbeda dengan Mode Kanvas Fokus (`useFullscreen`) yang hanya memfokuskan
 * area kanvas mind map.
 */
export function usePageFullscreen() {
  const [isPageFullscreen, setIsPageFullscreen] = useState(false);

  // Sinkronkan status tombol dengan fullscreen native (perubahan dari ESC, F11, atau aksi luar)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPageFullscreen(isPageFullscreenActive());
    };

    handleFullscreenChange();

    FULLSCREEN_CHANGE_EVENTS.forEach((eventName) =>
      document.addEventListener(eventName, handleFullscreenChange)
    );

    return () => {
      FULLSCREEN_CHANGE_EVENTS.forEach((eventName) =>
        document.removeEventListener(eventName, handleFullscreenChange)
      );
    };
  }, []);

  // Toggle fullscreen seluruh halaman
  const togglePageFullscreen = useCallback(async () => {
    try {
      if (!isPageFullscreenActive()) {
        // Masuk fullscreen: target `documentElement` = SELURUH HALAMAN web (semua elemen ikut)
        await requestElementFullscreen(document.documentElement);

        // Di HP/tablet: kunci orientasi landscape saat fullscreen halaman (jika didukung)
        if (device.isMobile || device.isTablet) {
          await lockLandscapeOrientation();
        }
      } else {
        // Keluar fullscreen
        await exitNativeFullscreen();

        // Re-lock orientasi landscape setelah keluar fullscreen (HP/tablet, delay 300ms)
        if (device.isMobile || device.isTablet) {
          scheduleLandscapeRelock(300);
        }
      }

      setIsPageFullscreen(isPageFullscreenActive());
    } catch (err) {
      console.warn("Fullscreen halaman tidak didukung atau diblokir:", err);
    }
  }, []);

  return {
    isPageFullscreen,
    togglePageFullscreen,
  };
}
