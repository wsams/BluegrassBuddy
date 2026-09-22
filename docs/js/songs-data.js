/**
 * Public-domain catalog plus the lead-sheet parser.
 * Built-in songs live in songs-catalog.js.
 *
 * A chart can be:
 * - ChordPro (.cho, .chopro, .pro): {title: ...} and [G]words
 * - Chords on one line, words on the next
 * - Bars between pipes: | [G] words | [C] words |
 */
import { normalizeNote } from './theory.js';
import { SONG_CHARTS } from './songs-catalog.js';

const CHORD_TOKEN = /^(?:N\.?C\.?|[A-G](?:#|b)?(?:maj7|maj9|maj|min|dim7|dim|aug|add9|add|sus2|sus4|sus|m)?\d{0,2}(?:sus2|sus4)?(?:\/[A-G](?:#|b)?)?)$/;

const SECTION_COMMENT = /^(verse|chorus|bridge|intro|outro|tag|break|instrumental|a|b)(?:\s+\d+)?$/i;

export function isChordToken(symbol) {
  return CHORD_TOKEN.test(String(symbol).trim());
}

export function toAppKey(value) {
  const cleaned = String(value ?? '').trim().replace(/\s*(minor|major|min|maj)$/i, '');
  return normalizeNote(cleaned) || 'G';
}

/** Index letter for the song library. A leading "The", "A", or "An" is skipped. */
export function songIndexLetter(title) {
  const name = String(title ?? '').replace(/^(the|a|an)\s+/i, '').trim();
  const ch = name.charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : '#';
}

/** Chord symbol above the words it covers. Two chords in one bar split the words. */
export function lyricColumns(chords, lyric) {
  const list = chords?.length ? chords : ['G'];
  const words = String(lyric ?? '').trim().split(/\s+/).filter(Boolean);
  if (list.length === 1) return [{ chord: list[0], lyric: words.join(' ') }];
  if (!words.length) return list.map((chord) => ({ chord, lyric: '' }));
  if (words.length < list.length) {
    return list.map((chord, i) => ({ chord, lyric: words[i] || '' }));
  }
  const size = Math.ceil(words.length / list.length);
  return list.map((chord, i) => ({
    chord,
    lyric: words.slice(i * size, (i + 1) * size).join(' '),
  }));
}

export function flattenSong(song) {
  const bars = [];
  for (const section of song.sections) {
    section.bars.forEach((bar, i) => {
      bars.push({
        ...bar,
        section: section.name,
        sectionIndex: i,
        index: bars.length,
      });
    });
  }
  return bars;
}

function titleCase(value) {
  return String(value)
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function sectionName(token, label) {
  if (label?.trim()) return label.trim();
  const short = { sov: 'Verse', soc: 'Chorus', sob: 'Bridge' };
  if (short[token.toLowerCase()]) return short[token.toLowerCase()];
  return titleCase(token.replace(/^start_of_/i, ''));
}

function withLine(bars) {
  return bars.map((bar, i) => ({ ...bar, lineStart: i === 0 }));
}

function barsFromBrackets(line) {
  const re = /\[([^\]]+)\]/g;
  const parts = [];
  let match;
  while ((match = re.exec(line))) {
    const token = match[1].trim();
    if (!isChordToken(token)) continue;
    parts.push({ chord: token, index: match.index, end: re.lastIndex });
  }
  return parts.map((part, i) => {
    const textEnd = i + 1 < parts.length ? parts[i + 1].index : line.length;
    const lyric = line.slice(part.end, textEnd).replace(/\[[^\]]+\]/g, '').trim();
    const bar = { chords: [part.chord], lyric };
    if (i === 0 && part.index > 0) {
      const pickup = line.slice(0, part.index).trim();
      if (pickup) bar.pickup = pickup;
    }
    return bar;
  });
}

function barFromCell(cell) {
  if (/\[[^\]]+\]/.test(cell)) return barsFromBrackets(cell);
  const tokens = cell.split(/\s+/).filter(Boolean);
  const chords = [];
  const words = [];
  for (const token of tokens) {
    if (!words.length && isChordToken(token)) chords.push(token);
    else words.push(token);
  }
  if (!chords.length) return [{ chords: ['G'], lyric: cell.trim() }];
  const lyric = words.join(' ');
  return chords.map((chord, i) => ({
    chords: [chord],
    lyric: i === chords.length - 1 ? lyric : '',
  }));
}

function chordSpans(line) {
  const spans = [];
  const re = /\S+/g;
  let match;
  while ((match = re.exec(line))) {
    if (isChordToken(match[0])) spans.push({ chord: match[0], index: match.index });
  }
  return spans;
}

function isChordLine(line) {
  const tokens = line.trim().split(/\s+/).filter(Boolean);
  return tokens.length > 0 && tokens.every(isChordToken);
}

function alignChords(chordLine, lyricLine) {
  const spans = chordSpans(chordLine);
  return spans.map((span, i) => {
    const end = i + 1 < spans.length ? spans[i + 1].index : lyricLine.length;
    const bar = { chords: [span.chord], lyric: lyricLine.slice(span.index, end).trim() };
    if (i === 0 && span.index > 0) {
      const pickup = lyricLine.slice(0, span.index).trim();
      if (pickup) bar.pickup = pickup;
    }
    return bar;
  });
}

function isStructural(line) {
  return !line
    || line.startsWith('{')
    || line.startsWith('|')
    || line.startsWith('#')
    || isChordLine(line)
    || /\[[^\]]+\]/.test(line);
}

function applyDirective(song, key, value, state) {
  const k = key.trim().toLowerCase();
  const v = value.trim();
  if (k === 'meta') {
    const meta = v.match(/^(\S+)\s+(.+)$/);
    if (meta) applyDirective(song, meta[1], meta[2], state);
    return null;
  }
  if (k === 'title' || k === 't') song.title = v;
  else if (k === 'key' || k === 'k') song.key = toAppKey(v);
  else if (k === 'tempo') song.tempo = Number(v) || song.tempo;
  else if (k === 'time') {
    song.time = v;
    if (!state.feelSet && /^3\//.test(v)) song.feel = 'waltz';
  } else if (k === 'feel') {
    song.feel = v;
    state.feelSet = true;
  } else if (k === 'artist') song.source = v;
  else if ((k === 'subtitle' || k === 'st') && song.source === 'Custom') song.source = v;
  else if ((k === 'comment' || k === 'c') && SECTION_COMMENT.test(v)) return titleCase(v);
  return null;
}

export function parseLeadSheet(text) {
  const lines = String(text ?? '').split(/\r?\n/);
  const song = {
    id: crypto.randomUUID(),
    title: 'Untitled',
    source: 'Custom',
    key: 'G',
    time: '4/4',
    tempo: 110,
    feel: 'boom-chuck',
    tags: ['custom'],
    sections: [],
    custom: true,
  };
  const state = { feelSet: false };
  let current = { name: 'Verse', bars: [] };
  let skipping = false;

  const flush = () => {
    if (!current.bars.length) return;
    song.sections.push(current);
    current = { name: `Section ${song.sections.length + 1}`, bars: [] };
  };

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) continue;

    if (skipping) {
      if (/^\{(?:end_of_tab|eot)\}$/i.test(line)) skipping = false;
      continue;
    }
    if (/^\{(?:start_of_tab|sot)\}$/i.test(line)) {
      skipping = true;
      continue;
    }
    if (/^\{chorus\}$/i.test(line)) {
      flush();
      const prev = [...song.sections].reverse().find((section) => section.name.toLowerCase() === 'chorus');
      if (prev) {
        song.sections.push({
          name: 'Chorus',
          bars: prev.bars.map((bar) => {
            const copy = {
              chords: [...bar.chords],
              lyric: bar.lyric,
              lineStart: bar.lineStart,
            };
            if (bar.pickup) copy.pickup = bar.pickup;
            return copy;
          }),
        });
      }
      continue;
    }

    const marker = line.match(/^\{(start_of_\w+|sov|soc|sob|end_of_\w+|eov|eoc|eob)(?::\s*([^}]*))?\}$/i);
    if (marker) {
      const token = marker[1].toLowerCase();
      if (token.startsWith('end_of_') || token === 'eov' || token === 'eoc' || token === 'eob') {
        flush();
      } else {
        flush();
        current = { name: sectionName(token, marker[2]), bars: [] };
      }
      continue;
    }
    if (/^##\s+/.test(line)) {
      flush();
      current = { name: line.replace(/^##\s+/, '').trim(), bars: [] };
      continue;
    }
    const heading = line.match(/^\[((?:verse|chorus|bridge|intro|outro|tag|break|instrumental|part)\b[^\]]*)\]$/i);
    if (heading) {
      flush();
      current = { name: titleCase(heading[1]), bars: [] };
      continue;
    }

    const directive = line.match(/^\{([^:}]+):\s*([^}]*)\}$/);
    if (directive) {
      const section = applyDirective(song, directive[1], directive[2], state);
      if (section) {
        flush();
        current = { name: section, bars: [] };
      }
      continue;
    }

    if (line.startsWith('|')) {
      const bars = [];
      for (const cell of line.split('|').map((part) => part.trim()).filter(Boolean)) {
        bars.push(...barFromCell(cell));
      }
      current.bars.push(...withLine(bars));
      continue;
    }

    if (isChordLine(line)) {
      const nextRaw = lines[i + 1] ?? '';
      const next = nextRaw.trim();
      if (next && !isStructural(next)) {
        i += 1;
        current.bars.push(...withLine(alignChords(raw, nextRaw)));
      } else {
        current.bars.push(...withLine(line.split(/\s+/).map((token) => ({ chords: [token], lyric: '' }))));
      }
      continue;
    }

    const bracketBars = barsFromBrackets(line);
    if (bracketBars.length) current.bars.push(...withLine(bracketBars));
  }

  flush();
  if (!song.sections.length) {
    song.sections.push({
      name: 'Verse',
      bars: [
        { chords: ['G'], lyric: '', lineStart: true },
        { chords: ['C'], lyric: '', lineStart: false },
        { chords: ['G'], lyric: '', lineStart: false },
        { chords: ['D7'], lyric: '', lineStart: false },
      ],
    });
  }
  return song;
}

export function songToLeadSheet(song) {
  const lines = [
    `{title: ${song.title}}`,
    `{key: ${song.key}}`,
    `{tempo: ${song.tempo}}`,
    `{time: ${song.time}}`,
    `{feel: ${song.feel}}`,
    '',
  ];
  for (const section of song.sections) {
    lines.push(`{start_of_section: ${section.name}}`);
    let group = [];
    const flushGroup = () => {
      if (!group.length) return;
      lines.push(group.map((bar) => `${bar.pickup ? `${bar.pickup} ` : ''}[${bar.chords[0] || 'G'}]${bar.lyric || ''}`).join(' '));
      group = [];
    };
    for (const bar of section.bars) {
      if (bar.lineStart && group.length) flushGroup();
      group.push(bar);
    }
    flushGroup();
    lines.push('{end_of_section}', '');
  }
  return lines.join('\n');
}

export function compileChart(entry) {
  const parsed = parseLeadSheet(entry.chart);
  return {
    ...parsed,
    id: entry.id,
    title: entry.title || parsed.title,
    source: entry.source || parsed.source,
    key: entry.key || parsed.key,
    time: entry.time || parsed.time,
    tempo: entry.tempo || parsed.tempo,
    feel: entry.feel || parsed.feel,
    tags: entry.tags || [],
    custom: false,
  };
}

export const BUILTIN_SONGS = SONG_CHARTS.map(compileChart);
