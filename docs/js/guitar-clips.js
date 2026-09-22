import { fillKeySelect } from './app.js';
import { chordSampleId } from './theory.js';
import { deleteClip, getClip, listClipKeys, saveClip } from './storage.js';
import { jam } from './audio.js';

const SLOTS = [
  { id: 'boom', name: 'Boom', hint: 'Bass note on 1 and 3.' },
  { id: 'chuck', name: 'Chuck', hint: 'Strum on 2 and 4.' },
];

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_MS = 8000;

function keyId(slot) {
  return `guitar-${slot}`;
}

export function mountGuitarClips(root) {
  root.innerHTML = `
    <h2>Guitar</h2>
    <p class="muted">Boom is one bass note, pitched to the chord. Each chuck file is one chord, named like G.wav, Gm.wav, or G7.wav. They stay in this browser.</p>
    <div class="clip-grid">
      ${SLOTS.map((slot) => `
        <article class="card clip-card" data-slot="${slot.id}">
          <h3>${slot.name}</h3>
          <p class="hint">${slot.hint}</p>
          <label class="field">Recorded in
            <select data-root="${slot.id}"></select>
          </label>
          <p class="hint" data-status="${slot.id}">Not added.</p>
          <div class="row-actions">
            <button class="btn btn-primary" type="button" data-record="${slot.id}">Record</button>
            <label class="btn btn-ghost">Add file
              <input data-file="${slot.id}" type="file" accept="audio/wav,audio/wave,audio/mpeg,audio/mp3,.wav,.mp3" hidden/>
            </label>
            <button class="btn btn-ghost" type="button" data-hear="${slot.id}">Hear</button>
            <button class="btn btn-danger" type="button" data-clear="${slot.id}">Clear</button>
          </div>
        </article>
      `).join('')}
      <article class="card clip-card">
        <h3>Chord chucks</h3>
        <p class="hint">One strum per chord. The file name is the chord.</p>
        <div class="row-actions">
          <label class="btn btn-ghost">Add files
            <input id="chord-files" type="file" accept="audio/wav,audio/wave,audio/mpeg,audio/mp3,.wav,.mp3" multiple hidden/>
          </label>
        </div>
        <ul class="note-list" id="chord-clip-list"></ul>
      </article>
    </div>
  `;

  const recorders = {};

  SLOTS.forEach((slot) => {
    const select = root.querySelector(`[data-root="${slot.id}"]`);
    fillKeySelect(select, 'G');
    select.addEventListener('change', () => updateRoot(slot.id, select.value));
  });

  root.querySelectorAll('[data-record]').forEach((btn) => {
    btn.addEventListener('click', () => toggleRecord(btn.dataset.record, btn));
  });
  root.querySelectorAll('[data-file]').forEach((input) => {
    input.addEventListener('change', () => takeFile(input.dataset.file, input));
  });
  root.querySelectorAll('[data-hear]').forEach((btn) => {
    btn.addEventListener('click', () => jam.previewClip(btn.dataset.hear));
  });
  root.querySelectorAll('[data-clear]').forEach((btn) => {
    btn.addEventListener('click', () => clearSlot(btn.dataset.clear));
  });

  root.querySelector('#chord-files').addEventListener('change', (event) => takeChordFiles(event.target));

  refresh();

  function status(slot, text) {
    root.querySelector(`[data-status="${slot}"]`).textContent = text;
  }

  async function refresh() {
    for (const slot of SLOTS) {
      const saved = await getClip(keyId(slot.id));
      const select = root.querySelector(`[data-root="${slot.id}"]`);
      if (!saved?.blob) {
        status(slot.id, 'Not added.');
        continue;
      }
      if (saved.root) select.value = saved.root;
      status(slot.id, saved.name || 'Added.');
    }
    const keys = (await listClipKeys()).filter((id) => id.startsWith('guitar-chord-')).sort();
    const list = root.querySelector('#chord-clip-list');
    list.innerHTML = keys.length
      ? keys.map((id) => {
        const name = id.slice('guitar-chord-'.length);
        return `<li>${name} <button type="button" class="btn btn-ghost" data-drop-chord="${id}">Clear</button></li>`;
      }).join('')
      : '<li>None yet.</li>';
    list.querySelectorAll('[data-drop-chord]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await deleteClip(btn.dataset.dropChord);
        await jam.loadGuitarClips().catch(() => {});
        refresh();
      });
    });
  }

  async function takeChordFiles(input) {
    const files = [...(input.files || [])];
    input.value = '';
    for (const file of files) {
      const stem = file.name.replace(/\.[^.]+$/, '').replace('♯', '#').replace('♭', 'b');
      const id = chordSampleId(stem);
      if (!id) continue;
      if (file.size > MAX_BYTES) continue;
      try {
        jam.ensure();
        const bytes = await file.arrayBuffer();
        await jam.ctx.decodeAudioData(bytes.slice(0));
      } catch {
        continue;
      }
      await saveClip(`guitar-chord-${id}`, { blob: file, root: id, name: file.name });
    }
    await jam.loadGuitarClips().catch(() => {});
    refresh();
  }

  async function store(slot, blob, name) {
    if (blob.size > MAX_BYTES) {
      status(slot, 'That file is too long.');
      return;
    }
    try {
      jam.ensure();
      const bytes = await blob.arrayBuffer();
      await jam.ctx.decodeAudioData(bytes.slice(0));
    } catch {
      status(slot, 'That file did not load. Use a wav or mp3.');
      return;
    }
    const rootNote = root.querySelector(`[data-root="${slot}"]`).value || 'G';
    await saveClip(keyId(slot), { blob, root: rootNote, name });
    status(slot, name);
    await jam.loadGuitarClips().catch(() => {});
  }

  async function updateRoot(slot, rootNote) {
    const saved = await getClip(keyId(slot));
    if (!saved?.blob) return;
    await saveClip(keyId(slot), { ...saved, root: rootNote });
    await jam.loadGuitarClips().catch(() => {});
  }

  async function takeFile(slot, input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    await store(slot, file, file.name);
  }

  async function clearSlot(slot) {
    if (recorders[slot]) await finishRecord(slot, false);
    await deleteClip(keyId(slot));
    status(slot, 'Not added.');
    await jam.loadGuitarClips().catch(() => {});
  }

  async function finishRecord(slot, save = true) {
    const current = recorders[slot];
    if (!current) return;
    clearTimeout(current.timer);
    current.proc.disconnect();
    current.source.disconnect();
    current.mute.disconnect();
    current.stream.getTracks().forEach((track) => track.stop());
    delete recorders[slot];
    const btn = root.querySelector(`[data-record="${slot}"]`);
    if (btn) btn.textContent = 'Record';
    const length = current.chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    if (!save || !length) {
      if (save) status(slot, 'Nothing recorded.');
      return;
    }
    const samples = new Float32Array(length);
    let offset = 0;
    current.chunks.forEach((chunk) => {
      samples.set(chunk, offset);
      offset += chunk.length;
    });
    await store(slot, encodeWav(samples, current.sampleRate), 'Recording');
  }

  async function toggleRecord(slot, btn) {
    if (recorders[slot]) {
      await finishRecord(slot);
      return;
    }
    let stream;
    try {
      jam.ensure();
      await jam.ctx.resume();
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      status(slot, 'Microphone off.');
      return;
    }
    const source = jam.ctx.createMediaStreamSource(stream);
    const proc = jam.ctx.createScriptProcessor(4096, 1, 1);
    const mute = jam.ctx.createGain();
    mute.gain.value = 0;
    const chunks = [];
    proc.onaudioprocess = (event) => {
      chunks.push(new Float32Array(event.inputBuffer.getChannelData(0)));
    };
    source.connect(proc);
    proc.connect(mute);
    mute.connect(jam.ctx.destination);
    const timer = setTimeout(() => finishRecord(slot), MAX_MS);
    recorders[slot] = { stream, source, proc, mute, chunks, timer, sampleRate: jam.ctx.sampleRate };
    btn.textContent = 'Stop';
    status(slot, 'Recording.');
  }
}

function encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const write = (offset, text) => {
    for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i));
  };
  write(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  write(8, 'WAVE');
  write(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  write(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}
