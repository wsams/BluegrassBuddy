const KEY = 'bluegrassbuddy.v1';

const EMPTY = {
  version: 2,
  preferences: {
    songKey: 'G',
    positionId: 1,
    instrument: 'guitar',
    lastSongId: 'circle-be-unbroken',
    theme: 'dark',
  },
  capoPresets: [],
  customSongs: [],
  mixer: {
    guitar: { on: true, pattern: 'strum' },
    mandolin: { on: true, pattern: 'chop' },
    fiddle: { on: false, pattern: 'drone' },
    bass: { on: true, pattern: 'root-five' },
    steel: { on: false, pattern: 'pad' },
    banjo: { on: true, pattern: 'sixteenth-run' },
  },
  widgets: {
    capo: { open: true, x: null, y: null },
    tuner: { open: true, x: null, y: null },
  },
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(EMPTY);
    const parsed = JSON.parse(raw);
    const mixer = { ...EMPTY.mixer, ...(parsed.mixer || {}) };
    if ((parsed.version || 1) < 2) {
      mixer.guitar = { on: true, pattern: 'strum' };
      mixer.bass = { on: true, pattern: 'root-five' };
      mixer.mandolin = { on: true, pattern: 'chop' };
      mixer.banjo = { on: true, pattern: 'sixteenth-run' };
      mixer.fiddle = { ...mixer.fiddle, on: false };
      mixer.steel = { ...mixer.steel, on: false };
    }
    const state = {
      ...structuredClone(EMPTY),
      ...parsed,
      version: 2,
      preferences: { ...EMPTY.preferences, ...(parsed.preferences || {}) },
      mixer,
      widgets: mergeWidgets(parsed.widgets),
      capoPresets: parsed.capoPresets || [],
      customSongs: parsed.customSongs || [],
    };
    if ((parsed.version || 1) < 2) save(state);
    return state;
  } catch {
    return structuredClone(EMPTY);
  }
}

function mergeWidgets(saved) {
  const base = structuredClone(EMPTY.widgets);
  if (!saved) return base;
  for (const id of Object.keys(base)) {
    base[id] = { ...base[id], ...(saved[id] || {}) };
  }
  return base;
}

function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
  return state;
}

export function getState() {
  return load();
}

export function patchState(partial) {
  const next = { ...load(), ...partial };
  return save(next);
}

export function patchPreferences(partial) {
  const state = load();
  state.preferences = { ...state.preferences, ...partial };
  return save(state);
}

export function patchWidget(id, partial) {
  const state = load();
  state.widgets = mergeWidgets(state.widgets);
  state.widgets[id] = { ...state.widgets[id], ...partial };
  return save(state);
}

export function patchMixer(instrumentId, partial) {
  const state = load();
  state.mixer[instrumentId] = { ...state.mixer[instrumentId], ...partial };
  return save(state);
}

export function addCapoPreset(preset) {
  const state = load();
  const item = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...preset,
  };
  state.capoPresets = [item, ...state.capoPresets].slice(0, 24);
  save(state);
  return item;
}

export function removeCapoPreset(id) {
  const state = load();
  state.capoPresets = state.capoPresets.filter((p) => p.id !== id);
  return save(state);
}

export function upsertCustomSong(song) {
  const state = load();
  const id = song.id || crypto.randomUUID();
  const next = { ...song, id, custom: true, updatedAt: new Date().toISOString() };
  const idx = state.customSongs.findIndex((s) => s.id === id);
  if (idx >= 0) state.customSongs[idx] = next;
  else state.customSongs.push(next);
  save(state);
  return next;
}

export function removeCustomSong(id) {
  const state = load();
  state.customSongs = state.customSongs.filter((s) => s.id !== id);
  return save(state);
}

export function exportData() {
  const payload = {
    ...load(),
    exportedAt: new Date().toISOString(),
    app: 'bluegrassbuddy',
  };
  return JSON.stringify(payload, null, 2);
}

export function importData(json) {
  const parsed = typeof json === 'string' ? JSON.parse(json) : json;
  if (!parsed || parsed.app !== 'bluegrassbuddy') {
    throw new Error('This file is not a BluegrassBuddy export.');
  }
  const next = {
    ...structuredClone(EMPTY),
    preferences: { ...EMPTY.preferences, ...(parsed.preferences || {}) },
    mixer: { ...EMPTY.mixer, ...(parsed.mixer || {}) },
    widgets: mergeWidgets(parsed.widgets),
    capoPresets: parsed.capoPresets || [],
    customSongs: parsed.customSongs || [],
    version: 2,
  };
  return save(next);
}

export function downloadExport() {
  const blob = new Blob([exportData()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bluegrassbuddy-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

const CLIP_DB = 'bluegrassbuddy-audio';
const CLIP_STORE = 'clips';

function openClipDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(CLIP_DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(CLIP_STORE)) {
        req.result.createObjectStore(CLIP_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function clipRequest(mode, run) {
  return openClipDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(CLIP_STORE, mode);
    const store = tx.objectStore(CLIP_STORE);
    const req = run(store);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

export function saveClip(id, record) {
  return clipRequest('readwrite', (store) => store.put(record, id));
}

export function getClip(id) {
  return clipRequest('readonly', (store) => store.get(id));
}

export function deleteClip(id) {
  return clipRequest('readwrite', (store) => store.delete(id));
}

export function listClipKeys() {
  return openClipDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(CLIP_STORE, 'readonly');
    const req = tx.objectStore(CLIP_STORE).getAllKeys();
    req.onsuccess = () => resolve(req.result.map(String));
    req.onerror = () => reject(req.error);
  }));
}

export function clearClips() {
  return clipRequest('readwrite', (store) => store.clear());
}

export function resetData() {
  const theme = load().preferences.theme;
  localStorage.removeItem(KEY);
  clearClips().catch(() => {});
  const state = load();
  if (theme === 'light' || theme === 'dark') state.preferences.theme = theme;
  return save(state);
}
