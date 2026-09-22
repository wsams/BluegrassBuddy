import { jam } from './audio.js';
import { BUILTIN_SONGS, flattenSong } from './songs-data.js';
import { getState, patchMixer, patchPreferences } from './storage.js';
import { INSTRUMENTS } from './instruments-data.js';
import { pitchClass, transposeChord } from './theory.js';

export function allSongs() {
  const custom = getState().customSongs || [];
  return [...custom, ...BUILTIN_SONGS];
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

export function renderLeadSheet(el, song, activeIndex = -1) {
  const bars = flattenSong(song);
  let html = '';
  let lastSection = '';
  bars.forEach((bar, i) => {
    if (bar.section !== lastSection) {
      html += `<h3 class="sheet-section">${bar.section}</h3><div class="sheet-row">`;
      lastSection = bar.section;
    }
    html += `
      <div class="bar ${i === activeIndex ? 'active' : ''}" data-bar="${i}">
        <div class="bar-chords">${bar.chords.map((c) => `<span class="chord">${c}</span>`).join('<span class="chord-split">/</span>')}</div>
        <div class="bar-lyric">${bar.lyric || '&nbsp;'}</div>
      </div>
    `;
    const next = bars[i + 1];
    if (!next || next.section !== bar.section) html += '</div>';
  });
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
    if (nowEl) {
      nowEl.innerHTML = `<span class="now-chords">${bar.chords.join('  ')}</span><span class="now-lyric">${bar.lyric || ''}</span>`;
    }
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
