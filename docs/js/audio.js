import { chordPitchClasses, chordSampleId, pitchClass, parseChord, sampleSemitones } from './theory.js';
import { getClip, listClipKeys } from './storage.js';
import {
  mandolinShouldHit,
  banjoRollSlot,
  fiddleShuffleHit,
  fiddleChopHit,
  steelShouldMove,
} from './jam-patterns.js';

function midiToFreq(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function pcToMidi(pc, octave) {
  return (octave + 1) * 12 + ((pc % 12) + 12) % 12;
}

export class JamEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.buses = {};
    this.playing = false;
    this.tempo = 110;
    this.barIndex = 0;
    this.step = 0;
    this.nextNoteTime = 0;
    this.timer = null;
    this.bars = [];
    this.beatsPerBar = 4;
    this.mixer = {};
    this.transpose = 0;
    this.prevRoot = 7;
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
    comp.threshold.value = -16;
    comp.knee.value = 10;
    comp.ratio.value = 3.5;
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.72;
    this.master.connect(comp);
    comp.connect(this.ctx.destination);
    this.buses = {
      guitar: this.makeBus(0.7, 70, 2400),
      bass: this.makeBus(0.95, 35, 380),
      mandolin: this.makeBus(0.62, 420, 5200),
      banjo: this.makeBus(0.5, 250, 4800),
      fiddle: this.makeBus(0.38, 180, 3200),
      steel: this.makeBus(0.42, 160, 2600),
    };
  }

  makeBus(gain, hp, lp) {
    const g = this.ctx.createGain();
    g.gain.value = gain;
    const high = this.ctx.createBiquadFilter();
    high.type = 'highpass';
    high.frequency.value = hp;
    const low = this.ctx.createBiquadFilter();
    low.type = 'lowpass';
    low.frequency.value = lp;
    g.connect(high).connect(low).connect(this.master);
    return g;
  }

  dest(name) {
    return this.buses[name] || this.master;
  }

  setSong(bars, { tempo, time, mixer, transpose } = {}) {
    this.bars = bars;
    if (tempo) this.tempo = tempo;
    if (time) this.beatsPerBar = Number(String(time).split('/')[0]) || 4;
    if (mixer) this.mixer = mixer;
    if (transpose != null) this.transpose = transpose;
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
    const bar = this.bars[barIndex] || { chords: ['G'], lyric: '' };
    const chord = this.chordAtStep(bar, step);
    const beat = step / 4;
    if (step % 4 === 0) this.defer(() => this.onBeat(barIndex, Math.floor(beat), bar), time);
    if (step === 0) this.defer(() => this.onBar(barIndex, bar), time);

    const t = time + Math.random() * 0.006;
    const m = this.mixer;
    if (m.guitar?.on) this.playGuitar(t, chord, step, m.guitar.pattern);
    if (m.bass?.on) this.playBass(t, chord, step, m.bass.pattern);
    if (m.mandolin?.on) this.playMandolin(t, chord, step, m.mandolin.pattern);
    if (m.banjo?.on) this.playBanjo(t, chord, step, m.banjo.pattern);
    if (m.fiddle?.on) this.playFiddle(t, chord, step, m.fiddle.pattern);
    if (m.steel?.on) this.playSteel(t, chord, step, m.steel.pattern);
    if (step === this.beatsPerBar * 4 - 1) this.prevRoot = this.rootPc(chord);
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

  playGuitar(time, chord, step, pattern = 'boom-chuck') {
    const waltz = this.beatsPerBar === 3 || pattern === 'waltz';
    if (pattern === 'strum' && !waltz) {
      if (step % 4 !== 0) return;
      const backbeat = step === 4 || step === 12;
      this.hitChuck(time, chord, backbeat ? 0.055 : 0.1, 1, backbeat ? 0.16 : 0.1);
      return;
    }
    if (waltz) {
      if (step === 0) this.hitBoom(time, this.rootPc(chord), 0.09);
      if (step === 4 || step === 8) this.hitChuck(time, chord, 0.07, 0.9, 0.12);
      return;
    }
    if (pattern === 'boom-boom-chuck') {
      if (step === 0) this.hitBoom(time, this.rootPc(chord), 0.1);
      if (step === 4) this.hitBoom(time, this.fifthPc(chord), 0.1);
      if (step === 8 || step === 12) this.hitChuck(time, chord, 0.08, 0.85, 0.12);
      return;
    }
    if (step === 0) this.hitBoom(time, this.rootPc(chord), 0.11);
    if (step === 8) this.hitBoom(time, this.fifthPc(chord), 0.11);
    if (step === 4 || step === 12) this.hitChuck(time, chord, 0.06, 1, 0.12);
  }

  hitBoom(time, pc, gain) {
    if (this.clips.boom?.buffer) this.playSample(time, this.clips.boom, pc, 0.62, 0.45);
    else this.boom(time, pc, gain);
  }

  hitChuck(time, chord, dur, octaveShift, gain) {
    const exact = this.chordClips[chordSampleId(chord)];
    if (exact?.buffer) {
      this.playSample(time, exact, exact.rootPc, 0.55, 0.7);
      return;
    }
    if (this.clips.chuck?.buffer) this.playSample(time, this.clips.chuck, this.rootPc(chord), 0.55, 0.7);
    else this.chuck(time, this.pcs(chord), dur, octaveShift, gain, 'guitar');
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
    src.connect(g).connect(this.master);
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
    const openMidi = [40, 45, 50, 55, 59, 64];
    const dest = this.dest('guitar');
    frets.forEach((fret, string) => {
      if (fret == null || fret < 0) return;
      const when = time + string * 0.02;
      this.pluck(when, midiToFreq(openMidi[string] + fret), 1.1, 0.08, 2400, dest);
    });
  }

  playBass(time, chord, step, pattern = 'root-five') {
    const root = pcToMidi(this.rootPc(chord), 1);
    const fifth = pcToMidi(this.fifthPc(chord), 1);
    const third = pcToMidi(this.thirdPc(chord), 1);
    if (pattern === 'two-beat') {
      if (step === 0 || step === 8) this.tone(time, midiToFreq(root), 0.22, 'triangle', 0.28, 140, this.dest('bass'));
      return;
    }
    if (pattern === 'walk') {
      const seq = [root, third, fifth, root + 2];
      if (step % 4 === 0) this.tone(time, midiToFreq(seq[(step / 4) % 4]), 0.16, 'triangle', 0.3, 160, this.dest('bass'));
      return;
    }
    if (step === 0) this.tone(time, midiToFreq(root), 0.2, 'triangle', 0.32, 140, this.dest('bass'));
    if (step === 8) this.tone(time, midiToFreq(fifth), 0.2, 'triangle', 0.32, 140, this.dest('bass'));
  }

  playMandolin(time, chord, step, pattern = 'chop') {
    if (!mandolinShouldHit(pattern, step, this.beatsPerBar)) return;
    const tones = [
      midiToFreq(pcToMidi(this.rootPc(chord), 5)),
      midiToFreq(pcToMidi(this.thirdPc(chord), 5)),
      midiToFreq(pcToMidi(this.fifthPc(chord), 5)),
    ];
    if (pattern === 'tremolo') {
      const pair = step % 2 === 0 ? tones[0] : tones[1];
      this.pluck(time, pair, 0.09, 0.07, 4200, this.dest('mandolin'));
      this.pluck(time, pair * 1.003, 0.09, 0.05, 4200, this.dest('mandolin'));
      return;
    }
    const chopDur = pattern === 'offbeat-double' ? 0.045 : 0.07;
    this.noiseChop(time, chopDur, 2800, 0.16, this.dest('mandolin'));
    tones.forEach((freq, i) => {
      this.pluck(time, freq, chopDur + 0.02, 0.08 - i * 0.015, 3800, this.dest('mandolin'));
      this.pluck(time, freq * 1.004, chopDur + 0.02, 0.05, 3800, this.dest('mandolin'));
    });
  }

  playBanjo(time, chord, step, pattern = 'forward-roll') {
    const slot = banjoRollSlot(pattern, step);
    if (slot == null) return;
    const root = this.rootPc(chord);
    const third = this.thirdPc(chord);
    const fifth = this.fifthPc(chord);
    const strings = [
      midiToFreq(pcToMidi(root, 3)),
      midiToFreq(pcToMidi(third, 4)),
      midiToFreq(pcToMidi(fifth, 4)),
      midiToFreq(pcToMidi(root, 5)),
    ];
    const freq = strings[slot % strings.length];
    const sixteenth = pattern === 'sixteenth-run';
    const accent = step % 4 === 0 ? (sixteenth ? 0.13 : 0.16) : (sixteenth ? 0.07 : 0.11);
    this.pluck(time, freq, sixteenth ? 0.09 : 0.22, accent, 3600, this.dest('banjo'));
    this.tone(time, freq, sixteenth ? 0.04 : 0.08, 'triangle', accent * 0.35, 2400, this.dest('banjo'));
  }

  playFiddle(time, chord, step, pattern = 'drone') {
    const rootF = midiToFreq(pcToMidi(this.rootPc(chord), 4));
    const fifthF = midiToFreq(pcToMidi(this.fifthPc(chord), 4));
    const thirdF = midiToFreq(pcToMidi(this.thirdPc(chord), 4));
    const barDur = (60 / this.tempo) * this.beatsPerBar;

    if (pattern === 'chop-fiddle') {
      if (!fiddleChopHit(step, this.beatsPerBar)) return;
      this.noiseChop(time, 0.06, 1600, 0.12, this.dest('fiddle'));
      this.bow(time, rootF, 0.08, 0.05);
      return;
    }

    if (pattern === 'shuffle') {
      const hit = fiddleShuffleHit(step, this.beatsPerBar);
      if (!hit.play) return;
      const seq = [rootF, thirdF, fifthF, thirdF];
      const freq = seq[Math.floor(step / 4) % seq.length];
      const dur = hit.long ? this.secondsPer16th() * 2.6 : this.secondsPer16th() * 0.9;
      this.bow(time, freq, dur, hit.long ? 0.07 : 0.055);
      return;
    }

    if (pattern === 'drone' && step === 0) {
      this.bow(time, rootF, barDur * 0.92, 0.055);
      this.bow(time, fifthF, barDur * 0.92, 0.04);
    }
  }

  playSteel(time, chord, step, pattern = 'pad') {
    if (!steelShouldMove(pattern, step, this.beatsPerBar)) return;
    const rootF = midiToFreq(pcToMidi(this.rootPc(chord), 4));
    const thirdF = midiToFreq(pcToMidi(this.thirdPc(chord), 4));
    const sixthF = midiToFreq(pcToMidi(this.sixthPc(chord), 4));
    const fifthF = midiToFreq(pcToMidi(this.fifthPc(chord), 4));
    const prev = midiToFreq(pcToMidi(this.prevRoot, 4));
    const barDur = (60 / this.tempo) * this.beatsPerBar;

    if (pattern === 'answer') {
      const dur = this.secondsPer16th() * 6;
      this.glide(time, fifthF, rootF, dur, 0.07, 0.04);
      this.glide(time, midiToFreq(pcToMidi(this.thirdPc(chord), 5)), sixthF, dur, 0.05, 0.05);
      return;
    }

    if (pattern === 'thirds') {
      this.glide(time, prev * 1.25, thirdF, barDur * 0.85, 0.06, 0.12);
      this.glide(time, prev * 1.5, sixthF, barDur * 0.85, 0.045, 0.14);
      return;
    }

    this.swell(time, rootF, barDur * 0.9, 0.055, 0.2, this.dest('steel'));
    this.swell(time, thirdF, barDur * 0.9, 0.045, 0.22, this.dest('steel'));
  }

  boom(time, pc, gain) {
    this.tone(time, midiToFreq(pcToMidi(pc, 2)), 0.18, 'triangle', gain, 420, this.dest('guitar'));
  }

  chuck(time, pcs, dur, octaveShift = 1, gain = 0.12, bus = 'guitar') {
    this.noiseChop(time, dur, 1100 * octaveShift, gain, this.dest(bus));
    pcs.slice(0, 4).forEach((pc, i) => {
      this.tone(
        time,
        midiToFreq(pcToMidi(pc, 3) + (octaveShift > 1 ? 12 : 0)),
        dur,
        'triangle',
        gain * 0.22,
        1400,
        this.dest(bus),
      );
      void i;
    });
  }

  noiseChop(time, dur, freq, gain, dest) {
    const ctx = this.ctx;
    const noise = ctx.createBufferSource();
    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frames; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    noise.buffer = buffer;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = 1.6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(Math.max(gain, 0.0001), time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    noise.connect(bp).connect(g).connect(dest);
    noise.start(time);
    noise.stop(time + dur + 0.01);
  }

  pluck(time, freq, dur, gain, color, dest) {
    const ctx = this.ctx;
    const period = Math.max(2, Math.round(ctx.sampleRate / Math.max(freq, 40)));
    const buffer = ctx.createBuffer(1, period, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < period; i += 1) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(color, time);
    lp.frequency.exponentialRampToValueAtTime(500, time + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(Math.max(gain, 0.0001), time);
    g.gain.exponentialRampToValueAtTime(0.0008, time + dur);
    src.connect(lp).connect(g).connect(dest);
    src.start(time);
    src.stop(time + dur + 0.02);
  }

  bow(time, freq, dur, gain) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.4;
    const vibG = ctx.createGain();
    vibG.gain.value = freq * 0.007;
    vib.connect(vibG).connect(osc.frequency);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 2100;
    const g = ctx.createGain();
    const attack = Math.min(0.045, dur * 0.2);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + attack);
    g.gain.setValueAtTime(gain, time + Math.max(dur - 0.05, attack));
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(lp).connect(g).connect(this.dest('fiddle'));
    osc.start(time);
    vib.start(time);
    osc.stop(time + dur + 0.04);
    vib.stop(time + dur + 0.04);
  }

  tone(time, freq, dur, type, gain, filterFreq, dest = this.master) {
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const f = this.ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filterFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(Math.max(gain, 0.0001), time);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(f).connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  swell(time, freq, dur, gain, attack, dest = this.master) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g).connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  glide(time, fromFreq, toFreq, dur, gain, attack) {
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    const start = Math.max(fromFreq, 40);
    const end = Math.max(toFreq, 40);
    osc.frequency.setValueAtTime(start, time);
    osc.frequency.exponentialRampToValueAtTime(end, time + Math.min(0.18, dur * 0.35));
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g).connect(this.dest('steel'));
    osc.start(time);
    osc.stop(time + dur + 0.03);
  }
}

export const jam = new JamEngine();
