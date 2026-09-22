import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  capoFor,
  soundingKey,
  majorPentatonic,
  minorPentatonic,
  relativeMinor,
  box1FretForKey,
  transposeChord,
  parseChord,
  explainCapo,
  describePitch,
  sampleSemitones,
  chordSampleId,
  diatonicChords,
  notesForScale,
  approachChord,
  chromaticWalkFrets,
} from './theory.js';

describe('capoFor', () => {
  it('puts the 1st box (open Em / G) at capo 0 in G', () => {
    assert.equal(capoFor('G', 1), 0);
  });

  it('needs capo 2 to play G-shapes (1st box) in A', () => {
    assert.equal(capoFor('A', 1), 2);
  });

  it('needs capo 5 to play the 1st box in C — not capo 3', () => {
    assert.equal(capoFor('C', 1), 5);
  });

  it('needs no capo to play the 4th box (C-form) at the open position in C', () => {
    assert.equal(capoFor('C', 4), 0);
  });

  it('uses capo 3 when the A-form (5th box) should sit open-relative in C', () => {
    assert.equal(capoFor('C', 5), 3);
  });

  it('needs no capo to play the 5th box at the open position in A', () => {
    assert.equal(capoFor('A', 5), 0);
  });

  it('is consistent with soundingKey', () => {
    for (const key of ['G', 'A', 'C', 'D', 'E', 'F', 'Bb']) {
      for (const pos of [1, 2, 3, 4, 5]) {
        const fret = capoFor(key, pos);
        assert.equal(soundingKey(pos, fret), key);
      }
    }
  });
});

describe('pentatonic mapping', () => {
  it('maps G major pentatonic to E minor pentatonic', () => {
    assert.deepEqual(majorPentatonic('G').sort(), minorPentatonic('E').sort());
  });

  it('uses E as the relative minor of G', () => {
    assert.equal(relativeMinor('G'), 'E');
    assert.equal(relativeMinor('C'), 'A');
    assert.equal(relativeMinor('A'), 'F#');
  });

  it('places uncapoed box 1 at fret 0 in G and fret 5 in C', () => {
    assert.equal(box1FretForKey('G'), 0);
    assert.equal(box1FretForKey('C'), 5);
    assert.equal(box1FretForKey('A'), 2);
  });
});

describe('chords', () => {
  it('parses G, Em, and D7', () => {
    assert.equal(parseChord('G').quality, 'major');
    assert.equal(parseChord('Em').quality, 'minor');
    assert.equal(parseChord('D7').quality, 'dominant');
  });

  it('parses colorful qualities', () => {
    assert.equal(parseChord('Gmaj7').quality, 'maj7');
    assert.equal(parseChord('Em7').quality, 'm7');
    assert.equal(parseChord('D9').quality, 'dominant9');
    assert.equal(parseChord('F#dim7').quality, 'dim7');
  });

  it('transposes G to A by two semitones', () => {
    assert.equal(transposeChord('G', 2), 'A');
    assert.equal(transposeChord('Em', 2), 'F#m');
  });

  it('transposes Gmaj7 to Cmaj7', () => {
    assert.equal(transposeChord('Gmaj7', 5), 'Cmaj7');
  });
});

describe('chromatic approach', () => {
  it('slides into G from F#', () => {
    assert.equal(approachChord('G', -1), 'F#');
    assert.equal(approachChord('G', 1), 'Ab');
  });

  it('walks E F F# G on the low E string into G', () => {
    const steps = chromaticWalkFrets('G', 4, 4);
    assert.deepEqual(steps.map((s) => s.note), ['E', 'F', 'F#', 'G']);
    assert.equal(steps.at(-1).landing, true);
  });
});

describe('diatonic and scale charts', () => {
  it('spells G major I IV V vi V7', () => {
    const row = diatonicChords('G');
    const byNum = Object.fromEntries(row.map((c) => [c.numeral, c.symbol]));
    assert.equal(byNum.I, 'G');
    assert.equal(byNum.IV, 'C');
    assert.equal(byNum.V, 'D');
    assert.equal(byNum.V7, 'D7');
    assert.equal(byNum.vi, 'Em');
    assert.equal(byNum.bVII, 'F');
  });

  it('maps G-major minor pentatonic to E minor pentatonic', () => {
    assert.deepEqual(notesForScale('G', 'minor-pent'), minorPentatonic('E'));
  });

  it('includes G in A Mixolydian', () => {
    assert.deepEqual(notesForScale('A', 'mixolydian'), ['A', 'B', 'C#', 'D', 'E', 'F#', 'G']);
  });
});

describe('describePitch', () => {
  it('names A4 at 440 Hz', () => {
    const pitch = describePitch(440);
    assert.equal(pitch.label, 'A4');
    assert.equal(pitch.cents, 0);
  });

  it('names the high E string', () => {
    const pitch = describePitch(329.63);
    assert.equal(pitch.label, 'E4');
    assert.ok(Math.abs(pitch.cents) < 3);
  });
});

describe('chordSampleId', () => {
  it('names major, minor, and seventh files', () => {
    assert.equal(chordSampleId('G'), 'G');
    assert.equal(chordSampleId('F#m'), 'F#m');
    assert.equal(chordSampleId('Bb7'), 'Bb7');
    assert.equal(chordSampleId('Abm7'), 'Abm7');
    assert.equal(chordSampleId('Cmaj7'), 'Cmaj7');
    assert.equal(chordSampleId('A#'), 'Bb');
  });
});

describe('sampleSemitones', () => {
  it('keeps a fifth up and folds a flat seven down', () => {
    assert.equal(sampleSemitones(2, 7), 7);
    assert.equal(sampleSemitones(5, 7), -2);
    assert.equal(sampleSemitones(7, 7), 0);
  });
});

describe('explainCapo', () => {
  it('explains the classic G-shapes-in-C case', () => {
    const result = explainCapo('C', 1);
    assert.equal(result.fret, 5);
    assert.match(result.summary, /Capo 5/);
  });
});
