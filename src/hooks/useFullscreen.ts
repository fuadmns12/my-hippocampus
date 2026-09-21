import { useState, useEffect, useCallback } from "react";
import { device } from "../utils/deviceDetection";
import {
  FULLSCREEN_CHANGE_EVENTS,
  exitNativeFullscreen,
  isAnyFullscreenActive,
  requestElementFullscreen,
  scheduleLandscapeRelock,
} from "../utils/fullscreenHelper";

/**
 * Hook MODE KANVAS FOKUS (canvas fullscreen) — tombol `#btn-canvas-fullscreen-toggle`
 * di dalam kanvas mind map.
 *
 * Berbeda dengan `usePageFullscreen` (tombol FULLSCREEN di header) yang mengaktifkan
 * layar penuh SELURUH HALAMAN tanpa menyembunyikan apa pun. Pada mode kanvas fokus ini
 * header serta panel input/tata letak disembunyikan dan kanvas mengisi 100vw x 100vh.
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      // Fullscreen native tetap ditargetkan ke documentElement (bukan elemen kanvas) agar
      // modal, drawer, toast, dan FAB yang dirender DI LUAR #canvas-container tetap tampil
      // di atas top-layer. Perangkat tanpa Fullscreen API (mis. iPhone Safari) memakai
      // pseudo fullscreen in-app melalui overlay 100vw x 100vh di MindMapCanvas.
      if (!device.needsPseudoFullscreen) {
        requestElementFullscreen(document.documentElement).catch(() => {
          // Ditolak/diblokir browser → tetap lanjut dengan pseudo fullscreen in-app
        });
      }
      setIsFullscreen(true);
    } else {
      if (isAnyFullscreenActive()) {
        exitNativeFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
      
      // Re-lock orientasi ke landscape setelah keluar fullscreen (HP/tablet),
      // supaya tampilan tidak langsung kembali ke portrait.
      if (device.isMobile || device.isTablet) {
        scheduleLandscapeRelock(300);
      }
    }
  }, [isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      // Pada perangkat pseudo fullscreen (mis. iPhone Safari) event fullscreen bisa berasal
      // dari elemen lain (mis. video) sehingga tidak boleh menutup mode kanvas fokus.
      if (device.needsPseudoFullscreen) return;

      // Mode kanvas hanya DITUTUP saat fullscreen native berakhir (mis. tombol ESC).
      // Efek ini sengaja tidak pernah MENYALAKAN mode kanvas, sehingga menekan tombol
      // FULLSCREEN di header (page fullscreen) tidak ikut memicu mode kanvas fokus.
      setIsFullscreen((prev) => (prev ? isAnyFullscreenActive() : prev));
    };

    FULLSCREEN_CHANGE_EVENTS.forEach((eventName) =>
      document.addEventListener(eventName, handleFullscreenChange)
    );

    return () => {
      FULLSCREEN_CHANGE_EVENTS.forEach((eventName) =>
        document.removeEventListener(eventName, handleFullscreenChange)
      );
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
