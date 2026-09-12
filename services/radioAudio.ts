// Web Audio API realistic radio squelch & Motorola walkie-talkie audio synthesizer
// Synthesizes authentic walkie-talkie PTT key-up beep, band-passed noise burst, and Roger beep / squelch tail.

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
  }
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

/**
 * Play a synthetic Motorola / Walkie-Talkie Push-To-Talk (PTT) key-in sound:
 * 1. High-frequency dual-tone chirp (MDC-1200 / trunking prompt)
 * 2. Brief radio squelch click
 */
export function playRadioPttKeyDown(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Dual-tone trunking / key-up beep (900Hz & 1400Hz)
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const beepGain = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'sine';
  osc1.frequency.setValueAtTime(941, now);
  osc2.frequency.setValueAtTime(1336, now);

  beepGain.gain.setValueAtTime(0.08, now);
  beepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  osc1.connect(beepGain);
  osc2.connect(beepGain);
  beepGain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.08);
  osc2.stop(now + 0.08);

  // 2. Micro-burst of band-passed white noise (RF squelch break)
  playWhiteNoiseBurst(ctx, now + 0.04, 0.06, 1600, 2.5, 0.06);
}

/**
 * Play synthetic PTT Key-Up / Dekey squelch tail ("krrr-tchk"):
 * The classic signature sound when releasing the walkie-talkie button.
 */
export function playRadioPttKeyUp(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. Band-passed noise burst (FM receiver squelch closing)
  playWhiteNoiseBurst(ctx, now, 0.12, 1400, 3.0, 0.12);

  // 2. Trailing low thud/click (mechanical PTT release switch)
  const osc = ctx.createOscillator();
  const clickGain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(160, now + 0.09);
  osc.frequency.exponentialRampToValueAtTime(40, now + 0.14);

  clickGain.gain.setValueAtTime(0.12, now + 0.09);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(clickGain);
  clickGain.connect(ctx.destination);

  osc.start(now + 0.09);
  osc.stop(now + 0.14);
}

/**
 * Play transmission confirmation / radio Roger beep
 */
export function playRadioRogerBeep(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // High tone followed by higher tone (typical field radio ack)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1050, now);
  osc.frequency.setValueAtTime(1250, now + 0.06);

  gain.gain.setValueAtTime(0.07, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.14);

  // Squelch tail
  playWhiteNoiseBurst(ctx, now + 0.14, 0.08, 1500, 2.0, 0.08);
}

/**
 * Generate a synthesized burst of radio static noise filtered through
 * communications-band frequency curve.
 */
function playWhiteNoiseBurst(
  ctx: AudioContext,
  startTime: number,
  duration: number,
  centerFreq: number,
  Q: number,
  volume: number
): void {
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  // Bandpass filter to mimic walkie-talkie speaker acoustics
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(centerFreq, startTime);
  filter.Q.setValueAtTime(Q, startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  whiteNoise.start(startTime);
  whiteNoise.stop(startTime + duration);
}
