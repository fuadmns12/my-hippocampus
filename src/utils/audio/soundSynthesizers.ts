import { SoundEffectType, ConnectAndTrackFn } from "./types";

// 1. Tactile subtle wooden/marble click (for button taps, controls, selections)
export function synthesizeClick(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

  gain.gain.setValueAtTime(0.35, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

  connectAndTrack(osc, gain, now, now + 0.04);
}

// 2. Cheerful modern bubble pop (for selecting nodes, presets, or tabs)
export function synthesizePop(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(680, now + 0.025);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.065);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

  connectAndTrack(osc, gain, now, now + 0.075);
}

// 3. Ascending harmonic shimmer (for generating branches / creating mindmap)
export function synthesizeSpawn(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + i * 0.045;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

    connectAndTrack(osc, gain, start, start + 0.23);
  });
}

// 4. Magnetic connection snap (for linking nodes or reparenting)
export function synthesizeConnect(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  // Primary resonant tone
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();

  osc1.type = "sine";
  osc1.frequency.setValueAtTime(880, now); // A5
  osc1.frequency.exponentialRampToValueAtTime(1174.66, now + 0.05); // D6

  gain1.gain.setValueAtTime(0.35, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

  connectAndTrack(osc1, gain1, now, now + 0.17);

  // Harmonic sparkle
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();

  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(1760, now + 0.03);

  gain2.gain.setValueAtTime(0.001, now + 0.03);
  gain2.gain.linearRampToValueAtTime(0.2, now + 0.045);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  connectAndTrack(osc2, gain2, now + 0.03, now + 0.23);
}

// 5. Soft woosh / line detachment snap (when disconnecting branch)
export function synthesizeDetach(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(620, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);

  gain.gain.setValueAtTime(0.32, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);

  connectAndTrack(osc, gain, now, now + 0.1);
}

// 6. Muted tactile thud (for deleting node or clearing canvas)
export function synthesizeDelete(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(45, now + 0.11);

  gain.gain.setValueAtTime(0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  connectAndTrack(osc, gain, now, now + 0.13);
}

// 7. Mechanical micro-switch toggle (for collapsing/expanding branches or mode changes)
export function synthesizeToggle(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  [0, 0.022].forEach((offset, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + offset;

    osc.type = "sine";
    osc.frequency.setValueAtTime(idx === 0 ? 540 : 820, start);
    osc.frequency.exponentialRampToValueAtTime(260, start + 0.02);

    gain.gain.setValueAtTime(0.28, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.025);

    connectAndTrack(osc, gain, start, start + 0.03);
  });
}

// 8. Warm celebratory chord (for saving, exporting, or loading presets)
export function synthesizeSuccess(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  const chord = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  chord.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = now + idx * 0.04;

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

    connectAndTrack(osc, gain, start, start + 0.36);
  });
}

// 9. Subtle pitch glide (for zoom in / out / reset)
export function synthesizeZoom(
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(420, now);
  osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

  connectAndTrack(osc, gain, now, now + 0.05);
}

export function playSynthesizedSound(
  type: SoundEffectType,
  ctx: AudioContext,
  now: number,
  connectAndTrack: ConnectAndTrackFn
) {
  switch (type) {
    case "click":
      synthesizeClick(ctx, now, connectAndTrack);
      break;
    case "pop":
      synthesizePop(ctx, now, connectAndTrack);
      break;
    case "spawn":
      synthesizeSpawn(ctx, now, connectAndTrack);
      break;
    case "connect":
      synthesizeConnect(ctx, now, connectAndTrack);
      break;
    case "detach":
      synthesizeDetach(ctx, now, connectAndTrack);
      break;
    case "delete":
      synthesizeDelete(ctx, now, connectAndTrack);
      break;
    case "toggle":
      synthesizeToggle(ctx, now, connectAndTrack);
      break;
    case "success":
      synthesizeSuccess(ctx, now, connectAndTrack);
      break;
    case "zoom":
      synthesizeZoom(ctx, now, connectAndTrack);
      break;
  }
}
