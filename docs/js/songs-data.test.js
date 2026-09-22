import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseChord } from './theory.js';
import { BUILTIN_SONGS, parseLeadSheet, songToLeadSheet, isChordToken, toAppKey, lyricColumns, songIndexLetter } from './songs-data.js';

describe('built-in songs', () => {
  it('has a large public-domain book with unique ids', () => {
    assert.ok(BUILTIN_SONGS.length >= 60);
    const ids = BUILTIN_SONGS.map((song) => song.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('gives every bar a real chord', () => {
    for (const song of BUILTIN_SONGS) {
      assert.ok(song.title && song.key && song.sections.length, song.id);
      for (const section of song.sections) {
        assert.ok(section.bars.length, `${song.id} ${section.name}`);
        for (const bar of section.bars) {
          assert.ok(bar.chords.length >= 1 && bar.chords.length <= 2, `${song.id} ${bar.chords}`);
          for (const chord of bar.chords) {
            assert.ok(parseChord(chord).root, `${song.id} ${chord}`);
          }
        }
      }
    }
  });
});

describe('parseLeadSheet', () => {
  it('reads the pipe chart the editor writes', () => {
    const song = parseLeadSheet(`{title: My Tune}
{key: G}
{tempo: 110}
{time: 4/4}

{start_of_verse}
| [G] First phrase | [G] second phrase | [C] third | [G] fourth |
| [G] fifth | [G] sixth | [D7] seventh | [G] eighth |
{end_of_verse}`);
    assert.equal(song.title, 'My Tune');
    assert.equal(song.key, 'G');
    assert.equal(song.tempo, 110);
    assert.equal(song.sections[0].name, 'Verse');
    assert.equal(song.sections[0].bars.length, 8);
    assert.deepEqual(song.sections[0].bars[2], { chords: ['C'], lyric: 'third', lineStart: false });
    assert.equal(song.sections[0].bars[0].lineStart, true);
    assert.equal(song.sections[0].bars[4].lineStart, true);
  });

  it('reads ChordPro brackets, short section markers, and a repeated chorus', () => {
    const song = parseLeadSheet(`{t: Shady Grove}
{key: Am}
{time: 4/4}
{artist: Traditional}

{sov}
[Am]Shady Grove, [Am]my little love
[Am]Shady Grove I [G]say
{eov}

{soc}
[Am]Bound for [Am]Shady Grove
{eoc}

{chorus}`);
    assert.equal(song.title, 'Shady Grove');
    assert.equal(song.key, 'A');
    assert.equal(song.source, 'Traditional');
    assert.equal(song.sections[0].bars.length, 4);
    assert.deepEqual(song.sections[0].bars[3], { chords: ['G'], lyric: 'say', lineStart: false });
    assert.equal(song.sections[1].name, 'Chorus');
    assert.equal(song.sections.length, 3);
    assert.equal(song.sections[2].name, 'Chorus');
    assert.deepEqual(song.sections[2].bars, song.sections[1].bars);
  });

  it('keeps each ChordPro chord on the words that follow it', () => {
    const song = parseLeadSheet('[G][D7] in the sky');
    assert.deepEqual(song.sections[0].bars, [
      { chords: ['G'], lyric: '', lineStart: true },
      { chords: ['D7'], lyric: 'in the sky', lineStart: false },
    ]);
  });

  it('reads a chords-over-words verse line', () => {
    const song = parseLeadSheet(`[Verse 1]
     Dm        F                     Dm
Went out last night to take a look around`);
    assert.equal(song.sections[0].name, 'Verse 1');
    assert.deepEqual(song.sections[0].bars.map((bar) => [bar.chords[0], bar.lyric]), [
      ['Dm', 'out last n'],
      ['F', 'ight to take a look ar'],
      ['Dm', 'ound'],
    ]);
  });

  it('reads chords on the line above the words', () => {
    const song = parseLeadSheet('G              C\nWill the       circle\n');
    assert.equal(song.sections[0].bars.length, 2);
    assert.equal(song.sections[0].bars[0].chords[0], 'G');
    assert.equal(song.sections[0].bars[0].lyric, 'Will the');
    assert.equal(song.sections[0].bars[1].chords[0], 'C');
    assert.equal(song.sections[0].bars[1].lyric, 'circle');
  });

  it('reads plain chord names inside bars', () => {
    const song = parseLeadSheet('| G | C home | G D7 sky |');
    assert.deepEqual(song.sections[0].bars.map((bar) => bar.chords), [['G'], ['C'], ['G'], ['D7']]);
    assert.equal(song.sections[0].bars[1].lyric, 'home');
    assert.equal(song.sections[0].bars[3].lyric, 'sky');
  });

  it('sets a waltz feel from 3/4 and skips tab', () => {
    const song = parseLeadSheet('{time: 3/4}\n{sot}\ne|--0--|\n{eot}\n[G]Amazing grace');
    assert.equal(song.time, '3/4');
    assert.equal(song.feel, 'waltz');
    assert.equal(song.sections.length, 1);
    assert.equal(song.sections[0].bars[0].lyric, 'Amazing grace');
  });

  it('round-trips a built-in song through the editor format', () => {
    const original = BUILTIN_SONGS.find((song) => song.id === 'amazing-grace');
    const again = parseLeadSheet(songToLeadSheet(original));
    assert.equal(again.title, original.title);
    assert.equal(again.key, original.key);
    assert.equal(again.tempo, original.tempo);
    assert.equal(again.time, original.time);
    assert.equal(again.feel, original.feel);
    const body = (item) => item.sections.map((section) => ({
      name: section.name,
      bars: section.bars.map((bar) => ({
        chords: bar.chords,
        lyric: bar.lyric || '',
        lineStart: Boolean(bar.lineStart),
        pickup: bar.pickup || '',
      })),
    }));
    assert.deepEqual(body(again), body(original));
  });
});

describe('Little Sadie', () => {
  it('is the full ballad, with the chord on the word it covers', () => {
    const song = BUILTIN_SONGS.find((item) => item.id === 'little-sadie');
    const words = song.sections.flatMap((section) => section.bars.map((bar) => bar.lyric)).join(' ');
    assert.match(words, /take a look around/);
    assert.match(words, /Jericho/);
    assert.match(words, /county jail/);
    assert.match(words, /forty-one years/i);
    const first = song.sections[0].bars.slice(0, 3);
    assert.deepEqual(first.map((bar) => [bar.chords[0], bar.lyric]), [
      ['Dm', 'Went out last night'],
      ['F', 'to take a look'],
      ['Dm', 'around'],
    ]);
  });
});

describe('songIndexLetter', () => {
  it('files a leading "The" under the next word', () => {
    assert.equal(songIndexLetter('The Wabash Cannonball'), 'W');
    assert.equal(songIndexLetter('The House of the Rising Sun'), 'H');
    assert.equal(songIndexLetter('Amazing Grace'), 'A');
    assert.equal(songIndexLetter('Oh! Susanna'), 'O');
  });
});

describe('lyricColumns', () => {
  it('sets one chord on the words that follow it', () => {
    assert.deepEqual(lyricColumns(['G'], 'Will the circle'), [
      { chord: 'G', lyric: 'Will the circle' },
    ]);
  });

  it('splits a bar so the second chord sits on the later words', () => {
    assert.deepEqual(lyricColumns(['E', 'A'], 'to see my girl'), [
      { chord: 'E', lyric: 'to see' },
      { chord: 'A', lyric: 'my girl' },
    ]);
  });
});

describe('chord tokens', () => {
  it('accepts the symbols a chart actually uses', () => {
    for (const symbol of ['G', 'D7', 'F#m', 'Bb', 'Am7', 'Gsus4', 'Cadd9', 'D/F#', 'A7sus4', 'N.C.']) {
      assert.equal(isChordToken(symbol), true, symbol);
    }
    assert.equal(isChordToken('Amazing'), false);
    assert.equal(toAppKey('A minor'), 'A');
    assert.equal(toAppKey('A#'), 'Bb');
  });
});
