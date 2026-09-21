import { useState, useEffect, useCallback } from "react";
import { getDeviceInfo } from "../../utils/deviceDetection";
import { hapticFx } from "../../utils/hapticFeedback";

export interface MobileOrientationState {
  isMobileDevice: boolean;
  isTabletDevice: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  showLandscapeNotice: boolean;
  noticeDismissed: boolean;
  dismissNotice: () => void;
  openNotice: () => void;
}

export function useMobileOrientation(): MobileOrientationState {
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [isTabletDevice, setIsTabletDevice] = useState<boolean>(false);
  const [isPortrait, setIsPortrait] = useState<boolean>(false);
  const [showLandscapeNotice, setShowLandscapeNotice] = useState<boolean>(false);
  const [noticeDismissed, setNoticeDismissed] = useState<boolean>(false);

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
      // Once in landscape, automatically close prompt and maintain lock
      setShowLandscapeNotice(false);
      setNoticeDismissed(false);
      
      // Keep landscape locked setiap saat
      if (hasLockApi) {
        (screen.orientation as any).lock("landscape").catch(() => {
          console.log("Maintain landscape lock");
        });
      }
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

    // Initial lock saat pertama kali load (jika sudah landscape)
    setTimeout(() => {
      const device = getDeviceInfo(true);
      const isMobile = device.isMobile || Math.min(window.innerWidth, window.innerHeight) <= 550;
      const isCurrentLandscape = window.innerWidth > window.innerHeight;
      
      if (isMobile && isCurrentLandscape) {
        if (
          typeof screen !== "undefined" &&
          screen.orientation &&
          typeof (screen.orientation as any).lock === "function"
        ) {
          (screen.orientation as any).lock("landscape").catch(() => {
            console.log("Initial landscape lock attempt");
          });
        }
      }
    }, 500);

    return () => {
      window.removeEventListener("resize", handleResizeOrRotate);
      window.removeEventListener("orientationchange", handleResizeOrRotate);
      if (typeof screen !== "undefined" && screen.orientation) {
        screen.orientation.removeEventListener("change", handleResizeOrRotate);
      }
    };
  }, [checkState]);

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
    noticeDismissed,
    dismissNotice,
    openNotice,
  };
}
