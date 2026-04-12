/**
 * Lightweight bowling-alley ambience + occasional pin hits via Web Audio (no MP3 assets).
 * Call `resume()` from a user gesture before playing.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("bowling-synth: no window");
  }
  if (!ctx) {
    ctx = new AudioContext();
  }
  return ctx;
}

export function resumeBowlingAudio(): Promise<void> {
  const c = getCtx();
  if (c.state === "suspended") {
    return c.resume();
  }
  return Promise.resolve();
}

function noiseBuffer(durationSec: number): AudioBuffer {
  const c = getCtx();
  const len = Math.floor(c.sampleRate * durationSec);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.5;
  }
  return buf;
}

/** Single pin / wood hit */
export function playPinPlink(delay = 0, pitch = 1): void {
  const c = getCtx();
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(180 * pitch, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.16);
}

/** Cluster of pins (strike-ish) */
export function playPinScatter(): void {
  const c = getCtx();
  const t = c.currentTime;
  const count = 6 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) {
    const delay = i * (0.02 + Math.random() * 0.045);
    const pitch = 0.85 + Math.random() * 0.35;
    playPinPlink(delay, pitch);
  }
  // subtle low thud
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(55, t);
  osc.frequency.exponentialRampToValueAtTime(35, t + 0.12);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  osc.connect(g);
  g.connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.22);
}

let ambienceNodes: {
  src: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
} | null = null;

export function startAlleyAmbience(): void {
  if (ambienceNodes) return;
  const c = getCtx();
  const buf = noiseBuffer(2);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const gain = c.createGain();
  gain.gain.value = 0.018;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start();
  ambienceNodes = { src, filter, gain };
}

export function stopAlleyAmbience(): void {
  if (!ambienceNodes) return;
  try {
    ambienceNodes.src.stop();
  } catch {
    /* already stopped */
  }
  ambienceNodes = null;
}
