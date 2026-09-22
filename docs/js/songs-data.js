/**
 * Built-in public-domain / traditional songs.
 * Bars are 4/4 unless `time` says otherwise. Each bar has one or two chords
 * and the lyric sung over that bar.
 */
export const BUILTIN_SONGS = [
  {
    id: 'circle-be-unbroken',
    title: 'Will the Circle Be Unbroken',
    source: 'Traditional / Ada R. Habershon & Charles H. Gabriel (public domain)',
    key: 'G',
    time: '4/4',
    tempo: 108,
    feel: 'boom-chuck',
    tags: ['gospel', 'standard'],
    sections: [
      {
        name: 'Verse',
        bars: [
          { chords: ['G'], lyric: 'Will the circle' },
          { chords: ['G'], lyric: 'be unbroken' },
          { chords: ['C'], lyric: 'by and by, Lord,' },
          { chords: ['G'], lyric: 'by and by' },
          { chords: ['G'], lyric: "There's a better" },
          { chords: ['G'], lyric: 'home a-waiting' },
          { chords: ['D7'], lyric: 'in the sky, Lord,' },
          { chords: ['G'], lyric: 'in the sky' },
        ],
      },
    ],
  },
  {
    id: 'willow',
    title: 'Bury Me Beneath the Willow',
    source: 'Traditional (public domain)',
    key: 'G',
    time: '4/4',
    tempo: 100,
    feel: 'boom-chuck',
    tags: ['gospel', 'standard'],
    sections: [
      {
        name: 'Verse',
        bars: [
          { chords: ['G'], lyric: 'My heart is sad and' },
          { chords: ['G'], lyric: 'I am lonely' },
          { chords: ['C'], lyric: 'For the one I' },
          { chords: ['G'], lyric: 'love so true' },
          { chords: ['G'], lyric: 'We never more shall' },
          { chords: ['G'], lyric: 'weep together' },
          { chords: ['D7'], lyric: 'For we know not' },
          { chords: ['G'], lyric: 'what we do' },
        ],
      },
      {
        name: 'Chorus',
        bars: [
          { chords: ['G'], lyric: 'Oh, bury me beneath the willow' },
          { chords: ['G'], lyric: 'Under the weeping willow tree' },
          { chords: ['C'], lyric: 'So she will know where' },
          { chords: ['G'], lyric: 'I am sleeping' },
          { chords: ['G'], lyric: 'And perhaps she\'ll' },
          { chords: ['G'], lyric: 'weep for me' },
          { chords: ['D7'], lyric: '' },
          { chords: ['G'], lyric: '' },
        ],
      },
    ],
  },
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    source: 'John Newton / traditional (public domain)',
    key: 'G',
    time: '3/4',
    tempo: 86,
    feel: 'waltz',
    tags: ['gospel', 'waltz'],
    sections: [
      {
        name: 'Verse',
        bars: [
          { chords: ['G'], lyric: 'Amazing grace,' },
          { chords: ['G'], lyric: 'how sweet the sound' },
          { chords: ['C'], lyric: 'That saved a' },
          { chords: ['G'], lyric: 'wretch like me' },
          { chords: ['G'], lyric: 'I once was lost,' },
          { chords: ['G'], lyric: 'but now am found' },
          { chords: ['D7'], lyric: 'Was blind, but' },
          { chords: ['G'], lyric: 'now I see' },
        ],
      },
    ],
  },
  {
    id: 'cripple-creek',
    title: 'Cripple Creek',
    source: 'Traditional fiddle tune (public domain)',
    key: 'A',
    time: '4/4',
    tempo: 126,
    feel: 'boom-chuck',
    tags: ['fiddle-tune', 'instrumental'],
    sections: [
      {
        name: 'A',
        bars: [
          { chords: ['A'], lyric: 'Goin\' up Cripple Creek' },
          { chords: ['A'], lyric: 'goin\' in a run' },
          { chords: ['A'], lyric: 'Goin\' up Cripple Creek' },
          { chords: ['E'], lyric: 'to have a little fun' },
          { chords: ['A'], lyric: 'Goin\' up Cripple Creek' },
          { chords: ['A'], lyric: 'goin\' in a whirl' },
          { chords: ['A'], lyric: 'Goin\' up Cripple Creek' },
          { chords: ['E', 'A'], lyric: 'to see my girl' },
        ],
      },
    ],
  },
  {
    id: 'old-joe-clark',
    title: 'Old Joe Clark',
    source: 'Traditional (public domain) — Mixolydian jam',
    key: 'A',
    time: '4/4',
    tempo: 120,
    feel: 'boom-chuck',
    tags: ['fiddle-tune', 'mixolydian'],
    sections: [
      {
        name: 'A',
        bars: [
          { chords: ['A'], lyric: 'Old Joe Clark, the' },
          { chords: ['A'], lyric: 'preacher\'s son' },
          { chords: ['A'], lyric: 'Preached all over the' },
          { chords: ['G'], lyric: 'kingdom come' },
          { chords: ['A'], lyric: 'Old Joe Clark he' },
          { chords: ['A'], lyric: 'had a house' },
          { chords: ['G'], lyric: 'Fifteen stories' },
          { chords: ['A'], lyric: 'high' },
        ],
      },
      {
        name: 'Chorus',
        bars: [
          { chords: ['A'], lyric: 'Fare thee well,' },
          { chords: ['A'], lyric: 'Old Joe Clark' },
          { chords: ['A'], lyric: 'Fare thee well,' },
          { chords: ['G'], lyric: "I say" },
          { chords: ['A'], lyric: 'Fare thee well,' },
          { chords: ['A'], lyric: 'Old Joe Clark' },
          { chords: ['G'], lyric: 'I\'m a-goin\' away' },
          { chords: ['A'], lyric: '' },
        ],
      },
    ],
  },
  {
    id: 'wabash-cannonball',
    title: 'The Wabash Cannonball',
    source: 'Traditional / Carter Family-era standard (public domain melody)',
    key: 'G',
    time: '4/4',
    tempo: 118,
    feel: 'boom-chuck',
    tags: ['standard'],
    sections: [
      {
        name: 'Verse',
        bars: [
          { chords: ['G'], lyric: 'From the great Atlantic ocean' },
          { chords: ['G'], lyric: 'to the wide Pacific shore' },
          { chords: ['C'], lyric: 'From the green old flowing mountains' },
          { chords: ['G'], lyric: 'to the south down by the shore' },
          { chords: ['G'], lyric: 'She\'s mighty tall and handsome' },
          { chords: ['G'], lyric: 'and she\'s known quite well by all' },
          { chords: ['D7'], lyric: 'She\'s the regular combination' },
          { chords: ['G'], lyric: 'on the Wabash Cannonball' },
        ],
      },
    ],
  },
  {
    id: 'angel-band',
    title: 'Angel Band',
    source: 'Traditional gospel (public domain)',
    key: 'G',
    time: '3/4',
    tempo: 80,
    feel: 'waltz',
    tags: ['gospel', 'waltz'],
    sections: [
      {
        name: 'Chorus',
        bars: [
          { chords: ['G'], lyric: 'Oh come,' },
          { chords: ['G'], lyric: 'angel band' },
          { chords: ['C'], lyric: 'Come and' },
          { chords: ['G'], lyric: 'around me stand' },
          { chords: ['G'], lyric: 'Oh bear me away' },
          { chords: ['G'], lyric: 'on your snowy wings' },
          { chords: ['D7'], lyric: 'To my immortal' },
          { chords: ['G'], lyric: 'home' },
        ],
      },
    ],
  },
];

export function flattenSong(song) {
  const bars = [];
  for (const section of song.sections) {
    section.bars.forEach((bar, i) => {
      bars.push({
        ...bar,
        section: section.name,
        sectionIndex: bars.length === 0 || bars[bars.length - 1]?.section !== section.name
          ? i
          : i,
        index: bars.length,
      });
    });
  }
  return bars;
}

export function parseLeadSheet(text) {
  const lines = text.split(/\r?\n/);
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
  let current = { name: 'Verse', bars: [] };

  const flush = () => {
    if (current.bars.length) {
      song.sections.push(current);
      current = { name: `Section ${song.sections.length + 1}`, bars: [] };
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const dir = line.match(/^\{(\w+):\s*(.+)\}$/i);
    if (dir) {
      const k = dir[1].toLowerCase();
      const v = dir[2].trim();
      if (k === 'title') song.title = v;
      if (k === 'key') song.key = v;
      if (k === 'tempo') song.tempo = Number(v) || song.tempo;
      if (k === 'time') song.time = v;
      if (k === 'feel') song.feel = v;
      continue;
    }
    if (/^\{start_of_(\w+)\}/i.test(line) || /^##\s+/.test(line)) {
      flush();
      current = {
        name: (line.match(/^\{start_of_(\w+)\}/i)?.[1] || line.replace(/^##\s+/, '')).replace(/^\w/, (c) => c.toUpperCase()),
        bars: [],
      };
      continue;
    }
    if (/^\{end_of_/i.test(line)) {
      flush();
      continue;
    }
    if (line.startsWith('|')) {
      const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
      for (const cell of cells) {
        const chords = [...cell.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
        const lyric = cell.replace(/\[[^\]]+\]/g, '').trim();
        current.bars.push({ chords: chords.length ? chords : ['G'], lyric });
      }
      continue;
    }
    const chords = [...line.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
    const lyric = line.replace(/\[[^\]]+\]/g, '').trim();
    if (chords.length) current.bars.push({ chords, lyric });
  }
  flush();
  if (!song.sections.length) {
    song.sections.push({
      name: 'Verse',
      bars: [
        { chords: ['G'], lyric: '' },
        { chords: ['C'], lyric: '' },
        { chords: ['G'], lyric: '' },
        { chords: ['D7'], lyric: '' },
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
    lines.push(`{start_of_${section.name.toLowerCase().replace(/\s+/g, '_')}}`);
    let row = '|';
    section.bars.forEach((bar, i) => {
      const chordBits = bar.chords.map((c) => `[${c}]`).join(' ');
      row += ` ${chordBits} ${bar.lyric || ''} |`;
      if ((i + 1) % 4 === 0) {
        lines.push(row);
        row = '|';
      }
    });
    if (row !== '|') lines.push(row);
    lines.push(`{end_of_${section.name.toLowerCase().replace(/\s+/g, '_')}}`, '');
  }
  return lines.join('\n');
}
