import { useState, useEffect, useCallback } from "react";
import { getDeviceInfo } from "../../utils/deviceDetection";
import { hapticFx } from "../../utils/hapticFeedback";

export interface MobileOrientationState {
  isMobileDevice: boolean;
  isTabletDevice: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  showLandscapeNotice: boolean;
  lockSupported: boolean;
  isLocking: boolean;
  noticeDismissed: boolean;
  requestLandscapeMode: () => Promise<{ success: boolean; message?: string }>;
  dismissNotice: () => void;
  openNotice: () => void;
}

export function useMobileOrientation(): MobileOrientationState {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isTabletDevice, setIsTabletDevice] = useState<boolean>(false);
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [showLandscapeNotice, setShowLandscapeNotice] = useState<boolean>(false);
  const [noticeDismissed, setNoticeDismissed] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [lockSupported, setLockSupported] = useState<boolean>(false);

  // Check orientation and device type
  const checkState = useCallback(() => {
    if (typeof window === "undefined") return;

    const device = getDeviceInfo(true);
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const isCurrentPortrait = screenH > screenW;
    const minDim = Math.min(screenW, screenH);
    const maxDim = Math.max(screenW, screenH);

    // Mobile smartphone detection:
    // Captures real smartphones in portrait & landscape, as well as devtools mobile responsive mode
    const isMobile =
      device.isMobile ||
      minDim <= 550 ||
      (!isCurrentPortrait && screenH <= 550 && screenW <= 1024);

    // Tablet detection (iPad, Android tablet, surface / devtools tablet screens)
    const isTablet =
      !isMobile &&
      (device.isTablet ||
        (minDim > 550 && minDim <= 1000 && maxDim <= 1366) ||
        (screenW >= 600 && screenW <= 1180));

    setIsMobileDevice(isMobile);
    setIsTabletDevice(isTablet);
    setIsPortrait(isCurrentPortrait);

    // Lock API support check
    const hasLockApi = Boolean(
      typeof screen !== "undefined" &&
        screen.orientation &&
        typeof (screen.orientation as any).lock === "function"
    );
    setLockSupported(hasLockApi);

    // If mobile & in portrait, strictly enforce landscape (no portrait allowed)
    if (isMobile && isCurrentPortrait) {
      setShowLandscapeNotice(true);
    } else if (isMobile && !isCurrentPortrait) {
      // Once in landscape, automatically close prompt
      setShowLandscapeNotice(false);
      setNoticeDismissed(false);
    }
  }, []);

  useEffect(() => {
    checkState();

    const handleResizeOrRotate = () => {
      checkState();
    };

    window.addEventListener("resize", handleResizeOrRotate);
    window.addEventListener("orientationchange", handleResizeOrRotate);

    if (typeof screen !== "undefined" && screen.orientation) {
      screen.orientation.addEventListener("change", handleResizeOrRotate);
    }

    return () => {
      window.removeEventListener("resize", handleResizeOrRotate);
      window.removeEventListener("orientationchange", handleResizeOrRotate);
      if (typeof screen !== "undefined" && screen.orientation) {
        screen.orientation.removeEventListener("change", handleResizeOrRotate);
      }
    };
  }, [checkState]);

  // Request rotation to landscape mode
  const requestLandscapeMode = useCallback(async (): Promise<{
    success: boolean;
    message?: string;
  }> => {
    setIsLocking(true);
    hapticFx.trigger("medium");

    try {
      // Step 1: Request Fullscreen if not already fullscreen (required for lock API on Android/Chrome)
      const docEl = document.documentElement as any;
      if (!document.fullscreenElement && docEl) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen().catch(() => {});
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen().catch(() => {});
        }
      }

      // Step 2: Try Screen Orientation Lock API
      if (
        typeof screen !== "undefined" &&
        screen.orientation &&
        typeof (screen.orientation as any).lock === "function"
      ) {
        await (screen.orientation as any).lock("landscape");
        setIsLocking(false);
        setShowLandscapeNotice(false);
        hapticFx.trigger("success");
        return { success: true };
      }

      // Step 3: If Screen Orientation Lock is not supported (e.g. iOS Safari)
      setIsLocking(false);
      return {
        success: false,
        message:
          "Putar perangkat Anda ke posisi horizontal (Landscape) dan pastikan rotasi otomatis diaktifkan.",
      };
    } catch (err: any) {
      setIsLocking(false);
      console.warn("Orientation lock error:", err);
      return {
        success: false,
        message:
          "Putar perangkat Anda ke posisi horizontal (Landscape) dan pastikan rotasi otomatis diaktifkan.",
      };
    }
  }, []);

  const dismissNotice = useCallback(() => {
    hapticFx.trigger("light");
    setNoticeDismissed(true);
    setShowLandscapeNotice(false);
  }, []);

  const openNotice = useCallback(() => {
    hapticFx.trigger("light");
    setNoticeDismissed(false);
    setShowLandscapeNotice(true);
  }, []);

  return {
    isMobileDevice,
    isTabletDevice,
    isPortrait,
    isLandscape: !isPortrait,
    showLandscapeNotice: isMobileDevice && isPortrait && showLandscapeNotice,
    lockSupported,
    isLocking,
    noticeDismissed,
    requestLandscapeMode,
    dismissNotice,
    openNotice,
  };
}
