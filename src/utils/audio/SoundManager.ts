import { hapticFx } from "../hapticFeedback";
import { SoundEffectType, STORAGE_KEY, VOLUME_STORAGE_KEY } from "./types";
import { playSynthesizedSound } from "./soundSynthesizers";
import { setupAudioUnlockListeners, setupGlobalClickListener } from "./audioContextUnlock";
import { safeStorage } from "../safeStorage";

export class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.35;
  private masterGain: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private listeners: Set<(enabled: boolean, volume: number) => void> = new Set();
  private lastPlayTimes: Map<SoundEffectType, number> = new Map();
  private lastSoundPlayTimestamp: number = 0;
  private activeVoiceCount: number = 0;
  private readonly MAX_CONCURRENT_VOICES = 16;
  private unlocked: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      const saved = safeStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        this.enabled = saved === "true";
      } else {
        this.enabled = true;
      }

      const savedVol = safeStorage.getItem(VOLUME_STORAGE_KEY);
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed;
        }
      }

      // Automatically setup listeners to unlock AudioContext on first user gesture
      setupAudioUnlockListeners(() => this.unlockAudio());

      // Setup global click sound fallback
      setupGlobalClickListener(
        () => this.unlockAudio(),
        () => this.enabled,
        (ms) => this.wasSoundRecentlyPlayed(ms),
        () => this.play("click")
      );
    }
  }

  public unlockAudio() {
    if (this.unlocked && this.ctx && this.ctx.state === "running") return;
    this.initContext();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().then(() => {
        this.unlocked = true;
      }).catch(() => {});
    } else if (this.ctx && this.ctx.state === "running") {
      this.unlocked = true;
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // 1. Master Gain for user-controlled volume
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

        // 2. Dynamics Compressor / Limiter to prevent audio clipping & distortion
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-6, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.08, this.ctx.currentTime);

        // Connect graph: Sources -> masterGain -> compressor -> destination
        this.masterGain.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }

    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    safeStorage.setItem(STORAGE_KEY, String(val));
    this.notifyListeners();
    if (val) {
      this.play("pop");
    }
  }

  public toggleEnabled(): boolean {
    this.setEnabled(!this.enabled);
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    safeStorage.setItem(VOLUME_STORAGE_KEY, String(this.volume));
    this.notifyListeners();
  }

  public subscribe(listener: (enabled: boolean, volume: number) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l(this.enabled, this.volume));
  }

  public wasSoundRecentlyPlayed(withinMs = 50): boolean {
    return performance.now() - this.lastSoundPlayTimestamp < withinMs;
  }

  /**
   * Helper to connect and automatically disconnect oscillator + gain nodes on completion.
   * Prevents memory leaks and handles cleanup safely with fallback timers.
   */
  public connectAndTrack(
    osc: OscillatorNode,
    gain: GainNode,
    startTime: number,
    stopTime: number
  ) {
    if (!this.masterGain) return;
    try {
      osc.connect(gain);
      gain.connect(this.masterGain);
    } catch {
      return;
    }

    this.activeVoiceCount++;

    try {
      osc.start(startTime);
      osc.stop(stopTime);
    } catch {
      this.activeVoiceCount = Math.max(0, this.activeVoiceCount - 1);
      return;
    }

    let cleanedUp = false;
    const cleanup = () => {
      if (cleanedUp) return;
      cleanedUp = true;
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Safe to ignore if already detached
      }
      this.activeVoiceCount = Math.max(0, this.activeVoiceCount - 1);
    };

    osc.onended = cleanup;
    // Fallback timer in case onended doesn't fire due to context state changes
    const durationMs = Math.max(60, (stopTime - startTime) * 1000 + 80);
    setTimeout(cleanup, durationMs);
  }

  public play(type: SoundEffectType) {
    // Trigger tactile haptic feedback in tandem with the action
    try {
      hapticFx.trigger(type);
    } catch {
      // Safe fallback
    }

    if (!this.enabled || typeof window === "undefined") return;

    // 1. Throttle rapid repeated triggers to prevent AudioContext congestion
    const nowMs = performance.now();
    const minInterval = type === "zoom" ? 60 : 25;
    const last = this.lastPlayTimes.get(type) || 0;
    if (nowMs - last < minInterval) return;
    this.lastPlayTimes.set(type, nowMs);
    this.lastSoundPlayTimestamp = nowMs;

    try {
      const ctx = this.initContext();
      if (!ctx || !this.masterGain) return;

      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      // Avoid overflowing voices
      if (this.activeVoiceCount >= this.MAX_CONCURRENT_VOICES) {
        this.activeVoiceCount = Math.min(this.activeVoiceCount, this.MAX_CONCURRENT_VOICES);
        return;
      }

      const now = ctx.currentTime;
      playSynthesizedSound(type, ctx, now, (osc, gain, st, sp) =>
        this.connectAndTrack(osc, gain, st, sp)
      );
    } catch {
      // Autoplay policy or browser audio disabled
    }
  }
}
