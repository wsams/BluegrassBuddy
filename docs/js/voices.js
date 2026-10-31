/** Plucked chairs: a short Karplus-Strong loop plus a few partials so the pitch stays clear. */

const noiseBuffers = new WeakMap();
let driveCurve;

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function noiseBuffer(ctx) {
  let buffer = noiseBuffers.get(ctx);
  if (buffer) return buffer;
  const len = Math.max(1, ctx.sampleRate);
  buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  noiseBuffers.set(ctx, buffer);
  return buffer;
}

function sharedDriveCurve() {
  if (driveCurve) return driveCurve;
  const n = 1024;
  const curve = new Float32Array(n);
  const amount = 1.8;
  const norm = Math.tanh(amount);
  for (let i = 0; i < n; i += 1) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * amount) / norm;
  }
  driveCurve = curve;
  return curve;
}

export function makeDrive(ctx, amount = 1.6) {
  const shaper = ctx.createWaveShaper();
  shaper.curve = amount > 1.15 ? sharedDriveCurve() : null;
  shaper.oversample = '2x';
  return shaper;
}

function decayEnv(param, time, peak, dur, attack = 0.004) {
  const a = Math.max(0.003, Math.min(attack, Math.max(dur * 0.4, 0.003)));
  const end = time + Math.max(dur, a + 0.025);
  const level = Math.max(peak, 0.0002);
  param.cancelScheduledValues(time);
  param.setValueAtTime(0.0001, time);
  param.exponentialRampToValueAtTime(level, time + a);
  param.exponentialRampToValueAtTime(0.0001, end);
  return end;
}

function sustainEnv(param, time, peak, dur, attack) {
  const a = Math.max(0.008, Math.min(attack, dur * 0.45));
  const release = Math.min(0.08, Math.max(0.02, dur * 0.22));
  const end = time + Math.max(dur, a + release);
  const level = Math.max(peak, 0.0002);
  param.cancelScheduledValues(time);
  param.setValueAtTime(0.0001, time);
  param.exponentialRampToValueAtTime(level, time + a);
  if (end - release > time + a + 0.008) param.setValueAtTime(level, end - release);
  param.exponentialRampToValueAtTime(0.0001, end);
  return end;
}

function arm(node, start, stop, extras = []) {
  node.onended = () => {
    for (const item of [node, ...extras]) {
      try { item.disconnect(); } catch { /* already released */ }
    }
  };
  node.start(start);
  node.stop(Math.max(stop, start + 0.03));
}

function sineOsc(ctx, dest, time, freq, gain, dur, dropCents = 0) {
  if (!(gain > 0.0008) || dur < 0.02 || !(freq > 20)) return;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  const startF = freq * 2 ** (dropCents / 1200);
  osc.frequency.setValueAtTime(Math.max(20, startF), time);
  if (dropCents > 0.6) {
    osc.frequency.exponentialRampToValueAtTime(freq, time + Math.min(0.055, dur * 0.4));
  }
  const g = ctx.createGain();
  const end = decayEnv(g.gain, time, gain, dur, 0.003);
  osc.connect(g).connect(dest);
  arm(osc, time, end, [g]);
}

function noiseBurst(ctx, dest, time, { dur = 0.02, gain = 0.08, type = 'highpass', freq = 2200, q = 0.7 } = {}) {
  if (!(gain > 0.001) || dur < 0.004) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(Math.max(40, freq), time);
  filter.Q.setValueAtTime(q, time);
  const g = ctx.createGain();
  const end = decayEnv(g.gain, time, gain, dur, 0.002);
  src.connect(filter).connect(g).connect(dest);
  arm(src, time, end, [filter, g]);
}

function karplus(ctx, dest, time, freq, opts) {
  const sr = ctx.sampleRate;
  const period = Math.max(8, Math.round(sr / freq));
  const dur = Math.max(0.05, opts.decay || 0.2);
  const n = Math.max(period + 2, Math.floor(sr * dur));
  const buffer = ctx.createBuffer(1, n, sr);
  const out = buffer.getChannelData(0);
  for (let i = 0; i < period; i += 1) {
    out[i] = (Math.random() * 2 - 1) * (1 - i / period) ** 0.35;
  }
  let mean = 0;
  for (let i = 0; i < period; i += 1) mean += out[i];
  mean /= period;
  for (let i = 0; i < period; i += 1) out[i] -= mean;

  const fb = Math.min(0.97, Math.max(0.35, opts.loopFb || 0.85));
  const loopGain = fb ** (1 / period);
  const cutoff = Math.max(120, opts.loopCutoff || 2000);
  const avg = Math.min(0.82, Math.max(0.08, 1 - cutoff / 9000));
  for (let i = period; i < n; i += 1) {
    const older = i - period - 1;
    const prev = older >= 0 ? out[older] : out[i - period];
    out[i] = loopGain * ((1 - avg) * out[i - period] + avg * prev);
  }
  const fadeIn = Math.min(period, Math.floor(sr * 0.002));
  for (let i = 0; i < fadeIn; i += 1) out[i] *= i / fadeIn;
  const fadeOut = Math.min(Math.floor(sr * 0.01), Math.floor(n / 5));
  for (let i = 0; i < fadeOut; i += 1) out[n - 1 - i] *= i / Math.max(1, fadeOut);

  let peak = 0.0001;
  for (let i = 0; i < n; i += 1) peak = Math.max(peak, Math.abs(out[i]));
  const norm = 0.95 / peak;
  for (let i = 0; i < n; i += 1) out[i] *= norm;

  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(Math.max(0.0001, opts.gain || 0.1), time);
  src.connect(gain).connect(dest);
  arm(src, time, time + dur + 0.02, [gain]);
}

export function stringVoice(role, tone = 0.6, color = 0.5) {
  const t = clamp01(tone);
  const c = clamp01(color);
  const table = {
    boom: {
      decay: 0.26 + (1 - c) * 0.08,
      ks: 0.16,
      sine: 0.045,
      partials: 4,
      slope: 0.32 + (1 - t) * 0.12,
      pick: 0.02 + c * 0.025,
      pickFreq: 420 + t * 1100,
      pitchDrop: 8 + c * 6,
      knock: 0.035 + c * 0.04,
      loopCutoff: 800 + t * 1800,
      loopFb: 0.86,
      wobble: 3,
      bassBoost: 1,
    },
    strum: {
      decay: 0.18 + (1 - c) * 0.1,
      ks: 0.058,
      sine: 0.02,
      partials: 3,
      slope: 0.38 + (1 - t) * 0.1,
      pick: 0.012,
      pickFreq: 1500 + t * 2400,
      pitchDrop: 3,
      knock: 0.008,
      loopCutoff: 1400 + t * 3400,
      loopFb: 0.82,
      chordPick: 0.022 + c * 0.028,
      bassBoost: 1.35,
      wobble: 4,
    },
    chuck: {
      decay: Math.max(0.04, 0.1 - c * 0.05),
      ks: 0.062,
      sine: 0.02,
      partials: 2,
      slope: 0.48,
      pick: 0.016,
      pickFreq: 1700 + t * 2600,
      pitchDrop: 5 + c * 8,
      knock: 0,
      loopCutoff: 1800 + t * 3200,
      loopFb: Math.max(0.48, 0.68 - c * 0.14),
      chordPick: 0.03 + c * 0.07,
      bassBoost: 0.55,
      wobble: 5,
    },
    mando: {
      decay: Math.max(0.035, 0.09 - c * 0.045),
      ks: 0.05,
      sine: 0.02,
      partials: 2,
      slope: 0.46,
      pick: 0.014 + c * 0.02,
      pickFreq: 2400 + t * 2800,
      pitchDrop: 3,
      knock: 0,
      loopCutoff: 2000 + t * 3800,
      loopFb: Math.max(0.5, 0.74 - c * 0.16),
      wobble: 2,
    },
    tremolo: {
      decay: 0.08,
      ks: 0.02,
      sine: 0.012,
      partials: 2,
      slope: 0.44,
      pick: 0.008,
      pickFreq: 2600 + t * 1800,
      pitchDrop: 0,
      knock: 0,
      loopCutoff: 1800 + t * 3000,
      loopFb: 0.8,
      wobble: 2,
    },
    banjo: {
      decay: 0.07 + c * 0.16,
      ks: 0.12,
      sine: 0.024,
      partials: 2,
      slope: 0.58,
      pick: 0.012,
      pickFreq: 2800 + t * 2000,
      pitchDrop: 2,
      knock: 0.012,
      loopCutoff: 2000 + t * 3600,
      loopFb: Math.min(0.9, 0.82 + c * 0.05),
      clang: 0.016 + c * 0.028,
      wobble: 7,
    },
    bass: {
      decay: Math.max(0.12, 0.2 - c * 0.06),
      ks: 0.05,
      sine: 0.075,
      partials: 3,
      slope: 0.26 + (1 - t) * 0.1,
      pick: 0.012 + c * 0.05,
      pickFreq: 160 + t * 420,
      pitchDrop: 16 + c * 12,
      knock: 0.03 + c * 0.07,
      loopCutoff: 240 + t * 700,
      loopFb: 0.84,
      wobble: 2,
    },
  };
  return { ...(table[role] || table.strum) };
}

export function bowedVoice(tone = 0.55, color = 0.4) {
  const t = clamp01(tone);
  const c = clamp01(color);
  return {
    gain: 0.072,
    brightness: 0.28 + t * 0.72,
    rosin: 0.1 + c * 0.75,
    vibrato: 0.0042,
  };
}

export function steelVoice(tone = 0.5, color = 0.6) {
  const t = clamp01(tone);
  const c = clamp01(color);
  return {
    gain: 0.05,
    brightness: t,
    attack: 0.055 + c * 0.48,
    vibrato: 0.0032,
  };
}

export function strike(ctx, dest, time, freq, opts = {}) {
  if (!ctx || !dest || !(freq > 25) || freq > 5000) return;
  const wobble = (opts.wobble || 0) * (Math.random() - 0.5);
  const f0 = freq * 2 ** (((opts.detune || 0) + wobble) / 1200);
  const decay = Math.max(0.035, opts.decay || 0.2);
  if (opts.ks > 0) {
    karplus(ctx, dest, time, f0, {
      decay,
      gain: opts.ks,
      loopCutoff: opts.loopCutoff,
      loopFb: opts.loopFb,
    });
  }
  const slope = opts.slope ?? 0.45;
  const partials = opts.partials || 0;
  for (let h = 1; h <= partials; h += 1) {
    const amp = (opts.sine || 0) * slope ** (h - 1);
    if (amp < 0.003) break;
    const partial = f0 * h * (1 + 0.00022 * h * h);
    sineOsc(ctx, dest, time, partial, amp, decay * 0.78 ** (h - 1), h === 1 ? opts.pitchDrop || 0 : 0);
  }
  if (opts.clang > 0) sineOsc(ctx, dest, time, f0 * 2.76, opts.clang, Math.min(0.055, decay), 0);
  if (opts.knock > 0) {
    const knockF = f0 < 180 ? 82 : 118;
    sineOsc(ctx, dest, time, knockF, opts.knock, 0.042, 16);
  }
  if (opts.pick > 0) {
    noiseBurst(ctx, dest, time, {
      dur: 0.01 + Math.min(0.016, opts.pick * 0.05),
      gain: opts.pick,
      type: f0 < 160 ? 'bandpass' : 'highpass',
      freq: opts.pickFreq || 2200,
      q: f0 < 160 ? 1.1 : 0.7,
    });
  }
}

export function strikeChord(ctx, dest, time, midis, voice, { spread = 0.01, dropBass = false } = {}) {
  let notes = [...(midis || [])].filter((midi) => midi > 0).sort((a, b) => a - b);
  if (dropBass && notes.length > 1) notes = notes.slice(1);
  if (!notes.length) return;
  if (voice.chordPick) {
    noiseBurst(ctx, dest, time, {
      dur: 0.02,
      gain: voice.chordPick,
      type: 'bandpass',
      freq: voice.pickFreq || 2400,
      q: 0.85,
    });
  }
  notes.forEach((midi, i) => {
    const freq = 440 * 2 ** ((midi - 69) / 12);
    const boost = i === 0 ? (voice.bassBoost || 1) : Math.max(0.6, 1 - i * 0.055);
    strike(ctx, dest, time + i * spread, freq, {
      ...voice,
      chordPick: 0,
      decay: voice.decay * (i === 0 ? 1 : 0.84),
      ks: (voice.ks || 0) * boost,
      sine: (voice.sine || 0) * boost,
      pick: (voice.pick || 0) * (i === 0 ? 1 : 0.65),
    });
  });
}

export function bowNote(ctx, dest, time, freq, dur, opts = {}) {
  if (!ctx || !dest || !(freq > 40) || !(dur > 0.03)) return;
  const gain = opts.gain ?? 0.026;
  const brightness = clamp01(opts.brightness ?? 0.5);
  const rosin = clamp01(opts.rosin ?? 0.3);
  const scoop = opts.scoop || 0;
  const vibrato = opts.vibrato || 0;
  const attack = Math.min(0.04, Math.max(0.012, dur * 0.18));
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(650 + brightness * 2600, time);
  filter.Q.setValueAtTime(0.65, time);
  const out = ctx.createGain();
  const end = sustainEnv(out.gain, time, gain, dur, attack);
  filter.connect(out).connect(dest);

  const extras = [filter, out];
  [0, 7].forEach((cents, index) => {
    const osc = ctx.createOscillator();
    osc.type = index === 0 ? 'sawtooth' : 'triangle';
    const f = freq * 2 ** (cents / 1200);
    const startF = f * 2 ** (-Math.max(0, scoop) / 1200);
    osc.frequency.setValueAtTime(Math.max(30, startF), time);
    if (scoop > 1) osc.frequency.exponentialRampToValueAtTime(f, time + Math.min(0.07, dur * 0.35));
    if (index === 0 && vibrato > 0 && dur > 0.18) {
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(5.2, time);
      const depth = ctx.createGain();
      depth.gain.setValueAtTime(0.0001, time);
      depth.gain.linearRampToValueAtTime(f * vibrato, time + Math.min(0.2, dur * 0.4));
      lfo.connect(depth).connect(osc.frequency);
      lfo.start(time);
      lfo.stop(end);
      extras.push(lfo, depth);
    }
    const tap = ctx.createGain();
    tap.gain.setValueAtTime(index === 0 ? 1 : 0.55, time);
    osc.connect(tap).connect(filter);
    arm(osc, time, end, [tap]);
  });

  const air = ctx.createBufferSource();
  air.buffer = noiseBuffer(ctx);
  air.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(freq * (2.4 + brightness * 1.6), time);
  bp.Q.setValueAtTime(1.35, time);
  const ng = ctx.createGain();
  const noiseEnd = sustainEnv(ng.gain, time, gain * (0.18 + rosin * 0.9), dur, attack);
  air.connect(bp).connect(ng).connect(dest);
  arm(air, time, noiseEnd, [bp, ng, ...extras]);
}

export function steelNote(ctx, dest, time, fromFreq, toFreq, dur, opts = {}) {
  if (!ctx || !dest || !(toFreq > 40) || !(dur > 0.05)) return;
  const from = Math.max(40, fromFreq || toFreq);
  const to = Math.max(40, toFreq);
  const gain = opts.gain ?? 0.022;
  const brightness = clamp01(opts.brightness ?? 0.5);
  const attack = Math.min(dur * 0.62, Math.max(0.04, opts.attack || 0.2));
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  const open = 700 + brightness * 2400;
  filter.frequency.setValueAtTime(Math.max(180, open * 0.62), time);
  filter.frequency.exponentialRampToValueAtTime(open, time + attack);
  filter.Q.setValueAtTime(0.7, time);
  const out = ctx.createGain();
  const end = sustainEnv(out.gain, time, gain, dur, attack);
  filter.connect(out).connect(dest);
  const glideTime = Math.min(0.28, Math.max(0.04, dur * 0.42));
  const layers = [
    { type: 'sawtooth', ratio: 1, cents: -4, amp: 1 },
    { type: 'sawtooth', ratio: 1, cents: 5, amp: 0.55 },
    { type: 'sine', ratio: 2, cents: 0, amp: 0.18 },
  ];
  layers.forEach((layer) => {
    const osc = ctx.createOscillator();
    osc.type = layer.type;
    const startF = from * layer.ratio * 2 ** (layer.cents / 1200);
    const endF = to * layer.ratio * 2 ** (layer.cents / 1200);
    osc.frequency.setValueAtTime(startF, time);
    if (Math.abs(startF - endF) > 0.6) {
      osc.frequency.exponentialRampToValueAtTime(endF, time + glideTime);
    }
    if (opts.vibrato > 0 && dur > 0.25) {
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(4.7, time);
      const depth = ctx.createGain();
      depth.gain.setValueAtTime(0.0001, time);
      depth.gain.linearRampToValueAtTime(endF * opts.vibrato, time + Math.min(0.35, dur * 0.45));
      lfo.connect(depth).connect(osc.frequency);
      arm(lfo, time, end, [depth]);
    }
    const tap = ctx.createGain();
    tap.gain.setValueAtTime(layer.amp, time);
    osc.connect(tap).connect(filter);
    arm(osc, time, end, [tap]);
  });
  const timer = ctx.createOscillator();
  const mute = ctx.createGain();
  mute.gain.setValueAtTime(0, time);
  timer.connect(mute).connect(dest);
  timer.onended = () => {
    for (const node of [filter, out, mute, timer]) {
      try { node.disconnect(); } catch { /* already released */ }
    }
  };
  timer.start(time);
  timer.stop(end + 0.02);
}
