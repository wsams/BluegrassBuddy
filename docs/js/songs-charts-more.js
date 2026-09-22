function chart(id, tags, body) {
  return { id, tags, chart: body.trim() };
}

export const MORE = [
  chart('new-river-train', ['standard'], `
{title: New River Train}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 114}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]I'm riding on that new river train
[G]Riding on that new river train
[C]Same old train that brought me here
[D7]Gonna carry me back [G]again
{end_of_section}

{start_of_section: Verse 2}
[G]Darling, you can't love but one
[G]Darling, you can't love but one
[C]You can't love ten and still love one
[D7]You can't love but [G]one
{end_of_section}

{start_of_section: Verse 3}
[G]Darling, you can't love two
[G]Darling, you can't love two
[C]You can't love two and still be true
[D7]You can't love [G]two
{end_of_section}

{start_of_section: Verse 4}
[G]Darling, you can't love three
[G]Darling, you can't love three
[C]You can't love three and still love me
[D7]You can't love [G]three
{end_of_section}

{start_of_section: Verse 5}
[G]Darling, remember what you said
[G]Darling, remember what you said
[C]Remember you said we'd be wed
[D7]Remember what you [G]said
{end_of_section}
`),
  chart('worried-man', ['standard'], `
{title: Worried Man Blues}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]It takes a worried man to sing a worried song
[G]It takes a worried man to sing a worried song
[C]It takes a worried man to sing a worried song
[D7]I'm worried now but I won't be worried [G]long
{end_of_section}

{start_of_section: Verse 2}
[G]I went across the river and I lay down to sleep
[G]I went across the river and I lay down to sleep
[C]I went across the river and I lay down to sleep
[D7]When I woke up I had shackles on my [G]feet
{end_of_section}

{start_of_section: Verse 3}
[G]Twenty-one links of chain around my leg
[G]Twenty-one links of chain around my leg
[C]Twenty-one links of chain around my leg
[D7]And on each link the initial of my [G]name
{end_of_section}

{start_of_section: Verse 4}
[G]I asked the judge what might be my fine
[G]I asked the judge what might be my fine
[C]I asked the judge what might be my fine
[D7]Twenty-one years on the Rocky Mountain [G]line
{end_of_section}

{start_of_section: Verse 5}
[G]If anyone should ask you who composed this song
[G]If anyone should ask you who composed this song
[C]If anyone should ask you who composed this song
[D7]Tell him it was I and I sing it all day [G]long
{end_of_section}
`),
  chart('deal-go-down', ['standard', 'breakdown'], `
{title: Don't Let Your Deal Go Down}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: Chorus}
[G]Don't let your deal go down
[G]Don't let your deal go down
[C]Don't let your deal go down
[D7]Before I get my [G]money
{end_of_section}

{start_of_section: Verse 1}
[G]I've been all around this whole round world
[G]Honey, down in sunny Tennessee
[C]And any place I hang my hat
[D7]Is home sweet home to [G]me
{end_of_section}

{start_of_section: Verse 2}
[G]When I left my love behind
[G]She's standing in the door
[C]She throwed her little arms around my neck
[D7]And said honey please don't [G]go
{end_of_section}

{start_of_section: Verse 3}
[G]Now the last time I seen my little woman
[G]She had a wine glass in her hand
[C]She was drinking down her troubles
[D7]With a low-down gambling [G]man
{end_of_section}

{chorus}
`),
  chart('salty-dog', ['standard', 'breakdown'], `
{title: Salty Dog Blues}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Standing on the corner with the low-down blues
[E7]A great big hole in the bottom of my shoes
[A7]Honey, let me be your salty dog
[D7]Let me be your salty [G]dog
{end_of_section}

{start_of_section: Chorus}
[G]Let me be your salty dog
[E7]Or I won't be your man at all
[A7]Honey, let me be your salty dog
[D7]Let me be your salty [G]dog
{end_of_section}

{start_of_section: Verse 2}
[G]God made a woman and he made her mighty funny
[E7]Lips 'round her mouth sweet as honey
[A7]Honey, let me be your salty dog
[D7]Let me be your salty [G]dog
{end_of_section}

{start_of_section: Verse 3}
[G]Two old maids sitting in the sand
[E7]Each one wishing the other was a man
[A7]Honey, let me be your salty dog
[D7]Let me be your salty [G]dog
{end_of_section}

{chorus}
`),
  chart('pig-in-a-pen', ['standard'], `
{title: Pig in a Pen}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]I got a pig at home in a pen
[G]Corn to feed him on
[C]All I need is a pretty little girl
[D7]To feed him when I'm [G]gone
{end_of_section}

{start_of_section: Verse 2}
[G]Going on the mountain to sow some cane
[G]Raise a barrel of corn
[C]Quit this woman, sing a little song
[D7]And cook a little sugar in my [G]pan
{end_of_section}

{start_of_section: Verse 3}
[G]I been all around this whole round world
[G]Honey, I just got back today
[C]If I live and don't get killed
[D7]I'll be back this [G]way
{end_of_section}

{start_of_section: Chorus}
[G]How can I go squirrel hunting
[G]When the meat won't fry
[C]How can I live with the pretty little girl
[D7]If she won't tell me [G]why
{end_of_section}
`),
  chart('sweet-babys-arms', ['standard', 'breakdown'], `
{title: Roll in My Sweet Baby's Arms}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 124}
{feel: boom-chuck}

{start_of_section: Chorus}
[G]Roll in my sweet baby's arms
[G]Roll in my sweet baby's arms
[C]Lay around the shack till the mail train comes back
[D7]Then I'll roll in my sweet baby's [G]arms
{end_of_section}

{start_of_section: Verse 1}
[G]I ain't gonna work on the railroad
[G]Ain't gonna work on the farm
[C]Lay around the shack till the mail train comes back
[D7]Then I'll roll in my sweet baby's [G]arms
{end_of_section}

{start_of_section: Verse 2}
[G]Now where were you last Friday night
[G]While I was lying in jail
[C]Walking the streets with another man
[D7]Wouldn't even go my [G]bail
{end_of_section}

{start_of_section: Verse 3}
[G]Mama was a beauty operator
[G]Sister could weave and spin
[C]Daddy owned an interest in the old cotton mill
[D7]Watch that money roll [G]in
{end_of_section}

{chorus}
`),
  chart('omie-wise', ['ballad'], `
{title: Omie Wise}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 96}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]I'll tell you a story of little Omie Wise
[G]How she was deluded by John Lewis's lies
[C]He told her to meet him at Adams's spring
[D7]He promised her money and other fine [G]things
{end_of_section}

{start_of_section: Verse 2}
[G]He brought her no money but flattered the case
[G]Saying we will get married and it will be no disgrace
[C]Jump up behind me and away we will go
[D7]We will go and get married and no one will [G]know
{end_of_section}

{start_of_section: Verse 3}
[G]She jumped up behind him and away they did go
[G]Down to the river where the deep waters flow
[C]John Lewis, John Lewis, won't you tell me your mind
[D7]Do you intend to marry me or leave me [G]behind
{end_of_section}

{start_of_section: Verse 4}
[G]Little Omie, little Omie, I'll tell you my mind
[G]My mind is to drown you and leave you behind
[C]Have mercy, have mercy, don't murder me here
[D7]I'm not prepared for eternity [G]here
{end_of_section}

{start_of_section: Verse 5}
[G]He kicked her and he cuffed her to the worst understand
[G]He threw her in the river below the mill dam
[C]Now Omie is missing as you all may know
[D7]And down to the river a-hunting we'll [G]go
{end_of_section}
`),
  chart('willow-garden', ['ballad'], `
{title: Down in the Willow Garden}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Down in the willow garden where me and my love did meet
[G]As we sat a-courting, my love dropped off to sleep
[C]I had a bottle of burgundy wine which my true love did not know
[D7]And so I poisoned that dear little girl down on the banks [G]below
{end_of_section}

{start_of_section: Verse 2}
[G]I stabbed her with a sabre which was a bloody knife
[G]I threw her in the river, it was a dreadful sight
[C]My father often told me that money would set me free
[D7]If I would murder that dear little girl whose name was Rose [G]Connolly
{end_of_section}

{start_of_section: Verse 3}
[G]My father sits at his cabin door wiping his tear-dimmed eyes
[G]His own dear son to be hung upon the scaffold high
[C]My race is run beneath the sun, hell's gates are waiting for me
[D7]For I did murder that dear little girl whose name was Rose [G]Connolly
{end_of_section}
`),
  chart('jesse-james', ['ballad'], `
{title: Jesse James}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Jesse James was a lad that killed many a man
[G]He robbed the Danville train
[C]But that dirty little coward that shot Mr. Howard
[D7]Has laid poor Jesse in his [G]grave
{end_of_section}

{start_of_section: Chorus}
[G]Jesse had a wife to mourn for his life
[G]Three children, they were brave
[C]But that dirty little coward that shot Mr. Howard
[D7]Has laid poor Jesse in his [G]grave
{end_of_section}

{start_of_section: Verse 2}
[G]It was Robert Ford, that dirty little coward
[G]I wonder how he does feel
[C]For he ate of Jesse's bread and he slept in Jesse's bed
[D7]Then he laid poor Jesse in his [G]grave
{end_of_section}

{start_of_section: Verse 3}
[G]Jesse was a man, a friend to the poor
[G]He'd never see a man suffer pain
[C]And with his brother Frank he robbed the Gallatin bank
[D7]And stopped the Glendale [G]train
{end_of_section}

{start_of_section: Verse 4}
[G]It was on a Saturday night, Jesse was at home
[G]Talking with his family brave
[C]Robert Ford came along like a thief in the night
[D7]And laid poor Jesse in his [G]grave
{end_of_section}

{chorus}
`),
  chart('john-hardy', ['ballad'], `
{title: John Hardy}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]John Hardy was a desperate little man
[G]He carried two guns every day
[C]He shot a man on the West Virginia line
[D7]And you ought to seen John Hardy get [G]away
{end_of_section}

{start_of_section: Verse 2}
[G]John Hardy stood at the gambling table
[G]Didn't have a nickel to his name
[C]Along come a yellow gal threw a dollar down
[D7]Said deal John Hardy in the [G]game
{end_of_section}

{start_of_section: Verse 3}
[G]John Hardy was standing in the dice room door
[G]He didn't have a nickel to his name
[C]He said I've been the death of many a poor boy
[D7]And the death of me won't be no [G]shame
{end_of_section}

{start_of_section: Verse 4}
[G]They've got John Hardy back in the jailhouse
[G]The jailer he treats him well
[C]He's got a girl in the white folks' yard
[D7]She walks him to the station [G]cell
{end_of_section}

{start_of_section: Verse 5}
[G]I've been to the east and I've been to the west
[G]I've been this wide world round
[C]I've been to the river and I've been baptized
[D7]And now I'm on my hanging [G]ground
{end_of_section}
`),
  chart('frankie-and-johnny', ['ballad'], `
{title: Frankie and Johnny}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 104}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Frankie and Johnny were lovers
[G]Oh lordy how they could love
[C]They swore to be true to each other
[D7]Just as true as the stars [G]above
[G]He was her man but he was doing her [D7]wrong
{end_of_section}

{start_of_section: Verse 2}
[G]Frankie went down to the corner
[G]To buy a bucket of beer
[C]She said Mr. Bartender
[D7]Has my loving Johnny been [G]here
[G]He was her man but he was doing her [D7]wrong
{end_of_section}

{start_of_section: Verse 3}
[G]I don't want to cause you no trouble
[G]I ain't gonna tell you no lie
[C]I saw your man an hour ago
[D7]With a girl named Alice [G]Bly
[G]He was your man but he was doing you [D7]wrong
{end_of_section}

{start_of_section: Verse 4}
[G]Frankie looked over the transom
[G]And there to her surprise
[C]There on a couch sat Johnny
[D7]Making love to Alice [G]Bly
[G]He was her man but he was doing her [D7]wrong
{end_of_section}

{start_of_section: Verse 5}
[G]Frankie drew back her kimono
[G]She pulled out her little forty-four
[C]Root-a-toot-toot three times she shot
[D7]Right through that hardwood [G]door
[G]She shot her man because he was doing her [D7]wrong
{end_of_section}
`),
  chart('old-97', ['ballad', 'standard'], `
{title: Wreck of the Old 97}
{artist: Traditional, melody from The Ship That Never Returned, 1865 (public domain)}
{key: C}
{time: 4/4}
{tempo: 120}
{feel: boom-chuck}

{start_of_section: Verse 1}
[C]They gave him his orders at Monroe, Virginia
[C]Saying Steve, you're way behind time
[F]This is not Thirty-Eight, it's Old Ninety-Seven
[G7]You must put her into Spencer on [C]time
{end_of_section}

{start_of_section: Verse 2}
[C]He turned and he said to his black greasy fireman
[C]Just shovel in a little more coal
[F]And when we cross that White Oak Mountain
[G7]You can watch Old Ninety-Seven [C]roll
{end_of_section}

{start_of_section: Verse 3}
[C]It's a mighty rough road from Lynchburg to Danville
[C]And a line on a three-mile grade
[F]It was on that grade that he lost his air brakes
[G7]You can see what a jump he [C]made
{end_of_section}

{start_of_section: Verse 4}
[C]He was going down the grade making ninety miles an hour
[C]When his whistle broke into a scream
[F]He was found in the wreck with his hand on the throttle
[G7]Scalded to death by the [C]steam
{end_of_section}

{start_of_section: Verse 5}
[C]Now ladies, you must take warning
[C]From this time now and on
[F]Never speak harsh words to your true loving husband
[G7]He may leave you and never return [C]home
{end_of_section}
`),
  chart('rising-sun', ['ballad', 'minor'], `
{title: The House of the Rising Sun}
{artist: Traditional (public domain)}
{key: Am}
{time: 4/4}
{tempo: 92}
{feel: boom-chuck}

{start_of_section: Verse 1}
[Am]There is a house in New Orleans
[C]They call the Rising Sun
[D]And it's been the ruin of many a poor boy
[F]And God, I know I'm [Am]one
{end_of_section}

{start_of_section: Verse 2}
[Am]My mother was a tailor
[C]She sewed my new blue jeans
[D]My father was a gambling man
[F]Down in New [Am]Orleans
{end_of_section}

{start_of_section: Verse 3}
[Am]Now the only thing a gambler needs
[C]Is a suitcase and a trunk
[D]And the only time he's satisfied
[F]Is when he's on a [Am]drunk
{end_of_section}

{start_of_section: Verse 4}
[Am]Oh mother, tell your children
[C]Not to do what I have done
[D]Spend your lives in sin and misery
[F]In the House of the Rising [Am]Sun
{end_of_section}

{start_of_section: Verse 5}
[Am]I'm going back to New Orleans
[C]My race is almost run
[D]I'm going back to end my life
[F]Down in the Rising [Am]Sun
{end_of_section}

{start_of_section: Verse 6}
[Am]There is a house in New Orleans
[C]They call the Rising Sun
[D]And it's been the ruin of many a poor boy
[F]And God, I know I'm [Am]one
{end_of_section}
`),
  chart('the-cuckoo', ['ballad', 'modal', 'minor'], `
{title: The Cuckoo}
{artist: Traditional (public domain)}
{key: Am}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[Am]Oh the cuckoo, she's a pretty bird
[C]She warbles as she flies
[Am]She never hollers cuckoo
[G]Till the fourth day of [Am]July
{end_of_section}

{start_of_section: Verse 2}
[Am]Gonna build me a log cabin
[C]On a mountain so high
[Am]So I can see Willie
[G]As she goes on [Am]by
{end_of_section}

{start_of_section: Verse 3}
[Am]Jack of diamonds, jack of diamonds
[C]I know you of old
[Am]You robbed my poor pockets
[G]Of my silver and my [Am]gold
{end_of_section}

{start_of_section: Verse 4}
[Am]My horses ain't hungry
[C]They won't eat your hay
[Am]I'll drive on a little farther
[G]I'll feed them on the [Am]way
{end_of_section}
`),
  chart('cluck-old-hen', ['fiddle-tune', 'modal'], `
{title: Cluck Old Hen}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[A]Cluck old hen, cluck and sing
[A]You ain't laid an egg since way last spring
[A]Cluck old hen, cluck and squall
[G]You ain't laid an egg since way last [A]fall
{end_of_section}

{start_of_section: Verse 2}
[A]My old hen's a good old hen
[A]She lays eggs for the railroad men
[A]Sometimes one, sometimes two
[G]Sometimes enough for the whole damn [A]crew
{end_of_section}

{start_of_section: Verse 3}
[A]Cluck old hen, cluck all around
[A]The next egg she lays gonna be in town
[A]Cluck old hen, cluck I say
[G]If you don't lay an egg gonna give you [A]away
{end_of_section}
`),
  chart('white-house-blues', ['breakdown'], `
{title: White House Blues}
{artist: Traditional (public domain)}
{key: C}
{time: 4/4}
{tempo: 130}
{feel: boom-chuck}

{start_of_section: Verse 1}
[C]McKinley hollered, McKinley squalled
[C]Doc said McKinley, I can't find that ball
[F]From Buffalo to Washington
[G7]He's been a long time [C]gone
{end_of_section}

{start_of_section: Verse 2}
[C]Roosevelt's in the White House doing his best
[C]McKinley's in the graveyard taking his rest
[F]He's gone a long long time
[G7]He's been a long time [C]gone
{end_of_section}

{start_of_section: Verse 3}
[C]Hush up little children, now don't you fret
[C]You'll draw a pension at your papa's death
[F]From Buffalo to Washington
[G7]He's been a long time [C]gone
{end_of_section}

{start_of_section: Verse 4}
[C]Look here, little children, don't you fret
[C]Roosevelt in the White House, he's doing his best
[F]He's gone, long gone
[G7]He's been a long time [C]gone
{end_of_section}
`),
  chart('molly-and-tenbrooks', ['breakdown'], `
{title: Molly and Tenbrooks}
{artist: Traditional (public domain)}
{key: A}
{time: 4/4}
{tempo: 132}
{feel: boom-chuck}

{start_of_section: Verse 1}
[A]Run O Molly run, run O Molly run
[A]Tenbrooks gonna beat you to the bright shining sun
[D]Run O Molly run, run O Molly run
[E]Tenbrooks gonna beat you to the bright shining [A]sun
{end_of_section}

{start_of_section: Verse 2}
[A]Tenbrooks was a bay horse, long and tall
[A]He ran like a rabbit and he flew like a squirrel
[D]Tenbrooks was a bay, long and tall
[E]He ran like a rabbit and he flew like a [A]squirrel
{end_of_section}

{start_of_section: Verse 3}
[A]Out in California where Molly done as she pleased
[A]Come back to old Kentucky, got beat with all ease
[D]Out in California Molly done as she pleased
[E]Come back to Kentucky, got beat with all [A]ease
{end_of_section}

{start_of_section: Verse 4}
[A]The women all a-laughing and the children all a-crying
[A]The men all a-hollering, old Tenbrooks a-flying
[D]Women all a-laughing, children all a-crying
[E]Men all a-hollering, old Tenbrooks a-[A]flying
{end_of_section}
`),
  chart('sitting-on-top', ['blues', 'standard'], `
{title: Sitting on Top of the World}
{artist: Walter Vinson and Lonnie Chatmon, 1930 (public domain)}
{key: G}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Was in the spring, one sunny day
[G]My good gal left me, Lord she went away
[C]And now she's gone and I don't worry
[G]Lord I'm sitting on top of the [D7]world
{end_of_section}

{start_of_section: Verse 2}
[G]Worked all the summer and all the fall
[G]Had to take Christmas in my overalls
[C]And now she's gone and I don't worry
[G]Lord I'm sitting on top of the [D7]world
{end_of_section}

{start_of_section: Verse 3}
[G]Going down to the station, down in the yard
[G]Gonna catch me a freight train, work done got hard
[C]And now she's gone and I don't worry
[G]Lord I'm sitting on top of the [D7]world
{end_of_section}

{start_of_section: Verse 4}
[G]The lonesome days they have gone by
[G]Why should I beg her, I'd rather die
[C]And now she's gone and I don't worry
[G]Lord I'm sitting on top of the [D7]world
{end_of_section}
`),
  chart('columbus-stockade', ['ballad', 'standard'], `
{title: Columbus Stockade Blues}
{artist: Thomas Darby, 1927 (public domain)}
{key: G}
{time: 4/4}
{tempo: 104}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Way down in Columbus, Georgia
[G]Want to be back in Tennessee
[C]Way down in Columbus stockade
[D7]My friends have turned their backs on [G]me
{end_of_section}

{start_of_section: Chorus}
[G]Go and leave me if you wish to
[G]Never let me cross your mind
[C]If in your heart you love another
[D7]Leave me darling, I don't [G]mind
{end_of_section}

{start_of_section: Verse 2}
[G]Last night as I lay sleeping
[G]I dreamed I held you in my arms
[C]When I awoke I was mistaken
[D7]I was peering through the [G]bars
{end_of_section}

{chorus}
`),
  chart('walking-cane', ['standard'], `
{title: Hand Me Down My Walking Cane}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 116}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Hand me down my walking cane
[G]Hand me down my walking cane
[C]Hand me down my walking cane
[G]Gonna leave on the midnight train
[D7]All my sins are taken [G]away
{end_of_section}

{start_of_section: Verse 2}
[G]Hand me down my bottle of corn
[G]Hand me down my bottle of corn
[C]Hand me down my bottle of corn
[G]Gonna get drunk as sure as you're born
[D7]All my sins are taken [G]away
{end_of_section}

{start_of_section: Verse 3}
[G]Oh I got drunk and I landed in jail
[G]Oh I got drunk and I landed in jail
[C]Oh I got drunk and I landed in jail
[G]Had nobody to go my bail
[D7]All my sins are taken [G]away
{end_of_section}

{start_of_section: Verse 4}
[G]If I die, just bury me deep
[G]If I die, just bury me deep
[C]If I die, just bury me deep
[G]Place a bottle at my head and my feet
[D7]All my sins are taken [G]away
{end_of_section}
`),
  chart('little-birdie', ['modal', 'ballad'], `
{title: Little Birdie}
{artist: Traditional (public domain)}
{key: G}
{time: 4/4}
{tempo: 118}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Little birdie, little birdie
[G]Come and sing me your song
[C]I've a short time to be here
[D7]And a long time to be [G]gone
{end_of_section}

{start_of_section: Verse 2}
[G]Little birdie, little birdie
[G]What makes you fly so high
[C]It's because I am a true little bird
[D7]And I do not fear to [G]die
{end_of_section}

{start_of_section: Verse 3}
[G]It's once I had an old true love
[G]I loved her as my life
[C]Along come a city slicker
[D7]And he's stole away my [G]wife
{end_of_section}

{start_of_section: Verse 4}
[G]Go on, go on, little birdie
[G]And sing your sweetest song
[C]For I have a short time to be here
[D7]And a long time to be [G]gone
{end_of_section}
`),
  chart('shady-grove', ['modal', 'minor', 'standard'], `
{title: Shady Grove}
{artist: Traditional (public domain)}
{key: Am}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[Am]Shady Grove, my little love
[Am]Shady Grove, I know
[C]Shady Grove, my little love
[G]I'm bound for Shady [Am]Grove
{end_of_section}

{start_of_section: Verse 2}
[Am]Cheeks as red as a blooming rose
[Am]Eyes of the deepest brown
[C]You are the darling of my heart
[G]Stay till the sun goes [Am]down
{end_of_section}

{start_of_section: Verse 3}
[Am]Went to see my Shady Grove
[Am]She was standing in the door
[C]Shoes and stockings in her hand
[G]Little bare feet on the [Am]floor
{end_of_section}

{start_of_section: Verse 4}
[Am]Wish I had a big fine horse
[Am]Corn to feed him on
[C]Shady Grove to stay at home
[G]And feed him when I'm [Am]gone
{end_of_section}

{start_of_section: Verse 5}
[Am]A kiss from pretty little Shady Grove
[Am]Is sweet as brandy wine
[C]And there ain't no girl in this old world
[G]That's prettier than [Am]mine
{end_of_section}
`),
];
