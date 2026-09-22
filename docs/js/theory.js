/**
 * BluegrassBuddy music theory — keys, capos, and pentatonic positions.
 *
 * Position numbering matches how guitarists learn the five boxes:
 *   Position 1 = the open Em pentatonic box (relative major G).
 * Sliding each later box down to the nut gives a different home major key.
 * Capo fret = (songKey - homeKey of that position) mod 12.
 */

export const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const ENHARMONIC = {
  'Db': 'C#',
  'D#': 'Eb',
  'Gb': 'F#',
  'G#': 'Ab',
  'A#': 'Bb',
  'Cb': 'B',
  'E#': 'F',
  'Fb': 'E',
  'B#': 'C',
};

export const MAJOR_KEYS = ['G', 'A', 'Bb', 'B', 'C', 'D', 'Eb', 'E', 'F', 'F#', 'Ab', 'C#'];

/** Keys you actually hear at a jam. */
export const BLUEGRASS_KEYS = ['G', 'A', 'Bb', 'B', 'C', 'D', 'E', 'F'];

export const MAJOR_PENT_INTERVALS = [0, 2, 4, 7, 9];
export const MINOR_PENT_INTERVALS = [0, 3, 5, 7, 10];
export const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
export const MIXOLYDIAN_INTERVALS = [0, 2, 4, 5, 7, 9, 10];
export const NATURAL_MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
export const BLUES_INTERVALS = [0, 3, 5, 6, 7, 10];

export const SCALE_TYPES = [
  {
    id: 'major-pent',
    name: 'Major pentatonic',
    intervals: MAJOR_PENT_INTERVALS,
    degrees: ['1', '2', '3', '5', '6'],
    tonic: 'major',
    hint: '1 2 3 5 6.',
  },
  {
    id: 'minor-pent',
    name: 'Minor pentatonic',
    intervals: MINOR_PENT_INTERVALS,
    degrees: ['1', 'b3', '4', '5', 'b7'],
    tonic: 'relative-minor',
    hint: 'Same pitches as the relative major pentatonic. Open Em box in G.',
  },
  {
    id: 'major',
    name: 'Major scale',
    intervals: MAJOR_INTERVALS,
    degrees: ['1', '2', '3', '4', '5', '6', '7'],
    tonic: 'major',
    hint: '1 2 3 4 5 6 7.',
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    intervals: MIXOLYDIAN_INTERVALS,
    degrees: ['1', '2', '3', '4', '5', '6', 'b7'],
    tonic: 'major',
    hint: 'Major scale, flat 7.',
  },
  {
    id: 'natural-minor',
    name: 'Natural minor',
    intervals: NATURAL_MINOR_INTERVALS,
    degrees: ['1', '2', 'b3', '4', '5', 'b6', 'b7'],
    tonic: 'relative-minor',
    hint: 'Relative minor of the selected key.',
  },
  {
    id: 'blues',
    name: 'Blues scale',
    intervals: BLUES_INTERVALS,
    degrees: ['1', 'b3', '4', 'b5', '5', 'b7'],
    tonic: 'relative-minor',
    hint: 'Minor pentatonic plus b5.',
  },
  {
    id: 'chromatic',
    name: 'Chromatic',
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    degrees: ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'],
    tonic: 'major',
    hint: 'All twelve. Land on a chord tone.',
  },
];

const TUNER_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SAMPLE_SUFFIX = {
  major: '',
  minor: 'm',
  dominant: '7',
  m7: 'm7',
  maj7: 'maj7',
  sixth: '6',
  add9: 'add9',
  sixth9: '69',
  dim7: 'dim7',
  diminished: 'dim',
  augmented: 'aug',
  '7sharp9': '7#9',
  dominant13: '13',
  dominant9: '9',
  sus2: 'sus2',
  sus4: 'sus4',
};

/** Filename stem for a chord sample: G, Gm, G7, Gmaj7. */
export function chordSampleId(symbol) {
  const parsed = parseChord(symbol);
  if (!parsed?.root) return null;
  const root = normalizeNote(parsed.root);
  if (!root) return null;
  const suffix = SAMPLE_SUFFIX[parsed.quality] ?? '';
  return `${root}${suffix}`;
}

/** Semitone shift from a recorded pitch class to the chord tone, fifth kept upward. */
export function sampleSemitones(targetPc, rootPc) {
  let semi = (((targetPc - rootPc) % 12) + 12) % 12;
  if (semi > 7) semi -= 12;
  return semi;
}

/** Nearest equal-tempered pitch, and how many cents sharp (positive) or flat. */
export function describePitch(freq) {
  if (!freq || freq < 20 || freq > 5000) return null;
  const midi = Math.round(12 * Math.log2(freq / 440) + 69);
  const center = 440 * 2 ** ((midi - 69) / 12);
  const cents = Math.round(1200 * Math.log2(freq / center));
  const name = TUNER_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { name, octave, cents, midi, label: `${name}${octave}` };
}

export function getScaleType(id) {
  return SCALE_TYPES.find((s) => s.id === id) || SCALE_TYPES[0];
}

export function scaleTonic(majorKey, scaleType) {
  const type = typeof scaleType === 'string' ? getScaleType(scaleType) : scaleType;
  return type.tonic === 'relative-minor' ? relativeMinor(majorKey) : normalizeNote(majorKey);
}

export function notesForScale(majorKey, scaleTypeId) {
  const type = getScaleType(scaleTypeId);
  return scaleNotes(scaleTonic(majorKey, type), type.intervals);
}

/**
 * Five pentatonic boxes, numbered from the open Em / G-major box.
 * boxOffsetFrets = where that box sits on a G-major neck (no capo).
 * homeMajor = the major key you get if you play that box fingering at the nut.
 */
export const PENTATONIC_POSITIONS = [
  {
    id: 1,
    label: '1st',
    title: 'G-form / open Em box',
    subtitle: 'Open Em pentatonic',
    description:
      'The box everyone learns first. Open strings give E minor pentatonic, which is G major pentatonic.',
    homeMajor: 'G',
    homeMinor: 'E',
    boxOffsetFrets: 0,
    caged: 'G-form',
    cowboyShapes: 'G / Em',
  },
  {
    id: 2,
    label: '2nd',
    title: 'E-form box',
    subtitle: 'Connects up from box 1',
    description: 'E-form pentatonic. Played at the nut, this fingering sits in E major / C# minor.',
    homeMajor: 'E',
    homeMinor: 'C#',
    boxOffsetFrets: 3,
    caged: 'E-form',
    cowboyShapes: 'E / C#m',
  },
  {
    id: 3,
    label: '3rd',
    title: 'D-form box',
    subtitle: 'Open-D cousin',
    description: 'D-form pentatonic. Played at the nut, this fingering sits in D major / B minor.',
    homeMajor: 'D',
    homeMinor: 'B',
    boxOffsetFrets: 5,
    caged: 'D-form',
    cowboyShapes: 'D / Bm',
  },
  {
    id: 4,
    label: '4th',
    title: 'C-form box',
    subtitle: 'Open-C cousin',
    description: 'C-form pentatonic. Played at the nut, this fingering sits in C major / A minor — no capo in C.',
    homeMajor: 'C',
    homeMinor: 'A',
    boxOffsetFrets: 7,
    caged: 'C-form',
    cowboyShapes: 'C / Am',
  },
  {
    id: 5,
    label: '5th',
    title: 'A-form box',
    subtitle: 'Open-A pentatonic',
    description:
      'A-form pentatonic. Played at the nut, this fingering sits in A major / F# minor — a song in A using the 5th box at the open position needs no capo. Capo 3 here is C (the classic A-shapes-in-C move).',
    homeMajor: 'A',
    homeMinor: 'F#',
    boxOffsetFrets: 10,
    caged: 'A-form',
    cowboyShapes: 'A / F#m',
  },
];

/** Low E → high E pitch classes. */
export const GUITAR_TUNING = [4, 9, 2, 7, 11, 4];
export const GUITAR_STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'E'];

export function normalizeNote(name) {
  if (name == null) return null;
  const trimmed = String(name).trim();
  if (!trimmed) return null;
  const base = trimmed.replace(/m$|maj.*$|min.*$|sus.*$|dim.*$|aug.*$|add.*$|7.*$|9.*$|11.*$|13.*$|6.*$|°.*$/i, '');
  const key = base.replace('♯', '#').replace('♭', 'b');
  if (NOTE_NAMES.includes(key)) return key;
  if (ENHARMONIC[key]) return ENHARMONIC[key];
  const upper = key.charAt(0).toUpperCase() + key.slice(1);
  if (NOTE_NAMES.includes(upper)) return upper;
  if (ENHARMONIC[upper]) return ENHARMONIC[upper];
  return null;
}

export function pitchClass(name) {
  const note = normalizeNote(name);
  if (note == null) return null;
  return NOTE_NAMES.indexOf(note);
}

export function noteName(pc, preferFlats = false) {
  const i = ((pc % 12) + 12) % 12;
  if (!preferFlats) return NOTE_NAMES[i];
  const flats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  return flats[i];
}

export function transposeNote(name, semitones, preferFlats = false) {
  const pc = pitchClass(name);
  if (pc == null) return name;
  return noteName(pc + semitones, preferFlats);
}

export function relativeMinor(majorName) {
  return transposeNote(majorName, -3);
}

export function relativeMajor(minorName) {
  return transposeNote(minorName, 3);
}

export function scaleNotes(root, intervals) {
  const pc = pitchClass(root);
  if (pc == null) return [];
  const preferFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(normalizeNote(root));
  return intervals.map((iv) => noteName(pc + iv, preferFlats));
}

export function majorPentatonic(root) {
  return scaleNotes(root, MAJOR_PENT_INTERVALS);
}

export function minorPentatonic(root) {
  return scaleNotes(root, MINOR_PENT_INTERVALS);
}

export function getPosition(id) {
  return PENTATONIC_POSITIONS.find((p) => p.id === Number(id)) ?? PENTATONIC_POSITIONS[0];
}

/**
 * Capo fret so that `position` sits at the open/first position in `songKey`.
 * 0 means play open — no capo.
 */
export function capoFor(songKey, positionId) {
  const position = getPosition(positionId);
  const song = pitchClass(songKey);
  const home = pitchClass(position.homeMajor);
  if (song == null || home == null) return null;
  return (song - home + 12) % 12;
}

/** Sounding major key if you capo at `fret` and play `position` in first position. */
export function soundingKey(positionId, capoFret) {
  const position = getPosition(positionId);
  return transposeNote(position.homeMajor, Number(capoFret) || 0);
}

export function formatCapo(fret) {
  if (fret === 0 || fret === '0') return 'Open (no capo)';
  const n = Number(fret);
  const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
  return `Capo ${n}${suffix}`;
}

/**
 * Where box 1 (Em-form) sits on an uncapo'd neck for this major key.
 * G → 0, A → 2, C → 5, etc.
 */
export function box1FretForKey(majorKey) {
  return capoFor(majorKey, 1);
}

export function boxFretForKey(majorKey, positionId) {
  const base = box1FretForKey(majorKey);
  const extra = getPosition(positionId).boxOffsetFrets;
  return (base + extra) % 12;
}

export function parseChord(symbol) {
  if (!symbol || symbol === '%' || symbol === '/' || symbol === '-') {
    return { raw: symbol, root: null, quality: 'major', bass: null };
  }
  const trimmed = String(symbol).trim();
  const match = trimmed.match(/^([A-G][b#♯♭]?)(.*)$/);
  if (!match) return { raw: trimmed, root: null, quality: 'major', bass: null };
  let quality = 'major';
  const rest = match[2];
  if (/^(m(?!aj)|min).*7/.test(rest) && !/maj/.test(rest)) quality = 'm7';
  else if (/^(m(?!aj)|min|−)/.test(rest) || rest.startsWith('-')) quality = 'minor';
  else if (/maj7|Δ/.test(rest)) quality = 'maj7';
  else if (/add9/.test(rest)) quality = 'add9';
  else if (/6\/9|69/.test(rest)) quality = 'sixth9';
  else if (/^6/.test(rest)) quality = 'sixth';
  else if (/dim7|°7/.test(rest)) quality = 'dim7';
  else if (/dim|°/.test(rest)) quality = 'diminished';
  else if (/aug|\+/.test(rest)) quality = 'augmented';
  else if (/7[#♯]9/.test(rest)) quality = '7sharp9';
  else if (/13/.test(rest)) quality = 'dominant13';
  else if (/9/.test(rest)) quality = 'dominant9';
  else if (/sus2/.test(rest)) quality = 'sus2';
  else if (/sus/.test(rest)) quality = 'sus4';
  else if (/7/.test(rest)) quality = 'dominant';
  const bassMatch = rest.match(/\/([A-G][b#♯♭]?)/);
  return {
    raw: trimmed,
    root: normalizeNote(match[1]),
    quality,
    bass: bassMatch ? normalizeNote(bassMatch[1]) : null,
  };
}

export function chordPitchClasses(symbol) {
  const { root, quality, bass } = parseChord(symbol);
  if (root == null) return [];
  const r = pitchClass(root);
  const intervals = {
    major: [0, 4, 7],
    minor: [0, 3, 7],
    m7: [0, 3, 7, 10],
    maj7: [0, 4, 7, 11],
    sixth: [0, 4, 7, 9],
    sixth9: [0, 2, 4, 7, 9],
    add9: [0, 2, 4, 7],
    diminished: [0, 3, 6],
    dim7: [0, 3, 6, 9],
    augmented: [0, 4, 8],
    sus2: [0, 2, 7],
    sus4: [0, 5, 7],
    dominant: [0, 4, 7, 10],
    dominant9: [0, 2, 4, 7, 10],
    dominant13: [0, 4, 7, 9, 10],
    '7sharp9': [0, 3, 4, 7, 10],
  }[quality] || [0, 4, 7];
  const pcs = intervals.map((iv) => (r + iv) % 12);
  if (bass != null) pcs.unshift(pitchClass(bass));
  return [...new Set(pcs)];
}

export function transposeChord(symbol, semitones, preferFlats = false) {
  const match = String(symbol).trim().match(/^([A-G][b#♯♭]?)(.*)$/);
  if (!match) return symbol;
  const newPc = (pitchClass(match[1]) + semitones + 12) % 12;
  const rest = match[2].replace(/\/([A-G][b#♯♭]?)/, (_, bass) => {
    const bpc = (pitchClass(bass) + semitones + 12) % 12;
    return `/${noteName(bpc, preferFlats)}`;
  });
  return `${noteName(newPc, preferFlats)}${rest}`;
}

export function nashvilleNumber(chord, key) {
  const parsed = parseChord(chord);
  if (parsed.root == null) return chord;
  const diff = (pitchClass(parsed.root) - pitchClass(key) + 12) % 12;
  const map = { 0: 'I', 2: 'II', 3: 'bIII', 4: 'III', 5: 'IV', 7: 'V', 8: 'bVI', 9: 'VI', 10: 'bVII', 11: 'VII' };
  const numeral = map[diff] ?? String(diff);
  const isMinor = parsed.quality === 'minor';
  return isMinor ? numeral.toLowerCase() : numeral;
}

export function explainCapo(songKey, positionId) {
  const position = getPosition(positionId);
  const fret = capoFor(songKey, positionId);
  const minor = relativeMinor(songKey);
  return {
    songKey: normalizeNote(songKey),
    songMinor: minor,
    position,
    fret,
    label: formatCapo(fret),
    shapes: position.cowboyShapes,
    majorPentatonic: majorPentatonic(songKey),
    minorPentatonic: minorPentatonic(minor),
    boxOnUncapoedNeck: boxFretForKey(songKey, positionId),
    summary:
      fret === 0
        ? `${position.title}, open. ${normalizeNote(songKey)} major, ${minor} minor pentatonic.`
        : `Capo ${fret}. ${position.cowboyShapes} shapes. ${normalizeNote(songKey)} major, ${minor} minor.`,
  };
}

export function capoChart() {
  return BLUEGRASS_KEYS.map((key) => ({
    key,
    relativeMinor: relativeMinor(key),
    positions: PENTATONIC_POSITIONS.map((p) => ({
      positionId: p.id,
      capo: capoFor(key, p.id),
      uncapoedBoxFret: boxFretForKey(key, p.id),
    })),
  }));
}

export function reverseCapoChart() {
  return Array.from({ length: 12 }, (_, fret) => ({
    fret,
    label: formatCapo(fret),
    positions: PENTATONIC_POSITIONS.map((p) => ({
      positionId: p.id,
      key: soundingKey(p.id, fret),
    })),
  }));
}

/** Nashville I–vi plus V7 and mixolydian bVII for a major key. */
export function diatonicChords(majorKey) {
  const root = pitchClass(majorKey);
  const preferFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(normalizeNote(majorKey));
  const n = (pc, suffix = '') => `${noteName(pc, preferFlats)}${suffix}`;
  return [
    { numeral: 'I', symbol: n(root), role: 'Tonic' },
    { numeral: 'ii', symbol: n(root + 2, 'm'), role: 'Supertonic' },
    { numeral: 'iii', symbol: n(root + 4, 'm'), role: 'Mediant' },
    { numeral: 'IV', symbol: n(root + 5), role: 'Subdominant' },
    { numeral: 'V', symbol: n(root + 7), role: 'Dominant' },
    { numeral: 'V7', symbol: n(root + 7, '7'), role: 'Dominant 7' },
    { numeral: 'vi', symbol: n(root + 9, 'm'), role: 'Relative minor' },
    { numeral: 'bVII', symbol: n(root + 10), role: 'Mixolydian' },
  ];
}

export function jamChords(majorKey) {
  const all = diatonicChords(majorKey);
  const want = new Set(['I', 'IV', 'V', 'V7', 'vi', 'bVII']);
  return all.filter((c) => want.has(c.numeral));
}

/** Chord a half step below `symbol` — the classic slide-from-behind grip. */
export function approachChord(symbol, semitones = -1) {
  return transposeChord(symbol, semitones);
}

export function chromaticWalkFrets(rootName, stringOpenPc, count = 4) {
  const root = pitchClass(rootName);
  if (root == null) return [];
  const open = ((stringOpenPc % 12) + 12) % 12;
  const targetFret = (root - open + 12) % 12;
  const start = targetFret - (count - 1);
  const labels = [];
  for (let i = 0; i < count; i += 1) {
    const fret = start + i;
    const abs = fret < 0 ? fret + 12 : fret;
    labels.push({
      fret: abs,
      note: noteName(open + abs),
      landing: i === count - 1,
    });
  }
  return labels;
}
