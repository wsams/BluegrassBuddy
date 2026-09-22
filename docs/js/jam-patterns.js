/** Hit maps for the jam backing instruments. Steps are 16th notes. */

export const BANJO_ROLLS = {
  'forward-roll': [0, 1, 2, 3, 1, 2, 0, 2],
  'backward-roll': [2, 1, 0, 2, 1, 3, 2, 1],
  'alternating-thumb': [0, 1, 0, 2, 0, 1, 0, 3],
  'sixteenth-run': [0, 1, 2, 0, 1, 2, 3, 2, 0, 1, 2, 0, 1, 2, 3, 1],
};

export function mandolinShouldHit(pattern, step, beatsPerBar = 4) {
  const waltz = beatsPerBar === 3;
  if (pattern === 'tremolo') return true;
  if (pattern === 'offbeat-double') {
    if (waltz) return step === 4 || step === 5 || step === 8 || step === 9;
    return step === 4 || step === 5 || step === 12 || step === 13;
  }
  if (waltz) return step === 4 || step === 8;
  return step === 4 || step === 12;
}

export function banjoRollSlot(pattern, step) {
  const seq = BANJO_ROLLS[pattern] || BANJO_ROLLS['forward-roll'];
  if (pattern === 'sixteenth-run') return seq[step % seq.length];
  if (step % 2 !== 0) return null;
  return seq[(step / 2) % seq.length];
}

export function fiddleShuffleHit(step, beatsPerBar = 4) {
  if (beatsPerBar === 3) {
    const long = step === 0 || step === 4 || step === 8;
    const short = step === 3 || step === 7 || step === 11;
    return { play: long || short, long };
  }
  const long = step % 4 === 0;
  const short = step % 4 === 3;
  return { play: long || short, long };
}

export function fiddleChopHit(step, beatsPerBar = 4) {
  if (beatsPerBar === 3) return step === 4 || step === 8;
  return step === 4 || step === 12;
}

export function steelShouldMove(pattern, step, beatsPerBar = 4) {
  if (pattern === 'answer') return beatsPerBar === 3 ? step === 8 : step === 8;
  return step === 0;
}
