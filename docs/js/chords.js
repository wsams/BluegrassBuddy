import { parseChord, pitchClass, transposeChord } from './theory.js';

/** Open and common guitar voicings. Frets are low E → high E; -1 is mute. */
export const OPEN_VOICINGS = {
  G: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], label: 'open' },
  G7: { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], label: 'open' },
  C: { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], label: 'open' },
  C7: { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0], label: 'open' },
  D: { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], label: 'open' },
  D7: { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], label: 'open' },
  A: { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], label: 'open' },
  A7: { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0], label: 'open' },
  E: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], label: 'open' },
  E7: { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0], label: 'open' },
  Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], label: 'open' },
  Am: { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], label: 'open' },
  Dm: { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], label: 'open' },
  F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], label: 'E-barre 1' },
  F7: { frets: [1, 3, 1, 2, 1, 1], fingers: [1, 3, 1, 2, 1, 1], label: 'E-barre 1' },
  B7: { frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4], label: 'open' },
  B: { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 3, 3, 3, 1], label: 'A-barre 2' },
  Bm: { frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], label: 'A-barre 2' },
  Bb: { frets: [-1, 1, 3, 3, 3, 1], fingers: [0, 1, 3, 3, 3, 1], label: 'A-barre 1' },
  Bbm: { frets: [-1, 1, 3, 3, 2, 1], fingers: [0, 1, 3, 4, 2, 1], label: 'A-barre 1' },
  'F#': { frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], label: 'E-barre 2' },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], fingers: [1, 3, 4, 1, 1, 1], label: 'E-barre 2' },
  'F#7': { frets: [2, 4, 2, 3, 2, 2], fingers: [1, 3, 1, 2, 1, 1], label: 'E-barre 2' },
  Eb: { frets: [-1, 6, 8, 8, 8, 6], fingers: [0, 1, 3, 3, 3, 1], label: 'A-barre 6' },
  Gmaj7: { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 1], label: 'open' },
  G6: { frets: [3, 2, 0, 0, 0, 0], fingers: [2, 1, 0, 0, 0, 0], label: 'open' },
  Gadd9: { frets: [3, 2, 0, 2, 0, 3], fingers: [2, 1, 0, 3, 0, 4], label: 'open' },
  G9: { frets: [3, -1, 0, 2, 0, 1], fingers: [3, 0, 0, 2, 0, 1], label: 'open' },
  Gaug: { frets: [3, 2, 1, 0, 0, -1], fingers: [3, 2, 1, 0, 0, 0], label: 'open' },
  Cmaj7: { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0], label: 'open' },
  C6: { frets: [-1, 3, 2, 2, 1, 0], fingers: [0, 3, 2, 4, 1, 0], label: 'open' },
  Cadd9: { frets: [-1, 3, 2, 0, 3, 0], fingers: [0, 2, 1, 0, 3, 0], label: 'open' },
  C9: { frets: [-1, 3, 2, 3, 3, 3], fingers: [0, 2, 1, 3, 3, 3], label: 'open' },
  Dmaj7: { frets: [-1, -1, 0, 2, 2, 2], fingers: [0, 0, 0, 1, 1, 1], label: 'open' },
  D6: { frets: [-1, -1, 0, 2, 0, 2], fingers: [0, 0, 0, 2, 0, 3], label: 'open' },
  D9: { frets: [-1, -1, 0, 2, 1, 0], fingers: [0, 0, 0, 2, 1, 0], label: 'open' },
  D13: { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], label: 'open D13-ish / D7' },
  'D7#9': { frets: [-1, -1, 0, 2, 1, 3], fingers: [0, 0, 0, 2, 1, 4], label: 'open' },
  Amaj7: { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 2, 1, 3, 0], label: 'open' },
  A6: { frets: [-1, 0, 2, 2, 2, 2], fingers: [0, 0, 1, 1, 1, 1], label: 'open' },
  Emaj7: { frets: [0, 2, 1, 1, 0, 0], fingers: [0, 3, 1, 2, 0, 0], label: 'open' },
  E6: { frets: [0, 2, 2, 1, 2, 0], fingers: [0, 2, 3, 1, 4, 0], label: 'open' },
  E9: { frets: [0, 2, 0, 1, 0, 2], fingers: [0, 2, 0, 1, 0, 3], label: 'open' },
  Am7: { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0], label: 'open' },
  Em7: { frets: [0, 2, 0, 0, 0, 0], fingers: [0, 2, 0, 0, 0, 0], label: 'open' },
  Dm7: { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 2, 1, 1], label: 'open' },
  'F#dim7': { frets: [2, -1, 1, 2, 1, -1], fingers: [2, 0, 1, 3, 1, 0], label: 'dim7' },
  Gdim7: { frets: [3, -1, 2, 3, 2, -1], fingers: [2, 0, 1, 3, 1, 0], label: 'dim7' },
};

const E_SHAPES = {
  major: { frets: [0, 2, 2, 1, 0, 0], fingers: [1, 3, 4, 2, 1, 1] },
  minor: { frets: [0, 2, 2, 0, 0, 0], fingers: [1, 3, 4, 1, 1, 1] },
  dominant: { frets: [0, 2, 0, 1, 0, 0], fingers: [1, 3, 1, 2, 1, 1] },
  maj7: { frets: [0, 2, 1, 1, 0, 0], fingers: [1, 4, 2, 3, 1, 1] },
  m7: { frets: [0, 2, 2, 0, 3, 0], fingers: [1, 2, 3, 1, 4, 1] },
  sixth: { frets: [0, 2, 2, 1, 2, 0], fingers: [1, 3, 4, 2, 4, 1] },
  add9: { frets: [0, 2, 2, 1, 0, 2], fingers: [1, 3, 4, 2, 1, 4] },
  dominant9: { frets: [0, 2, 0, 1, 0, 2], fingers: [1, 3, 1, 2, 1, 4] },
  dominant13: { frets: [0, 2, 0, 1, 2, 0], fingers: [1, 3, 1, 2, 4, 1] },
  dim7: { frets: [0, 1, 2, 0, 2, 0], fingers: [1, 2, 3, 1, 4, 1] },
  diminished: { frets: [0, 1, 2, 0, 2, 0], fingers: [1, 2, 3, 1, 4, 1] },
  augmented: { frets: [0, 3, 2, 1, 1, 0], fingers: [1, 4, 3, 2, 2, 1] },
  '7sharp9': { frets: [0, 2, 0, 1, 3, 0], fingers: [1, 3, 1, 2, 4, 1] },
};

const A_SHAPES = {
  major: { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 1, 3, 3, 3, 1] },
  minor: { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 1, 3, 4, 2, 1] },
  dominant: { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 1, 3, 1, 4, 1] },
  maj7: { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 1, 3, 2, 4, 1] },
  m7: { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 1, 3, 1, 2, 1] },
  sixth: { frets: [-1, 0, 2, 2, 2, 2], fingers: [0, 1, 3, 3, 3, 3] },
  add9: { frets: [-1, 0, 2, 4, 2, 0], fingers: [0, 1, 2, 4, 3, 1] },
  dominant9: { frets: [-1, 0, 2, 4, 2, 3], fingers: [0, 1, 2, 4, 3, 3] },
  dominant13: { frets: [-1, 0, 2, 0, 2, 2], fingers: [0, 1, 2, 1, 3, 4] },
  dim7: { frets: [-1, 0, 1, 2, 1, 2], fingers: [0, 1, 2, 4, 3, 4] },
  diminished: { frets: [-1, 0, 1, 2, 1, -1], fingers: [0, 1, 2, 4, 3, 0] },
  augmented: { frets: [-1, 0, 3, 2, 2, 1], fingers: [0, 1, 4, 3, 3, 2] },
  '7sharp9': { frets: [-1, 0, 2, 0, 2, 3], fingers: [0, 1, 2, 1, 3, 4] },
};

function shift(shape, fret, label) {
  return {
    frets: shape.frets.map((n) => (n < 0 ? -1 : n + fret)),
    fingers: shape.fingers,
    label,
  };
}

export function voicingFor(symbol, options = {}) {
  const key = String(symbol).replace('♯', '#').replace('♭', 'b');
  if (!options.closed && OPEN_VOICINGS[key]) return { symbol: key, ...OPEN_VOICINGS[key] };

  const parsed = parseChord(key);
  if (parsed.root == null) return { symbol: key, frets: [-1, -1, -1, -1, -1, -1], fingers: [], label: 'n/a' };

  const quality = parsed.quality;
  const eFret = (pitchClass(parsed.root) - 4 + 12) % 12;
  const aFret = (pitchClass(parsed.root) - 9 + 12) % 12;
  const useA = options.form === 'A' || (options.form !== 'E' && aFret > 0 && aFret < eFret && aFret <= 5);
  const fret = useA ? aFret : eFret;
  const bank = useA ? A_SHAPES : E_SHAPES;
  const shape = bank[quality] || bank.major;
  const kind = useA ? 'A-form' : 'E-form';
  return { symbol: key, ...shift(shape, fret, `${kind} ${fret}`) };
}

export function transposeVoicing(voicing, semitones) {
  return {
    ...voicing,
    frets: voicing.frets.map((n) => {
      if (n < 0) return -1;
      const next = n + semitones;
      return next < 0 ? -1 : next;
    }),
  };
}

export const COWBOY_LIBRARY = ['G', 'G7', 'C', 'C7', 'D', 'D7', 'A', 'A7', 'E', 'E7', 'Em', 'Am', 'Dm', 'F', 'B7'];

const TEN_DOLLAR_TEMPLATES = [
  { template: 'G6', numeral: 'I6', family: 'Tonic color', why: 'Western swing and Django. Swap for a plain I when the line hangs.' },
  { template: 'Gmaj7', numeral: 'Imaj7', family: 'Tonic color', why: 'Pretty, floating I. Gospel tags and jazzgrass endings.' },
  { template: 'Gadd9', numeral: 'Iadd9', family: 'Tonic color', why: 'Open, ringing I. Country and modern bluegrass rhythm.' },
  { template: 'G9', numeral: 'I9', family: 'Tonic color', why: 'Bluesy I that still functions as tonic. Great before a solo.' },
  { template: 'C6', numeral: 'IV6', family: 'Subdominant color', why: 'The classic IV sweetener. Think western swing rhythm guitar.' },
  { template: 'Cmaj7', numeral: 'IVmaj7', family: 'Subdominant color', why: 'Soft IV. Lets the 7th of the key ring against the four chord.' },
  { template: 'Cadd9', numeral: 'IVadd9', family: 'Subdominant color', why: 'Big ringing IV. Easy swap for cowboy C in G.' },
  { template: 'D9', numeral: 'V9', family: 'Dominant color', why: 'The ten-dollar V. Lands harder than D7 without leaving the key.' },
  { template: 'D13', numeral: 'V13', family: 'Dominant color', why: 'Adds the 6th of the key on V. Western swing and jazzgrass turnarounds.' },
  { template: 'D7#9', numeral: 'V7#9', family: 'Dominant color', why: 'Hendrix grit on the V. Use sparingly at a jam — it shouts.' },
  { template: 'Em7', numeral: 'vi7', family: 'Minor color', why: 'Relative minor with a 7. Smooth walk from I or into IV.' },
  { template: 'Am7', numeral: 'ii7', family: 'Minor color', why: 'Jazz ii. Sets up a ii–V into I, or a soft way to the IV.' },
  { template: 'A7', numeral: 'V/V', family: 'Secondary dominant', why: 'Five of five. A7 → D7 → G is the million-dollar turnaround.' },
  { template: 'F#dim7', numeral: 'vii°7', family: 'Passing / slide', why: 'A half step under I. Slide it up, or drop it in as a passing chord.' },
  { template: 'Gaug', numeral: 'I+', family: 'Passing / slide', why: 'Raised 5th on I. Walks chromatically toward IV (G → G+ → C).' },
];

export function tenDollarSet(majorKey) {
  const fromG = (pitchClass(majorKey) - pitchClass('G') + 12) % 12;
  const preferFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(majorKey);
  return TEN_DOLLAR_TEMPLATES.map((item) => {
    const symbol = transposeChord(item.template, fromG, preferFlats);
    return {
      ...item,
      symbol,
      voicing: voicingFor(symbol),
    };
  });
}

export function chordDiagramSvg(voicing) {
  const frets = voicing.frets;
  const fingers = voicing.fingers || [];
  const played = frets.filter((f) => f > 0);
  const hasOpen = frets.includes(0);
  const minFret = played.length ? Math.min(...played) : 1;
  const maxFret = played.length ? Math.max(...played) : 4;
  let base = 1;
  if (!hasOpen && minFret > 1) base = minFret;
  const fretCount = Math.max(4, maxFret - base + 1);

  const left = 22;
  const top = 28;
  const stringGap = 16;
  const fretH = 18;
  const width = left + 5 * stringGap + 18;
  const height = top + fretCount * fretH + 18;

  const xAt = (s) => left + s * stringGap;
  const yAt = (relFret) => top + relFret * fretH;
  const nut = base === 1;

  const barreFret = minFret;
  let barreFrom = null;
  let barreTo = null;
  if (barreFret > 0) {
    if (frets[0] === barreFret && frets[5] === barreFret) {
      barreFrom = 0;
      barreTo = 5;
    } else if (frets[1] === barreFret && frets[5] === barreFret) {
      barreFrom = 1;
      barreTo = 5;
    } else {
      const idxs = frets.map((f, i) => (f === barreFret ? i : -1)).filter((i) => i >= 0);
      if (idxs.length >= 3 && idxs[idxs.length - 1] - idxs[0] + 1 === idxs.length) {
        barreFrom = idxs[0];
        barreTo = idxs[idxs.length - 1];
      }
    }
  }
  const drawBarre = barreFrom != null;

  const dots = [];
  for (let s = 0; s < 6; s += 1) {
    const f = frets[s];
    if (f == null || f <= 0) continue;
    if (drawBarre && f === barreFret && s >= barreFrom && s <= barreTo) continue;
    const rel = f - base + 1;
    dots.push({ s, rel, finger: fingers[s] || '' });
  }

  const marks = frets.map((f, s) => {
    const x = xAt(s);
    if (f < 0) return `<text class="cd-mute" x="${x}" y="${top - 10}">×</text>`;
    if (f === 0) return `<circle class="cd-open" cx="${x}" cy="${top - 12}" r="4.5"/>`;
    return '';
  }).join('');

  let barre = '';
  if (drawBarre) {
    const rel = barreFret - base + 1;
    const y = yAt(rel) - fretH / 2;
    const x1 = xAt(barreFrom);
    const x2 = xAt(barreTo);
    barre = `<rect class="cd-barre" x="${x1 - 7}" y="${y - 7}" width="${x2 - x1 + 14}" height="14" rx="7"/>`;
  }

  return `
    <svg class="chord-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${voicing.symbol} chord">
      ${nut ? `<line class="cd-nut" x1="${left}" y1="${top}" x2="${xAt(5)}" y2="${top}"/>` : `<text class="cd-base" x="4" y="${top + fretH / 2 + 3}">${base}fr</text>`}
      ${Array.from({ length: 6 }, (_, s) => `<line class="cd-string" x1="${xAt(s)}" y1="${top}" x2="${xAt(s)}" y2="${yAt(fretCount)}"/>`).join('')}
      ${Array.from({ length: fretCount + 1 }, (_, i) => `<line class="cd-fret" x1="${left}" y1="${yAt(i)}" x2="${xAt(5)}" y2="${yAt(i)}"/>`).join('')}
      ${marks}
      ${barre}
      ${dots.map((d) => {
        const x = xAt(d.s);
        const y = yAt(d.rel) - fretH / 2;
        return `<g><circle class="cd-dot" cx="${x}" cy="${y}" r="7"/><text class="cd-finger" x="${x}" y="${y + 3}">${d.finger || ''}</text></g>`;
      }).join('')}
    </svg>
  `;
}

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

function playButton(symbol, frets) {
  const shape = Array.isArray(frets) ? frets.join(',') : '';
  return `<button type="button" class="chord-play" data-play-chord="${escapeAttr(symbol)}" data-play-frets="${shape}"><span class="chord-play-label">Play ${escapeAttr(symbol)}</span></button>`;
}

export function chordCardHtml(symbol, extra = {}) {
  const voicing = voicingFor(symbol);
  const numeral = extra.numeral ? `<span class="badge ready">${extra.numeral}</span>` : '';
  const role = extra.role ? `<p class="hint">${extra.role}${voicing.label && voicing.label !== 'open' ? ` · ${voicing.label}` : ''}</p>` : `<p class="hint">${voicing.label}</p>`;
  return `
    <article class="chord-card">
      ${playButton(symbol, voicing.frets)}
      <div class="chord-card-head">
        <h3>${symbol}</h3>
        ${numeral}
        <span class="chord-play-mark" aria-hidden="true">Play</span>
      </div>
      ${chordDiagramSvg({ ...voicing, symbol })}
      ${role}
      ${extra.why ? `<p class="hint why">${extra.why}</p>` : ''}
    </article>
  `;
}
