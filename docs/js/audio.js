import { chordPitchClasses, chordSampleId, pitchClass, parseChord, sampleSemitones } from './theory.js';
import { voicingFor } from './chords.js';
import { getClip, listClipKeys } from './storage.js';
import { MIX_DEFAULTS } from './instruments-data.js';
import {
  mandolinShouldHit,
  banjoRollSlot,
  fiddleShuffleHit,
  fiddleChopHit,
  steelShouldMove,
} from './jam-patterns.js';
import {
  bowNote,
  makeDrive,
  steelNote,
  steelVoice,
  bowedVoice,
  strike,
  strikeChord,
  stringVoice,
} from './voices.js';

const OPEN_MIDI = [40, 45, 50, 55, 59, 64];

const POCKET = {
  guitarBass: -0.004,
  guitarStrum: 0.002,
  guitarChuck: 0.015,
  bass: -0.008,
  mandolin: 0.016,
  banjo: -0.001,
  fiddle: 0.006,
  steel: 0.01,
};

const BUS = {
  guitar: {
    hp: 55,
    drive: 1.7,
    toneLo: 700,
    toneHi: 6800,
    trim: 0.72,
    body: [
      { freq: 102, q: 1.1, gain: 3.4 },
      { freq: 205, q: 1, gain: 2.2 },
      { freq: 390, q: 0.8, gain: 1.3 },
    ],
  },
  bass: {
    hp: 32,
    drive: 1.45,
    toneLo: 160,
    toneHi: 1100,
    trim: 0.78,
    body: [
      { type: 'lowshelf', freq: 110, q: 0.7, gain: 3 },
      { freq: 92, q: 1.25, gain: 2.4 },
      { freq: 180, q: 1, gain: 1.4 },
    ],
  },
  mandolin: {
    hp: 160,
    drive: 1.4,
    toneLo: 1200,
    toneHi: 7600,
    trim: 0.76,
    body: [
      { freq: 430, q: 1.15, gain: 2 },
      { freq: 980, q: 1.35, gain: 2.5 },
      { freq: 2400, q: 1, gain: 1.5 },
    ],
  },
  banjo: {
    hp: 130,
    drive: 1.8,
    toneLo: 1600,
    toneHi: 8200,
    trim: 0.6,
    body: [
      { freq: 330, q: 2.1, gain: 4.5 },
      { freq: 690, q: 1.5, gain: 2.2 },
      { type: 'highshelf', freq: 2800, q: 0.7, gain: 1.6 },
    ],
  },
  fiddle: {
    hp: 170,
    drive: 1.35,
    toneLo: 800,
    toneHi: 4600,
    trim: 0.68,
    body: [
      { freq: 280, q: 1.45, gain: 3.8 },
      { freq: 700, q: 1.1, gain: 1.5 },
      { freq: 1280, q: 1.7, gain: 3 },
      { freq: 2500, q: 1.1, gain: 1.4 },
    ],
  },
  steel: {
    hp: 140,
    drive: 1.25,
    toneLo: 650,
    toneHi: 3400,
    trim: 0.7,
    body: [
      { freq: 520, q: 0.9, gain: 1.5 },
      { freq: 1400, q: 0.8, gain: 1.1 },
    ],
  },
};

function midiToFreq(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function mixNum(raw, fallback) {
  const n = raw == null || raw === '' ? fallback : Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, n));
}

export function guitarBassMidi(pc) {
  const wrapped = ((pc % 12) + 12) % 12;
  return 40 + ((wrapped - 4 + 12) % 12);
}

export function uprightMidi(pc) {
  const wrapped = ((pc % 12) + 12) % 12;
  let midi = 24 + wrapped;
  if (midi < 28) midi += 12;
  return midi;
}

export function approachMidi(targetMidi) {
  const below = targetMidi - 1;
  if (below >= 28 && below <= 43) return below;
  const above = targetMidi + 1;
  if (above <= 45) return above;
  return targetMidi;
}

export function voiceLeadingMidi(pc, anchor) {
  let midi = uprightMidi(pc);
  if (anchor == null) return midi;
  while (midi - anchor > 7) midi -= 12;
  while (anchor - midi > 5) midi += 12;
  if (midi < 28) midi += 12;
  if (midi > 45) midi -= 12;
  if (midi < 28) return uprightMidi(pc);
  return midi;
}

export function droneMidi(pc) {
  const wrapped = ((pc % 12) + 12) % 12;
  let midi = 67 + ((wrapped - 7 + 12) % 12);
  if (midi > 79) midi -= 12;
  return midi;
}

export function midiInRange(pc, low, high) {
  const wrapped = ((pc % 12) + 12) % 12;
  let midi = wrapped;
  while (midi < low) midi += 12;
  while (midi > high) midi -= 12;
  if (midi < low) midi += 12;
  return midi;
}

export function chordMidis(symbol) {
  let frets = [];
  try {
    frets = voicingFor(symbol)?.frets || [];
  } catch {
    frets = [];
  }
  const notes = [];
  frets.forEach((fret, string) => {
    if (string > 5 || fret == null || fret < 0) return;
    notes.push(OPEN_MIDI[string] + fret);
  });
  return notes;
}

export class JamEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.roomSend = null;
    this.buses = {};
    this.playing = false;
    this.tempo = 110;
    this.barIndex = 0;
    this.step = 0;
    this.stepBar = 0;
    this.nextNoteTime = 0;
    this.timer = null;
    this.bars = [];
    this.beatsPerBar = 4;
    this.mixer = {};
    this.transpose = 0;
    this.keyPc = 7;
    this.prevSteelRoot = null;
    this.prevSteelThird = null;
    this.prevSteelSixth = null;
    this.roomAmount = 28;
    this.onBar = () => {};
    this.onBeat = () => {};
    this.onStop = () => {};
    this.clips = { boom: null, chuck: null };
    this.chordClips = {};
    this.lookahead = 25;
    this.scheduleAhead = 0.12;
  }

  ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -13;
    comp.knee.value = 8;
    comp.ratio.value = 2.6;
    comp.attack.value = 0.014;
    comp.release.value = 0.2;
    this.master = this.ctx.createGain();
    this.master.gain.value = 1.05;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);
    this.makeRoom();
    this.buses = {};
    for (const id of Object.keys(BUS)) this.buses[id] = this.makeBus(BUS[id]);
    this.applyMix(this.mixer);
    this.setRoom(this.roomAmount);
  }

  makeRoom() {
    const ctx = this.ctx;
    const input = ctx.createGain();
    input.gain.value = 0.1;
    const taps = [
      [0.0179, 0.32, 3000],
      [0.0237, 0.28, 2400],
      [0.0314, 0.24, 1900],
    ];
    for (const [delayTime, feedback, cutoff] of taps) {
      const delay = ctx.createDelay(0.1);
      delay.delayTime.value = delayTime;
      const fb = ctx.createGain();
      fb.gain.value = feedback;
      const low = ctx.createBiquadFilter();
      low.type = 'lowpass';
      low.frequency.value = cutoff;
      input.connect(delay);
      delay.connect(low);
      low.connect(fb);
      fb.connect(delay);
      low.connect(this.master);
    }
    this.roomSend = input;
  }

  makeBus(spec) {
    const ctx = this.ctx;
    const input = ctx.createGain();
    input.gain.value = 1;
    const high = ctx.createBiquadFilter();
    high.type = 'highpass';
    high.frequency.value = spec.hp;
    high.Q.value = 0.7;
    const drive = makeDrive(ctx, spec.drive);
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.Q.value = 0.62;
    tone.frequency.value = spec.toneLo * (spec.toneHi / spec.toneLo) ** 0.62;
    const level = ctx.createGain();
    level.gain.value = spec.trim;

    input.connect(high);
    high.connect(drive);
    let tail = drive;
    for (const peak of spec.body || []) {
      const filter = ctx.createBiquadFilter();
      filter.type = peak.type || 'peaking';
      filter.frequency.value = peak.freq;
      filter.Q.value = peak.q ?? 1;
      filter.gain.value = peak.gain ?? 0;
      tail.connect(filter);
      tail = filter;
    }
    tail.connect(tone);
    tone.connect(level);
    level.connect(this.master);
    level.connect(this.roomSend);
    return { input, tone, level, toneLo: spec.toneLo, toneHi: spec.toneHi, trim: spec.trim };
  }

  dest(name) {
    return this.buses[name]?.input || this.master;
  }

  setSong(bars, { tempo, time, mixer, transpose, key } = {}) {
    this.bars = bars;
    if (tempo) this.tempo = tempo;
    if (time) this.beatsPerBar = Number(String(time).split('/')[0]) || 4;
    if (mixer) this.applyMix(mixer);
    if (transpose != null) this.transpose = transpose;
    if (key) {
      const pc = pitchClass(key);
      if (pc != null) this.keyPc = pc;
    }
  }

  setRoom(amount) {
    const n = Number(amount);
    this.roomAmount = Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 28;
    if (!this.roomSend?.gain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.roomSend.gain.cancelScheduledValues(now);
    this.roomSend.gain.setValueAtTime((this.roomAmount / 100) * 0.34, now);
  }

  applyMix(mixer) {
    if (mixer) this.mixer = mixer;
    if (!this.ctx || !this.buses.guitar?.level) return;
    const now = this.ctx.currentTime;
    for (const id of Object.keys(this.buses)) {
      const slot = this.mixer?.[id] || {};
      const defaults = MIX_DEFAULTS[id] || {};
      const level = mixNum(slot.level, defaults.level ?? 70) / 100;
      const tone = mixNum(slot.tone, defaults.tone ?? 60) / 100;
      const bus = this.buses[id];
      bus.level.gain.cancelScheduledValues(now);
      bus.level.gain.setValueAtTime(level * bus.trim, now);
      const cutoff = bus.toneLo * (bus.toneHi / bus.toneLo) ** tone;
      bus.tone.frequency.cancelScheduledValues(now);
      bus.tone.frequency.setValueAtTime(cutoff, now);
    }
  }

  knob(id, key) {
    const fallback = MIX_DEFAULTS[id]?.[key] ?? 60;
    const raw = this.mixer?.[id]?.[key];
    return mixNum(raw, fallback) / 100;
  }

  at(time, feel) {
    const shift = POCKET[feel] || 0;
    const wobble = (Math.random() - 0.5) * 0.0025;
    const earliest = (this.ctx?.currentTime || 0) + 0.004;
    return Math.max(earliest, time + shift + wobble);
  }

  secondsPer16th() {
    return 60 / this.tempo / 4;
  }

  async loadGuitarClips() {
    this.ensure();
    for (const slot of ['boom', 'chuck']) {
      const saved = await getClip(`guitar-${slot}`);
      if (!saved?.blob) {
        this.clips[slot] = null;
        continue;
      }
      try {
        const bytes = await saved.blob.arrayBuffer();
        const buffer = await this.ctx.decodeAudioData(bytes.slice(0));
        this.clips[slot] = { buffer, rootPc: pitchClass(saved.root || 'G') };
      } catch {
        this.clips[slot] = null;
      }
    }
    this.chordClips = {};
    const keys = await listClipKeys();
    for (const id of keys) {
      if (!id.startsWith('guitar-chord-')) continue;
      const saved = await getClip(id);
      if (!saved?.blob) continue;
      try {
        const bytes = await saved.blob.arrayBuffer();
        const buffer = await this.ctx.decodeAudioData(bytes.slice(0));
        const chordId = id.slice('guitar-chord-'.length);
        const root = parseChord(chordId).root;
        this.chordClips[chordId] = { buffer, rootPc: pitchClass(root || 'G') };
      } catch {
        /* skip a file the browser cannot decode */
      }
    }
  }

  async start(fromBar = 0) {
    this.ensure();
    await this.ctx.resume();
    await this.loadGuitarClips();
    this.playing = true;
    this.barIndex = fromBar % Math.max(this.bars.length, 1);
    this.step = 0;
    this.prevSteelRoot = null;
    this.prevSteelThird = null;
    this.prevSteelSixth = null;
    this.nextNoteTime = this.ctx.currentTime + 0.06;
    this.onBar(this.barIndex, this.currentBar());
    this.scheduler();
  }

  stop() {
    this.playing = false;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.onStop();
  }

  toggle() {
    if (this.playing) this.stop();
    else this.start(this.barIndex);
  }

  currentBar() {
    return this.bars[this.barIndex] || { chords: ['G'], lyric: '' };
  }

  chordAtStep(bar, step) {
    const chords = bar.chords?.length ? bar.chords : ['G'];
    const stepsPerBar = this.beatsPerBar * 4;
    const idx = chords.length === 1 ? 0 : step >= stepsPerBar / 2 ? 1 : 0;
    return chords[Math.min(idx, chords.length - 1)];
  }

  scheduler() {
    if (!this.playing) return;
    while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAhead) {
      this.scheduleStep(this.nextNoteTime, this.barIndex, this.step);
      this.advance();
    }
    this.timer = setTimeout(() => this.scheduler(), this.lookahead);
  }

  advance() {
    const steps = this.beatsPerBar * 4;
    this.nextNoteTime += this.secondsPer16th();
    this.step += 1;
    if (this.step >= steps) {
      this.step = 0;
      this.barIndex = (this.barIndex + 1) % Math.max(this.bars.length, 1);
    }
  }

  scheduleStep(time, barIndex, step) {
    this.stepBar = barIndex;
    const bar = this.bars[barIndex] || { chords: ['G'], lyric: '' };
    const chord = this.chordAtStep(bar, step);
    const beat = step / 4;
    if (step % 4 === 0) this.defer(() => this.onBeat(barIndex, Math.floor(beat), bar), time);
    if (step === 0) this.defer(() => this.onBar(barIndex, bar), time);

    const m = this.mixer;
    if (m.guitar?.on) this.playGuitar(time, chord, step, m.guitar.pattern);
    if (m.bass?.on) this.playBass(time, chord, step, m.bass.pattern);
    if (m.mandolin?.on) this.playMandolin(time, chord, step, m.mandolin.pattern);
    if (m.banjo?.on) this.playBanjo(time, chord, step, m.banjo.pattern);
    if (m.fiddle?.on) this.playFiddle(time, chord, step, m.fiddle.pattern);
    if (m.steel?.on) this.playSteel(time, chord, step, m.steel.pattern);
  }

  changes(step) {
    if (step === 0) return true;
    const half = this.beatsPerBar * 2;
    if (step !== half) return false;
    return (this.bars[this.stepBar]?.chords?.length || 0) > 1;
  }

  hold(step) {
    const steps = this.beatsPerBar * 4;
    const half = steps / 2;
    const two = (this.bars[this.stepBar]?.chords?.length || 0) > 1;
    const span = two && step < half ? half - step : steps - step;
    return Math.max(1, span) * this.secondsPer16th();
  }

  nextRootPc(step) {
    const steps = this.beatsPerBar * 4;
    const bar = this.bars[this.stepBar] || { chords: ['G'] };
    const chords = bar.chords?.length ? bar.chords : ['G'];
    if (chords.length > 1 && step < steps / 2) return this.rootPc(chords[1]);
    const next = this.bars[(this.stepBar + 1) % Math.max(this.bars.length, 1)] || bar;
    const nextChords = next.chords?.length ? next.chords : ['G'];
    return this.rootPc(nextChords[0]);
  }

  defer(fn, time) {
    const wait = Math.max(0, (time - this.ctx.currentTime) * 1000 - 5);
    setTimeout(fn, wait);
  }

  pcs(chord) {
    return chordPitchClasses(chord).map((pc) => (pc + this.transpose + 12) % 12);
  }

  rootPc(chord) {
    const parsed = parseChord(chord);
    const pc = pitchClass(parsed.root || 'G');
    return (pc + this.transpose + 12) % 12;
  }

  fifthPc(chord) {
    return (this.rootPc(chord) + 7) % 12;
  }

  thirdPc(chord) {
    const q = parseChord(chord).quality;
    const minor = q === 'minor' || q === 'm7' || q === 'diminished' || q === 'dim7';
    return (this.rootPc(chord) + (minor ? 3 : 4)) % 12;
  }

  sixthPc(chord) {
    return (this.rootPc(chord) + 9) % 12;
  }

  guitarNotes(symbol) {
    const voiced = chordMidis(symbol);
    if (voiced.length) return voiced;
    return this.pcs(symbol).slice(0, 4).map((pc, i) => midiInRange(pc, 50 + i, 79));
  }

  playGuitar(time, chord, step, pattern = 'boom-chuck') {
    const waltz = this.beatsPerBar === 3 || pattern === 'waltz';
    if (pattern === 'strum' && !waltz) {
      if (step % 4 !== 0) return;
      const back = step === 4 || step === 12;
      const when = this.at(time, back ? 'guitarChuck' : 'guitarStrum');
      this.hitChuck(when, chord, back ? 'chuck' : 'strum');
      return;
    }
    if (waltz) {
      if (step === 0) this.hitBoom(this.at(time, 'guitarBass'), this.rootPc(chord));
      if (step === 4 || step === 8) this.hitChuck(this.at(time, 'guitarChuck'), chord, 'chuck');
      return;
    }
    if (pattern === 'boom-boom-chuck') {
      if (step === 0) this.hitBoom(this.at(time, 'guitarBass'), this.rootPc(chord));
      if (step === 4) this.hitBoom(this.at(time, 'guitarBass'), this.fifthPc(chord));
      if (step === 8 || step === 12) this.hitChuck(this.at(time, 'guitarChuck'), chord, 'chuck');
      return;
    }
    if (step === 0) this.hitBoom(this.at(time, 'guitarBass'), this.rootPc(chord));
    if (step === 8) this.hitBoom(this.at(time, 'guitarBass'), this.fifthPc(chord));
    if (step === 4 || step === 12) this.hitChuck(this.at(time, 'guitarChuck'), chord, 'chuck');
  }

  hitBoom(time, pc) {
    if (this.clips.boom?.buffer) this.playSample(time, this.clips.boom, pc, 0.62, 0.45);
    else this.playBoom(time, pc);
  }

  hitChuck(time, chord, role = 'chuck') {
    const exact = this.chordClips[chordSampleId(chord)];
    if (exact?.buffer) {
      this.playSample(time, exact, exact.rootPc, 0.55, 0.7);
      return;
    }
    if (this.clips.chuck?.buffer) this.playSample(time, this.clips.chuck, this.rootPc(chord), 0.55, 0.7);
    else this.playStrum(time, chord, role);
  }

  playBoom(time, pc) {
    const voice = stringVoice('boom', this.knob('guitar', 'tone'), this.knob('guitar', 'color'));
    strike(this.ctx, this.dest('guitar'), time, midiToFreq(guitarBassMidi(pc)), voice);
  }

  playStrum(time, chord, role) {
    const color = this.knob('guitar', 'color');
    const voice = stringVoice(role, this.knob('guitar', 'tone'), color);
    const spread = role === 'chuck'
      ? 0.0055 + (1 - color) * 0.004
      : 0.008 + (1 - color) * 0.006;
    strikeChord(this.ctx, this.dest('guitar'), time, this.guitarNotes(chord), voice, {
      dropBass: role === 'chuck',
      spread,
    });
  }

  playSample(time, clip, targetPc, gain, maxDur) {
    const rate = 2 ** (sampleSemitones(targetPc, clip.rootPc) / 12);
    const src = this.ctx.createBufferSource();
    src.buffer = clip.buffer;
    src.playbackRate.setValueAtTime(rate, time);
    const g = this.ctx.createGain();
    const dur = Math.min(clip.buffer.duration / rate, maxDur);
    g.gain.setValueAtTime(gain, time);
    g.gain.setValueAtTime(gain, time + Math.max(0.02, dur - 0.04));
    g.gain.linearRampToValueAtTime(0.0001, time + dur);
    const dest = this.buses.guitar?.tone || this.master;
    src.connect(g).connect(dest);
    src.start(time);
    src.stop(time + dur + 0.02);
  }

  async previewClip(slot) {
    this.ensure();
    await this.ctx.resume();
    await this.loadGuitarClips();
    const clip = this.clips[slot];
    if (!clip?.buffer) return;
    this.playSample(this.ctx.currentTime + 0.02, clip, clip.rootPc, 0.6, slot === 'boom' ? 0.5 : 0.85);
  }

  async previewChord(symbol, frets) {
    this.ensure();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (!this.clipLoad) this.clipLoad = this.loadGuitarClips();
    await this.clipLoad;
    const time = this.ctx.currentTime + 0.02;
    const exact = this.chordClips[chordSampleId(symbol)];
    if (exact?.buffer) {
      this.playSample(time, exact, exact.rootPc, 0.7, 1.5);
      return;
    }
    if (Array.isArray(frets) && frets.some((fret) => fret >= 0)) {
      this.strumShape(time, frets);
      return;
    }
    this.chuck(time, this.pcs(symbol), 0.7, 1, 0.2, 'guitar');
  }

  strumShape(time, frets) {
    const dest = this.dest('guitar');
    const voice = stringVoice('strum', 0.74, 0.32);
    frets.forEach((fret, string) => {
      if (fret == null || fret < 0 || string > 5) return;
      strike(this.ctx, dest, time + string * 0.012, midiToFreq(OPEN_MIDI[string] + fret), {
        ...voice,
        ks: voice.ks * 1.2,
        sine: voice.sine * 1.15,
      });
    });
  }

  playBass(time, chord, step, pattern = 'root-five') {
    const root = uprightMidi(this.rootPc(chord));
    const hit = (midi, accent = 1) => {
      const voice = stringVoice('bass', this.knob('bass', 'tone'), this.knob('bass', 'color'));
      voice.ks *= accent;
      voice.sine *= accent;
      voice.knock *= accent;
      voice.pick *= accent;
      strike(this.ctx, this.dest('bass'), this.at(time, 'bass'), midiToFreq(midi), voice);
    };
    if (pattern === 'two-beat') {
      if (step === 0) hit(root, 1.08);
      if (step === 8) hit(root, 0.96);
      return;
    }
    if (pattern === 'walk') {
      if (step % 4 !== 0) return;
      const beat = Math.floor(step / 4) % 4;
      let midi = root;
      if (beat === 1) midi = voiceLeadingMidi(this.thirdPc(chord), root);
      else if (beat === 2) midi = voiceLeadingMidi(this.fifthPc(chord), root);
      else if (beat === 3) midi = approachMidi(uprightMidi(this.nextRootPc(step)));
      hit(midi, beat === 0 ? 1.06 : 0.94);
      return;
    }
    if (step === 0) hit(root, 1.1);
    if (step === 8) hit(voiceLeadingMidi(this.fifthPc(chord), root), 0.98);
  }

  mandoNotes(chord) {
    const pcs = [this.rootPc(chord), this.thirdPc(chord), this.fifthPc(chord)];
    const notes = [];
    let floor = 64;
    pcs.forEach((pc) => {
      let midi = midiInRange(pc, floor, 88);
      if (notes.includes(midi)) midi += 12;
      if (midi > 88) midi -= 12;
      if (!notes.includes(midi)) notes.push(midi);
      floor = Math.min(88, midi + 1);
    });
    return notes;
  }

  playMandolin(time, chord, step, pattern = 'chop') {
    if (!mandolinShouldHit(pattern, step, this.beatsPerBar)) return;
    const notes = this.mandoNotes(chord);
    const dest = this.dest('mandolin');
    const when = this.at(time, 'mandolin');
    const tone = this.knob('mandolin', 'tone');
    const color = this.knob('mandolin', 'color');
    if (pattern === 'tremolo') {
      const voice = stringVoice('tremolo', tone, color);
      const midi = notes[step % notes.length] || notes[0];
      if (!midi) return;
      const freq = midiToFreq(midi);
      strike(this.ctx, dest, when, freq, { ...voice, detune: -7 });
      strike(this.ctx, dest, when, freq, { ...voice, detune: 7 });
      return;
    }
    const voice = stringVoice('mando', tone, color);
    notes.forEach((midi) => {
      const freq = midiToFreq(midi);
      strike(this.ctx, dest, when, freq, { ...voice, detune: -8 });
      strike(this.ctx, dest, when + 0.004, freq, { ...voice, detune: 8, ks: voice.ks * 0.82, sine: voice.sine * 0.82 });
    });
  }

  banjoMidi(slot, chord) {
    if (slot % 4 === 3) return droneMidi(this.keyPc);
    const root = midiInRange(this.rootPc(chord), 50, 62);
    const third = midiInRange(this.thirdPc(chord), 55, 69);
    const fifth = midiInRange(this.fifthPc(chord), 59, 74);
    return [root, third, fifth][slot % 3];
  }

  playBanjo(time, chord, step, pattern = 'forward-roll') {
    const slot = banjoRollSlot(pattern, step);
    if (slot == null) return;
    const voice = stringVoice('banjo', this.knob('banjo', 'tone'), this.knob('banjo', 'color'));
    const drone = slot % 4 === 3;
    let accent = step % 4 === 0 ? 1.18 : (step % 2 === 0 ? 0.96 : 0.78);
    if (drone) {
      accent *= 0.84;
      voice.decay *= 0.72;
      voice.loopCutoff = (voice.loopCutoff || 4000) + 700;
    }
    voice.ks *= accent;
    voice.sine *= accent;
    if (voice.clang) voice.clang *= accent;
    strike(this.ctx, this.dest('banjo'), this.at(time, 'banjo'), midiToFreq(this.banjoMidi(slot, chord)), voice);
  }

  playFiddle(time, chord, step, pattern = 'drone') {
    const bow = bowedVoice(this.knob('fiddle', 'tone'), this.knob('fiddle', 'color'));
    const dest = this.dest('fiddle');
    const when = this.at(time, 'fiddle');
    const rootF = midiToFreq(midiInRange(this.rootPc(chord), 60, 86));
    const thirdF = midiToFreq(midiInRange(this.thirdPc(chord), 62, 88));
    const fifthF = midiToFreq(midiInRange(this.fifthPc(chord), 60, 88));

    if (pattern === 'chop-fiddle') {
      if (!fiddleChopHit(step, this.beatsPerBar)) return;
      bowNote(this.ctx, dest, when, rootF, 0.07, {
        ...bow,
        gain: bow.gain * 1.25,
        scoop: 0,
        vibrato: 0,
        rosin: Math.min(1, bow.rosin + 0.15),
      });
      return;
    }

    if (pattern === 'shuffle') {
      const hit = fiddleShuffleHit(step, this.beatsPerBar);
      if (!hit.play) return;
      const seq = [rootF, thirdF, fifthF, thirdF];
      const freq = seq[Math.floor(step / 4) % seq.length];
      const sixth = this.secondsPer16th();
      const dur = hit.long ? sixth * 2.15 : sixth * 0.82;
      bowNote(this.ctx, dest, when, freq, dur, {
        ...bow,
        gain: bow.gain * (hit.long ? 1.15 : 0.7),
        scoop: hit.long ? 32 : 0,
        vibrato: hit.long ? bow.vibrato : 0,
      });
      return;
    }

    if (pattern === 'drone' && this.changes(step)) {
      const dur = this.hold(step) * 0.94;
      bowNote(this.ctx, dest, when, rootF, dur, { ...bow, scoop: 8, gain: bow.gain * 1.05 });
      bowNote(this.ctx, dest, when, fifthF, dur, {
        ...bow,
        gain: bow.gain * 0.72,
        scoop: 0,
        rosin: bow.rosin * 0.75,
      });
    }
  }

  nearFreq(prev, target) {
    if (!prev || prev <= 0) return target;
    const semis = Math.abs(12 * Math.log2(target / prev));
    return semis <= 5 ? prev : target;
  }

  playSteel(time, chord, step, pattern = 'pad') {
    if (pattern === 'answer') {
      if (!steelShouldMove(pattern, step, this.beatsPerBar)) return;
    } else if (!this.changes(step)) return;

    const voice = steelVoice(this.knob('steel', 'tone'), this.knob('steel', 'color'));
    const dest = this.dest('steel');
    const when = this.at(time, 'steel');
    const rootF = midiToFreq(midiInRange(this.rootPc(chord), 52, 76));
    const thirdF = midiToFreq(midiInRange(this.thirdPc(chord), 55, 79));
    const fifthF = midiToFreq(midiInRange(this.fifthPc(chord), 55, 79));
    const sixthF = midiToFreq(midiInRange(this.sixthPc(chord), 57, 81));

    if (pattern === 'answer') {
      const dur = this.secondsPer16th() * 6;
      const quick = { ...voice, attack: Math.min(voice.attack, 0.11) };
      steelNote(this.ctx, dest, when, fifthF, rootF, dur, { ...quick, gain: voice.gain * 1.15 });
      const highThird = midiToFreq(midiInRange(this.thirdPc(chord), 64, 88));
      steelNote(this.ctx, dest, when, highThird, sixthF, dur, { ...quick, gain: voice.gain * 0.78 });
      return;
    }

    const dur = this.hold(step) * 0.96;
    if (pattern === 'thirds') {
      steelNote(this.ctx, dest, when, this.nearFreq(this.prevSteelThird, thirdF), thirdF, dur, voice);
      steelNote(this.ctx, dest, when, this.nearFreq(this.prevSteelSixth, sixthF), sixthF, dur, {
        ...voice,
        gain: voice.gain * 0.8,
      });
      this.prevSteelThird = thirdF;
      this.prevSteelSixth = sixthF;
      return;
    }

    steelNote(this.ctx, dest, when, this.nearFreq(this.prevSteelRoot, rootF), rootF, dur, voice);
    steelNote(this.ctx, dest, when, this.nearFreq(this.prevSteelThird, thirdF), thirdF, dur, {
      ...voice,
      gain: voice.gain * 0.84,
    });
    this.prevSteelRoot = rootF;
    this.prevSteelThird = thirdF;
  }

  boom(time, pc) {
    this.playBoom(time, pc);
  }

  chuck(time, pcs, dur, octaveShift = 1, gain = 0.12, bus = 'guitar') {
    const low = octaveShift > 1 ? 64 : 52;
    const midis = (pcs || []).slice(0, 4).map((pc, i) => midiInRange(pc, low + i, 86));
    const voice = stringVoice('chuck', 0.7, 0.62);
    voice.decay = Math.max(voice.decay, dur || 0);
    voice.ks = Math.max(gain * 0.5, 0.03);
    voice.sine = Math.max(gain * 0.24, 0.014);
    strikeChord(this.ctx, this.dest(bus), time, midis, voice, { spread: 0.008 });
  }

  pluck(time, freq, dur, gain, color, dest) {
    const voice = stringVoice('strum', Math.min(1, (color || 2400) / 5200), 0.4);
    voice.decay = dur || voice.decay;
    voice.ks = gain || voice.ks;
    voice.sine = (gain || 0.04) * 0.55;
    strike(this.ctx, dest || this.dest('guitar'), time, freq, voice);
  }
}

export const jam = new JamEngine();
