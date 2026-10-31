import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { bowedVoice, steelVoice, stringVoice } from './voices.js';
import {
  JamEngine,
  approachMidi,
  chordMidis,
  droneMidi,
  guitarBassMidi,
  uprightMidi,
  voiceLeadingMidi,
} from './audio.js';

describe('bass and banjo pitch', () => {
  it('keeps the guitar boom on the low strings', () => {
    assert.equal(guitarBassMidi(7), 43);
    assert.equal(guitarBassMidi(2), 50);
    assert.equal(guitarBassMidi(4), 40);
    assert.equal(guitarBassMidi(9), 45);
    assert.equal(guitarBassMidi(0), 48);
  });

  it('keeps the upright inside E1–G2', () => {
    assert.equal(uprightMidi(4), 28);
    assert.equal(uprightMidi(2), 38);
    assert.equal(uprightMidi(7), 31);
    assert.ok(uprightMidi(0) >= 28);
  });

  it('walks into the next root by a semitone', () => {
    assert.equal(approachMidi(31), 30);
    assert.equal(approachMidi(28), 29);
  });

  it('keeps the walk next to the root', () => {
    assert.equal(voiceLeadingMidi(2, 31), 38);
    assert.equal(voiceLeadingMidi(11, 31), 35);
  });

  it('puts the fifth string on the key, capoed from G', () => {
    assert.equal(droneMidi(7), 67);
    assert.equal(droneMidi(0), 72);
    assert.equal(droneMidi(2), 74);
  });
});

describe('guitar voicing', () => {
  it('strums an open G', () => {
    assert.deepEqual(chordMidis('G'), [43, 47, 50, 55, 59, 67]);
  });
});

describe('tone knobs', () => {
  it('tightens the chuck and lengthens the banjo ring', () => {
    assert.ok(stringVoice('chuck', 0.5, 1).decay < stringVoice('chuck', 0.5, 0).decay);
    assert.ok(stringVoice('banjo', 0.5, 1).decay > stringVoice('banjo', 0.5, 0).decay);
  });

  it('keeps the upright darker than a guitar strum', () => {
    const bass = stringVoice('bass', 0.4, 0.7);
    const strum = stringVoice('strum', 0.7, 0.4);
    assert.ok(bass.loopCutoff < strum.loopCutoff);
    assert.ok(bass.sine > strum.sine);
  });

  it('opens the bow and the volume pedal', () => {
    assert.ok(bowedVoice(0.5, 1).rosin > bowedVoice(0.5, 0).rosin);
    assert.ok(steelVoice(0.5, 1).attack > steelVoice(0.5, 0).attack);
  });
});

function fakeContext() {
  const param = (value = 0) => ({
    value,
    setValueAtTime(next) { this.value = next; },
    setTargetAtTime(next) { this.value = next; },
    exponentialRampToValueAtTime(next) { this.value = next; },
    linearRampToValueAtTime(next) { this.value = next; },
    cancelScheduledValues() {},
  });
  const node = (extra = {}) => ({
    connect(dest) { return dest; },
    disconnect() {},
    start() {},
    stop() {},
    onended: null,
    ...extra,
  });
  const ctx = {
    sampleRate: 44100,
    currentTime: 10,
    state: 'running',
    destination: node(),
    resume: async () => {},
    createGain: () => node({ gain: param(1) }),
    createBiquadFilter: () => node({
      type: 'lowpass',
      frequency: param(1000),
      Q: param(1),
      gain: param(0),
    }),
    createOscillator: () => node({ type: 'sine', frequency: param(440), detune: param(0) }),
    createBufferSource: () => node({ buffer: null, loop: false, playbackRate: param(1) }),
    createDelay: () => node({ delayTime: param(0) }),
    createWaveShaper: () => node({ curve: null, oversample: 'none' }),
    createDynamicsCompressor: () => node({
      threshold: param(-24),
      knee: param(0),
      ratio: param(1),
      attack: param(0),
      release: param(0),
    }),
    createBuffer(channels, length) {
      const data = Array.from({ length: Math.max(1, channels) }, () => new Float32Array(length));
      return {
        duration: length / 44100,
        length,
        numberOfChannels: channels,
        getChannelData: (index) => data[index] || data[0],
      };
    },
  };
  function Ctor() { return ctx; }
  return { Ctor, ctx };
}

describe('jam engine', () => {
  it('plays a bar of every chair without throwing', () => {
    const { Ctor, ctx } = fakeContext();
    globalThis.window = { AudioContext: Ctor };
    const engine = new JamEngine();
    engine.ensure();
    const on = (pattern) => ({ on: true, pattern, level: 70, tone: 60, color: 50 });
    const patterns = {
      guitar: ['strum', 'boom-chuck', 'boom-boom-chuck', 'waltz'],
      bass: ['root-five', 'two-beat', 'walk'],
      mandolin: ['chop', 'tremolo', 'offbeat-double'],
      banjo: ['forward-roll', 'backward-roll', 'alternating-thumb', 'sixteenth-run'],
      fiddle: ['drone', 'shuffle', 'chop-fiddle'],
      steel: ['pad', 'thirds', 'answer'],
    };
    engine.setSong(
      [{ chords: ['G', 'D7'], lyric: '' }, { chords: ['C'], lyric: '' }],
      { tempo: 110, time: '4/4', key: 'G', mixer: Object.fromEntries(Object.entries(patterns).map(([id, list]) => [id, on(list[0])])) },
    );
    for (const [id, list] of Object.entries(patterns)) {
      for (const pattern of list) {
        engine.mixer[id].pattern = pattern;
        for (let step = 0; step < 16; step += 1) engine.scheduleStep(10, 0, step);
      }
    }
    engine.beatsPerBar = 3;
    for (let step = 0; step < 12; step += 1) engine.scheduleStep(10, 1, step);

    engine.applyMix({ guitar: { level: 0, tone: 100, color: 10 } });
    assert.equal(engine.buses.guitar.level.gain.value, 0);
    assert.ok(Math.abs(engine.buses.guitar.tone.frequency.value - engine.buses.guitar.toneHi) < 0.01);
    engine.setRoom(0);
    assert.equal(engine.roomSend.gain.value, 0);
    engine.setRoom(100);
    assert.ok(Math.abs(engine.roomSend.gain.value - 0.34) < 0.001);
    assert.equal(ctx.sampleRate, 44100);
  });
});
