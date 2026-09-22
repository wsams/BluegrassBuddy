import { fillKeySelect } from './app.js';
import { getState } from './storage.js';
import { bindPlayer } from './player-ui.js';

fillKeySelect(document.querySelector('#key'), getState().preferences.songKey);
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
