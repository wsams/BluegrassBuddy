# AGENTS.md

## What this is

BluegrassBuddy is a static HTML/CSS/JavaScript app for bluegrass guitar, hosted on GitHub Pages. No build step, no backend, no npm runtime dependencies. The reference material is guitar. Bass, mandolin, fiddle, banjo, and steel are jam parts only.

This is not a LAMP/Nginx container. Do not add PHP, Python app servers, or reverse-proxy config unless the project explicitly moves off GitHub Pages.

## Layout

The site lives in `docs/` so GitHub Pages can publish that folder and the repo root stays short. Paths below are inside `docs/`.

```
index.html, capo.html, charts.html, scales.html,
jam.html, songs.html, sheet.html, instruments.html
css/style.css
js/theory.js          keys, capo, pentatonic boxes, scale types, diatonic chords
js/chords.js          open/barre voicings, ten-dollar catalog, SVG diagrams
js/fretboard.js       SVG neck + scale strips
js/storage.js         localStorage + JSON import/export
js/audio.js           Web Audio jam engine (all six chairs)
js/jam-patterns.js    chop / roll / shuffle / swell hit maps
js/player-ui.js       mixer, lead sheet, transport
js/songs-data.js      public-domain catalog + lead-sheet parser
js/instruments-data.js
js/page-*.js          one module per page
```

Design tokens live in `docs/css/style.css` (`:root`). Keep Playfair Display + Inter, the dark palette, `.btn` / `.card` / sticky header with `backdrop-filter: blur(12px)`.

## Conventions

- Vanilla ES modules. New UI belongs in a `page-*.js` file, not a framework.
- Long pages use in-place tabs (`[data-tabs]`, `?tab=` query params via `initTabs` / `showTab` in `docs/js/app.js`). Nested tabs are fine. Do not add hash-anchor section nav that scrolls the page.
- Music math belongs in `docs/js/theory.js` with tests in `docs/js/theory.test.js`.
- Capo position 1 = open Em pentatonic / G major. Do not “fix” C major + 1st box to capo 3; that is the 5th (A-form) box.
- Persist user data only through `docs/js/storage.js`. Guitar boom/chuck recordings and wav/mp3 files live in IndexedDB (`saveClip` / `getClip`), not in the JSON export. Theme is `preferences.theme` (`dark` or `light`). `docs/js/theme-boot.js` reads that key before paint so the page does not flash.
- Built-in songs must be public domain. Custom songs are local-only.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) so semantic-release can version from `main`. `feat:` and `fix:` cut a release. Pages publishes `docs/` only after tests pass. Renovate config is `.github/renovate.json`.
- Copy is short and plain. No slogans, and no unfinished-work notes in the UI. Do not add technique pages for instruments other than guitar unless someone asks.

Optional photographs, shown only when the file is present (`docs/js/app.js` drops the image if it 404s):

- `docs/assets/bg/page.jpg` — full-page wash behind every screen
- `docs/assets/bg/header.jpg` — strip behind the sticky header
- `docs/assets/bg/hero.jpg` — inside the capo panel on `capo.html`

The capo calculator is a panel on the capo page, above the neck. The tuner is a tab on that page (`capo.html?tab=tuner`). Do not put the calculator back on the home page.

A grain tile at `docs/assets/bg/grain.svg` is always on. Keep a dark scrim so type stays readable.

## Checks

```bash
npm test
npm start
```

After UI changes, click through Capo, Charts (nested chord / chromatic / capo tabs), Scales, Jam (Play + mute instruments + switch patterns live), Songs (save custom + export), Instruments (one tab per chair), and Sheet. Deep links use query params (`charts.html?tab=chromatics`, `instruments.html?tab=fiddle`), not hashes.
