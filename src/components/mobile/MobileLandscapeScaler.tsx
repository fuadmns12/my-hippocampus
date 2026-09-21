import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { MobileOrientationState } from "./useMobileOrientation";

export interface MobileLandscapeScalerProps {
  children: React.ReactNode;
  orientation: MobileOrientationState;
}

/**
 * Base compact desktop / laptop layout width in pixels.
 * At 1260px, all header buttons and multi-column panels render in desktop layout.
 */
export const DESKTOP_BASE_WIDTH = 1260;

export const MobileLandscapeScaler: React.FC<MobileLandscapeScalerProps> = ({
  children,
  orientation,
}) => {
  const [scale, setScale] = useState<number>(0.65);
  const [supportsZoom, setSupportsZoom] = useState<boolean>(true);

  // Check if current device is a mobile smartphone in landscape orientation
  const isMobileLandscape = useMemo(() => {
    return orientation.isMobileDevice && orientation.isLandscape;
  }, [orientation.isMobileDevice, orientation.isLandscape]);

  // Check if device is a tablet
  const isTablet = orientation.isTabletDevice;

  // Active scaling applies to mobile smartphone in landscape OR tablet devices
  const isScalingActive = isMobileLandscape || isTablet;

  useEffect(() => {
    if (typeof CSS !== "undefined" && typeof CSS.supports === "function") {
      setSupportsZoom(CSS.supports("zoom", "1"));
    }
  }, []);

  useLayoutEffect(() => {
    // Desktop / Laptop screens are NEVER scaled or modified
    if (!isScalingActive) {
      document.body.classList.remove("mobile-landscape-active");
      document.body.classList.remove("tablet-scaled-active");
      document.documentElement.style.removeProperty("--mobile-landscape-scale");
      return;
    }

    if (isMobileLandscape) {
      document.body.classList.add("mobile-landscape-active");
      document.body.classList.remove("tablet-scaled-active");
    } else if (isTablet) {
      document.body.classList.add("tablet-scaled-active");
      document.body.classList.remove("mobile-landscape-active");
    }

    const updateScale = () => {
      const screenWidth = window.innerWidth || document.documentElement.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight;

      if (screenWidth > 0) {
        if (isMobileLandscape) {
          // Proportional scale factor matching phone's landscape width to the 1260px laptop layout
          const widthScale = Number((screenWidth / DESKTOP_BASE_WIDTH).toFixed(3));
          
          // Compact height factor: mobile landscape height is short (320px - 440px)
          const heightScale = screenHeight > 0 ? Number(((screenHeight / 520) * 0.85).toFixed(3)) : widthScale;
          
          // Pick the tighter scale so the layout fits comfortably without appearing huge
          const computed = Math.min(0.85, Math.max(0.40, Math.min(widthScale, heightScale)));
          setScale(computed);
          document.documentElement.style.setProperty(
            "--mobile-landscape-scale",
            String(computed)
          );
        } else if (isTablet) {
          // Tablet Scaling: Proportional downscaling so 1260px laptop layout fits beautifully on iPad/Android Tablet
          // e.g. 768px (iPad portrait) -> 768 / 1260 = ~0.61; 810px -> ~0.64; 1024px (iPad landscape) -> ~0.81
          const tabletScaleFactor = Number((screenWidth / DESKTOP_BASE_WIDTH).toFixed(3));
          const computed = Math.min(0.92, Math.max(0.55, tabletScaleFactor));
          setScale(computed);
          document.documentElement.style.setProperty(
            "--mobile-landscape-scale",
            String(computed)
          );
        }
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
      document.body.classList.remove("mobile-landscape-active");
      document.body.classList.remove("tablet-scaled-active");
      document.documentElement.style.removeProperty("--mobile-landscape-scale");
    };
  }, [isScalingActive, isMobileLandscape, isTablet]);

  // If neither mobile in landscape nor tablet, render directly without any wrappers or scaling
  if (!isScalingActive) {
    return <>{children}</>;
  }

  return (
    <div
      id="mobile-landscape-outer-wrapper"
      className="w-full max-w-full overflow-x-hidden min-h-screen bg-black"
    >
      <div
        id="mobile-landscape-viewport"
        className="mobile-landscape-viewport"
        style={
          supportsZoom
            ? {
                width: `${DESKTOP_BASE_WIDTH}px`,
                minWidth: `${DESKTOP_BASE_WIDTH}px`,
                zoom: scale,
              }
            : {
                width: `${DESKTOP_BASE_WIDTH}px`,
                minWidth: `${DESKTOP_BASE_WIDTH}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }
        }
      >
        {children}
      </div>
    </div>
  );
};

