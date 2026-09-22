import { jam } from './audio.js';
import { BUILTIN_SONGS, flattenSong, lyricColumns } from './songs-data.js';
import { getState, patchMixer, patchPreferences } from './storage.js';
import { INSTRUMENTS } from './instruments-data.js';
import { pitchClass, transposeChord } from './theory.js';

export function allSongs() {
  const byTitle = (a, b) => a.title.localeCompare(b.title);
  const custom = [...(getState().customSongs || [])].sort(byTitle);
  const builtin = [...BUILTIN_SONGS].sort(byTitle);
  return [...custom, ...builtin];
}

export function getSong(id) {
  return allSongs().find((s) => s.id === id) || BUILTIN_SONGS[0];
}

export function transposeSong(song, targetKey) {
  const from = pitchClass(song.key);
  const to = pitchClass(targetKey);
  const delta = (to - from + 12) % 12;
  if (delta === 0) return { ...song, sections: song.sections };
  const preferFlats = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(targetKey);
  return {
    ...song,
    key: targetKey,
    sections: song.sections.map((section) => ({
      ...section,
      bars: section.bars.map((bar) => ({
        ...bar,
        chords: bar.chords.map((c) => transposeChord(c, delta, preferFlats)),
      })),
    })),
  };
}

export function renderMixer(el) {
  const mixer = getState().mixer;
  el.innerHTML = INSTRUMENTS.map((inst) => {
    const slot = mixer[inst.id] || { on: false, pattern: inst.patterns[0].id };
    return `
      <div class="mixer-card ${slot.on ? 'on' : ''}" data-inst="${inst.id}">
        <div class="mixer-head">
          <label class="switch">
            <input type="checkbox" data-mix-on="${inst.id}" ${slot.on ? 'checked' : ''}/>
            <span>${inst.name}</span>
          </label>
        </div>
        <select data-mix-pattern="${inst.id}" aria-label="${inst.name} pattern">
          ${inst.patterns.map((p) => `<option value="${p.id}" ${p.id === slot.pattern ? 'selected' : ''}>${p.name}</option>`).join('')}
        </select>
        <p class="hint">${inst.patterns.find((p) => p.id === slot.pattern)?.hint || inst.role}</p>
      </div>
    `;
  }).join('');

  el.querySelectorAll('[data-mix-on]').forEach((input) => {
    input.addEventListener('change', () => {
      patchMixer(input.dataset.mixOn, { on: input.checked });
      jam.mixer = getState().mixer;
      el.querySelector(`[data-inst="${input.dataset.mixOn}"]`)?.classList.toggle('on', input.checked);
    });
  });
  el.querySelectorAll('[data-mix-pattern]').forEach((select) => {
    select.addEventListener('change', () => {
      patchMixer(select.dataset.mixPattern, { pattern: select.value });
      jam.mixer = getState().mixer;
      const inst = INSTRUMENTS.find((i) => i.id === select.dataset.mixPattern);
      const hint = inst?.patterns.find((p) => p.id === select.value)?.hint;
      select.parentElement.querySelector('.hint').textContent = hint || '';
    });
  });
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

function renderLine(cols) {
  const anyWords = cols.some((col) => col.lyric);
  return `<div class="sheet-line">${cols.map((col) => {
    const lyric = anyWords
      ? `<span class="lyric">${col.lyric ? esc(col.lyric) : '&nbsp;'}</span>`
      : '';
    const chord = col.chord ? esc(col.chord) : '&nbsp;';
    return `<span class="sheet-col${col.active ? ' active' : ''}" data-bar="${col.index}"><span class="chord">${chord}</span>${lyric}</span>`;
  }).join('')}</div>`;
}

export function renderLeadSheet(el, song, activeIndex = -1) {
  const bars = flattenSong(song);
  let html = '';
  let lastSection = '';
  let line = [];
  const flush = () => {
    if (!line.length) return;
    html += renderLine(line);
    line = [];
  };
  bars.forEach((bar, i) => {
    if (bar.section !== lastSection) {
      flush();
      html += `<h3 class="sheet-section">${esc(bar.section)}</h3>`;
      lastSection = bar.section;
    }
    if (bar.lineStart && line.length) flush();
    else if (bar.lineStart == null && bar.sectionIndex > 0 && bar.sectionIndex % 4 === 0 && line.length) flush();
    if (bar.pickup) line.push({ chord: '', lyric: bar.pickup, index: i, active: i === activeIndex });
    for (const col of lyricColumns(bar.chords, bar.lyric)) {
      line.push({ ...col, index: i, active: i === activeIndex });
    }
  });
  flush();
  el.innerHTML = html;
}

export function bindPlayer({
  songSelect,
  keySelect,
  tempoInput,
  playBtn,
  stopBtn,
  sheetEl,
  nowEl,
  beatEl,
}) {
  const state = getState();

  function current() {
    const base = getSong(songSelect.value);
    const key = keySelect.value;
    const song = transposeSong(base, key);
    return { base, song, bars: flattenSong(song) };
  }

  function applySong() {
    const { song, bars } = current();
    jam.setSong(bars, {
      tempo: Number(tempoInput.value) || song.tempo,
      time: song.time,
      mixer: getState().mixer,
      transpose: 0,
    });
    renderLeadSheet(sheetEl, song, jam.playing ? jam.barIndex : -1);
    patchPreferences({ lastSongId: songSelect.value, songKey: keySelect.value });
  }

  songSelect.innerHTML = allSongs()
    .map((s) => `<option value="${s.id}">${s.title}${s.custom ? ' (custom)' : ''}</option>`)
    .join('');
  songSelect.value = state.preferences.lastSongId;
  if (![...songSelect.options].some((o) => o.value === songSelect.value)) {
    songSelect.value = BUILTIN_SONGS[0].id;
  }

  keySelect.value = keySelect.value || state.preferences.songKey;
  const selected = getSong(songSelect.value);
  tempoInput.value = selected.tempo;

  songSelect.addEventListener('change', () => {
    const s = getSong(songSelect.value);
    keySelect.value = s.key;
    tempoInput.value = s.tempo;
    applySong();
  });
  keySelect.addEventListener('change', applySong);
  tempoInput.addEventListener('input', () => {
    jam.tempo = Number(tempoInput.value) || 110;
  });

  playBtn.addEventListener('click', async () => {
    applySong();
    if (jam.playing) {
      jam.stop();
      playBtn.textContent = 'Play';
      return;
    }
    playBtn.textContent = 'Pause';
    await jam.start(0);
  });

  stopBtn.addEventListener('click', () => {
    jam.stop();
    jam.barIndex = 0;
    playBtn.textContent = 'Play';
    applySong();
    if (nowEl) nowEl.textContent = 'Ready';
  });

  jam.onBar = (index, bar) => {
    renderLeadSheet(sheetEl, current().song, index);
    sheetEl.querySelector(`[data-bar="${index}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    if (nowEl) nowEl.innerHTML = renderLine(lyricColumns(bar.chords, bar.lyric).map((col) => ({ ...col, index: -1, active: false })));
  };
  jam.onBeat = (_i, beat) => {
    if (beatEl) beatEl.textContent = String(beat + 1);
  };
  jam.onStop = () => {
    playBtn.textContent = 'Play';
  };

  applySong();
  return { applySong, current };
}
