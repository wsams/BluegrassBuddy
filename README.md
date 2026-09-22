# BluegrassBuddy

No install. Use it in the browser, including on a phone.

**[Open BluegrassBuddy](https://atom.github.io/bluegrassbuddy/)**

Capo, charts, scales, and a jam for bluegrass players. Guitar is the reference instrument. Bass, mandolin, fiddle, banjo, and steel play along in the mixer. The app is meant to be used as it is. Recommendations are welcome — open an [issue](https://github.com/atom/bluegrassbuddy/issues) if a chart, a capo spot, or a jam part should work differently. If there is interest in a larger site, with accounts and songs kept on a server, that can come later.

## Saved in your browser only

Custom songs, capo setups, mixer settings, and notes stay in the browser you are using. Nothing is stored on a server. They do not follow you to another phone or browser, and clearing site data deletes them. On the site, open Home → Your data and export a JSON file when you want a copy. Guitar recordings stay in the browser as well, and that export does not include them.

## What is on the site

| Page | What it does |
| --- | --- |
| Home | The tools, and import/export |
| Capo | Capo and fretboard |
| Charts | Chords, ten-dollar grips, chromatics, scale tables, capo charts |
| Scales | Pentatonic, major, Mixolydian, and blues on the neck |
| Jam | Mixer and lead sheet |
| Songs | Traditional charts and your own |
| Sheet | Lead sheet |
| Instruments | Tuning and jam pattern for each chair |

Long pages switch sections with tabs. A shared view uses `?tab=`, for example `charts.html?tab=ten-dollar` or `instruments.html?tab=banjo`.

## Capo math

Position **1** is the open Em pentatonic box (G major pentatonic). Capo fret = `(songKey − homeKey of that box) mod 12`.

Examples:

- Song in **A**, 1st box at the open position → **capo 2** (G shapes sounding in A)
- Song in **C**, 1st box at the open position → **capo 5** (capo 3 is the A-form / 5th box)
- Song in **A**, 5th box at the open position → **open** (that box’s home key is already A)

## Working on the code

The site files are in `docs/`. GitHub Actions publishes that folder to Pages. To look at it locally:

```bash
npm start
```

Open http://localhost:18421

```bash
npm test
```

Push to `main` with Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`). `feat:` and `fix:` are what cut a release.

After the repo is on GitHub:

1. The Pages workflow turns on GitHub Pages for the repo and publishes `docs/` after the tests pass. If that step still reports that Pages was not found, set Settings → Pages → Source to **GitHub Actions** and run the workflow again.
2. Add a repository secret named `RENOVATE_TOKEN` (a personal access token or the Renovate GitHub App) so its pull requests can run the tests. Settings → General → Allow auto-merge.
3. semantic-release uses the built-in `GITHUB_TOKEN` and writes `CHANGELOG.md` back to `main`.

## License

MIT. Built-in lyrics are traditional / public domain. Do not paste copyrighted charts into the shared catalog.
