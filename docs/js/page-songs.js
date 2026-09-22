import { fillKeySelect, showTab } from './app.js';
import { patchPreferences, removeCustomSong, upsertCustomSong } from './storage.js';
import { parseLeadSheet, songIndexLetter, songToLeadSheet } from './songs-data.js';
import { allSongs } from './player-ui.js';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const keyEl = document.querySelector('#key');
fillKeySelect(keyEl, 'G');

let letter = 'A';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

function matchesQuery(song, q) {
  const hay = [song.title, song.key, song.source, song.time, ...(song.tags || [])].join(' ').toLowerCase();
  return hay.includes(q);
}

function renderLibrary() {
  const q = document.querySelector('#song-search').value.trim().toLowerCase();
  const songs = allSongs();
  const present = new Set(songs.map((song) => songIndexLetter(song.title)));
  if (!q && letter !== 'ALL' && !present.has(letter)) letter = LETTERS.find((item) => present.has(item)) || 'A';

  const allOn = !q && letter === 'ALL';
  const allBtn = `<button type="button" class="az-letter az-all${allOn ? ' is-active' : ''}" data-letter="ALL" aria-pressed="${allOn}">All</button>`;
  document.querySelector('#az').innerHTML = allBtn + LETTERS.map((item) => {
    const active = !q && item === letter;
    const empty = !present.has(item);
    return `<button type="button" class="az-letter${active ? ' is-active' : ''}" data-letter="${item}" aria-pressed="${active}" ${empty ? 'disabled' : ''}>${item}</button>`;
  }).join('');
  document.querySelector('#az').querySelectorAll('[data-letter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      letter = btn.dataset.letter;
      document.querySelector('#song-search').value = '';
      renderLibrary();
    });
  });

  const shown = songs.filter((song) => {
    if (q) return matchesQuery(song, q);
    if (letter === 'ALL') return true;
    return songIndexLetter(song.title) === letter;
  });
  const el = document.querySelector('#library');
  const count = shown.length === 1 ? '1 song' : `${shown.length} songs`;
  document.querySelector('#song-count').textContent = q
    ? (shown.length === 1 ? '1 song matches this search' : `${shown.length} songs match this search`)
    : count;
  el.innerHTML = shown.length ? shown
    .map((s) => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;gap:0.5rem">
          <h3>${esc(s.title)}</h3>
          ${s.custom ? '<span class="badge custom">Custom</span>' : '<span class="badge ready">Built-in</span>'}
        </div>
        <p>${esc(s.key)} · ${esc(s.time)} · ${esc(s.tempo)} bpm · ${esc(s.tags?.join(', ') || '')}</p>
        <p class="hint">${esc(s.source || '')}</p>
        <div class="row-actions">
          <a class="btn btn-primary" href="jam.html" data-open="${s.id}">Jam</a>
          ${s.custom ? `
            <button class="btn btn-ghost" data-edit="${s.id}" type="button">Edit</button>
            <button class="btn btn-danger" data-del="${s.id}" type="button">Delete</button>
          ` : ''}
        </div>
      </div>
    `)
    .join('') : `<p class="hint">${q ? 'No songs match that search.' : `No songs under ${esc(letter)}.`}</p>`;

  el.querySelectorAll('[data-open]').forEach((a) => {
    a.addEventListener('click', () => patchPreferences({ lastSongId: a.dataset.open }));
  });
  el.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const song = allSongs().find((s) => s.id === btn.dataset.edit);
      if (!song) return;
      document.querySelector('#edit-id').value = song.id;
      document.querySelector('#title').value = song.title;
      keyEl.value = song.key;
      document.querySelector('#tempo').value = song.tempo;
      document.querySelector('#chart').value = songToLeadSheet(song);
      showTab('write');
    });
  });
  el.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this custom song from local storage?')) {
        removeCustomSong(btn.dataset.del);
        renderLibrary();
      }
    });
  });
}

function saveFromForm() {
  const chart = document.querySelector('#chart').value;
  const parsed = parseLeadSheet(chart);
  parsed.title = document.querySelector('#title').value.trim() || parsed.title;
  parsed.key = keyEl.value || parsed.key;
  parsed.tempo = Number(document.querySelector('#tempo').value) || parsed.tempo;
  const existing = document.querySelector('#edit-id').value;
  if (existing) parsed.id = existing;
  return upsertCustomSong(parsed);
}

document.querySelector('#save-song').addEventListener('click', () => {
  saveFromForm();
  document.querySelector('#edit-id').value = '';
  renderLibrary();
  showTab('library');
});
document.querySelector('#jam-song').addEventListener('click', () => {
  const song = saveFromForm();
  patchPreferences({ lastSongId: song.id, songKey: song.key });
  location.href = 'jam.html';
});

function fillWriter(song, note) {
  document.querySelector('#edit-id').value = '';
  document.querySelector('#title').value = song.title;
  if ([...keyEl.options].some((option) => option.value === song.key)) keyEl.value = song.key;
  document.querySelector('#tempo').value = song.tempo;
  document.querySelector('#chart').value = songToLeadSheet(song);
  const knownKey = [...keyEl.options].some((option) => option.value === song.key);
  const keyNote = knownKey ? '' : ` Key ${song.key} is not in the menu, so pick one before you save.`;
  document.querySelector('#load-note').textContent = `${note}${keyNote}`;
  showTab('write');
}

document.querySelector('#song-search').addEventListener('input', renderLibrary);

document.querySelector('#load-chart').addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return;
  try {
    const parsed = parseLeadSheet(await file.text());
    if (parsed.title === 'Untitled') parsed.title = file.name.replace(/\.[^.]+$/, '') || 'Untitled';
    const bars = parsed.sections.reduce((count, section) => count + section.bars.length, 0);
    fillWriter(parsed, `Loaded ${bars} bars from ${file.name}. Save to keep it in this browser.`);
  } catch (err) {
    document.querySelector('#load-note').textContent = err.message || 'Could not read that chart.';
  }
});

renderLibrary();
