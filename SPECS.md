# BluegrassBuddy spec

A static browser app for bluegrass guitar. Guitar is the reference instrument. Bass, mandolin, fiddle, banjo, and steel exist only as jam parts. There is no account, no server, and no build step.

This file is the product spec. `AGENTS.md` is how to work in the repo. `README.md` is what a player reads.

## Stack

- Plain HTML, one CSS file, vanilla ES modules. No framework, no bundler, no npm packages at runtime.
- Host the site from `docs/` on GitHub Pages. Paths inside pages are relative. Include `docs/.nojekyll`.
- Local preview: `python3 -m http.server 18421 --directory docs` (`npm start`).
- Tests: `node --test` on `docs/js/theory.test.js`, `chords.test.js`, `jam-patterns.test.js`, and `songs-data.test.js` (`npm test`).
- License MIT. Built-in lyrics are traditional or public domain. Custom songs never leave the browser.

## Look

Playfair Display for headings, Inter for body, from Google Fonts. Tokens live in `docs/css/style.css` on `:root`. Dark is the default. Light is `html[data-theme="light"]`.

Dark tokens: background `#0d0f14`, card `#161920`, panel `#1d2030`, border `#2a2d3e`, accent `#7c6af7`, teal `#50e3c2`, amber `#f7a234`, text `#e8eaf0`, muted `#7a7f9a`, danger `#f25c6e`, success `#50e3a4`. Radius 12px, small radius 6px. Header height 64px.

Light tokens: background `#f6f1e8`, card `#fffdf8`, panel `#efe8dc`, text `#1c1916`.

Shared pieces: `.btn` (primary, ghost, danger), `.card` (hover lifts), `.panel`, `.hint` / `.muted`, a sticky header with `backdrop-filter: blur(12px)`. Copy is short and plain. No slogans, and no unfinished-work notes in the UI.

A grain tile at `docs/assets/bg/grain.svg` is always on, with a dark scrim so type stays readable. These photos are optional and are removed if they 404:

- `docs/assets/bg/page.jpg` — wash behind every page
- `docs/assets/bg/header.jpg` — strip behind the header
- `docs/assets/bg/hero.jpg` — inside the capo panel on the capo page

## Chrome

Every page shares the header: a treble-clef mark, the wordmark BluegrassBuddy, a Light | Dark toggle, a menu button, and links to Home, Capo, Charts, Scales, Jam, Songs, Sheet, Instruments. The current page is `aria-current="page"`. The menu button opens the nav on a narrow screen. The footer shows the current year.

`docs/js/theme-boot.js` is a classic script in `<head>`. It reads `localStorage` key `bluegrassbuddy.v1` and sets `data-theme` before paint, so the page does not flash. The toggle writes `preferences.theme` as `dark` or `light`.

Long pages use in-place tabs: `[data-tabs]`, a tab list, and panels. The outer tab set uses `data-tabs-param="tab"` and stores the choice in `?tab=`. The first tab omits the query param. Nested tab sets do not write the URL. Deep links are query params (`charts.html?tab=chromatics`, `instruments.html?tab=fiddle`, `capo.html?tab=tuner`), never hash anchors that scroll the page.

The key menu everywhere is major only: G, A, Bb, B, C, D, Eb, E, F. The last chosen key and pentatonic position are remembered.

## Saved data

All user data goes through `docs/js/storage.js`. Nothing else writes `localStorage`.

Key `bluegrassbuddy.v1`, version 2:

- `preferences`: `songKey` (default G), `positionId` (default 1), `instrument` (default guitar), `lastSongId` (default `circle-be-unbroken`), `theme` (default dark)
- `capoPresets`: up to 24, newest first, each with `id` and `createdAt`
- `customSongs`: local charts only
- `mixer`: see Jam
- `widgets`: leftover open/position flags for capo and tuner; the UI does not use floating docks

A stored document with `version` less than 2 is migrated once to the mixer defaults below.

JSON export includes songs, presets, mixer, widgets, and preferences, plus `app: "bluegrassbuddy"` and `exportedAt`. Import rejects a file whose `app` is not `bluegrassbuddy`. Reset clears that JSON and the audio database.

Guitar boom/chuck recordings and wav/mp3 files live in IndexedDB database `bluegrassbuddy-audio`, store `clips`. They are not in the JSON export. A clip is at most 8 MB and 8 seconds. Boom is one bass note, stored as `guitar-boom`, and pitched to the chord. Chuck files are one chord each, named like `G`, `Gm`, or `G7` (`guitar-chuck` plus the chord sample id).

## Music rules

Spelling uses sharps for C# F# and flats for Eb Ab Bb. Enharmonics fold to that spelling (`Db` → `C#`, `A#` → `Bb`). Flats are preferred when spelling a scale whose tonic is F, Bb, Eb, Ab, Db, or Gb.

### Capo and the five boxes

Position 1 is the open Em pentatonic box, which is G major pentatonic. Capo fret = `(songKey − homeMajor of that box) mod 12`. Fret 0 is open, labeled “Open (no capo)”.

| Position | Form | Home major | Home minor | Frets above box 1 on a G neck |
| --- | --- | --- | --- | --- |
| 1st | G-form / open Em | G | E | 0 |
| 2nd | E-form | E | C# | 3 |
| 3rd | D-form | D | B | 5 |
| 4th | C-form | C | A | 7 |
| 5th | A-form | A | F# | 10 |

Do not treat capo 3 in C as the 1st box. These are the checks:

- G, 1st box → capo 0
- A, 1st box → capo 2
- C, 1st box → capo 5
- C, 4th box → capo 0
- C, 5th box → capo 3
- A, 5th box → capo 0

`soundingKey(position, capoFret)` is the major key you get by playing that box at the nut and then adding the capo. Box fret on an open neck is `(box1 fret for the key + that box’s offset) mod 12`.

### Scales

The key select is a major key. Some scales are then spelled from the relative minor (down a minor third):

- Major pentatonic: 1 2 3 5 6, from the major key
- Minor pentatonic: 1 b3 4 5 b7, from the relative minor. Same pitches as the major pentatonic. Open Em box in G.
- Major: 1 2 3 4 5 6 7
- Mixolydian: major with b7
- Natural minor: from the relative minor
- Blues: minor pentatonic plus b5, from the relative minor
- Chromatic: all twelve, from the major key

Guitar tuning, low to high, pitch classes: E A D G B E (`4, 9, 2, 7, 11, 4`).

### Chords

`parseChord` reads a root, a quality, and an optional bass note. Qualities include major, minor, m7, maj7, 6, 6/9, add9, dim, dim7, aug, 7, 9, 13, 7#9, sus2, sus4. `%`, `/`, and `-` are empty chords.

Diatonic row for a major key: I, ii, iii, IV, V, V7, vi, bVII. Jam chords are I, IV, V, V7, vi, bVII.

Cowboy grips, as open or first-position shapes, then transposed: G, G7, C, C7, D, D7, A, A7, E, E7, Em, Am, Dm, F, B7. A chord with no cowboy shape uses an E-shape barre (minor and seventh included).

The ten-dollar set is those colors, learned in G and transposed: I6, Imaj7, Iadd9, I9, IV6, IVmaj7, IVadd9, V9, V13, V7#9, vi7, ii7, V/V, vii°7, I+. In G that is G6, Gmaj7, Gadd9, G9, C6, Cmaj7, Cadd9, D9, D13, D7#9, Em7, Am7, A7, F#dim7, Gaug.

Diagrams are SVG. Played frets, open strings, muted strings, and a fret number when the shape is up the neck. Clicking a chord card plays it: a saved chuck sample for that chord if one exists, otherwise a strum of the diagram frets, otherwise a short synthesized chuck.

Chromatic tools: a chord one semitone under the target (the slide-from-behind grip), and a four-fret walk into a root on a chosen open string.

### Fretboard drawing

Two SVGs. The neck marks scale tones and, for pentatonic boxes, the box fingering. The dreadnought shows nut through fret 14. A capo sits on the fret wire. Notes between the nut and the capo are dimmed. Give the SVG a width and height, and in CSS use `width: auto; max-width: 100%`.

## Pages

### Home (`index.html`)

Tabs: Tools, The band, Your data.

Tools is a grid of cards: Capo, Charts, Scales, Jam, Lead sheet, Songs. The band lists the six chairs and their jobs. Your data explains that everything stays in this browser, and offers Export JSON, Import JSON, and Reset local data.

### Capo (`capo.html`)

The calculator is a panel above the neck. It is not on the home page. Pick a song key and a box. Show the capo fret, the cowboy shapes that box uses, the sounding major and relative minor, and both pentatonic spellings. The dreadnought and the neck follow that capo.

Tabs: Necks, Tuner (`?tab=tuner`), Saved setups. Saving a setup stores key, position, and capo fret. The list can delete one.

### Tuner

Standard guitar: E2 82.41, A2 110, D3 146.83, G3 196, B3 246.94, E4 329.63. Each string plays a reference tone. Strings below 165 Hz (low E, A, D) also play an octave up so the pitch is easier to hear. The mic reports the nearest note and cents sharp or flat. Leaving the tuner tab stops the microphone.

### Charts (`charts.html`)

Outer tabs: Chords, Ten-dollar, Chromatics, Scales, Capo. The key select retunes every tab.

Chords, nested: This key (diatonic cards), All keys (a table), Cowboy library.

Ten-dollar: the fifteen color chords for the selected key, each with a diagram and a one-line reason.

Chromatics, nested: Ideas, Half-step slide, Walk, Neck.

Scales: the scale types as note rows for the selected key.

Capo, nested: By song key, By capo fret, G shapes. By song key is the bluegrass keys G A Bb B C D E F against all five boxes. By capo fret is frets 0–11 and the sounding key of each box.

### Scales (`scales.html`)

Tabs: Neck, Boxes. Pick key and scale type. The neck highlights the scale. Boxes shows the five pentatonic positions for that key, whether or not the selected scale is pentatonic. Minor-family scales are rooted on the relative minor.

### Jam (`jam.html`)

Pick a song, a key (transpose), and a tempo. Transport is Play and Stop. Tabs: The band, Lead sheet.

The mixer has one row per chair: on/off, and a pattern menu. Changes apply while the jam is playing. Defaults:

| Chair | On | Pattern |
| --- | --- | --- |
| Guitar | yes | Strum |
| Bass | yes | Root–five |
| Mandolin | yes | Chop |
| Banjo | yes | 16th run |
| Fiddle | no | Drone |
| Steel | no | Pad |

The lead sheet highlights the current bar. Chords sit above the words they cover.

### Sheet (`sheet.html`)

The same lead sheet as the jam, for the last chosen song, with the key transpose. No requirement to duplicate the mixer here.

### Songs (`songs.html`)

Tabs: Library, Write a chart.

The library is not one long dump. An A–Z switcher plus All. A title is filed under the first letter after a leading The, A, or An (`The Wabash Cannonball` → W, `House of the Rising Sun` → H). Letters with no songs are disabled. If the saved letter is empty, fall back to the first letter that has songs. Search looks through the whole book and clears the active letter. Choosing a letter clears the search. The count reads “N songs”, or “1 song matches this search” / “N songs match this search”.

Write a chart: title, source, key, time, tempo, feel, and a lead-sheet textarea. Load a file (`.cho`, `.chopro`, `.pro`, `.crd`, `.chordpro`, `.txt`, `.onsong`) into that form. Save stores a custom song. Custom songs sort ahead of built-ins. Delete removes only a custom song.

### Instruments (`instruments.html`)

One tab per chair, deep-linked with `?tab=`. Show tuning, role, and the jam patterns for that chair. Guitar is the only chair with charts and a capo. Do not add technique lessons for the other instruments. Guitar is also where boom/chuck recordings are added.

| Chair | Tuning | Patterns |
| --- | --- | --- |
| Guitar | E2 A2 D3 G3 B3 E4 | Strum; boom-chuck; boom-boom-chuck; waltz |
| Bass | E1 A1 D2 G2 | Root–five; two-beat; walk |
| Mandolin | G3 D4 A4 E5 | Chop; tremolo; double chop |
| Fiddle | G3 D4 A4 E5 | Drone; shuffle; chop |
| Banjo | gDGBD | 16th run; forward roll; backward roll; alternating thumb |
| Steel | none shown | Swell; thirds; answer |

### Not found (`404.html`)

A short missing-page message and a link home.

## Lead sheets

Three input forms, all parsed by `parseLeadSheet`:

- ChordPro: `{title: ...}`, `{key: Dm}`, `{time: 4/4}`, `{tempo: 104}`, `{feel: boom-chuck}`, `{artist: ...}`, and `[G]words`
- Chords on the line above the words, columns aligned
- Pipe bars: `| [G] words | [C] words |`

Section markers: `{start_of_verse: Verse 1}` and `{end_of_section}`, short `{sov}` `{soc}` `{sob}`, `## Verse`, or a line that is only `[Verse 1]` / `[Chorus]`. `{chorus}` copies the previous section named Chorus, including line breaks and pickup words. `{start_of_tab}` … `{end_of_tab}` is skipped.

Each ChordPro chord owns the words that follow it, up to the next chord. Words before the first chord on a line are a pickup: they render in a column with a blank chord and stay in the same bar. A line break in the chart is a line break on the sheet (`lineStart`). Do not park every chord at the start of the line, and do not split a word in half so a chord lands in the middle of it (`a[G]way` is wrong; `[G]away` is right).

`{key: Dm}` becomes key D in the app, because the key menu is major. The chord symbols stay Dm. Time `3/4` sets feel `waltz` unless `{feel:}` is set.

Round-trip back to ChordPro: one line per `lineStart` group, `{start_of_section}` / `{end_of_section}`, pickup text before the first bracket.

The sheet renderer draws a row of columns, chord above lyric. The active bar uses the highlight color and an inset accent. Playback gives each bar the same amount of time. If a bar has two chords, the second chord starts at the halfway point. That is coarser than sung rhythm. The engine does not try to fit the lyric meter.

A song object:

```
{
  id, title, source, key, time, tempo, feel, tags, custom,
  sections: [{ name, bars: [{ chords: ['G'], lyric, lineStart, pickup? }] }]
}
```

`feel` is `boom-chuck` or `waltz`. Built-ins have `custom: false`.

## Jam engine

Web Audio, one shared engine. Steps are 16th notes. Schedule a short lookahead ahead of time. Tempo defaults from the song, otherwise 110. Beats per bar come from the time signature (3 for a waltz). Muted chairs are silent. Pattern changes take effect on the next hit.

Rhythm, in 16th-note steps, 4/4 unless noted:

- Guitar strum: a stroke on every beat. Boom-chuck: bass on 1 and 3, strum on 2 and 4. Boom-boom-chuck: two bass notes then a strum. Waltz, or any song in 3: bass and two strums.
- Bass root–five: root on beat 1, fifth on beat 3. Two-beat: roots on 1 and 3. Walk: root, 3rd, 5th, then a chromatic approach into the next root.
- Mandolin chop: 16ths 4 and 12 (beats 2 and 4). Double chop: those beats plus the next 16th. Tremolo: every step. In 3/4, chops fall on steps 4 and 8.
- Banjo 16th run: a string on every 16th. Forward, backward, and alternating-thumb rolls: an eighth-note pattern (hits on even steps only).
- Fiddle drone: root and fifth. Shuffle: long bow on the beat, short bow on the last 16th of the beat. Chop: same backbeat as the mandolin.
- Steel swell: root and third when the chord changes. Thirds: sliding thirds. Answer: a short fill on beat 3 (step 8).

If a boom or chuck recording exists, the guitar uses it. Otherwise the guitar is synthesized. Other chairs are synthesized. Low guitar and bass notes stay in a low octave. A fifth above the root stays up; a flat seventh folds down rather than jumping up a seventh.

## Song book

Eighty built-in charts. Lyric songs are the whole song: several verses, or verse and chorus, with chords on the words. A one-verse scrap is not good enough. Instrumental tunes are chord charts with a full A and B. Do not invent lyrics for them.

Minor and modal songs keep their chord symbols and are filed under the major key of the root (`Am` songs use key A).

Public-domain rule used here: a published work from 1930 or earlier. That includes Sitting on Top of the World (1930). Leave out later copyrighted bluegrass songs such as I’ll Fly Away, Rocky Top, Blue Moon of Kentucky, Rank Stranger, and Monroe or Stanley originals. Roll in My Sweet Baby’s Arms stays, as a traditional song.

Little Sadie is the shape of a lyric chart. Seven verses, key stored as D, chords Dm. Verse 1:

```
[Dm]Went out last night [F]to take a look [Dm]around
[C]Met little Sadie and I blowed her [Am]down
[C]Went back home, and [C]I got into bed
[A7]Forty-four smokeless under my [Dm]head
```

Later verses include Jericho, the county jail, and forty-one years.

Gospel: Will the Circle Be Unbroken (the 1907 text, not the one-verse Carter paraphrase), Amazing Grace, Angel Band, Swing Low Sweet Chariot, Wayfaring Stranger, The Unclouded Day, Leaning on the Everlasting Arms, In the Sweet By and By, Shall We Gather at the River, What a Friend We Have in Jesus, Farther Along, Life’s Railway to Heaven, Precious Memories, Softly and Tenderly, When the Roll Is Called Up Yonder, Keep on the Sunny Side.

Ballads: Little Sadie, Bury Me Beneath the Willow, The Wabash Cannonball, Wildwood Flower, Man of Constant Sorrow, Little Maggie, Banks of the Ohio, Pretty Polly, In the Pines, John Henry, Nine Pound Hammer, Long Journey Home, East Virginia, Handsome Molly.

More: New River Train, Worried Man Blues, Don’t Let Your Deal Go Down, Salty Dog Blues, Pig in a Pen, Roll in My Sweet Baby’s Arms, Omie Wise, Down in the Willow Garden, Jesse James, John Hardy, Frankie and Johnny, Wreck of the Old 97, The House of the Rising Sun, The Cuckoo, Cluck Old Hen, White House Blues, Molly and Tenbrooks, Sitting on Top of the World, Columbus Stockade Blues, Hand Me Down My Walking Cane, Little Birdie, Shady Grove.

Songs: Cripple Creek, Old Joe Clark, Cumberland Gap, Boil Them Cabbage Down, Cotton-Eyed Joe, Buffalo Gals, Oh! Susanna, She’ll Be Coming Round the Mountain, Red River Valley, Home on the Range, Old Dan Tucker, Oh Dem Golden Slippers, Darling Nelly Gray, Turkey in the Straw.

Tunes, chords only: Soldier’s Joy, Angeline the Baker, Arkansas Traveler, Liberty, Over the Waterfall, Fisher’s Hornpipe, St. Anne’s Reel, Sally Goodin, Red Haired Boy, June Apple, Blackberry Blossom, Bill Cheatham, Devil’s Dream, Reuben’s Train.

Ids are stable kebab-case strings (`circle-be-unbroken`, `little-sadie`, `old-97`). Keep them if a player’s saved `lastSongId` should still open the same song.

## What this app does not do

No accounts, no cloud save, no upload of songs to a server. No staff notation and no tablature editor. No technique pages for bass, mandolin, fiddle, banjo, or steel. No hash-anchor section navigation. The capo calculator does not live on the home page. The tuner is not inside the capo calculator panel.
