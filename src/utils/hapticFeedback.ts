/**
 * Tactile Haptic Feedback Engine for MindMap Interactive Canvas.
 * Uses the Web Vibration API (navigator.vibrate) with graceful fallbacks
 * and fine-tuned duration patterns for tactile physical feedback.
 */

import { device } from "./deviceDetection";
import { safeStorage } from "./safeStorage";

export type HapticType =
  | "click"
  | "light"
  | "selection"
  | "medium"
  | "impact"
  | "heavy"
  | "connect"
  | "detach"
  | "success"
  | "warning"
  | "delete"
  | "error"
  | "toggle"
  | "pop"
  | "spawn"
  | "zoom";

const STORAGE_KEY = "mindmap_haptics_enabled";

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  click: 10,
  light: 10,
  selection: 12,
  medium: 22,
  impact: 30,
  heavy: 45,
  connect: 24,
  detach: [15, 25],
  success: [15, 45, 25],
  warning: [30, 40, 30],
  delete: [35, 45, 35],
  error: [40, 35, 40, 35, 40],
  toggle: 16,
  pop: 14,
  spawn: [12, 35, 20],
  zoom: 8,
};

class HapticManager {
  private enabled: boolean = true;
  private lastTriggerTime: number = 0;
  private listeners: Set<(enabled: boolean) => void> = new Set();
  private isDeviceSupported: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.isDeviceSupported = device.supportsHaptics;

      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        this.enabled = saved === "true";
      } else {
        this.enabled = true;
      }
    }
  }

  public isSupported(): boolean {
    return this.isDeviceSupported;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    safeStorage.setItem(STORAGE_KEY, String(enabled));
    this.notify();
    if (enabled) {
      this.trigger("light");
    }
  }

  public toggle(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public addListener(listener: (enabled: boolean) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.enabled));
  }

  /**
   * Trigger haptic vibration feedback.
   * Can pass predefined HapticType, duration in ms, or pattern array.
   */
  public trigger(pattern: HapticType | number | number[] = "selection") {
    if (!this.enabled || typeof window === "undefined" || !this.isDeviceSupported) {
      return;
    }

    const now = performance.now();
    // Throttle triggers within 20ms to prevent vibration engine stuttering
    if (now - this.lastTriggerTime < 20) {
      return;
    }
    this.lastTriggerTime = now;

    try {
      let vibrationPattern: number | number[];

      if (typeof pattern === "string") {
        vibrationPattern = HAPTIC_PATTERNS[pattern] ?? 12;
      } else {
        vibrationPattern = pattern;
      }

      navigator.vibrate(vibrationPattern);
    } catch {
      // Ignore security or restriction errors when window not active
    }
  }
}

export const hapticFx = new HapticManager();
