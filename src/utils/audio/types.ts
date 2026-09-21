export type SoundEffectType =
  | "click"
  | "pop"
  | "spawn"
  | "connect"
  | "detach"
  | "delete"
  | "toggle"
  | "success"
  | "zoom";

export const STORAGE_KEY = "mindmap_sound_fx_enabled";
export const VOLUME_STORAGE_KEY = "mindmap_sound_fx_volume";

export type ConnectAndTrackFn = (
  osc: OscillatorNode,
  gain: GainNode,
  startTime: number,
  stopTime: number
) => void;
