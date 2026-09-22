function chart(id, tags, body) {
  return { id, tags, chart: body.trim() };
}

export const SONGS = [
  chart('cripple-creek', ['fiddle-tune', 'breakdown'], `
{title: Cripple Creek}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 126}
{feel: boom-chuck}

{start_of_section: Verse 1}
[A]Goin' up Cripple Creek, goin' in a run
[A]Goin' up Cripple Creek [E]to have a little fun
[A]Goin' up Cripple Creek, goin' in a whirl
[A]Goin' up Cripple Creek [E]to see my [A]girl
{end_of_section}

{start_of_section: Chorus}
[A]Cripple Creek's wide and Cripple Creek's deep
[A]I'll wade old Cripple Creek [E]before I sleep
[A]Roll my britches to my knees
[A]I'll wade old Cripple Creek [E]whenever I [A]please
{end_of_section}

{start_of_section: Verse 2}
[A]I went down to Cripple Creek to see what them girls would do
[A]Went down to Cripple Creek [E]to see what them girls would do
[A]This one grabbed my bottle and the other grabbed my gun
[A]This one said, come on boys, [E]let's have some [A]fun
{end_of_section}

{chorus}
`),
  chart('old-joe-clark', ['fiddle-tune', 'modal'], `
{title: Old Joe Clark}
{artist: Traditional, Mixolydian (public domain)}
{key: A}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: Verse 1}
[A]Old Joe Clark, the preacher's son
[A]Preached all over the plain
[A]The only text he ever knew
[G]Was high, low, jack, and the [A]game
{end_of_section}

{start_of_section: Chorus}
[A]Fare thee well, Old Joe Clark
[A]Fare thee well, I say
[A]Fare thee well, Old Joe Clark
[G]I'm a-going [A]away
{end_of_section}

{start_of_section: Verse 2}
[A]Old Joe Clark he had a house
[A]Sixteen stories high
[A]And every story in that house
[G]Was filled with chicken [A]pie
{end_of_section}

{start_of_section: Verse 3}
[A]I went down to Old Joe's house
[A]He invited me to supper
[A]I stumped my toe on the table leg
[G]And stuck my nose in the [A]butter
{end_of_section}

{start_of_section: Verse 4}
[A]Old Joe Clark had a mule
[A]His name was Morgan Brown
[A]And every tooth in that mule's head
[G]Was sixteen inches [A]round
{end_of_section}

{chorus}
`),
  chart('cumberland-gap', ['fiddle-tune', 'breakdown'], `
{title: Cumberland Gap}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 124}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Lay down boys and take a little nap
[G]Lay down boys and take a little nap
[G]Lay down boys and take a little nap
[D]They're raising Cain in Cumberland [G]Gap
{end_of_section}

{start_of_section: Verse 2}
[G]Me and my wife and my wife's pap
[G]All going down to Cumberland Gap
[G]Me and my wife and my wife's pap
[D]All going down to Cumberland [G]Gap
{end_of_section}

{start_of_section: Verse 3}
[G]Cumberland Gap, Cumberland Gap
[G]Fifteen miles on the Cumberland Gap
[G]Cumberland Gap is a mighty fine place
[D]Can't get nothing to suit my [G]case
{end_of_section}
`),
  chart('cabbage-down', ['fiddle-tune'], `
{title: Boil Them Cabbage Down}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Boil them cabbage down, down
[G]Turn them hoecakes round
[D]The only song that I can sing
[G]Is boil them cabbage down
{end_of_section}

{start_of_section: Verse 2}
[G]Possum in a simmon tree
[G]Raccoon on the ground
[D]Raccoon says you son of a gun
[G]Won't you shake them simmons down
{end_of_section}

{start_of_section: Verse 3}
[G]Raccoon and the possum
[G]Going up the hill
[D]Raccoon said to the possum
[G]Can you dance a reel
{end_of_section}

{start_of_section: Verse 4}
[G]Went to see my Sally Gray
[G]Went to see her soon
[D]She was standing in the door
[G]And a-picking of a tune
{end_of_section}
`),
  chart('cotton-eyed-joe', ['fiddle-tune'], `
{title: Cotton-Eyed Joe}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: Verse 1}
[A]Where did you come from, where did you go
[A]Where did you come from, Cotton-Eyed Joe
[E]Where did you come from, where did you go
[A]Where did you come from, Cotton-Eyed Joe
{end_of_section}

{start_of_section: Verse 2}
[A]I come for to see you, come for to sing
[A]Come for to show you my diamond ring
[E]I come for to see you, come for to sing
[A]Come for to show you my diamond ring
{end_of_section}

{start_of_section: Verse 3}
[A]Had not been for Cotton-Eyed Joe
[A]I'd been married a long time ago
[E]Had not been for Cotton-Eyed Joe
[A]I'd been married a long time ago
{end_of_section}

{start_of_section: B}
[A] [D] [A] [A]
[A] [E] [A] [A]
{end_of_section}
`),
  chart('buffalo-gals', ['standard'], `
{title: Buffalo Gals}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: Chorus}
[G]Buffalo gals, won't you come out tonight
[G]Come out tonight, come out tonight
[D]Buffalo gals, won't you come out tonight
[G]And dance by the light of the moon
{end_of_section}

{start_of_section: Verse 1}
[G]As I was walking down the street
[G]Down the street, down the street
[D]A pretty little gal I chanced to meet
[G]Oh she was fair to view
{end_of_section}

{start_of_section: Verse 2}
[G]I asked her if she'd be my wife
[G]Be my wife, be my wife
[D]Then I'd be happy all my life
[G]If she'd marry me
{end_of_section}

{chorus}
`),
  chart('oh-susanna', ['standard'], `
{title: Oh! Susanna}
{artist: Stephen Foster, 1848 (public domain)}
{key: G}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]I come from Alabama with my banjo on my knee
[D]I'm going to Louisiana, my true love for to [G]see
[G]It rained all night the day I left, the weather it was dry
[D]The sun so hot I froze to death, Susanna don't you [G]cry
{end_of_section}

{start_of_section: Chorus}
[G]Oh Susanna, oh don't you cry for me
[C]I come from Alabama with my banjo on my [G]knee
{end_of_section}

{start_of_section: Verse 2}
[G]I had a dream the other night when everything was still
[D]I thought I saw Susanna dear a-coming down the [G]hill
[G]The buckwheat cake was in her mouth, the tear was in her eye
[D]Says I, I'm coming from the south, Susanna don't you [G]cry
{end_of_section}

{chorus}
`),
  chart('she-be-coming', ['standard'], `
{title: She'll Be Coming Round the Mountain}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]She'll be coming round the mountain when she comes
[G]She'll be coming round the mountain when she comes
[C]She'll be coming round the mountain, she'll be coming round the mountain
[D7]She'll be coming round the mountain when she [G]comes
{end_of_section}

{start_of_section: Verse 2}
[G]She'll be driving six white horses when she comes
[G]She'll be driving six white horses when she comes
[C]She'll be driving six white horses, she'll be driving six white horses
[D7]She'll be driving six white horses when she [G]comes
{end_of_section}

{start_of_section: Verse 3}
[G]Oh we'll all go out to meet her when she comes
[G]Oh we'll all go out to meet her when she comes
[C]Oh we'll all go out to meet her, we'll all go out to meet her
[D7]Oh we'll all go out to meet her when she [G]comes
{end_of_section}

{start_of_section: Verse 4}
[G]We'll kill the old red rooster when she comes
[G]We'll kill the old red rooster when she comes
[C]We'll kill the old red rooster, we'll kill the old red rooster
[D7]We'll kill the old red rooster when she [G]comes
{end_of_section}
`),
  chart('red-river-valley', ['waltz', 'standard'], `
{title: Red River Valley}
{artist: Traditional (public domain)}
{key: G}
{time: 3/4}
{tempo: 92}
{feel: waltz}

{start_of_section: Verse 1}
[G]From this valley they say you are going
[G]We will miss your bright eyes and sweet [D7]smile
[G]For they say you are taking the sunshine
[D7]That has brightened our pathway a [G]while
{end_of_section}

{start_of_section: Chorus}
[G]Come and sit by my side if you love me
[G]Do not hasten to bid me [D7]adieu
[G]Just remember the Red River Valley
[D7]And the cowboy who loved you so [G]true
{end_of_section}

{start_of_section: Verse 2}
[G]Won't you think of the valley you're leaving
[G]Oh how lonely, how sad it will [D7]be
[G]Oh think of the fond heart you're breaking
[D7]And the grief you are causing to [G]me
{end_of_section}

{start_of_section: Verse 3}
[G]As you go to your home by the ocean
[G]May you never forget those sweet [D7]hours
[G]That we spent in the Red River Valley
[D7]And the love we exchanged mid the [G]flowers
{end_of_section}

{chorus}
`),
  chart('home-on-the-range', ['waltz', 'standard'], `
{title: Home on the Range}
{artist: Brewster Higley and Daniel Kelley, 1870s (public domain)}
{key: G}
{time: 3/4}
{tempo: 88}
{feel: waltz}

{start_of_section: Verse 1}
[G]Oh give me a home where the buffalo roam
[C]Where the deer and the antelope [G]play
[G]Where seldom is heard a discouraging word
[D7]And the skies are not cloudy all [G]day
{end_of_section}

{start_of_section: Chorus}
[G]Home, home on the range
[C]Where the deer and the antelope [G]play
[G]Where seldom is heard a discouraging word
[D7]And the skies are not cloudy all [G]day
{end_of_section}

{start_of_section: Verse 2}
[G]How often at night when the heavens are bright
[C]With the light of the glittering [G]stars
[G]Have I stood there amazed and asked as I gazed
[D7]If their glory exceeds that of [G]ours
{end_of_section}

{start_of_section: Verse 3}
[G]Where the air is so pure, the zephyrs so free
[C]The breezes so balmy and [G]light
[G]That I would not exchange my home on the range
[D7]For all of the cities so [G]bright
{end_of_section}

{chorus}
`),
  chart('old-dan-tucker', ['standard', 'breakdown'], `
{title: Old Dan Tucker}
{artist: Dan Emmett, 1843 (public domain)}
{key: G}
{time: 4/4}
{tempo: 124}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Old Dan Tucker was a fine old man
[G]Washed his face in a frying pan
[D]Combed his hair with a wagon wheel
[G]And died with a toothache in his heel
{end_of_section}

{start_of_section: Chorus}
[G]Get out the way, Old Dan Tucker
[G]You're too late to get your supper
[C]Supper's over and breakfast cooking
[D]Old Dan Tucker just standing there [G]looking
{end_of_section}

{start_of_section: Verse 2}
[G]Old Dan Tucker come to town
[G]Riding a billy goat, leading a hound
[D]Hound dog bark and the billy goat jump
[G]Landed Dan Tucker on top of a stump
{end_of_section}

{start_of_section: Verse 3}
[G]Old Dan Tucker he got drunk
[G]Fell in the fire and kicked up a chunk
[D]Red hot coal got in his shoe
[G]Lord bless you, honey, how the ashes flew
{end_of_section}

{chorus}
`),
  chart('golden-slippers', ['standard'], `
{title: Oh, Dem Golden Slippers}
{artist: James Bland, 1879 (public domain)}
{key: G}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Oh my golden slippers am laid away
[C]Cause I don't expect to wear them till my wedding [G]day
[G]And my long-tailed coat that I loved so well
[D7]I will wear up in the chariot in the [G]morn
{end_of_section}

{start_of_section: Chorus}
[G]Oh them golden slippers, oh them golden slippers
[C]Golden slippers I'm going to wear, because they look so [G]neat
[G]Oh them golden slippers, oh them golden slippers
[D7]Golden slippers I'm going to wear to walk the golden [G]street
{end_of_section}

{start_of_section: Verse 2}
[G]Oh my old banjo hangs on the wall
[C]Cause it ain't been tuned since way last [G]fall
[G]But the people say we'll have a good time
[D7]When we ride up in the chariot in the [G]morn
{end_of_section}

{chorus}
`),
  chart('nelly-gray', ['ballad'], `
{title: Darling Nelly Gray}
{artist: Benjamin Hanby, 1856 (public domain)}
{key: G}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]There's a low green valley on the old Kentucky shore
[C]Where I've whiled many happy hours [G]away
[G]A-sitting and a-singing by the little cottage door
[D7]Where lived my darling Nelly [G]Gray
{end_of_section}

{start_of_section: Chorus}
[G]Oh my poor Nelly Gray, they have taken you away
[C]And I'll never see my darling any [G]more
[G]I'm sitting by the river and I'm weeping all the day
[D7]For you've gone from the old Kentucky [G]shore
{end_of_section}

{start_of_section: Verse 2}
[G]When the moon had climbed the mountain and the stars were shining too
[C]Then I'd take my darling Nelly [G]Gray
[G]And we'd float down the river in my little red canoe
[D7]While my banjo sweetly I would [G]play
{end_of_section}

{start_of_section: Verse 3}
[G]One night I went to see her but she's gone the neighbors say
[C]The white man bound her with his [G]chain
[G]They have taken her to Georgia for to wear her life away
[D7]As she toils in the cotton and the [G]cane
{end_of_section}

{chorus}
`),
  chart('turkey-in-the-straw', ['fiddle-tune'], `
{title: Turkey in the Straw}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]As I was a-going down the road
[G]With a tired team and a heavy load
[D]I cracked my whip and the leader sprung
[G]I says goodbye and the wagon hung
{end_of_section}

{start_of_section: Chorus}
[G]Turkey in the straw, turkey in the hay
[C]Roll 'em up and twist 'em up a high [G]tuckahaw
[G]And hit 'em up a tune called Turkey in the Straw
[D]Turkey in the [G]Straw
{end_of_section}

{start_of_section: Verse 2}
[G]Went out to milk and I didn't know how
[G]I milked the goat instead of the cow
[D]A monkey sitting on a pile of straw
[G]A-winking at his mother-in-law
{end_of_section}

{start_of_section: B}
[G] [C] [G] [D]
[G] [D] [G] [G]
{end_of_section}

{chorus}
`),
];
