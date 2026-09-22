import { fillKeySelect, fillPositionSelect, rememberKeyPosition, showTab } from './app.js';
import { addCapoPreset, getState, removeCapoPreset } from './storage.js';
import { explainCapo, formatCapo } from './theory.js';
import { renderDreadnought, renderFretboard, renderScaleStrip } from './fretboard.js';
import { GUITAR_STRINGS, playReference, startListening, stopListening, stopReference } from './tuner.js';

const keyEl = document.querySelector('#song-key');
const posEl = document.querySelector('#position');
const state = getState();
fillKeySelect(keyEl, state.preferences.songKey);
fillPositionSelect(posEl, state.preferences.positionId);

function render() {
  const info = explainCapo(keyEl.value, Number(posEl.value));
  document.querySelector('#capo-label').textContent = info.label;
  document.querySelector('#capo-summary').textContent = info.summary;
  document.querySelector('#capo-meta').textContent =
    `${info.shapes} shapes. On an open neck, fret ${info.boxOnUncapoedNeck} in ${info.songKey}.`;

  const note = document.querySelector('#capo-note');
  if (info.songKey === 'C' && info.position.id === 1) {
    note.hidden = false;
    note.textContent =
      'Capo 3 in C is the A-form, 5th position. Position 1 is the Em/G box, so C is capo 5.';
  } else if (info.songKey === 'A' && info.position.id === 5) {
    note.hidden = false;
    note.textContent =
      'The 5th box is already A. Play it open.';
  } else {
    note.hidden = true;
  }

  renderDreadnought(document.querySelector('#guitar-neck'), {
    majorKey: info.songKey,
    positionId: info.position.id,
    capo: info.fret,
    frets: 14,
  });
  renderScaleStrip(document.querySelector('#scale-strip'), info.songKey);
  renderFretboard(document.querySelector('#box-neck'), {
    majorKey: info.songKey,
    positionId: info.position.id,
    capo: info.fret,
    mode: 'box',
  });
  renderFretboard(document.querySelector('#full-neck'), {
    majorKey: info.songKey,
    positionId: info.position.id,
    capo: info.fret,
    mode: 'full',
    frets: 12,
  });
  rememberKeyPosition(keyEl.value, posEl.value);
  renderPresets();
}

function renderPresets() {
  const presets = getState().capoPresets;
  const el = document.querySelector('#presets');
  if (!presets.length) {
    el.innerHTML = '<p class="muted">No saved setups yet.</p>';
    return;
  }
  el.innerHTML = presets.map((p) => `
    <div class="card">
      <h3>${p.songKey} · ${p.positionId}${['st','nd','rd','th','th'][p.positionId-1]} box</h3>
      <p>${formatCapo(p.fret)} · ${p.summary}</p>
      <div class="row-actions">
        <button class="btn btn-ghost" data-load="${p.id}" type="button">Load</button>
        <button class="btn btn-danger" data-del="${p.id}" type="button">Remove</button>
      </div>
    </div>
  `).join('');
  el.querySelectorAll('[data-load]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = getState().capoPresets.find((x) => x.id === btn.dataset.load);
      if (!p) return;
      keyEl.value = p.songKey;
      posEl.value = String(p.positionId);
      render();
    });
  });
  el.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      removeCapoPreset(btn.dataset.del);
      renderPresets();
    });
  });
}

document.querySelector('#save-preset').addEventListener('click', () => {
  const info = explainCapo(keyEl.value, Number(posEl.value));
  addCapoPreset({
    songKey: info.songKey,
    positionId: info.position.id,
    fret: info.fret,
    summary: info.summary,
  });
  renderPresets();
  showTab('saved');
});

keyEl.addEventListener('change', render);
posEl.addEventListener('change', render);
render();

const noteEl = document.querySelector('#tuner-note');
const centsEl = document.querySelector('#tuner-cents');
const listenBtn = document.querySelector('#tuner-listen');
const stringsEl = document.querySelector('#tuner-strings');
let listening = false;

function showPitch(pitch) {
  if (!pitch) {
    noteEl.textContent = '—';
    centsEl.textContent = listening ? 'Listening.' : 'Standard tuning.';
    noteEl.classList.remove('in-tune');
    return;
  }
  noteEl.textContent = pitch.label;
  const off = pitch.cents;
  noteEl.classList.toggle('in-tune', Math.abs(off) <= 5);
  if (Math.abs(off) <= 5) centsEl.textContent = 'In tune.';
  else if (off > 0) centsEl.textContent = `${off} cents sharp.`;
  else centsEl.textContent = `${Math.abs(off)} cents flat.`;
}

stringsEl.innerHTML = GUITAR_STRINGS.map((string) =>
  `<button type="button" class="btn btn-ghost" data-string="${string.id}">${string.name}</button>`
).join('');

stringsEl.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-string]');
  if (!btn) return;
  const string = GUITAR_STRINGS.find((item) => item.id === btn.dataset.string);
  if (!string) return;
  playReference(string.freq);
});

async function setListening(on) {
  listening = on;
  listenBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  listenBtn.textContent = on ? 'Stop' : 'Listen';
  if (!on) {
    stopListening();
    showPitch(null);
    return;
  }
  try {
    await startListening(showPitch);
  } catch {
    listening = false;
    listenBtn.setAttribute('aria-pressed', 'false');
    listenBtn.textContent = 'Listen';
    centsEl.textContent = 'Microphone off.';
  }
}

listenBtn.addEventListener('click', () => setListening(!listening));

const tunerPanel = document.querySelector('[data-tab-panel="tuner"]');
new MutationObserver(() => {
  if (!tunerPanel.hidden) return;
  stopReference();
  if (listening) setListening(false);
}).observe(tunerPanel, { attributes: true, attributeFilter: ['hidden'] });
