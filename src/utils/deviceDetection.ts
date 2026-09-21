/**
 * Device & OS Detection Utility for Cross-Platform Adaptations
 * Accurately detects iOS (including iPadOS), Android, Windows, macOS, and Linux,
 * identifying platform capabilities and browser-specific quirks.
 */

export type OperatingSystem = "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
export type DeviceType = "mobile" | "tablet" | "desktop";

export interface DeviceInfo {
  os: OperatingSystem;
  osName: string;
  osDisplayName: string;
  deviceType: DeviceType;
  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isMacOS: boolean;
  isLinux: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
  isSafari: boolean;
  supportsHaptics: boolean;
  supportsNativeFullscreen: boolean;
  needsPseudoFullscreen: boolean;
  hasPhysicalEscKey: boolean;
  hasDownloadQuirks: boolean;
}

let cachedDeviceInfo: DeviceInfo | null = null;

export function getDeviceInfo(forceRefresh: boolean = false): DeviceInfo {
  if (cachedDeviceInfo && !forceRefresh) {
    // Dynamically update dimensional fields if window dimensions have changed
    if (typeof window !== "undefined") {
      const shortSide = Math.min(window.innerWidth, window.innerHeight);
      const isMobileByDim = shortSide <= 550;
      if (cachedDeviceInfo.isMobile !== (cachedDeviceInfo.isMobile || isMobileByDim)) {
        cachedDeviceInfo = null;
      } else {
        return cachedDeviceInfo;
      }
    } else {
      return cachedDeviceInfo;
    }
  }

  if (typeof window === "undefined" || typeof navigator === "undefined") {
    // Server-side / fallback default
    return {
      os: "unknown",
      osName: "Unknown",
      osDisplayName: "Unknown Device",
      deviceType: "desktop",
      isIOS: false,
      isAndroid: false,
      isWindows: false,
      isMacOS: false,
      isLinux: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouch: false,
      isSafari: false,
      supportsHaptics: false,
      supportsNativeFullscreen: true,
      needsPseudoFullscreen: false,
      hasPhysicalEscKey: true,
      hasDownloadQuirks: false,
    };
  }

  const ua = navigator.userAgent || "";
  const platform = (navigator as unknown as { userAgentData?: { platform?: string }; platform?: string }).platform || "";
  const maxTouchPoints = navigator.maxTouchPoints || 0;
  const isTouch = "ontouchstart" in window || maxTouchPoints > 0;

  // 1. Detect iOS & iPadOS (iPadOS 13+ spoof userAgent as MacIntel with touch support)
  const isIPad = /iPad/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
  const isIPhoneOrIPod = /iPhone|iPod/i.test(ua);
  const isIOS = isIPad || isIPhoneOrIPod;

  // 2. Detect Android
  const isAndroid = /Android/i.test(ua);

  // 3. Detect Windows
  const isWindows = /Windows|Win32|Win64/i.test(ua);

  // 4. Detect macOS (excluding iPadOS)
  const isMacOS = (/Macintosh|Mac OS X/i.test(ua) || platform === "MacIntel") && !isIOS;

  // 5. Detect Linux (excluding Android)
  const isLinux = /Linux/i.test(ua) && !isAndroid;

  // Browser detection
  const isSafari =
    /Safari/i.test(ua) &&
    !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS|mercury/i.test(ua);

  // Device Form Factor: use minimum dimension (short side) so orientation changes do not misclassify phones
  const shortSide = Math.min(window.innerWidth, window.innerHeight);
  const longSide = Math.max(window.innerWidth, window.innerHeight);
  const isMobileUA = /iPhone|iPod/i.test(ua) || (/Android/i.test(ua) && /Mobile/i.test(ua));
  
  // Any device with short side <= 550px is a phone regardless of rotation
  const isMobile = isMobileUA || shortSide <= 550;
  const isTablet = !isMobile && (isIPad || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || (isTouch && shortSide <= 900 && longSide <= 1366));
  const isDesktop = !isMobile && !isTablet;

  // Operating system key & friendly label
  let os: OperatingSystem = "unknown";
  let osName = "Lainnya";
  let osDisplayName = "Perangkat Web";

  if (isIOS) {
    os = "ios";
    osName = "iOS";
    osDisplayName = isIPad ? "Apple iPad (iPadOS)" : "Apple iPhone (iOS)";
  } else if (isAndroid) {
    os = "android";
    osName = "Android";
    osDisplayName = isTablet ? "Android Tablet" : "Android Smartphone";
  } else if (isWindows) {
    os = "windows";
    osName = "Windows";
    osDisplayName = "Microsoft Windows PC";
  } else if (isMacOS) {
    os = "macos";
    osName = "macOS";
    osDisplayName = "Apple Mac (macOS)";
  } else if (isLinux) {
    os = "linux";
    osName = "Linux";
    osDisplayName = "Linux Desktop";
  }

  // Capability checks
  // iOS Safari / WebKit explicitly does NOT support navigator.vibrate
  const supportsHaptics =
    !isIOS &&
    typeof navigator.vibrate === "function" &&
    isTouch;

  // Native fullscreen support check (iPhone Safari lacks document.documentElement.requestFullscreen)
  const supportsNativeFullscreen =
    typeof document !== "undefined" &&
    Boolean(
      document.documentElement &&
        (document.documentElement.requestFullscreen ||
          (document.documentElement as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen)
    );

  const needsPseudoFullscreen = isIOS || !supportsNativeFullscreen;
  const hasPhysicalEscKey = isDesktop;
  const hasDownloadQuirks = isIOS; // Safari opens blobs in new preview tabs

  cachedDeviceInfo = {
    os,
    osName,
    osDisplayName,
    deviceType: isMobile ? "mobile" : isTablet ? "tablet" : "desktop",
    isIOS,
    isAndroid,
    isWindows,
    isMacOS,
    isLinux,
    isMobile,
    isTablet,
    isDesktop,
    isTouch,
    isSafari,
    supportsHaptics,
    supportsNativeFullscreen,
    needsPseudoFullscreen,
    hasPhysicalEscKey,
    hasDownloadQuirks,
  };

  return cachedDeviceInfo;
}

export const device = getDeviceInfo();
