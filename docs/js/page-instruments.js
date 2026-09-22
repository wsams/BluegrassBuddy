import { initTabs } from './app.js';
import { INSTRUMENTS } from './instruments-data.js';

const shortName = {
  guitar: 'Guitar',
  bass: 'Bass',
  mandolin: 'Mandolin',
  fiddle: 'Fiddle',
  banjo: 'Banjo',
  steel: 'Steel',
};

const tabsEl = document.querySelector('#instrument-tabs');
const panelsEl = document.querySelector('#instruments');

tabsEl.innerHTML = INSTRUMENTS.map((inst) =>
  `<button type="button" role="tab" data-tab="${inst.id}">${shortName[inst.id] || inst.name}</button>`
).join('');

panelsEl.innerHTML = INSTRUMENTS.map((inst) => `
  <article class="card" role="tabpanel" data-tab-panel="${inst.id}">
    <h2>${inst.name}</h2>
    ${inst.tuning ? `<p><strong>Tuning.</strong> ${inst.tuning}</p>` : ''}
    <p>${inst.notes}</p>
    <ul class="note-list">
      ${inst.patterns.map((p) => `<li><strong>${p.name}</strong> — ${p.hint}</li>`).join('')}
    </ul>
  </article>
`).join('');

initTabs();
