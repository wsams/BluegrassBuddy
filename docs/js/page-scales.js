import { fillKeySelect } from './app.js';
import { getState, patchPreferences } from './storage.js';
import {
  PENTATONIC_POSITIONS,
  SCALE_TYPES,
  capoFor,
  formatCapo,
  getScaleType,
} from './theory.js';
import { renderFretboard, renderScaleStrip } from './fretboard.js';

const keyEl = document.querySelector('#scale-key');
const typeEl = document.querySelector('#scale-type');
fillKeySelect(keyEl, getState().preferences.songKey);
typeEl.innerHTML = SCALE_TYPES.map((s) => `<option value="${s.id}">${s.name}</option>`).join('');
typeEl.value = 'major-pent';

function render() {
  const key = keyEl.value;
  const scaleTypeId = typeEl.value;
  const type = getScaleType(scaleTypeId);
  patchPreferences({ songKey: key });
  document.querySelector('#scale-hint').textContent = type.hint;
  renderScaleStrip(document.querySelector('#scale-strip'), key, scaleTypeId);
  renderFretboard(document.querySelector('#full-neck'), {
    majorKey: key,
    positionId: 1,
    capo: 0,
    mode: 'full',
    frets: 12,
    scaleTypeId,
  });

  const boxesWrap = document.querySelector('#boxes-wrap');
  const isPent = type.id === 'major-pent' || type.id === 'minor-pent';
  if (!isPent) {
    boxesWrap.innerHTML = `<p class="muted">The five boxes are for major and minor pentatonic.</p>`;
    return;
  }
  boxesWrap.innerHTML = `
    <h2>The five pentatonic boxes in this key</h2>
    <div id="boxes" class="grid grid-2"></div>
  `;

  document.querySelector('#boxes').innerHTML = PENTATONIC_POSITIONS.map((p) => {
    const fret = capoFor(key, p.id);
    return `
      <div class="card">
        <div style="display:flex;justify-content:space-between;gap:0.6rem;align-items:baseline">
          <h3>${p.label} — ${p.title}</h3>
          <span class="badge ready">${formatCapo(fret)}</span>
        </div>
        <p>${p.description}</p>
        <p class="hint">Home open key: ${p.homeMajor} major / ${p.homeMinor} minor · ${p.cowboyShapes} shapes</p>
        <div data-box="${p.id}"></div>
      </div>
    `;
  }).join('');
  PENTATONIC_POSITIONS.forEach((p) => {
    renderFretboard(document.querySelector(`[data-box="${p.id}"]`), {
      majorKey: key,
      positionId: p.id,
      capo: capoFor(key, p.id),
      mode: 'box',
      scaleTypeId: 'major-pent',
    });
  });
}

keyEl.addEventListener('change', render);
typeEl.addEventListener('change', render);
render();
