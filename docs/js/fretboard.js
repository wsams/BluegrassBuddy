import {
  GUITAR_TUNING,
  GUITAR_STRING_NAMES,
  PENTATONIC_POSITIONS,
  getPosition,
  majorPentatonic,
  minorPentatonic,
  relativeMinor,
  pitchClass,
  noteName,
  capoFor,
  getScaleType,
  scaleTonic,
  notesForScale,
} from './theory.js';


/** Two-note-per-string fingerings, frets relative to each box origin. */
export const BOX_FINGERINGS = {
  1: [[0, 3], [0, 2], [0, 2], [0, 2], [0, 3], [0, 3]],
  2: [[0, 2], [2, 4], [2, 4], [1, 4], [0, 2], [0, 2]],
  3: [[0, 2], [0, 2], [0, 2], [0, 3], [0, 3], [0, 2]],
  4: [[0, 3], [0, 3], [0, 2], [0, 2], [0, 3], [0, 3]],
  5: [[0, 2], [0, 2], [0, 2], [0, 2], [0, 3], [0, 2]],
};

function noteAt(stringIndex, absoluteFret) {
  return (GUITAR_TUNING[stringIndex] + absoluteFret) % 12;
}

export function pentatonicSet(majorKey) {
  return new Set(majorPentatonic(majorKey).map((n) => pitchClass(n)));
}

export function renderFretboard(el, options = {}) {
  const {
    majorKey = 'G',
    positionId = 1,
    capo = null,
    frets = 12,
    mode = 'full',
    scaleTypeId = 'major-pent',
    showLegend = true,
    onlyPcs = null,
    chordPcs = null,
    approachPcs = null,
  } = options;

  const type = getScaleType(scaleTypeId);
  const tonic = scaleTonic(majorKey, type);
  const position = getPosition(positionId);
  const resolvedCapo = capo == null ? capoFor(majorKey, positionId) : Number(capo);
  const scale = new Set(notesForScale(majorKey, scaleTypeId).map((n) => pitchClass(n)));
  const rootPc = pitchClass(options.root || tonic);
  const minorPc = pitchClass(relativeMinor(majorKey));
  const onlySet = onlyPcs ? new Set(onlyPcs) : null;
  const chordSet = chordPcs ? new Set(chordPcs) : null;
  const approachSet = approachPcs ? new Set(approachPcs) : null;
  const startFret = mode === 'box' ? resolvedCapo : 0;
  const visibleFrets = mode === 'box' ? 5 : frets;
  const fingering = BOX_FINGERINGS[position.id];
  const isPent = type.id === 'major-pent' || type.id === 'minor-pent';
  const title = options.title
    || (mode === 'box'
      ? `${position.label} @ ${resolvedCapo === 0 ? 'open' : `capo ${resolvedCapo}`}`
      : `${tonic} ${type.name}`);

  const nutX = 28;
  const fretW = 36;
  const stringGap = 22;
  const top = 22;
  const width = nutX + visibleFrets * fretW + 16;
  const height = top + (GUITAR_TUNING.length - 1) * stringGap + 36;

  const dots = [];
  for (let s = 0; s < 6; s += 1) {
    for (let f = 0; f <= visibleFrets; f += 1) {
      const abs = startFret + f;
      const pc = noteAt(s, abs);
      if (!scale.has(pc)) continue;
      if (onlySet && !onlySet.has(pc)) continue;
      const inBox =
        mode === 'full'
          ? isInBox(abs, majorKey, position)
          : fingering[s].includes(f);
      if (mode === 'box' && !inBox) continue;
      const isApproach = Boolean(approachSet?.has(pc) && !chordSet?.has(pc));
      const isChordTone = Boolean(chordSet?.has(pc));
      dots.push({
        string: s,
        fret: f,
        abs,
        pc,
        name: noteName(pc),
        isRoot: pc === rootPc,
        isMinorRoot: isPent && pc === minorPc && pc !== rootPc,
        isApproach: Boolean(isApproach),
        isChordTone: Boolean(isChordTone),
        inBox,
      });
    }
  }

  const inlays = [3, 5, 7, 9, 12].filter((n) => n <= visibleFrets);

  el.innerHTML = `
    <svg class="fretboard-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="Guitar fretboard in ${majorKey}">
      <rect class="fb-wood" x="0" y="0" width="${width}" height="${height}" rx="10"/>
      <text class="fb-label" x="8" y="14">${title}</text>
      ${resolvedCapo > 0 && mode === 'full' ? `<rect class="fb-capo" x="${nutX + (resolvedCapo - 1) * fretW + 4}" y="${top - 8}" width="${fretW - 8}" height="${stringGap * 5 + 16}" rx="4"/>` : ''}
      ${Array.from({ length: 6 }, (_, s) => {
        const y = top + s * stringGap;
        return `<line class="fb-string" x1="${nutX}" y1="${y}" x2="${nutX + visibleFrets * fretW}" y2="${y}"/>`;
      }).join('')}
      ${Array.from({ length: visibleFrets + 1 }, (_, f) => {
        const x = nutX + f * fretW;
        const thick = f === 0 ? 'fb-nut' : 'fb-fret';
        return `<line class="${thick}" x1="${x}" y1="${top}" x2="${x}" y2="${top + 5 * stringGap}"/>`;
      }).join('')}
      ${inlays.map((f) => {
        const x = nutX + (f - 0.5) * fretW;
        const y = top + 2.5 * stringGap;
        if (f === 12) {
          return `<circle class="fb-inlay" cx="${x}" cy="${top + stringGap}" r="3"/><circle class="fb-inlay" cx="${x}" cy="${top + 4 * stringGap}" r="3"/>`;
        }
        return `<circle class="fb-inlay" cx="${x}" cy="${y}" r="3.5"/>`;
      }).join('')}
      ${dots.map((d) => {
        const x = d.fret === 0 ? nutX - 12 : nutX + (d.fret - 0.5) * fretW;
        const y = top + d.string * stringGap;
        const cls = d.isRoot
          ? 'root'
          : d.isApproach
            ? 'approach'
            : d.isChordTone
              ? 'chord-tone'
              : d.isMinorRoot
                ? 'minor-root'
                : 'scale';
        return `<g>
          <circle class="fb-dot ${cls}" cx="${x}" cy="${y}" r="8"/>
          <text class="fb-dot-label" x="${x}" y="${y + 3}">${d.name}</text>
        </g>`;
      }).join('')}
      ${GUITAR_STRING_NAMES.map((name, s) => `<text class="fb-string-name" x="10" y="${top + s * stringGap + 4}">${name}</text>`).join('')}
      ${Array.from({ length: visibleFrets }, (_, i) => {
        const n = startFret + i + 1;
        return `<text class="fb-fret-num" x="${nutX + (i + 0.5) * fretW}" y="${top + 5 * stringGap + 16}">${n}</text>`;
      }).join('')}
    </svg>
    ${showLegend ? `<div class="fret-legend">
      <span><i class="swatch root"></i> Tonic (${tonic})</span>
      ${approachSet ? '<span><i class="swatch approach"></i> Half-step approach</span>' : ''}
      ${chordSet ? '<span><i class="swatch chord-tone"></i> Chord tone</span>' : ''}
      ${isPent && !chordSet ? `<span><i class="swatch minor-root"></i> Relative root (${relativeMinor(majorKey)}m / ${majorKey})</span>` : ''}
      ${!chordSet ? `<span><i class="swatch scale"></i> Other ${type.name.toLowerCase()} tones</span>` : ''}
    </div>` : ''}
  `;
}

export function renderDreadnought(el, options = {}) {
  const {
    majorKey = 'G',
    positionId = 1,
    capo = 0,
    frets = 14,
    scaleTypeId = 'major-pent',
  } = options;
  const type = getScaleType(scaleTypeId);
  const tonic = scaleTonic(majorKey, type);
  const position = getPosition(positionId);
  const scale = new Set(notesForScale(majorKey, scaleTypeId).map((n) => pitchClass(n)));
  const rootPc = pitchClass(tonic);
  const minorPc = pitchClass(relativeMinor(majorKey));
  const isPent = type.id === 'major-pent' || type.id === 'minor-pent';
  const capoFret = Number(capo) || 0;

  const nutX = 58;
  const fretW = 28;
  const stringGap = 18;
  const top = 36;
  const neckEnd = nutX + frets * fretW;
  const width = neckEnd + 108;
  const height = top + 5 * stringGap + 34;
  const stringsY = (s) => top + s * stringGap;

  const dots = [];
  for (let s = 0; s < 6; s += 1) {
    for (let abs = 0; abs <= frets; abs += 1) {
      const pc = noteAt(s, abs);
      if (!scale.has(pc)) continue;
      dots.push({
        string: s,
        abs,
        name: noteName(pc),
        behind: capoFret > 0 && abs < capoFret,
        isRoot: pc === rootPc,
        isMinorRoot: isPent && pc === minorPc && pc !== rootPc,
      });
    }
  }

  const inlays = [3, 5, 7, 9, 12].filter((n) => n <= frets);
  const capoX = capoFret > 0 ? nutX + capoFret * fretW : 0;
  const title = capoFret === 0
    ? `${position.label} · open`
    : `${position.label} · capo ${capoFret}`;

  el.innerHTML = `
    <svg class="guitar-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}. Neck from the nut through fret ${frets}.">
      <text class="fb-label" x="8" y="16">${title}</text>
      <rect class="fb-head" x="6" y="${top - 10}" width="42" height="${5 * stringGap + 20}" rx="8"/>
      <path class="fb-body" d="
        M ${neckEnd - 8} ${top - 14}
        L ${neckEnd + 18} ${top - 22}
        C ${neckEnd + 70} ${top - 36}, ${width - 8} ${top + 10}, ${width - 12} ${top + 2.5 * stringGap}
        C ${width - 8} ${top + 5 * stringGap + 20}, ${neckEnd + 40} ${top + 5 * stringGap + 28}, ${neckEnd + 6} ${top + 5 * stringGap + 14}
        L ${neckEnd - 8} ${top + 5 * stringGap + 14}
        Z"/>
      <rect class="fb-wood" x="${nutX - 6}" y="${top - 12}" width="${neckEnd - nutX + 14}" height="${5 * stringGap + 24}" rx="3"/>
      ${Array.from({ length: 6 }, (_, s) => {
        const y = stringsY(s);
        return `<line class="fb-string" x1="${nutX}" y1="${y}" x2="${neckEnd + 24}" y2="${y}"/>`;
      }).join('')}
      ${Array.from({ length: frets + 1 }, (_, f) => {
        const x = nutX + f * fretW;
        return `<line class="${f === 0 ? 'fb-nut' : 'fb-fret'}" x1="${x}" y1="${top - 8}" x2="${x}" y2="${top + 5 * stringGap + 8}"/>`;
      }).join('')}
      ${inlays.map((f) => {
        const x = nutX + (f - 0.5) * fretW;
        if (f === 12) {
          return `<circle class="fb-inlay" cx="${x}" cy="${stringsY(1)}" r="3"/><circle class="fb-inlay" cx="${x}" cy="${stringsY(4)}" r="3"/>`;
        }
        return `<circle class="fb-inlay" cx="${x}" cy="${stringsY(2.5)}" r="3.2"/>`;
      }).join('')}
      ${capoFret > 0 ? `<rect class="fb-capo" x="${capoX - 5}" y="${top - 16}" width="10" height="${5 * stringGap + 32}" rx="3"/>` : ''}
      ${dots.map((d) => {
        const x = d.abs === 0 ? nutX - 18 : nutX + (d.abs - 0.5) * fretW;
        const y = stringsY(d.string);
        const cls = d.behind
          ? 'behind'
          : d.isRoot
            ? 'root'
            : d.isMinorRoot
              ? 'minor-root'
              : 'scale';
        return `<g>
          <circle class="fb-dot ${cls}" cx="${x}" cy="${y}" r="7"/>
          <text class="fb-dot-label ${d.behind ? 'behind' : ''}" x="${x}" y="${y + 3}">${d.name}</text>
        </g>`;
      }).join('')}
      ${GUITAR_STRING_NAMES.map((name, s) => `<text class="fb-string-name" x="26" y="${stringsY(s) + 3}">${name}</text>`).join('')}
      ${Array.from({ length: frets }, (_, i) => `
        <text class="fb-fret-num" x="${nutX + (i + 0.5) * fretW}" y="${top + 5 * stringGap + 22}">${i + 1}</text>
      `).join('')}
    </svg>
    ${capoFret > 0 ? '<p class="hint">Dim notes are the ones between the nut and the capo.</p>' : ''}
  `;
}

function isInBox(absFret, majorKey, position) {
  const box1 = capoFor(majorKey, 1);
  const rel = (absFret - box1 + 12) % 12;
  const start = position.boxOffsetFrets;
  const next = start === 10 ? 12 : PENTATONIC_POSITIONS[position.id % 5].boxOffsetFrets;
  const end = start === 10 ? 12 : next;
  if (start < end) return rel >= start && rel <= end;
  return rel >= start || rel <= end % 12;
}

export function renderScaleStrip(el, majorKey, scaleTypeId = 'major-pent') {
  const type = getScaleType(scaleTypeId);
  const tonic = scaleTonic(majorKey, type);
  const notes = notesForScale(majorKey, scaleTypeId);
  const pills = notes.map((n, i) => {
    const degree = type.degrees[i] || '';
    const cls = i === 0 ? 'root' : '';
    return `<span class="pill ${cls}"><b>${n}</b><small>${degree}</small></span>`;
  }).join('');

  if (type.id === 'major-pent' || type.id === 'minor-pent') {
    const major = majorPentatonic(majorKey);
    const minor = minorPentatonic(relativeMinor(majorKey));
    el.innerHTML = `
      <div class="scale-strip">
        <div>
          <strong>${majorKey} major pentatonic</strong>
          <div class="note-pills">${major.map((n, i) => `<span class="pill ${i === 0 ? 'root' : ''}">${n}</span>`).join('')}</div>
        </div>
        <div class="equals">=</div>
        <div>
          <strong>${relativeMinor(majorKey)} minor pentatonic</strong>
          <div class="note-pills">${minor.map((n, i) => `<span class="pill ${i === 0 ? 'minor-root' : ''}">${n}</span>`).join('')}</div>
        </div>
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div>
      <strong>${tonic} ${type.name}</strong>
      <p class="hint">${type.hint}</p>
      <div class="note-pills">${pills}</div>
    </div>
  `;
}
