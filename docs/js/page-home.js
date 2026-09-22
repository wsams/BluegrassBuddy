import { INSTRUMENTS } from './instruments-data.js';

document.querySelector('#band-cards').innerHTML = INSTRUMENTS.map((inst) => `
  <a class="card hoverable" href="instruments.html?tab=${inst.id}">
    <h3>${inst.name}</h3>
    <p>${inst.role}</p>
  </a>
`).join('');
