function chart(id, tags, body) {
  return { id, tags, chart: body.trim() };
}

export const TUNES = [
  chart('soldiers-joy', ['fiddle-tune', 'instrumental'], `
{title: Soldier's Joy}
{artist: Traditional fiddle tune (public domain)}
{key: D}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: A}
[D] [D] [D] [A]
[D] [D] [D] [A]
[D] [D] [D] [A]
[D] [A] [D] [D]
{end_of_section}

{start_of_section: B}
[D] [G] [D] [A]
[D] [G] [D] [A]
[D] [G] [D] [A]
[D] [A] [D] [D]
{end_of_section}
`),
  chart('angeline', ['fiddle-tune', 'instrumental'], `
{title: Angeline the Baker}
{artist: Traditional fiddle tune (public domain)}
{key: D}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: A}
[D] [D] [D] [A]
[D] [G] [D] [A]
[D] [D] [D] [A]
[D] [G] [D] [A]
{end_of_section}

{start_of_section: B}
[D] [D] [G] [D]
[D] [A] [D] [D]
[D] [D] [G] [D]
[D] [A] [D] [D]
{end_of_section}
`),
  chart('arkansas-traveler', ['fiddle-tune', 'instrumental'], `
{title: Arkansas Traveler}
{artist: Traditional fiddle tune (public domain)}
{key: D}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: A}
[D] [D] [D] [A]
[D] [D] [A] [D]
[D] [D] [D] [A]
[D] [A] [D] [D]
{end_of_section}

{start_of_section: B}
[D] [G] [D] [A]
[D] [G] [A] [D]
[D] [G] [D] [A]
[D] [A] [D] [D]
{end_of_section}
`),
  chart('liberty', ['fiddle-tune', 'instrumental'], `
{title: Liberty}
{artist: Traditional fiddle tune (public domain)}
{key: D}
{time: 4/4}
{tempo: 124}
{feel: boom-chuck}

{start_of_section: A}
[D] [D] [A] [D]
[D] [D] [A] [D]
[D] [G] [D] [A]
[D] [A] [D] [D]
{end_of_section}

{start_of_section: B}
[D] [G] [D] [A]
[D] [G] [D] [A]
[D] [G] [D] [A]
[D] [A] [D] [D]
{end_of_section}
`),
  chart('over-the-waterfall', ['fiddle-tune', 'instrumental'], `
{title: Over the Waterfall}
{artist: Traditional fiddle tune (public domain)}
{key: D}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: A}
[D] [G] [D] [A]
[D] [G] [D] [A]
[D] [G] [D] [A]
[D] [G] [A] [D]
{end_of_section}

{start_of_section: B}
[D] [D] [A] [A]
[D] [G] [A] [D]
[D] [D] [A] [A]
[D] [G] [A] [D]
{end_of_section}
`),
  chart('fishers-hornpipe', ['fiddle-tune', 'instrumental'], `
{title: Fisher's Hornpipe}
{artist: Traditional fiddle tune (public domain)}
{key: D}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: A}
[D] [D] [A] [D]
[D] [D] [A] [D]
[D] [G] [D] [A]
[D] [A] [D] [D]
{end_of_section}

{start_of_section: B}
[D] [G] [D] [A]
[D] [G] [D] [A]
[D] [Bm] [G] [A]
[D] [A] [D] [D]
{end_of_section}
`),
  chart('st-annes-reel', ['fiddle-tune', 'instrumental'], `
{title: St. Anne's Reel}
{artist: Traditional (public domain)}
{key: D}
{time: 4/4}
{tempo: 122}
{feel: boom-chuck}

{start_of_section: A}
[D] [D] [D] [A]
[D] [D] [A] [D]
[D] [D] [D] [A]
[D] [A] [D] [D]
{end_of_section}

{start_of_section: B}
[G] [G] [D] [D]
[D] [A] [D] [D]
[G] [G] [D] [A]
[D] [A] [D] [D]
{end_of_section}
`),
  chart('sally-goodin', ['fiddle-tune', 'instrumental'], `
{title: Sally Goodin}
{artist: Traditional fiddle tune (public domain)}
{key: A}
{time: 4/4}
{tempo: 126}
{feel: boom-chuck}

{start_of_section: A}
[A] [A] [A] [E]
[A] [A] [E] [A]
[A] [A] [A] [E]
[A] [E] [A] [A]
{end_of_section}

{start_of_section: B}
[A] [A] [D] [A]
[A] [E] [A] [A]
[A] [D] [A] [A]
[A] [E] [A] [A]
{end_of_section}
`),
  chart('red-haired-boy', ['fiddle-tune', 'modal', 'instrumental'], `
{title: Red Haired Boy}
{artist: Traditional, Mixolydian (public domain)}
{key: A}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: A}
[A] [A] [G] [A]
[A] [A] [G] [A]
[A] [D] [A] [G]
[A] [G] [A] [A]
{end_of_section}

{start_of_section: B}
[D] [A] [G] [A]
[D] [A] [E] [A]
[D] [A] [G] [A]
[D] [E] [A] [A]
{end_of_section}
`),
  chart('june-apple', ['fiddle-tune', 'modal', 'instrumental'], `
{title: June Apple}
{artist: Traditional, Mixolydian (public domain)}
{key: A}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: A}
[A] [G] [A] [A]
[A] [G] [A] [A]
[A] [D] [A] [G]
[A] [G] [A] [A]
{end_of_section}

{start_of_section: B}
[D] [D] [A] [A]
[A] [E] [A] [A]
[D] [D] [A] [A]
[A] [E] [A] [A]
{end_of_section}
`),
  chart('blackberry-blossom', ['fiddle-tune', 'instrumental'], `
{title: Blackberry Blossom}
{artist: Traditional fiddle tune (public domain)}
{key: G}
{time: 4/4}
{tempo: 126}
{feel: boom-chuck}

{start_of_section: A}
[G] [G] [C] [G]
[G] [D] [G] [D]
[G] [G] [C] [G]
[G] [D] [G] [G]
{end_of_section}

{start_of_section: B}
[Em] [Em] [C] [G]
[Em] [C] [D] [Em]
[Em] [Em] [C] [G]
[Em] [D] [Em] [Em]
{end_of_section}
`),
  chart('bill-cheatham', ['fiddle-tune', 'instrumental'], `
{title: Bill Cheatham}
{artist: Traditional fiddle tune (public domain)}
{key: A}
{time: 4/4}
{tempo: 128}
{feel: boom-chuck}

{start_of_section: A}
[A] [A] [E] [A]
[A] [A] [E] [A]
[A] [D] [A] [E]
[A] [E] [A] [A]
{end_of_section}

{start_of_section: B}
[A] [D] [A] [E]
[A] [D] [E] [A]
[A] [D] [A] [E]
[A] [E] [A] [A]
{end_of_section}
`),
  chart('devils-dream', ['fiddle-tune', 'instrumental'], `
{title: Devil's Dream}
{artist: Traditional fiddle tune (public domain)}
{key: A}
{time: 4/4}
{tempo: 132}
{feel: boom-chuck}

{start_of_section: A}
[A] [A] [E] [A]
[A] [A] [E] [A]
[A] [D] [A] [E]
[A] [E] [A] [A]
{end_of_section}

{start_of_section: B}
[A] [D] [A] [E]
[A] [D] [E] [A]
[A] [D] [A] [E]
[A] [E] [A] [A]
{end_of_section}
`),
  chart('reubens-train', ['fiddle-tune', 'modal', 'instrumental'], `
{title: Reuben's Train}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: A}
[A] [A] [A] [G]
[A] [A] [G] [A]
[A] [A] [A] [G]
[A] [G] [A] [A]
{end_of_section}

{start_of_section: B}
[A] [A] [G] [A]
[A] [G] [A] [A]
[A] [A] [G] [A]
[A] [G] [A] [A]
{end_of_section}
`),
];
