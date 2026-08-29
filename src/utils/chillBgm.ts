/**
 * Generative Procedural Chill BGM Synthesizer (Web Audio API)
 * Plays soothing, instrumental, lofi/ambient chill music with zero external audio files.
 */

let bgmAudioCtx: AudioContext | null = null;
let bgmMasterGain: GainNode | null = null;
let isBgmPlaying = false;
let stepTimer: ReturnType<typeof setTimeout> | null = null;
let currentChordIdx = 0;
let currentStep = 0;

// Chord Frequencies (Fmaj9, Em7, Dm9, Cmaj9)
const CHORDS = [
  {
    name: 'Fmaj9',
    bass: 87.31, // F2
    pad: [174.61, 220.0, 261.63, 329.63, 392.0], // F3, A3, C4, E4, G4
    melodyScale: [261.63, 329.63, 392.0, 440.0, 523.25, 659.25, 783.99], // C4, E4, G4, A4, C5, E5, G5
  },
  {
    name: 'Em7',
    bass: 82.41, // E2
    pad: [164.81, 196.0, 246.94, 293.66, 392.0], // E3, G3, B3, D4, G4
    melodyScale: [246.94, 293.66, 329.63, 392.0, 493.88, 587.33, 659.25], // B3, D4, E4, G4, B4, D5, E5
  },
  {
    name: 'Dm9',
    bass: 73.42, // D2
    pad: [146.83, 174.61, 220.0, 261.63, 329.63], // D3, F3, A3, C4, E4
    melodyScale: [220.0, 261.63, 293.66, 349.23, 440.0, 523.25, 587.33], // A3, C4, D4, F4, A4, C5, D5
  },
  {
    name: 'Cmaj9',
    bass: 65.41, // C2
    pad: [130.81, 164.81, 196.0, 246.94, 293.66], // C3, E3, G3, B3, D4
    melodyScale: [196.0, 246.94, 261.63, 329.63, 392.0, 493.88, 523.25], // G3, B3, C4, E4, G4, B4, C5
  },
];

function getBgmContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!bgmAudioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      bgmAudioCtx = new AudioContextClass();
    }
  }
  if (bgmAudioCtx && bgmAudioCtx.state === 'suspended') {
    bgmAudioCtx.resume().catch(() => {});
  }
  return bgmAudioCtx;
}

/**
 * Plays a warm, soft Rhodes/Pad chord
 */
function playChillPadChord(ctx: AudioContext, freqs: number[], master: GainNode, duration = 3.6) {
  const now = ctx.currentTime;

  // Filter for warmth (soft lofi sound)
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(650, now);
  filter.frequency.linearRampToValueAtTime(850, now + 1.2);
  filter.frequency.linearRampToValueAtTime(550, now + duration);

  const chordGain = ctx.createGain();
  chordGain.gain.setValueAtTime(0, now);
  chordGain.gain.linearRampToValueAtTime(0.08, now + 0.4);
  chordGain.gain.setValueAtTime(0.08, now + duration - 0.8);
  chordGain.gain.linearRampToValueAtTime(0.001, now + duration);

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = i % 2 === 0 ? 'sine' : 'triangle';
    // Subtle detune for lush chorus feel
    osc.detune.setValueAtTime((i - 2) * 5, now);
    osc.frequency.setValueAtTime(freq, now);

    osc.connect(filter);
    osc.start(now);
    osc.stop(now + duration + 0.1);
  });

  filter.connect(chordGain);
  chordGain.connect(master);
}

/**
 * Plays a deep, warm sub-bass note
 */
function playChillBass(ctx: AudioContext, freq: number, master: GainNode, duration = 3.6) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
  gain.gain.setValueAtTime(0.12, now + duration - 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(master);

  osc.start(now);
  osc.stop(now + duration + 0.1);
}

/**
 * Plays a gentle, sparkling music-box / kalimba pluck
 */
function playKalimbaPluck(ctx: AudioContext, freq: number, master: GainNode, timeOffset = 0) {
  const now = ctx.currentTime + timeOffset;

  const osc = ctx.createOscillator();
  const overtone = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  overtone.type = 'triangle';
  overtone.frequency.setValueAtTime(freq * 2, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc.connect(filter);
  overtone.connect(filter);
  filter.connect(gain);
  gain.connect(master);

  osc.start(now);
  overtone.start(now);
  osc.stop(now + 1.3);
  overtone.stop(now + 1.3);
}

/**
 * Advance one musical beat/measure in the chill loop
 */
function tickChillMusic() {
  if (!isBgmPlaying) return;

  const ctx = getBgmContext();
  if (!ctx || !bgmMasterGain) return;

  const chord = CHORDS[currentChordIdx];
  const stepDuration = 3800; // 3.8s per chord measure (~63 BPM)

  // 1. Play background lush pad and bass
  playChillPadChord(ctx, chord.pad, bgmMasterGain, 3.8);
  playChillBass(ctx, chord.bass, bgmMasterGain, 3.8);

  // 2. Play gentle arpeggiated kalimba plucks across the measure
  const melodyNotes = chord.melodyScale;
  const numPlucks = 4;
  for (let i = 0; i < numPlucks; i++) {
    // Pick melodic note smoothly
    const noteIdx = (currentStep * 2 + i * 3) % melodyNotes.length;
    const freq = melodyNotes[noteIdx];
    const delay = (i * 0.9) + (Math.random() * 0.1);
    playKalimbaPluck(ctx, freq, bgmMasterGain, delay);
  }

  // Progress to next chord
  currentChordIdx = (currentChordIdx + 1) % CHORDS.length;
  currentStep++;

  stepTimer = setTimeout(() => {
    tickChillMusic();
  }, stepDuration);
}

export function startChillBgm(volume = 0.6) {
  if (isBgmPlaying) return;
  try {
    const ctx = getBgmContext();
    if (!ctx) return;

    if (!bgmMasterGain) {
      bgmMasterGain = ctx.createGain();
      bgmMasterGain.gain.setValueAtTime(0, ctx.currentTime);
      bgmMasterGain.connect(ctx.destination);
    }

    isBgmPlaying = true;
    bgmMasterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.2);

    tickChillMusic();
  } catch {
    // Ignore audio initialization errors
  }
}

export function stopChillBgm() {
  if (!isBgmPlaying) return;
  isBgmPlaying = false;

  if (stepTimer) {
    clearTimeout(stepTimer);
    stepTimer = null;
  }

  if (bgmMasterGain && bgmAudioCtx) {
    try {
      const now = bgmAudioCtx.currentTime;
      bgmMasterGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
    } catch {
      // Ignore audio ramp errors
    }
  }
}

export function setChillBgmVolume(volume: number) {
  if (bgmMasterGain && bgmAudioCtx) {
    try {
      const now = bgmAudioCtx.currentTime;
      bgmMasterGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, volume)), now + 0.1);
    } catch {
      // Ignore
    }
  }
}

export function toggleChillBgm(shouldPlay?: boolean): boolean {
  const targetState = shouldPlay !== undefined ? shouldPlay : !isBgmPlaying;
  if (targetState) {
    startChillBgm(0.6);
  } else {
    stopChillBgm();
  }
  return isBgmPlaying;
}
