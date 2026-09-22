export const INSTRUMENTS = [
  {
    id: 'guitar',
    name: 'Guitar',
    tuning: 'E2 A2 D3 G3 B3 E4',
    role: 'Strum, boom-chuck, and waltz',
    notes: 'Rhythm guitar for the jam, plus the capo, boxes, and chord charts.',
    patterns: [
      { id: 'strum', name: 'Strum', hint: 'A strum on every beat' },
      { id: 'boom-chuck', name: 'Boom-chuck', hint: 'Bass on 1 and 3, strum on 2 and 4' },
      { id: 'boom-boom-chuck', name: 'Boom-boom-chuck', hint: 'Two bass notes, then a strum' },
      { id: 'waltz', name: 'Waltz', hint: 'Bass and two strums, in 3/4' },
    ],
  },
  {
    id: 'bass',
    name: 'Bass',
    tuning: 'E1 A1 D2 G2',
    role: 'Root and five',
    notes: 'Two-beat time under the guitar.',
    patterns: [
      { id: 'root-five', name: 'Root–five', hint: 'Root on 1, fifth on 3' },
      { id: 'two-beat', name: 'Two-beat', hint: 'Roots on 1 and 3' },
      { id: 'walk', name: 'Walk', hint: 'Root, 3rd, 5th, approach' },
    ],
  },
  {
    id: 'mandolin',
    name: 'Mandolin',
    tuning: 'G3 D4 A4 E5',
    role: 'Chop',
    notes: 'Backbeat chop, a double chop, or tremolo.',
    patterns: [
      { id: 'chop', name: 'Chop', hint: 'Short chunk on 2 and 4' },
      { id: 'tremolo', name: 'Tremolo', hint: 'Sustained, for a waltz or a slow song' },
      { id: 'offbeat-double', name: 'Double chop', hint: 'Two sixteenths on the backbeat' },
    ],
  },
  {
    id: 'fiddle',
    name: 'Fiddle',
    tuning: 'G3 D4 A4 E5',
    role: 'Drone, shuffle, chop',
    notes: 'A bowed drone, a long-short shuffle, or a chop.',
    patterns: [
      { id: 'drone', name: 'Drone', hint: 'Root and fifth' },
      { id: 'shuffle', name: 'Shuffle', hint: 'Long-short bow' },
      { id: 'chop-fiddle', name: 'Chop', hint: 'Short bow on 2 and 4' },
    ],
  },
  {
    id: 'banjo',
    name: 'Banjo',
    tuning: 'gDGBD',
    role: 'Rolls',
    notes: 'A sixteenth-note run, or an eighth-note roll.',
    patterns: [
      { id: 'sixteenth-run', name: '16th run', hint: 'A roll on every sixteenth' },
      { id: 'forward-roll', name: 'Forward roll', hint: 'Thumb, index, middle' },
      { id: 'backward-roll', name: 'Backward roll', hint: 'Middle, index, thumb' },
      { id: 'alternating-thumb', name: 'Alternating thumb', hint: 'Thumb, index, thumb, middle' },
    ],
  },
  {
    id: 'steel',
    name: 'Steel',
    tuning: '',
    role: 'Swell and thirds',
    notes: 'A soft pad, sliding thirds, or a short answer.',
    patterns: [
      { id: 'pad', name: 'Swell', hint: 'Root and third on the change' },
      { id: 'thirds', name: 'Thirds', hint: 'Sliding thirds' },
      { id: 'answer', name: 'Answer', hint: 'A fill on beat 3' },
    ],
  },
];

export function getInstrument(id) {
  return INSTRUMENTS.find((i) => i.id === id);
}
