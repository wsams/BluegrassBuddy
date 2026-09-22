import { fillKeySelect } from './app.js';
import { getState } from './storage.js';
import { bindPlayer, renderMixer } from './player-ui.js';
import { mountGuitarClips } from './guitar-clips.js';

fillKeySelect(document.querySelector('#key'), getState().preferences.songKey);
renderMixer(document.querySelector('#mixer'));
mountGuitarClips(document.querySelector('#guitar-clips'));
bindPlayer({
  songSelect: document.querySelector('#song'),
  keySelect: document.querySelector('#key'),
  tempoInput: document.querySelector('#tempo'),
  playBtn: document.querySelector('#play'),
  stopBtn: document.querySelector('#stop'),
  sheetEl: document.querySelector('#sheet'),
  nowEl: document.querySelector('#now'),
  beatEl: document.querySelector('#beat'),
});
