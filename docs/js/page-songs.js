import { fillKeySelect, showTab } from './app.js';
import { getState, patchPreferences, removeCustomSong, upsertCustomSong } from './storage.js';
import { parseLeadSheet, songToLeadSheet } from './songs-data.js';
import { allSongs } from './player-ui.js';

const keyEl = document.querySelector('#key');
fillKeySelect(keyEl, 'G');

function renderLibrary() {
  const el = document.querySelector('#library');
  el.innerHTML = allSongs()
    .map((s) => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;gap:0.5rem">
          <h3>${s.title}</h3>
          ${s.custom ? '<span class="badge custom">Custom</span>' : '<span class="badge ready">Built-in</span>'}
        </div>
        <p>${s.key} · ${s.time} · ${s.tempo} bpm · ${s.tags?.join(', ') || ''}</p>
        <p class="hint">${s.source || ''}</p>
        <div class="row-actions">
          <a class="btn btn-primary" href="jam.html" data-open="${s.id}">Jam</a>
          ${s.custom ? `
            <button class="btn btn-ghost" data-edit="${s.id}" type="button">Edit</button>
            <button class="btn btn-danger" data-del="${s.id}" type="button">Delete</button>
          ` : ''}
        </div>
      </div>
    `)
    .join('');

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

renderLibrary();
