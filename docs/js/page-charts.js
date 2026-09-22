import { fillKeySelect } from './app.js';
import { getState, patchPreferences } from './storage.js';
import {
  BLUEGRASS_KEYS,
  PENTATONIC_POSITIONS,
  SCALE_TYPES,
  GUITAR_TUNING,
  capoChart,
  capoFor,
  formatCapo,
  relativeMinor,
  reverseCapoChart,
  jamChords,
  diatonicChords,
  notesForScale,
  getScaleType,
  scaleTonic,
  approachChord,
  chromaticWalkFrets,
  chordPitchClasses,
  parseChord,
  pitchClass,
} from './theory.js';
import {
  chordCardHtml,
  chordDiagramSvg,
  COWBOY_LIBRARY,
  tenDollarSet,
  voicingFor,
  transposeVoicing,
} from './chords.js';
import { renderFretboard } from './fretboard.js';
import { JamEngine } from './audio.js';

function head(labels, first) {
  return `<tr><th class="key">${first}</th>${labels.map((l) => `<th>${l}</th>`).join('')}</tr>`;
}

const keyEl = document.querySelector('#chord-key');
const targetEl = document.querySelector('#chromatic-target');
fillKeySelect(keyEl, getState().preferences.songKey);

function fillTargets() {
  const prior = targetEl.value;
  const options = jamChords(keyEl.value).filter((c) => ['I', 'IV', 'V', 'V7'].includes(c.numeral));
  targetEl.innerHTML = options.map((c) => `<option value="${c.symbol}">${c.numeral} · ${c.symbol}</option>`).join('');
  if ([...targetEl.options].some((o) => o.value === prior)) targetEl.value = prior;
}

function renderTenDollar(key) {
  const set = tenDollarSet(key);
  const families = [...new Set(set.map((c) => c.family))];
  document.querySelector('#ten-dollar-chords').innerHTML = families.map((fam) => `
    <h3>${fam}</h3>
    <div class="chord-grid">
      ${set.filter((c) => c.family === fam).map((c) => chordCardHtml(c.symbol, {
        numeral: c.numeral,
        role: c.voicing.label,
        why: c.why,
      })).join('')}
    </div>
  `).join('');
}

function diagramCard(voicing, badge, blurb) {
  const shape = (voicing.frets || []).join(',');
  return `
    <article class="chord-card">
      <button type="button" class="chord-play" data-play-chord="${voicing.symbol}" data-play-frets="${shape}"><span class="chord-play-label">Play ${voicing.symbol}</span></button>
      <div class="chord-card-head">
        <h3>${voicing.symbol}</h3>
        <span class="badge ready">${badge}</span>
        <span class="chord-play-mark" aria-hidden="true">Play</span>
      </div>
      ${chordDiagramSvg(voicing)}
      <p class="hint">${blurb}</p>
    </article>
  `;
}

function walkString(rootName) {
  const rootPc = pitchClass(rootName);
  const dist = (open) => (rootPc - open + 12) % 12;
  const choices = [
    { name: 'low E', open: GUITAR_TUNING[0] },
    { name: 'A', open: GUITAR_TUNING[1] },
    { name: 'D', open: GUITAR_TUNING[2] },
  ];
  choices.sort((a, b) => dist(a.open) - dist(b.open));
  return choices[0];
}

function renderChromatics() {
  const symbol = targetEl.value;
  if (!symbol) return;
  const closed = voicingFor(symbol, { closed: true, form: 'E' });
  const below = { ...transposeVoicing(closed, -1), symbol: approachChord(symbol, -1) };
  const above = { ...transposeVoicing(closed, 1), symbol: approachChord(symbol, 1) };

  document.querySelector('#slide-trio').innerHTML = [
    diagramCard(below, '½ step below', 'Start here, then slide up'),
    '<div class="slide-arrow" aria-hidden="true">→</div>',
    diagramCard(closed, 'Target', 'Same shape, one fret higher'),
    '<div class="slide-arrow" aria-hidden="true">←</div>',
    diagramCard(above, '½ step above', 'Fall in from a fret sharp'),
  ].join('');

  const string = walkString(parseChord(symbol).root);
  const steps = chromaticWalkFrets(parseChord(symbol).root, string.open, 4);
  document.querySelector('#chromatic-walk').innerHTML = `
    <p class="muted">${string.name} string · chromatic into <strong>${symbol}</strong></p>
    <div class="walk-notes">
      ${steps.map((s, i) => `
        ${i ? '<span class="walk-arr">→</span>' : ''}
        <span class="walk-note ${s.landing ? 'landing' : ''}">
          <b>${s.note}</b>
          <small>fret ${s.fret}${s.landing ? ' · root' : ''}</small>
        </span>
      `).join('')}
    </div>
  `;

  const chordPcs = chordPitchClasses(symbol);
  const approachPcs = chordPcs.map((pc) => (pc - 1 + 12) % 12);
  renderFretboard(document.querySelector('#chromatic-neck'), {
    majorKey: keyEl.value,
    scaleTypeId: 'chromatic',
    capo: 0,
    mode: 'full',
    frets: 12,
    title: `${symbol} chord tones + half-step below`,
    root: parseChord(symbol).root,
    chordPcs,
    approachPcs,
    onlyPcs: [...new Set([...chordPcs, ...approachPcs])],
  });
}

function renderKeyChords() {
  const key = keyEl.value;
  patchPreferences({ songKey: key });
  document.querySelector('#key-chords').innerHTML = jamChords(key)
    .map((c) => chordCardHtml(c.symbol, { numeral: c.numeral, role: c.role }))
    .join('');
  renderTenDollar(key);
  fillTargets();
  renderChromatics();
}

keyEl.addEventListener('change', renderKeyChords);
targetEl.addEventListener('change', renderChromatics);
renderKeyChords();

document.querySelector('#cowboy-chords').innerHTML = COWBOY_LIBRARY
  .map((symbol) => chordCardHtml(symbol))
  .join('');

const chordAudio = new JamEngine();
document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-play-chord]');
  if (!btn) return;
  const frets = (btn.dataset.playFrets || '')
    .split(',')
    .filter((part) => part !== '')
    .map((part) => Number(part));
  const card = btn.closest('.chord-card');
  card?.classList.add('is-playing');
  window.setTimeout(() => card?.classList.remove('is-playing'), 700);
  chordAudio.previewChord(btn.dataset.playChord, frets);
});

const diatonicCols = ['I', 'ii', 'iii', 'IV', 'V', 'V7', 'vi', 'bVII'];
document.querySelector('#chart-diatonic').innerHTML =
  head(diatonicCols, 'Key') +
  BLUEGRASS_KEYS.map((key) => {
    const row = diatonicChords(key);
    const cells = diatonicCols
      .map((n) => {
        const hit = row.find((c) => c.numeral === n);
        const hl = n === 'I' || n === 'IV' || n === 'V' ? 'hl' : '';
        return `<td class="${hl}">${hit?.symbol ?? ''}</td>`;
      })
      .join('');
    return `<tr><td class="key">${key} <span class="muted">(${relativeMinor(key)}m)</span></td>${cells}</tr>`;
  }).join('');

const scaleTypeEl = document.querySelector('#chart-scale-type');
scaleTypeEl.innerHTML = SCALE_TYPES.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');

function renderScaleChart() {
  const type = getScaleType(scaleTypeEl.value);
  document.querySelector('#chart-scales').innerHTML =
    head(type.degrees, `Key · ${type.name}`) +
    BLUEGRASS_KEYS.map((key) => {
      const tonic = scaleTonic(key, type);
      const notes = notesForScale(key, type.id);
      const cells = notes.map((n, i) => `<td class="${i === 0 ? 'hl' : ''}">${n}</td>`).join('');
      const label = type.tonic === 'relative-minor' ? `${key} → ${tonic}m` : key;
      return `<tr><td class="key">${label}</td>${cells}</tr>`;
    }).join('');
}

scaleTypeEl.addEventListener('change', renderScaleChart);
renderScaleChart();

const forward = capoChart();
document.querySelector('#chart-forward').innerHTML =
  head(
    PENTATONIC_POSITIONS.map((p) => `${p.label} · ${p.caged}`),
    'Song key',
  ) +
  forward
    .map((row) => {
      const cells = row.positions
        .map((p) => `<td class="${p.capo === 0 ? 'hl' : ''}">${p.capo === 0 ? 'open' : p.capo}</td>`)
        .join('');
      return `<tr><td class="key">${row.key} <span class="muted">(${row.relativeMinor}m)</span></td>${cells}</tr>`;
    })
    .join('');

const reverse = reverseCapoChart().filter((r) => r.fret <= 7);
document.querySelector('#chart-reverse').innerHTML =
  head(
    PENTATONIC_POSITIONS.map((p) => `${p.label} box`),
    'Capo',
  ) +
  reverse
    .map((row) => {
      const cells = row.positions.map((p) => `<td>${p.key}</td>`).join('');
      return `<tr><td class="key">${row.label}</td>${cells}</tr>`;
    })
    .join('');

document.querySelector('#chart-cowboy').innerHTML = `
  ${head(['Play these open shapes', 'Capo', 'Relative minor pentatonic'], 'Want this key')}
  ${BLUEGRASS_KEYS.map((key) => {
    const fret = capoFor(key, 1);
    return `<tr>
      <td class="key">${key}</td>
      <td>G / Em</td>
      <td class="${fret === 0 ? 'hl' : ''}">${formatCapo(fret)}</td>
      <td>${relativeMinor(key)} minor pentatonic</td>
    </tr>`;
  }).join('')}
`;
