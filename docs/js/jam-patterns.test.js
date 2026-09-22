import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  mandolinShouldHit,
  banjoRollSlot,
  fiddleShuffleHit,
  fiddleChopHit,
  steelShouldMove,
} from './jam-patterns.js';

describe('mandolin', () => {
  it('chops on 2 and 4 in 4/4', () => {
    const hits = Array.from({ length: 16 }, (_, s) => mandolinShouldHit('chop', s, 4));
    assert.deepEqual(hits.flatMap((h, i) => (h ? [i] : [])), [4, 12]);
  });

  it('double-chops the backbeat', () => {
    assert.equal(mandolinShouldHit('offbeat-double', 4, 4), true);
    assert.equal(mandolinShouldHit('offbeat-double', 5, 4), true);
    assert.equal(mandolinShouldHit('offbeat-double', 0, 4), false);
  });
});

describe('banjo', () => {
  it('plays eighths on a forward roll', () => {
    assert.equal(banjoRollSlot('forward-roll', 1), null);
    assert.equal(banjoRollSlot('forward-roll', 0), 0);
    assert.equal(banjoRollSlot('forward-roll', 2), 1);
  });

  it('fills every sixteenth on a run', () => {
    const hits = Array.from({ length: 16 }, (_, step) => banjoRollSlot('sixteenth-run', step));
    assert.equal(hits.every((slot) => slot != null), true);
  });
});

describe('fiddle', () => {
  it('shuffles long-short', () => {
    assert.deepEqual(fiddleShuffleHit(0, 4), { play: true, long: true });
    assert.deepEqual(fiddleShuffleHit(3, 4), { play: true, long: false });
    assert.equal(fiddleShuffleHit(1, 4).play, false);
  });

  it('chops on 2 and 4', () => {
    assert.equal(fiddleChopHit(4, 4), true);
    assert.equal(fiddleChopHit(0, 4), false);
  });
});

describe('steel', () => {
  it('pads on the downbeat and answers on beat 3', () => {
    assert.equal(steelShouldMove('pad', 0, 4), true);
    assert.equal(steelShouldMove('answer', 8, 4), true);
    assert.equal(steelShouldMove('answer', 0, 4), false);
  });
});
