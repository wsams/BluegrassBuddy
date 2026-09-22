function chart(id, tags, body) {
  return { id, tags, chart: body.trim() };
}

export const GOSPEL = [
  chart('circle-be-unbroken', ['gospel', 'standard'], `
{title: Will the Circle Be Unbroken}
{artist: Ada R. Habershon and Charles H. Gabriel, 1907 (public domain)}
{key: G}
{time: 4/4}
{tempo: 108}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]There are loved ones in the glory
[G]Whose dear forms you often miss
[C]When you close your earthly story
[D7]Will you join them in their [G]bliss
{end_of_section}

{start_of_section: Chorus}
[G]Will the circle be unbroken
[G]By and by, by and by
[C]In a better home awaiting
[D7]In the sky, in the [G]sky
{end_of_section}

{start_of_section: Verse 2}
[G]In the joyous days of childhood
[G]Oft they told of wondrous love
[C]Pointed to the dying Saviour
[D7]Now they dwell with him [G]above
{end_of_section}

{start_of_section: Verse 3}
[G]You remember songs of heaven
[G]Which you sang with childish voice
[C]Do you love the hymns they taught you
[D7]Or are songs of earth your [G]choice
{end_of_section}

{start_of_section: Verse 4}
[G]You can picture happy gatherings
[G]Round the fireside long ago
[C]And you think of tearful partings
[D7]When they left you here [G]below
{end_of_section}

{start_of_section: Verse 5}
[G]One by one their seats were emptied
[G]One by one they went away
[C]Now the family is parted
[D7]Will it be complete one [G]day
{end_of_section}

{chorus}
`),
  chart('amazing-grace', ['gospel', 'waltz'], `
{title: Amazing Grace}
{artist: John Newton, 1779 (public domain)}
{key: G}
{time: 3/4}
{tempo: 86}
{feel: waltz}

{start_of_section: Verse 1}
[G]Amazing grace, how [G]sweet the [C]sound
[G]That saved a [D7]wretch like [G]me
[G]I once was lost, but [G]now am [C]found
[G]Was blind, but [D7]now I [G]see
{end_of_section}

{start_of_section: Verse 2}
[G]'Twas grace that taught my [G]heart to [C]fear
[G]And grace my [D7]fears [G]relieved
[G]How precious did that [G]grace [C]appear
[G]The hour I [D7]first [G]believed
{end_of_section}

{start_of_section: Verse 3}
[G]Through many dangers, [G]toils, and [C]snares
[G]I have [D7]already [G]come
[G]'Tis grace hath brought me [G]safe thus [C]far
[G]And grace will [D7]lead me [G]home
{end_of_section}

{start_of_section: Verse 4}
[G]The Lord has promised [G]good to [C]me
[G]His word my [D7]hope [G]secures
[G]He will my shield and [G]portion [C]be
[G]As long as [D7]life [G]endures
{end_of_section}

{start_of_section: Verse 5}
[G]Yea, when this flesh and [G]heart shall [C]fail
[G]And mortal [D7]life shall [G]cease
[G]I shall possess [G]within the [C]veil
[G]A life of [D7]joy and [G]peace
{end_of_section}

{start_of_section: Verse 6}
[G]When we've been there ten [G]thousand [C]years
[G]Bright shining [D7]as the [G]sun
[G]We've no less days to [G]sing God's [C]praise
[G]Than when we'd [D7]first [G]begun
{end_of_section}
`),
  chart('angel-band', ['gospel', 'waltz'], `
{title: Angel Band}
{artist: Jefferson Hascall and William Bradbury, 1860 (public domain)}
{key: G}
{time: 3/4}
{tempo: 80}
{feel: waltz}

{start_of_section: Verse 1}
[G]My latest sun is [G]sinking [C]fast
My [G]race is [D7]nearly [G]run
[G]My strongest trials [G]now are [C]past
[G]My triumph [D7]is [G]begun
{end_of_section}

{start_of_section: Chorus}
[G]Oh come, angel [G]band
[C]Come and [G]around me stand
[G]Oh bear me away on your [G]snowy wings
To my [D7]immortal [G]home
{end_of_section}

{start_of_section: Verse 2}
[G]I know I'm nearing [G]the holy [C]ranks
Of [G]friends and [D7]kindred [G]dear
[G]I brush the dew on [G]Jordan's [C]banks
The [G]crossing [D7]must be [G]near
{end_of_section}

{start_of_section: Verse 3}
[G]I've almost gained my [G]heavenly [C]home
My [G]spirit [D7]loudly [G]sings
[G]The holy ones, [G]behold they [C]come
I [G]hear the [D7]noise of [G]wings
{end_of_section}

{chorus}
`),
  chart('swing-low', ['gospel', 'standard'], `
{title: Swing Low, Sweet Chariot}
{artist: Traditional spiritual (public domain)}
{key: G}
{time: 4/4}
{tempo: 92}
{feel: boom-chuck}

{start_of_section: Chorus}
[G]Swing low, sweet [G]chariot
[C]Coming for to carry me [G]home
[G]Swing low, sweet [G]chariot
[D7]Coming for to carry me [G]home
{end_of_section}

{start_of_section: Verse 1}
[G]I looked over Jordan and [G]what did I see
[C]Coming for to carry me [G]home
[G]A band of angels [G]coming after me
[D7]Coming for to carry me [G]home
{end_of_section}

{start_of_section: Verse 2}
[G]If you get there [G]before I do
[C]Coming for to carry me [G]home
[G]Tell all my friends I'm [G]coming too
[D7]Coming for to carry me [G]home
{end_of_section}

{start_of_section: Verse 3}
[G]I'm sometimes up and [G]sometimes down
[C]Coming for to carry me [G]home
[G]But still my soul feels [G]heavenly bound
[D7]Coming for to carry me [G]home
{end_of_section}

{chorus}
`),
  chart('wayfaring-stranger', ['gospel', 'ballad', 'minor'], `
{title: Wayfaring Stranger}
{artist: Traditional (public domain)}
{key: Am}
{time: 4/4}
{tempo: 84}
{feel: boom-chuck}

{start_of_section: Verse 1}
[Am]I am a poor wayfaring stranger
[Dm]Traveling through this world of [Am]woe
[Am]Yet there's no sickness, toil, nor danger
[E7]In that bright land to which I [Am]go
{end_of_section}

{start_of_section: Chorus}
[Am]I'm going there to see my father
[Dm]I'm going there no more to [Am]roam
[Am]I'm only going over Jordan
[E7]I'm only going over [Am]home
{end_of_section}

{start_of_section: Verse 2}
[Am]I know dark clouds will gather round me
[Dm]I know my way is rough and [Am]steep
[Am]Yet beauteous fields lie just before me
[E7]Where God's redeemed their vigils [Am]keep
{end_of_section}

{start_of_section: Verse 3}
[Am]I'll soon be free from every trial
[Dm]My body sleep in the churchyard [Am]sod
[Am]I'll drop the cross of self-denial
[E7]And enter on my home with [Am]God
{end_of_section}

{chorus}
`),
  chart('unclouded-day', ['gospel'], `
{title: The Unclouded Day}
{artist: Josiah K. Alwood, 1880 (public domain)}
{key: G}
{time: 4/4}
{tempo: 104}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Oh they tell me of a home far beyond the skies
[G]Oh they tell me of a home far away
[C]Oh they tell me of a home where no storm clouds rise
[D7]Oh they tell me of an unclouded [G]day
{end_of_section}

{start_of_section: Chorus}
[G]Oh the land of cloudless day
[G]Oh the land of an unclouded sky
[C]Oh they tell me of a home where no storm clouds rise
[D7]Oh they tell me of an unclouded [G]day
{end_of_section}

{start_of_section: Verse 2}
[G]Oh they tell me of a home where my friends have gone
[G]Oh they tell me of that land far away
[C]Where the tree of life in eternal bloom
[D7]Sheds its fragrance through the unclouded [G]day
{end_of_section}

{start_of_section: Verse 3}
[G]Oh they tell me of a King in his beauty there
[G]And they tell me that mine eyes shall behold
[C]Where he sits on the throne that is whiter than snow
[D7]In the city that is made of [G]gold
{end_of_section}

{start_of_section: Verse 4}
[G]Oh they tell me that he smiles on his children there
[G]And his smile drives their sorrows away
[C]And they tell me that no tears ever come again
[D7]In that lovely land of unclouded [G]day
{end_of_section}

{chorus}
`),
  chart('everlasting-arms', ['gospel'], `
{title: Leaning on the Everlasting Arms}
{artist: Elisha Hoffman and Anthony Showalter, 1887 (public domain)}
{key: G}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]What a fellowship, what a joy divine
[C]Leaning on the everlasting [G]arms
[G]What a blessedness, what a peace is mine
[D7]Leaning on the everlasting [G]arms
{end_of_section}

{start_of_section: Chorus}
[G]Leaning, leaning
[C]Safe and secure from all [G]alarms
[G]Leaning, leaning
[D7]Leaning on the everlasting [G]arms
{end_of_section}

{start_of_section: Verse 2}
[G]Oh how sweet to walk in this pilgrim way
[C]Leaning on the everlasting [G]arms
[G]Oh how bright the path grows from day to day
[D7]Leaning on the everlasting [G]arms
{end_of_section}

{start_of_section: Verse 3}
[G]What have I to dread, what have I to fear
[C]Leaning on the everlasting [G]arms
[G]I have blessed peace with my Lord so near
[D7]Leaning on the everlasting [G]arms
{end_of_section}

{chorus}
`),
  chart('sweet-by-and-by', ['gospel', 'waltz'], `
{title: In the Sweet By and By}
{artist: Sanford Bennett and Joseph Webster, 1868 (public domain)}
{key: G}
{time: 3/4}
{tempo: 92}
{feel: waltz}

{start_of_section: Verse 1}
[G]There's a land that is fairer than day
[C]And by faith we can see it [G]afar
[G]For the Father waits over the way
[D7]To prepare us a dwelling place [G]there
{end_of_section}

{start_of_section: Chorus}
[G]In the sweet by and by
[C]We shall meet on that beautiful [G]shore
[G]In the sweet by and by
[D7]We shall meet on that beautiful [G]shore
{end_of_section}

{start_of_section: Verse 2}
[G]We shall sing on that beautiful shore
[C]The melodious songs of the [G]blest
[G]And our spirits shall sorrow no more
[D7]Not a sigh for the blessing of [G]rest
{end_of_section}

{start_of_section: Verse 3}
[G]To our bountiful Father above
[C]We will offer our tribute of [G]praise
[G]For the glorious gift of his love
[D7]And the blessings that hallow our [G]days
{end_of_section}

{chorus}
`),
  chart('gather-at-the-river', ['gospel'], `
{title: Shall We Gather at the River}
{artist: Robert Lowry, 1864 (public domain)}
{key: G}
{time: 4/4}
{tempo: 96}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Shall we gather at the river
[G]Where bright angel feet have trod
[C]With its crystal tide forever
[D7]Flowing by the throne of [G]God
{end_of_section}

{start_of_section: Chorus}
[G]Yes, we'll gather at the river
[G]The beautiful, the beautiful river
[C]Gather with the saints at the river
[D7]That flows by the throne of [G]God
{end_of_section}

{start_of_section: Verse 2}
[G]On the margin of the river
[G]Washing up its silver spray
[C]We will walk and worship ever
[D7]All the happy golden [G]day
{end_of_section}

{start_of_section: Verse 3}
[G]Ere we reach the shining river
[G]Lay we every burden down
[C]Grace our spirits will deliver
[D7]And provide a robe and [G]crown
{end_of_section}

{start_of_section: Verse 4}
[G]Soon we'll reach the shining river
[G]Soon our pilgrimage will cease
[C]Soon our happy hearts will quiver
[D7]With the melody of [G]peace
{end_of_section}

{chorus}
`),
  chart('what-a-friend', ['gospel'], `
{title: What a Friend We Have in Jesus}
{artist: Joseph Scriven and Charles Converse, 1855 (public domain)}
{key: G}
{time: 4/4}
{tempo: 88}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]What a friend we have in Jesus
[G]All our sins and griefs to bear
[C]What a privilege to carry
[D7]Everything to God in [G]prayer
[G]Oh what peace we often forfeit
[G]Oh what needless pain we bear
[C]All because we do not carry
[D7]Everything to God in [G]prayer
{end_of_section}

{start_of_section: Verse 2}
[G]Have we trials and temptations
[G]Is there trouble anywhere
[C]We should never be discouraged
[D7]Take it to the Lord in [G]prayer
[G]Can we find a friend so faithful
[G]Who will all our sorrows share
[C]Jesus knows our every weakness
[D7]Take it to the Lord in [G]prayer
{end_of_section}

{start_of_section: Verse 3}
[G]Are we weak and heavy laden
[G]Cumbered with a load of care
[C]Precious Saviour, still our refuge
[D7]Take it to the Lord in [G]prayer
[G]Do thy friends despise, forsake thee
[G]Take it to the Lord in prayer
[C]In his arms he'll take and shield thee
[D7]Thou wilt find a solace [G]there
{end_of_section}
`),
  chart('farther-along', ['gospel'], `
{title: Farther Along}
{artist: W. B. Stevens and W. A. Fletcher, 1911 (public domain)}
{key: G}
{time: 4/4}
{tempo: 96}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Tempted and tried, we're oft made to wonder
[G]Why it should be thus all the day long
[C]While there are others living about us
[D7]Never molested, though in the [G]wrong
{end_of_section}

{start_of_section: Chorus}
[G]Farther along we'll know all about it
[G]Farther along we'll understand why
[C]Cheer up my brother, live in the sunshine
[D7]We'll understand it all by and [G]by
{end_of_section}

{start_of_section: Verse 2}
[G]When death has come and taken our loved ones
[G]It leaves our home so lonely and drear
[C]Then do we wonder why others prosper
[D7]Living so wicked year after [G]year
{end_of_section}

{start_of_section: Verse 3}
[G]Faithful till death, said our loving Master
[G]A few more days to labor and wait
[C]Toils of the road will then seem as nothing
[D7]As we sweep through the beautiful [G]gate
{end_of_section}

{chorus}
`),
  chart('lifes-railway', ['gospel'], `
{title: Life's Railway to Heaven}
{artist: M. E. Abbey and Charles Tillman, 1890 (public domain)}
{key: G}
{time: 4/4}
{tempo: 100}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]Life is like a mountain railroad
[G]With an engineer that's brave
[C]We must make the run successful
[D7]From the cradle to the [G]grave
[G]Watch the curves, the fills, the tunnels
[G]Never falter, never fail
[C]Keep your hand upon the throttle
[D7]And your eye upon the [G]rail
{end_of_section}

{start_of_section: Chorus}
[G]Blessed Saviour, thou wilt guide us
[G]Till we reach that blissful shore
[C]Where the angels wait to join us
[D7]In thy praise [G]forevermore
{end_of_section}

{start_of_section: Verse 2}
[G]You will roll up grades of trial
[G]You will cross the bridge of strife
[C]See that Christ is your conductor
[D7]On this lightning train of [G]life
[G]Always mindful of obstruction
[G]Do your duty, never fail
[C]Keep your hand upon the throttle
[D7]And your eye upon the [G]rail
{end_of_section}

{start_of_section: Verse 3}
[G]As you roll across the trestle
[G]Spanning Jordan's swelling tide
[C]You behold the union depot
[D7]Into which your train will [G]glide
[G]There you'll meet the superintendent
[G]God the Father, God the Son
[C]With the hearty joyous plaudit
[D7]Weary pilgrim, welcome [G]home
{end_of_section}

{chorus}
`),
  chart('precious-memories', ['gospel', 'waltz'], `
{title: Precious Memories}
{artist: J. B. F. Wright, 1925 (public domain)}
{key: G}
{time: 3/4}
{tempo: 84}
{feel: waltz}

{start_of_section: Verse 1}
[G]Precious memories, unseen angels
[C]Sent from somewhere to my [G]soul
[G]How they linger, ever near me
[D7]And the sacred past [G]unfold
{end_of_section}

{start_of_section: Chorus}
[G]Precious memories, how they linger
[C]How they ever flood my [G]soul
[G]In the stillness of the midnight
[D7]Precious sacred scenes [G]unfold
{end_of_section}

{start_of_section: Verse 2}
[G]Precious father, loving mother
[C]Fly across the lonely [G]years
[G]And old home scenes of my childhood
[D7]In fond memory [G]appear
{end_of_section}

{start_of_section: Verse 3}
[G]In the stillness of the midnight
[C]Echoes from the past I [G]hear
[G]Old-time singing, gladness bringing
[D7]From that lovely land [G]somewhere
{end_of_section}

{start_of_section: Verse 4}
[G]As I travel on life's pathway
[C]Know not what the years may [G]hold
[G]As I ponder, hope grows fonder
[D7]Precious memories flood my [G]soul
{end_of_section}

{chorus}
`),
  chart('softly-and-tenderly', ['gospel', 'waltz'], `
{title: Softly and Tenderly}
{artist: Will Thompson, 1880 (public domain)}
{key: G}
{time: 3/4}
{tempo: 80}
{feel: waltz}

{start_of_section: Verse 1}
[G]Softly and tenderly Jesus is calling
[C]Calling for you and for [G]me
[G]See, on the portals he's waiting and watching
[D7]Watching for you and for [G]me
{end_of_section}

{start_of_section: Chorus}
[G]Come home, come home
[C]Ye who are weary, come [G]home
[G]Earnestly, tenderly, Jesus is calling
[D7]Calling, O sinner, come [G]home
{end_of_section}

{start_of_section: Verse 2}
[G]Why should we tarry when Jesus is pleading
[C]Pleading for you and for [G]me
[G]Why should we linger and heed not his mercies
[D7]Mercies for you and for [G]me
{end_of_section}

{start_of_section: Verse 3}
[G]Time is now fleeting, the moments are passing
[C]Passing from you and from [G]me
[G]Shadows are gathering, deathbeds are coming
[D7]Coming for you and for [G]me
{end_of_section}

{start_of_section: Verse 4}
[G]Oh for the wonderful love he has promised
[C]Promised for you and for [G]me
[G]Though we have sinned, he has mercy and pardon
[D7]Pardon for you and for [G]me
{end_of_section}

{chorus}
`),
  chart('roll-call', ['gospel'], `
{title: When the Roll Is Called Up Yonder}
{artist: James M. Black, 1893 (public domain)}
{key: G}
{time: 4/4}
{tempo: 104}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]When the trumpet of the Lord shall sound and time shall be no more
[C]When the morning breaks eternal, bright and [G]fair
[G]When the saved of earth shall gather over on the other shore
[D7]And the roll is called up yonder I'll be [G]there
{end_of_section}

{start_of_section: Chorus}
[G]When the roll is called up yonder
[G]When the roll is called up yonder
[C]When the roll is called up yonder
[D7]When the roll is called up yonder I'll be [G]there
{end_of_section}

{start_of_section: Verse 2}
[G]On that bright and cloudless morning when the dead in Christ shall rise
[C]And the glory of his resurrection [G]share
[G]When his chosen ones shall gather to their home beyond the skies
[D7]And the roll is called up yonder I'll be [G]there
{end_of_section}

{start_of_section: Verse 3}
[G]Let us labor for the Master from the dawn till setting sun
[C]Let us talk of all his wondrous love and [G]care
[G]Then when all of life is over and our work on earth is done
[D7]And the roll is called up yonder I'll be [G]there
{end_of_section}

{chorus}
`),
  chart('sunny-side', ['gospel', 'standard'], `
{title: Keep on the Sunny Side}
{artist: Ada Blenkhorn and J. Howard Entwisle, 1899 (public domain)}
{key: G}
{time: 4/4}
{tempo: 112}
{feel: boom-chuck}

{start_of_section: Verse 1}
[G]There's a dark and a troubled side of life
[G]There's a bright and a sunny side too
[C]Though we meet with the darkness and strife
[D7]The sunny side we also may [G]view
{end_of_section}

{start_of_section: Chorus}
[G]Keep on the sunny side, always on the sunny side
[C]Keep on the sunny side of life
[G]It will help us every day, it will brighten all the way
[D7]If we keep on the sunny side of [G]life
{end_of_section}

{start_of_section: Verse 2}
[G]Though the storm in its fury break today
[G]Crushing hopes that we cherished so dear
[C]Storm and cloud will in time pass away
[D7]The sun again will shine bright and [G]clear
{end_of_section}

{start_of_section: Verse 3}
[G]Let us greet with a song of hope each day
[G]Though the moments be cloudy or fair
[C]Let us trust in our Saviour always
[D7]Who keepeth everyone in his [G]care
{end_of_section}

{chorus}
`),
];
