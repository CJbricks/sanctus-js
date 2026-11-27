/**
 * engine.js
 * Tiny original Web Audio chiptune stub for SANCTUS.
 *
 * Modeled loosely on the Game Boy APU: two pulse channels, one wave
 * channel, and one noise channel. No audio files — tones are built in
 * code. All music/SFX here is original.
 *
 * WHY audio waits for a gesture:
 * Browsers block Autoplay. We do not create an AudioContext until the
 * player presses a key or taps the screen. unlockAudio() is called from
 * those handlers.
 *
 * This is a stub: enough to beep a soft title arpeggio and honor mute.
 * Real songs will land later in src/game/audio/songs.js.
 */

const state = {
  installed: false,
  unlocked: false,
  ctx: null,
  master: null,
  muted: false,
  // Test / SSR host override.
  host: null,
  // Gentle friary loop handles (oscillators + interval).
  friary: null,
};

const listeners = new Set();

function hostWindow() {
  if (state.host) return state.host;
  return typeof window === "undefined" ? null : window;
}

function snapshot() {
  return {
    muted: state.muted,
    unlocked: state.unlocked,
  };
}

function emit() {
  const value = snapshot();
  for (const listener of listeners) listener(value);
}

/** Subscribe to mute / unlock changes (for the mute button UI). */
export function subscribeAudio(listener) {
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
}

export function getAudioState() {
  return snapshot();
}

function audibleGain() {
  return state.muted ? 0.0001 : 0.18;
}

function applyMaster() {
  if (!state.master) return;
  state.master.gain.value = audibleGain();
}

export function setMuted(muted) {
  state.muted = Boolean(muted);
  applyMaster();
  emit();
}

export function toggleMuted() {
  setMuted(!state.muted);
}

function ensureContext() {
  const win = hostWindow();
  if (!win) return null;
  const AudioCtx = win.AudioContext || win.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!state.ctx) {
    const ctx = new AudioCtx();
    const master = ctx.createGain();
    master.gain.value = audibleGain();
    master.connect(ctx.destination);
    state.ctx = ctx;
    state.master = master;
  }
  return state.ctx;
}

/**
 * Resume the audio clock inside a user gesture.
 * Safe to call many times; later taps just ensure the context is running.
 */
export function unlockAudio() {
  const ctx = ensureContext();
  if (!ctx) return;
  if (typeof ctx.resume === "function") {
    ctx.resume().catch(() => {});
  }
  state.unlocked = true;
  applyMaster();
  emit();
}

/**
 * Play a short original confirm sting using all four GB-style voices:
 * pulse1 + pulse2 (squares), wave (triangle), then a soft noise tick.
 * Does nothing until unlockAudio() has run at least once.
 */
export function playConfirmBeep() {
  if (!state.unlocked) return;
  const ctx = ensureContext();
  if (!ctx || !state.master) return;

  const now = ctx.currentTime;
  const peak = state.muted ? 0.0001 : 0.05;

  // Pulse 1 — lead square
  const pulse1 = ctx.createOscillator();
  pulse1.type = "square";
  pulse1.frequency.setValueAtTime(523.25, now); // C5
  const g1 = ctx.createGain();
  g1.gain.setValueAtTime(0.0001, now);
  g1.gain.exponentialRampToValueAtTime(peak, now + 0.01);
  g1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  pulse1.connect(g1);
  g1.connect(state.master);
  pulse1.start(now);
  pulse1.stop(now + 0.18);

  // Pulse 2 — harmony square a third above
  const pulse2 = ctx.createOscillator();
  pulse2.type = "square";
  pulse2.frequency.setValueAtTime(659.25, now + 0.04); // E5
  const g2 = ctx.createGain();
  g2.gain.setValueAtTime(0.0001, now + 0.04);
  g2.gain.exponentialRampToValueAtTime(peak * 0.7, now + 0.05);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  pulse2.connect(g2);
  g2.connect(state.master);
  pulse2.start(now + 0.04);
  pulse2.stop(now + 0.22);

  // Wave channel — triangle "bass" under the chord (GB wave approx)
  const wave = ctx.createOscillator();
  wave.type = "triangle";
  wave.frequency.setValueAtTime(261.63, now); // C4
  const gw = ctx.createGain();
  gw.gain.setValueAtTime(0.0001, now);
  gw.gain.exponentialRampToValueAtTime(peak * 0.5, now + 0.02);
  gw.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
  wave.connect(gw);
  gw.connect(state.master);
  wave.start(now);
  wave.stop(now + 0.26);

  // Noise channel — tiny confirm tick at the end
  const length = Math.floor(ctx.sampleRate * 0.05);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gn = ctx.createGain();
  const nStart = now + 0.18;
  gn.gain.setValueAtTime(state.muted ? 0.0001 : 0.03, nStart);
  gn.gain.exponentialRampToValueAtTime(0.0001, nStart + 0.05);
  noise.connect(gn);
  gn.connect(state.master);
  noise.start(nStart);
  noise.stop(nStart + 0.06);
}

/**
 * Soft noise tick for menu moves (LFSR-ish feel via filtered noise buffer).
 */
export function playCursorTick() {
  if (!state.unlocked || state.muted) return;
  const ctx = ensureContext();
  if (!ctx || !state.master) return;

  const length = Math.floor(ctx.sampleRate * 0.04);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1800;
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(state.master);
  source.start(now);
  source.stop(now + 0.05);
}

/**
 * Soft original chiptune pad for the friary grounds.
 * WHY a short looping arpeggio in code (no MP3):
 * Keeps the project asset-free and mute-friendly. Stops cleanly when
 * leaving the overworld. Never copies commercial game music.
 */
export function startFriaryLoop() {
  if (!state.unlocked || state.friary) return;
  const ctx = ensureContext();
  if (!ctx || !state.master) return;

  const notes = [261.63, 329.63, 392.0, 349.23]; // C E G F — calm open fifths feel
  let step = 0;
  const voices = [];

  function pulse(freq, start, dur, gainPeak) {
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, start);
    const g = ctx.createGain();
    const peak = state.muted ? 0.0001 : gainPeak;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(state.master);
    osc.start(start);
    osc.stop(start + dur + 0.02);
    voices.push(osc);
  }

  function tick() {
    if (!state.friary) return;
    const ctxNow = ensureContext();
    if (!ctxNow || !state.master) return;
    const now = ctxNow.currentTime;
    const freq = notes[step % notes.length];
    pulse(freq, now, 0.35, 0.025);
    // Quiet triangle under the pulse
    const tri = ctxNow.createOscillator();
    tri.type = "triangle";
    tri.frequency.setValueAtTime(freq / 2, now);
    const tg = ctxNow.createGain();
    tg.gain.setValueAtTime(state.muted ? 0.0001 : 0.015, now);
    tg.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    tri.connect(tg);
    tg.connect(state.master);
    tri.start(now);
    tri.stop(now + 0.42);
    voices.push(tri);
    step += 1;
  }

  const intervalId = setInterval(tick, 480);
  tick();
  state.friary = { intervalId, voices };
}

/** Stop the friary loop and release oscillators. */
export function stopFriaryLoop() {
  if (!state.friary) return;
  clearInterval(state.friary.intervalId);
  for (const v of state.friary.voices) {
    try {
      v.stop();
    } catch {
      // already stopped
    }
  }
  state.friary = null;
}

/**
 * Install global unlock listeners once (capture phase so preventDefault
 * on the D-pad cannot swallow the gesture before we resume audio).
 */
export function installAudio(options = {}) {
  const win = options.host || (typeof window === "undefined" ? null : window);
  if (state.installed || !win) return;
  state.installed = true;
  state.host = options.host || null;

  const unlock = () => unlockAudio();
  for (const type of ["pointerdown", "keydown", "touchstart", "click"]) {
    win.addEventListener(type, unlock, { capture: true });
  }

  // M toggles mute (same idea as many browser games).
  win.addEventListener(
    "keydown",
    (event) => {
      if (event.code !== "KeyM" || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      toggleMuted();
    },
    { capture: true },
  );

  emit();
}

/** Test helper: wipe module state between cases. */
export function resetAudioForTests() {
  stopFriaryLoop();
  state.installed = false;
  state.unlocked = false;
  state.ctx = null;
  state.master = null;
  state.muted = false;
  state.host = null;
  listeners.clear();
}
