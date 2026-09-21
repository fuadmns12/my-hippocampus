import { useState, useEffect, useCallback } from 'react';

/**
 * Hook untuk fullscreen SELURUH HALAMAN web (page fullscreen)
 * Berbeda dengan canvas fullscreen yang hanya fullscreen area kanvas SVG
 */
export function usePageFullscreen() {
  const [isPageFullscreen, setIsPageFullscreen] = useState(false);

  // Cek status fullscreen saat ini
  useEffect(() => {
    const checkFullscreen = () => {
      const isNowFullscreen = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsPageFullscreen(isNowFullscreen);
    };

    checkFullscreen();

    // Listen perubahan fullscreen (ESC, F11, dll)
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('MSFullscreenChange', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('MSFullscreenChange', checkFullscreen);
    };
  }, []);

  // Toggle fullscreen seluruh halaman
  const togglePageFullscreen = useCallback(async () => {
    try {
      if (!isPageFullscreen) {
        // Enter fullscreen - target document.documentElement (seluruh halaman HTML)
        const docElement = document.documentElement;
        
        if (docElement.requestFullscreen) {
          await docElement.requestFullscreen();
        } else if ((docElement as any).webkitRequestFullscreen) {
          await (docElement as any).webkitRequestFullscreen();
        } else if ((docElement as any).mozRequestFullScreen) {
          await (docElement as any).mozRequestFullScreen();
        } else if ((docElement as any).msRequestFullscreen) {
          await (docElement as any).msRequestFullscreen();
        }

        // Di HP: Lock landscape saat fullscreen halaman (jika mendukung)
        if ('orientation' in screen && 'lock' in screen.orientation) {
          try {
            await (screen.orientation as any).lock('landscape').catch(() => {
              // Ignore error jika tidak didukung
            });
          } catch {}
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }

        // Di HP: Re-lock landscape setelah keluar fullscreen (delay 300ms)
        if ('orientation' in screen && 'lock' in screen.orientation) {
          setTimeout(async () => {
            try {
              await (screen.orientation as any).lock('landscape').catch(() => {});
            } catch {}
          }, 300);
        }
      }
    } catch (err) {
      console.warn('Fullscreen halaman tidak didukung atau diblokir:', err);
    }
  }, [isPageFullscreen]);

  return {
    isPageFullscreen,
    togglePageFullscreen,
  };
}
