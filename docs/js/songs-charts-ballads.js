function chart(id, tags, body) {
  return { id, tags, chart: body.trim() };
}

export const BALLADS = [
  chart('little-sadie', ['ballad', 'minor'], `
{title: Little Sadie}
{artist: Traditional (public domain)}
{key: Dm}
{time: 4/4}
{tempo: 104}
{feel: boom-chuck}

{start_of_section: Verse 1}
[Dm]Went out last night [F]to take a look [Dm]around
[C]Met little Sadie and I blowed her [Am]down
[C]Went back home, and [C]I got into bed
[A7]Forty-four smokeless under my [Dm]head
{end_of_section}

{start_of_section: Verse 2}
[Dm]Woke the next morning [F]'bout half past [Dm]nine
[C]Hacks and the buggies all stood in a [Am]line
[C]Gents and the gamblers [C]standing around
[A7]Taking little Sadie to the burying [Dm]ground
{end_of_section}

{start_of_section: Verse 3}
[Dm]Began to think what [F]a deed I'd [Dm]done
[C]Grabbed my hat and [Am]away I run
[C]Made a good run but [C]a little too slow
[A7]They overtook me in [Dm]Jericho
{end_of_section}

{start_of_section: Verse 4}
[Dm]Standing on the corner [F]reading the [Dm]bill
[C]Up stepped the sheriff from [Am]Thomasville
[C]Said young man, ain't your [C]name Brown
[A7]Remember the night you blowed [Dm]Sadie down
{end_of_section}

{start_of_section: Verse 5}
[Dm]Yes sir, yes sir, [F]my name is [Dm]Lee
[C]I murdered little Sadie in the [Am]first degree
[C]First degree and the [C]second degree
[A7]Got any papers, won't you read 'em to [Dm]me
{end_of_section}

{start_of_section: Verse 6}
[Dm]Took me downtown and they [F]dressed me in [Dm]black
[C]Put me on the train and they [Am]sent me back
[C]Had no one for to [C]go my bail
[A7]They crammed me back in the county [Dm]jail
{end_of_section}

{start_of_section: Verse 7}
[Dm]Judge and the jury [F]took the [Dm]stand
[C]Judge held the papers in his [Am]right hand
[C]Forty-one days and [C]forty-one nights
[A7]Forty-one years to wear the ball and [Dm]stripes
{end_of_section}
`),
  chart('willow', ['ballad', 'standard'], `
{title: Bury Me Beneath the Willow}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]My heart is sad and I am [G]lonely
[C]For the only one I [G]love
[G]When shall I see her, oh no [G]never
[D7]Till we meet in heaven [G]above
{end_of_section}

{start_of_section: Chorus}
[G]Oh bury me beneath the [G]willow
[C]Under the weeping willow [G]tree
[G]So she will know where I am [G]sleeping
[D7]And perhaps she'll weep for [G]me
{end_of_section}

{start_of_section: Verse 2}
[G]She told me that she did not [G]love me
[C]I could not believe it [G]true
[G]Until an angel softly [G]whispered
[D7]She no longer cares for [G]you
{end_of_section}

{start_of_section: Verse 3}
[G]Tomorrow was our wedding [G]day
[C]Oh God, oh God, where can she [G]be
[G]She's gone, she's gone to love [G]another
[D7]She no longer cares for [G]me
{end_of_section}

{chorus}
`),
  chart('wabash-cannonball', ['standard'], `
{title: The Wabash Cannonball}
{artist: Traditional, from The Great Rock Island Route, 1882 (public domain)}
{key: G}
{time: 4/4}
{tempo: 118}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]From the great Atlantic ocean to the wide Pacific [G]shore
[C]From the queen of flowing mountains to the south belt by the [G]shore
[G]She's mighty tall and handsome and quite well known by [G]all
[D7]She's the combination on the Wabash [G]Cannonball
{end_of_section}

{start_of_section: Verse 2}
[G]Listen to the jingle, the rumble and the [G]roar
[C]As she glides along the woodland through the hills and by the [G]shore
[G]Hear the mighty rush of the engine, hear the lonesome hobos [G]call
[D7]You're traveling through the jungles on the Wabash [G]Cannonball
{end_of_section}

{start_of_section: Verse 3}
[G]She came down from Birmingham one cold December [G]day
[C]As she rolled into the station you could hear the people [G]say
[G]There's a girl from Tennessee, she's long and she is [G]tall
[D7]She came down from Birmingham on the Wabash [G]Cannonball
{end_of_section}

{start_of_section: Verse 4}
[G]Here's to daddy Claxton, may his name forever [G]stand
[C]And always be remembered in the courts throughout the [G]land
[G]His earthly race is over and the curtains round him [G]fall
[D7]We'll carry him home to victory on the Wabash [G]Cannonball
{end_of_section}
`),
  chart('wildwood-flower', ['standard', 'ballad'], `
{title: Wildwood Flower}
{artist: I'll Twine 'Mid the Ringlets, 1860 (public domain)}
{key: C}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[C]I'll twine 'mid the ringlets of my raven black [C]hair
[F]The lilies so pale and the roses so [C]fair
[C]The myrtle so bright with an emerald [C]hue
[G7]And the pale aronatus with eyes of bright [C]blue
{end_of_section}

{start_of_section: Verse 2}
[C]I'll sing and I'll dance and my laugh shall be [C]gay
[F]I'll cease this wild weeping, drive sorrow [C]away
[C]Though my heart is now breaking, he never shall [C]know
[G7]That his name made me tremble and my pale cheeks to [C]glow
{end_of_section}

{start_of_section: Verse 3}
[C]I'll think of him never, I'll be wildly [C]gay
[F]I'll charm every heart and the crowd I will [C]sway
[C]I'll live yet to see him regret the dark [C]hour
[G7]When he won, then neglected, the frail wildwood [C]flower
{end_of_section}

{start_of_section: Verse 4}
[C]He told me he loved me and promised to [C]love
[F]Through ill and misfortune, all others [C]above
[C]Another has won him, oh misery to [C]tell
[G7]He left me in silence, no word of [C]farewell
{end_of_section}
`),
  chart('constant-sorrow', ['ballad', 'standard'], `
{title: Man of Constant Sorrow}
{artist: Dick Burnett, Farewell Song, 1913 (public domain)}
{key: D}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[D]I am a man of constant [D]sorrow
[G]I've seen trouble [D]all my days
[D]I bid farewell to old [D]Kentucky
[A7]The place where I was born and [D]raised
{end_of_section}

{start_of_section: Verse 2}
[D]For six long years I've been in [D]trouble
[G]No pleasures here on [D]earth I find
[D]For in this world I'm bound to [D]ramble
[A7]I have no friends to help me [D]now
{end_of_section}

{start_of_section: Verse 3}
[D]It's fare you well, my own true [D]lover
[G]I never expect to see you [D]again
[D]For I'm bound to ride that northern [D]railroad
[A7]Perhaps I'll die upon this [D]train
{end_of_section}

{start_of_section: Verse 4}
[D]You can bury me in some deep [D]valley
[G]For many years where I may [D]lay
[D]Then you may learn to love [D]another
[A7]While I am sleeping in my [D]grave
{end_of_section}

{start_of_section: Verse 5}
[D]Maybe your friends think I'm a [D]stranger
[G]My face you'll never see no [D]more
[D]But there is one promise that is [D]given
[A7]I'll meet you on God's golden [D]shore
{end_of_section}
`),
  chart('little-maggie', ['ballad', 'standard'], `
{title: Little Maggie}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 118}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Over yonder stands little Maggie
[G]With a dram glass in her hand
[C]She's drinking away her troubles
[D7]Over courting some other [G]man
{end_of_section}

{start_of_section: Verse 2}
[G]Oh how can I ever stand it
[G]To see them two blue eyes
[C]Shining in the moonlight
[D7]Like two diamonds in the [G]sky
{end_of_section}

{start_of_section: Verse 3}
[G]Pretty flowers were made for blooming
[G]Pretty stars were made to shine
[C]Pretty women were made for loving
[D7]Little Maggie was made for [G]mine
{end_of_section}

{start_of_section: Verse 4}
[G]Last time I saw little Maggie
[G]She was sitting on the banks of the sea
[C]With a forty-four around her
[D7]And a banjo on her [G]knee
{end_of_section}

{start_of_section: Verse 5}
[G]Lay down your last gold dollar
[G]Lay down your gold watch and chain
[C]Little Maggie's gonna leave you
[D7]You'll never see her [G]again
{end_of_section}
`),
  chart('banks-of-the-ohio', ['ballad'], `
{title: Banks of the Ohio}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 104}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]I asked my love to take a walk
[G]Just a little ways with me
[C]And as we walked along we talked
[D7]Of when would be our wedding [G]day
{end_of_section}

{start_of_section: Chorus}
[G]Only say that you'll be mine
[G]In no other's arms entwine
[C]Down beside where the waters flow
[D7]Down by the banks of the [G]Ohio
{end_of_section}

{start_of_section: Verse 2}
[G]I held a knife against her breast
[G]As into my arms she pressed
[C]She cried Willie, don't you murder me
[D7]I'm not prepared for [G]eternity
{end_of_section}

{start_of_section: Verse 3}
[G]I started home 'tween twelve and one
[G]I cried my God, what have I done
[C]I've killed the only girl I love
[D7]Because she would not be my [G]bride
{end_of_section}

{chorus}
`),
  chart('pretty-polly', ['ballad', 'minor'], `
{title: Pretty Polly}
{artist: Traditional (public domain)}
{key: Am}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[Am]Pretty Polly, pretty Polly, come go along with [Am]me
[Am]Pretty Polly, pretty Polly, come go along with [Am]me
[C]Before we get married some pleasure to [Am]see
{end_of_section}

{start_of_section: Verse 2}
[Am]She got up behind him and away they did [Am]go
[Am]She got up behind him and away they did [Am]go
[C]Over the hills to the valley so [Am]low
{end_of_section}

{start_of_section: Verse 3}
[Am]They went a little farther and what did they [Am]spy
[Am]They went a little farther and what did they [Am]spy
[C]A new dug grave with a spade lying [Am]by
{end_of_section}

{start_of_section: Verse 4}
[Am]Oh Willie, oh Willie, I'm afraid of your [Am]ways
[Am]Oh Willie, oh Willie, I'm afraid of your [Am]ways
[C]I'm afraid you will lead my poor body [Am]astray
{end_of_section}

{start_of_section: Verse 5}
[Am]Polly, pretty Polly, you guessed about [Am]right
[Am]Polly, pretty Polly, you guessed about [Am]right
[E7]I dug on your grave the best part of last [Am]night
{end_of_section}
`),
  chart('in-the-pines', ['ballad'], `
{title: In the Pines}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 96}
{feel: boom-chuck}

{start_of_section: Chorus}
[A]In the pines, in the [A]pines
[D]Where the sun never [A]shines
[A]And we shiver when the [E]cold wind [A]blows
{end_of_section}

{start_of_section: Verse 1}
[A]The longest train I [A]ever saw
[D]Went down that Georgia [A]line
[A]The engine passed at six o'[E]clock
[A]And the cab passed by at [A]nine
{end_of_section}

{start_of_section: Verse 2}
[A]Little girl, little girl, what have I [A]done
[D]That makes you treat me [A]so
[A]You caused me to weep, you caused me to [E]mourn
[A]You caused me to leave my [A]home
{end_of_section}

{start_of_section: Verse 3}
[A]My husband was a railroad [A]man
[D]Killed a mile and a half from [A]town
[A]His head was found in a driver's [E]wheel
[A]And his body has never been [A]found
{end_of_section}

{chorus}
`),
  chart('john-henry', ['ballad', 'standard'], `
{title: John Henry}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: Verse 1}
[A]When John Henry was a little baby
[A]Sitting on his papa's knee
[D]He picked up a hammer and a little piece of steel
[E]Said hammer's gonna be the death of me, [A]Lord
[E]Hammer's gonna be the death of [A]me
{end_of_section}

{start_of_section: Verse 2}
[A]Well the captain said to John Henry
[A]Gonna bring that steam drill round
[D]Gonna bring that steam drill out on the job
[E]Gonna whop that steel on down, [A]Lord
[E]Whop that steel on [A]down
{end_of_section}

{start_of_section: Verse 3}
[A]John Henry said to the captain
[A]A man ain't nothing but a man
[D]And before I let your steam drill beat me down
[E]I'll die with a hammer in my hand, [A]Lord
[E]Die with a hammer in my [A]hand
{end_of_section}

{start_of_section: Verse 4}
[A]John Henry hammered in the mountain
[A]His hammer was striking fire
[D]He worked so hard it broke his poor heart
[E]He laid down his hammer and he died, [A]Lord
[E]Laid down his hammer and he [A]died
{end_of_section}

{start_of_section: Verse 5}
[A]They took John Henry to the graveyard
[A]And they buried him in the sand
[D]And every locomotive comes a-rolling by
[E]Says there lies a steel-driving man, [A]Lord
[E]There lies a steel-driving [A]man
{end_of_section}
`),
  chart('nine-pound-hammer', ['standard', 'breakdown'], `
{title: Nine Pound Hammer}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: Verse 1}
[A]This nine pound hammer is a little too heavy
[A]For my size, buddy, for my size
[D]I'm going on the mountain just to see my baby
[E]And I ain't coming back, no I [A]ain't coming back
{end_of_section}

{start_of_section: Chorus}
[A]Roll on buddy, don't you roll so slow
[A]How can I roll when the wheels won't go
[D]Roll on buddy, pull a load of coal
[E]How can I pull when the wheels won't [A]go
{end_of_section}

{start_of_section: Verse 2}
[A]It's a long way to Harlan, it's a long way to Hazard
[A]Just to get a little brew, just to get a little brew
[D]When I'm long gone you can make my tombstone
[E]Out of number nine coal, out of [A]number nine coal
{end_of_section}

{start_of_section: Verse 3}
[A]Ain't one hammer in this tunnel
[A]That rings like mine, that rings like mine
[D]Rings like silver, shines like gold
[E]Rings like silver, shines like [A]gold
{end_of_section}

{chorus}
`),
  chart('long-journey-home', ['standard', 'breakdown'], `
{title: Long Journey Home}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: Chorus}
[G]Lost all my money but a two dollar bill
[G]I'm on my long journey home
[C]Cloudy in the west and it looks like rain
[D7]I'm on my long journey [G]home
{end_of_section}

{start_of_section: Verse 1}
[G]Black smoke a-rising and it surely is a train
[G]I'm on my long journey home
[C]Can't you hear the whistle blow a hundred miles
[D7]I'm on my long journey [G]home
{end_of_section}

{start_of_section: Verse 2}
[G]Homesick and lonesome and I'm feeling kind of blue
[G]I'm on my long journey home
[C]I've got a good gal waiting and a good gal true
[D7]I'm on my long journey [G]home
{end_of_section}

{start_of_section: Verse 3}
[G]Starting into raining and I've got to go home
[G]I'm on my long journey home
[C]One of these days I'll be leaving this town
[D7]I'm on my long journey [G]home
{end_of_section}

{chorus}
`),
  chart('east-virginia', ['ballad'], `
{title: East Virginia}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]I was born in East Virginia
[G]North Carolina I did go
[C]There I met a fair young maiden
[D7]And her name I did not [G]know
{end_of_section}

{start_of_section: Verse 2}
[G]Her hair was dark and curly
[G]And her cheeks were rosy red
[C]On her breast she wore a locket
[D7]Oh the tears that I have [G]shed
{end_of_section}

{start_of_section: Verse 3}
[G]When I'm dead and in my coffin
[G]And my pale face toward the sun
[C]You may think of me, my darling
[D7]And weep for me when I am [G]gone
{end_of_section}

{start_of_section: Verse 4}
[G]I don't want your greenback dollar
[G]I don't want your watch and chain
[C]All I want is you, my darling
[D7]Say you'll take me back [G]again
{end_of_section}
`),
  chart('handsome-molly', ['ballad'], `
{title: Handsome Molly}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]I wish I was in London
[C]Or some other seaport town
[G]I'd set my foot on a steamboat
[D7]I'd sail the ocean [G]round
{end_of_section}

{start_of_section: Chorus}
[G]While sailing around the ocean
[C]While sailing around the sea
[G]I'd think of handsome Molly
[D7]Wherever she might [G]be
{end_of_section}

{start_of_section: Verse 2}
[G]She rode to church on Sunday
[C]She passed me on by
[G]I knew her mind was changing
[D7]By the roving of her [G]eye
{end_of_section}

{start_of_section: Verse 3}
[G]Do you remember, Molly
[C]When you gave me your right hand
[G]You said if you ever married
[D7]That I would be the [G]man
{end_of_section}

{start_of_section: Verse 4}
[G]Now you've broke your promise
[C]Go home with who you please
[G]While my poor heart is aching
[D7]You're lying at your [G]ease
{end_of_section}

{chorus}
`),
];
