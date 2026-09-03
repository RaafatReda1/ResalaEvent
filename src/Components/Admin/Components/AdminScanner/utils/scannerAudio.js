/**
 * Audio and Haptic feedback generator for event QR code scanner.
 * Uses Web Audio API oscillator synthesis so no external audio files are needed.
 */

let audioCtx = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Play high crisp two-tone chime for successful first-time verification
 */
export const playSuccessSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Two-tone melody (880Hz -> 1320Hz)
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1320, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.start(now);
    osc.stop(now + 0.32);
  } catch (e) {
    console.warn("Audio feedback error:", e);
  }
};

/**
 * Play double medium-pitch alert tone for duplicate/already scanned code
 */
export const playWarningSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Descending tone alert
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.setValueAtTime(360, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    console.warn("Audio feedback error:", e);
  }
};

/**
 * Play low error buzz for invalid / not-found code
 */
export const playErrorSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(160, now);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    console.warn("Audio feedback error:", e);
  }
};

/**
 * Haptic vibrations for mobile devices
 */
export const triggerHaptic = (type = "success") => {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  try {
    if (type === "success") {
      navigator.vibrate([70, 40, 90]);
    } else if (type === "warning") {
      navigator.vibrate([200, 80, 200]);
    } else if (type === "error") {
      navigator.vibrate([350]);
    }
  } catch (e) {
    // vibration not allowed or failed
  }
};
