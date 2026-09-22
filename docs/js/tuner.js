import { describePitch } from './theory.js';

export const GUITAR_STRINGS = [
  { id: 'E2', name: 'E', freq: 82.41 },
  { id: 'A2', name: 'A', freq: 110 },
  { id: 'D3', name: 'D', freq: 146.83 },
  { id: 'G3', name: 'G', freq: 196 },
  { id: 'B3', name: 'B', freq: 246.94 },
  { id: 'E4', name: 'e', freq: 329.63 },
];

let audioCtx;
let tone;
let listenState;
let listenGen = 0;

function context() {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export async function playReference(freq) {
  const ctx = context();
  if (ctx.state === 'suspended') await ctx.resume();
  stopReference();
  const now = ctx.currentTime;
  const lead = freq < 165 ? freq * 2 : freq;
  const partials = [
    [lead, 'triangle', 0.5],
    [lead * 2, 'triangle', 0.22],
    [lead * 3, 'sine', 0.08],
  ];
  if (lead !== freq) partials.push([freq, 'sine', 0.1]);

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.22, now + 0.012);
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
  master.connect(ctx.destination);

  const oscs = partials.map(([f, type, amp]) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = f;
    gain.gain.value = amp;
    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + 1.55);
    return osc;
  });
  tone = {
    stop() {
      oscs.forEach((osc) => {
        try { osc.stop(); } catch { /* already stopped */ }
      });
      try { master.disconnect(); } catch { /* already gone */ }
    },
  };
}

export function stopReference() {
  if (!tone) return;
  try { tone.stop(); } catch { /* already stopped */ }
  tone = null;
}

function autocorrelate(buf, sampleRate) {
  let rms = 0;
  for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / buf.length);
  if (rms < 0.01) return null;

  const minLag = Math.floor(sampleRate / 900);
  const maxLag = Math.floor(sampleRate / 70);
  let bestLag = -1;
  let best = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let corr = 0;
    for (let i = 0; i < buf.length - lag; i += 2) corr += buf[i] * buf[i + lag];
    if (corr > best) {
      best = corr;
      bestLag = lag;
    }
  }
  if (bestLag < 0) return null;
  return sampleRate / bestLag;
}

export async function startListening(onPitch) {
  stopListening();
  const gen = ++listenGen;
  const ctx = context();
  if (ctx.state === 'suspended') await ctx.resume();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  if (gen !== listenGen) {
    stream.getTracks().forEach((track) => track.stop());
    return;
  }
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  const buf = new Float32Array(analyser.fftSize);
  let timer = 0;
  const state = { stream, source, timer: 0, stopped: false };
  listenState = state;

  function tick(now) {
    if (state.stopped) return;
    if (now - timer > 80) {
      timer = now;
      analyser.getFloatTimeDomainData(buf);
      const freq = autocorrelate(buf, ctx.sampleRate);
      onPitch(freq ? describePitch(freq) : null);
    }
    state.timer = requestAnimationFrame(tick);
  }
  state.timer = requestAnimationFrame(tick);
}

export function stopListening() {
  listenGen += 1;
  if (!listenState) return;
  listenState.stopped = true;
  cancelAnimationFrame(listenState.timer);
  listenState.stream.getTracks().forEach((track) => track.stop());
  try { listenState.source.disconnect(); } catch { /* already gone */ }
  listenState = null;
}
