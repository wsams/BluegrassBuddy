import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { voicingFor, chordDiagramSvg, tenDollarSet } from './chords.js';

describe('chord diagrams', () => {
  it('uses the open G shape', () => {
    assert.deepEqual(voicingFor('G').frets, [3, 2, 0, 0, 0, 3]);
  });

  it('uses open C and D', () => {
    assert.equal(voicingFor('C').frets[0], -1);
    assert.deepEqual(voicingFor('D').frets.slice(2), [0, 2, 3, 2]);
  });

  it('builds an E-shape barre for F#', () => {
    assert.equal(voicingFor('F#').label.includes('E-barre'), true);
    assert.equal(voicingFor('F#').frets[0], 2);
  });

  it('renders SVG for G', () => {
    const svg = chordDiagramSvg(voicingFor('G'));
    assert.match(svg, /<svg/);
    assert.match(svg, /aria-label="G chord"/);
  });

  it('uses the open Gmaj7 grip', () => {
    assert.deepEqual(voicingFor('Gmaj7').frets, [3, 2, 0, 0, 0, 2]);
  });

  it('lists ten-dollar Imaj7 and vii°7 in G', () => {
    const set = tenDollarSet('G');
    assert.equal(set.some((c) => c.symbol === 'Gmaj7' && c.numeral === 'Imaj7'), true);
    assert.equal(set.some((c) => c.symbol === 'F#dim7'), true);
  });

  it('transposes the ten-dollar set into A', () => {
    const set = tenDollarSet('A');
    assert.equal(set.some((c) => c.symbol === 'Amaj7'), true);
    assert.equal(set.some((c) => c.numeral === 'V9' && c.symbol === 'E9'), true);
  });
});
