import { getState, patchPreferences, downloadExport, importData, resetData, clearClips } from './storage.js';

const NAV = [
  ['index.html', 'Home'],
  ['capo.html', 'Capo'],
  ['charts.html', 'Charts'],
  ['scales.html', 'Scales'],
  ['jam.html', 'Jam'],
  ['songs.html', 'Songs'],
  ['sheet.html', 'Sheet'],
  ['instruments.html', 'Instruments'],
];

export function currentPage() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file === '' ? 'index.html' : file;
}

export function initChrome() {
  const header = document.querySelector('.site-header');
  if (header) {
    const here = currentPage();
    header.querySelectorAll('.site-nav a').forEach((a) => {
      const href = a.getAttribute('href');
      if (href === here || (here === '' && href === 'index.html')) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  toggle?.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  initTheme();

  document.querySelectorAll('[data-export]').forEach((btn) => {
    btn.addEventListener('click', () => downloadExport());
  });

  document.querySelectorAll('[data-import]').forEach((el) => {
    el.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        importData(await file.text());
        location.reload();
      } catch (err) {
        alert(err.message || 'Could not import that file.');
      }
    });
  });

  document.querySelectorAll('[data-reset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (confirm('Clear all saved presets, custom songs, guitar recordings, and mixer settings on this device?')) {
        resetData();
        clearClips().finally(() => location.reload());
      }
    });
  });
}

function paintTheme(theme) {
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
}

function initTheme() {
  const saved = getState().preferences.theme === 'light' ? 'light' : 'dark';
  paintTheme(saved);
  const buttons = [...document.querySelectorAll('[data-theme-choice]')];
  if (!buttons.length) return;
  const sync = () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', btn.dataset.themeChoice === current ? 'true' : 'false');
    });
  };
  sync();
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.themeChoice === 'light' ? 'light' : 'dark';
      patchPreferences({ theme: next });
      paintTheme(next);
      sync();
    });
  });
}

export function fillKeySelect(select, value) {
  const keys = ['G', 'A', 'Bb', 'B', 'C', 'D', 'Eb', 'E', 'F'];
  select.innerHTML = keys.map((k) => `<option value="${k}">${k}</option>`).join('');
  select.value = value || getState().preferences.songKey;
}

export function fillPositionSelect(select, value) {
  select.innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<option value="${n}">${n}${['st', 'nd', 'rd', 'th', 'th'][n - 1]} position</option>`)
    .join('');
  select.value = String(value || getState().preferences.positionId);
}

export function rememberKeyPosition(key, positionId) {
  patchPreferences({ songKey: key, positionId: Number(positionId) });
}

export function $(sel, root = document) {
  return root.querySelector(sel);
}

export function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

export function showTab(id, scope = document) {
  const tab = scope.querySelector(`[role="tab"][data-tab="${id}"]`);
  if (tab) tab.click();
}

export function initTabs(scope = document) {
  scope.querySelectorAll('[data-tabs]').forEach((set) => {
    if (set.dataset.tabsReady) return;
    const param = set.dataset.tabsParam;
    const list = set.querySelector(':scope > .tab-list');
    const panelsRoot = set.querySelector(':scope > .tab-panels');
    if (!list || !panelsRoot) return;
    const tabs = [...list.querySelectorAll(':scope > [role="tab"]')];
    const panels = [...panelsRoot.querySelectorAll(':scope > [role="tabpanel"]')];
    if (!tabs.length) return;
    set.dataset.tabsReady = '1';

    function activate(id, writeUrl) {
      tabs.forEach((tab) => {
        const on = tab.dataset.tab === id;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        tab.classList.toggle('is-active', on);
      });
      panels.forEach((panel) => {
        const on = panel.dataset.tabPanel === id;
        panel.hidden = !on;
      });
      if (param && writeUrl) {
        const url = new URL(location.href);
        if (id === tabs[0]?.dataset.tab) url.searchParams.delete(param);
        else url.searchParams.set(param, id);
        history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
      }
    }

    let initial = tabs[0]?.dataset.tab;
    if (param) {
      const fromUrl = new URLSearchParams(location.search).get(param);
      if (fromUrl && tabs.some((tab) => tab.dataset.tab === fromUrl)) initial = fromUrl;
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab.dataset.tab, true));
      tab.addEventListener('keydown', (event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
        event.preventDefault();
        const dir = event.key === 'ArrowRight' ? 1 : -1;
        const next = tabs[(index + dir + tabs.length) % tabs.length];
        next.focus();
        activate(next.dataset.tab, true);
      });
    });
    if (initial) activate(initial, false);
  });
}

function mountOptionalPhoto(src, className, parent) {
  if (!parent) return;
  const img = document.createElement('img');
  img.className = className;
  img.alt = '';
  img.decoding = 'async';
  img.addEventListener('error', () => img.remove());
  img.src = src;
  parent.prepend(img);
}

function mountOptionalPhotos() {
  mountOptionalPhoto('assets/bg/page.jpg', 'bg-photo', document.body);
  mountOptionalPhoto('assets/bg/header.jpg', 'header-photo', document.querySelector('.site-header'));
  mountOptionalPhoto('assets/bg/hero.jpg', 'hero-photo', document.querySelector('.capo-panel'));
}

function boot() {
  initChrome();
  initTabs();
  mountOptionalPhotos();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else queueMicrotask(boot);

export { NAV };
