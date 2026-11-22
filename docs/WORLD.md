# SANCTUS: World

Each path's **home base** (room by room), its **outside world** (area by area), where the **devotion stops** stand (statues and crucifixes, see GAME_RULES §15), where the **reading-thread moments** happen (GAME_RULES §16), and the **first playable map** for each path.

**All named places and people are fictional.** The real communities and cities are inspiration only: the CFR friaries of New York, the Dominican House of Studies in Washington, DC, and the Carmelite Monks of Wyoming. In-game names never use a real friary, priory, parish, or person.

**Map scale.** Like Brick City, every tile is **32×32 px**. Brick City's town standard is 72×66 tiles; full home-base maps should use that footprint. The first playable maps below are **40×24-tile slices** (1280×768 px) showing the spawn and the first objective.

**Art.** All art is original, drawn in code. Photos in `docs/concepts/` are reference only and never ship. Path style guides (palette, sprite specs, props) live in `docs/concepts/<path>/STYLE.md`.

### Shared map legend

| Char | Tile | Char | Tile |
|---|---|---|---|
| `#` | Wall | `.` | Floor |
| `+` | Door | `,` | Grass / ground |
| `"` | **Tall grass** (small-grace finds) | `T` | Tree (pine on the Carmelite map) |
| `:` | Sidewalk | `=` `-` | Road (lanes, center line); `=` over water = footbridge |
| `\|` | Crosswalk | `~` | Water (creek, fountain) |
| `^` | Mountain / rock | `X` | **Enclosure wall** (Carmelite) |
| `F` | Fence (pasture) | `E` | Subway / Metro entrance |
| `A` | Altar | `t` | Tabernacle (fixed, reverent) |
| `M` | Monstrance in an adoration chapel (fixed, reverent) | `c` | **San Damiano cross** (fixture over the altar) |
| `P` | Pew | `h` | Choir stall (in chapels) / horse (in stables and pasture) |
| `B` | Bed | `b` | Bookshelf |
| `D` | Desk / table | `K` | Kitchen counter / stove |
| `S` | Soup-line serving table | `W` | Chalkboard |
| `L` | Lectern / pulpit | `H` | Stable stall |
| `w` | Livestock (cattle) | `G` | Garden bed |
| `q` | Bell frame (bell yard) | `s` | Sign / notice board |
| `f` | Statue of the path's founder | `n` | Bench |
| **`x`** | **Crucifix** (devotion stop) | **`o`** | **Our Lady of Sorrows** statue |
| **`v`** | **Our Lady of Victory / of the Rosary** statue | **`k`** | **Our Lady, Undoer of Knots** statue |
| `N` | NPC (the superior is marked in each map's notes) | **`@`** | **Player spawn** (in lay clothes) |
| `1`–`9` | Room labels (listed under each map) | | |

---

## 1. Franciscan Friars: the Friary of St. Juniper, Five Bridges City

> [CONCEPT IMAGE: docs/concepts/franciscan/friary-chapel-interior.png] · [CONCEPT IMAGE: docs/concepts/franciscan/cfr-friars-kitchen.png] · [CONCEPT IMAGE: docs/concepts/franciscan/san-damiano-cross.png]

*St. Juniper Friary* (fictional; named for Brother Juniper, an early companion of St. Francis) is a converted row-house and old rectory in **Ironbridge**, a poor, loud, beloved neighborhood of **Five Bridges City** (NYC-like). The house is **simple and small**: a few rooms drawn in loving detail. The friars spend most of their open Vigor **outside**.

### Home base, room by room

| Room | What's there | What you do | Devotion stops |
|---|---|---|---|
| **1. Chapel for Mass** | Warm cream walls, exposed dark wooden roof beams, a gold-and-blue **angel mural** behind the sanctuary, twin wooden stairs to a small balcony railing above, hanging lanterns, red carpet aisle, white altar with candles, plain wooden pews. The **San Damiano cross** hangs above the altar. (Mood from CJ's reference; layout and name are original) | Daily Mass, Morning/Evening Prayer, sacristy duties, lighting candles (*Brother Fire*) | San Damiano cross (A to kneel), crucifix by the door, St. Francis and Our Lady statues in side niches, Stations of the Cross on the walls |
| **2. Adoration chapel** | Small, dim, warm; the monstrance on a simple altar; a few kneelers; one lantern | Evening **Holy Hour**, visits any time (0 Vigor) | Crucifix; Our Lady of Sorrows in the corner |
| **3. Cells** | Tiny rooms: bed, a hook for the habit, a crucifix, a small shelf; no TV (the CFR rule has none) | Sleep, spiritual reading, examen | A crucifix in every cell |
| **Hallway** | Long narrow hall, notice board with the week's obediences | Check your assignment | Crucifix; **Our Lady of Sorrows** at the turn of the stairs |
| **4. Kitchen + refectory** | One long table, benches, a big stove, a sink, the soup pots; humble and busy (mood from the B&W kitchen photo) | Meals, dishes (*Sister Water*), lighting the stove (*Brother Fire*), table reading | Crucifix over the table |
| **5. Common room** | Worn couches, a guitar, a chess board, bookshelf | Recreation, community talks | **Our Lady, Undoer of Knots** on the wall |
| **6. Porter's lodge / front door** | A desk, a bell, a basket for donations (the **poor box**) | Porter obedience: answer the door, take donations | — |
| **Friary yard + garden** | Small yard with tall grass, a vegetable bed, a statue of St. Francis | Garden work (*Sister Mother Earth*), dawn (*Brother Sun*), night sky (*Sister Moon and Stars*) | St. Francis statue (`f`) |

### Five Bridges City, area by area (NYC-like)

| Area | What it is | Activities | Devotion stops |
|---|---|---|---|
| **Ironbridge Avenue** | The busy street outside the friary: bodegas, buses, fire escapes | Street evangelization walks, small graces in planters | A street-niche **crucifix** on a wall |
| **7. Labre House soup line** | A parish-hall soup kitchen across the street (named for St. Benedict Joseph Labre, patron of the homeless) | Serve meals (2 Vigor), hard conversations (Outer encounters), give away your lay things (Poverty task) | Crucifix over the serving hatch |
| **8. Corner bodega** | The owner is a friend; donates day-old bread | Pick up donations; small talk | — |
| **9. Subway entrance** | To other districts (unlocks by rank) | Travel (1 slot) | — |
| **Pocket park** | Benches, tall grass, a little shrine | Night outreach, finds | **Our Lady of Victory** shrine (street niche) |
| **Later districts** | *Lantern Square* (a Midtown-like crossroads, street preaching), *Harbor Ferry* (an island hospital), *Riverside shelter* (a men's shelter), *Mercy Hospice* (*Sister Bodily Death*), *St. Clare's parish* (confessions once you're a priest) | Unlock by rank | Each has a crucifix; Sorrows at the hospice; Victory at St. Clare's |

### First playable map: St. Juniper Friary and Ironbridge Avenue (40×24)

```
    0000000000111111111122222222223333333333
    0123456789012345678901234567890123456789
 0  ############################,,,,,,,,,,,,
 1  #1..AcA...#2.Mt..#B.#B.#B.##,T,,,,,,,T,,
 2  #.....x...#......#..#..#..##,,,,,f,,,,,,
 3  #.PPP.PPP.#.P..P.#3.#..#..##,,,"""""",,,
 4  #.PPP.PPP.#.P..P.##+##+##+##,,,"""""",,,
 5  #.PPP.PPP.#......#.x.......#,,,"""""",,,
 6  #.........#......#.........#,,,"""""",,,
 7  #####+#######+########+#####,,,,,,,,,,,,
 8  #..x..........o............#,,,,,,,,,,,,
 9  #4KKK....#5.......#6.......#,,,,,,,,,,T,
10  #.DD..DD.#.D..D...#.s......+,T,,,,,,,,,,
11  #.......x#......k.#.N......#,,,,,@,,,,,,
12  #######################+####,,,,,,,,,,,,
13  ::::::::::::::::::::::::::::::::::::::::
14  ========|||=============================
15  --------|||-----------------------------
16  ========|||=============================
17  ::::::::::::::::::::::::::::::::::::::::
18  ,#########+#########,###+####,E9,,,,,,,,
19  ,#7SSSSSSSSS.......#,#8.....#,,n,,v,n,,T
20  ,#...............x.#,#.KK...#,,,"""""",,
21  ,#.N.N.N.N.N.N.....#,#......#,,,"""""",,
22  ,#.....K.K.K.......#,#......#,,,"""""",,
23  ,###################,########,,,,,,,,,,T
```

**Rooms:** 1 Chapel for Mass (San Damiano cross `c` above altar `A`) · 2 Adoration chapel (`M`, `t`) · 3 Cells · 4 Kitchen + refectory · 5 Common room · 6 Porter's lodge (the **Local Servant** `N` waits here) · 7 Labre House soup line (guests `N`) · 8 Corner bodega · 9 Subway (`E`).

**Spawn and first objective:** you spawn at `@` (33,11) in the friary yard in lay clothes. *"Find the Local Servant."* Walk to the yard door (27,10) → porter's lodge (6). Entry tasks: **Poverty** at the soup line (7) across the crosswalk, **Chastity** at the Our Lady of Sorrows statue `o` in the hall, **Obedience** by sweeping the chapel steps.

---

## 2. Dominican Friars: the House of Studies of St. Raymond, Capitol City

> [CONCEPT IMAGE: docs/concepts/dominican/saint-thomas-aquinas/aquinas-crucifix-study.png] · [CONCEPT IMAGE: docs/concepts/dominican/house-of-studies.png] (still wanted)

*The House of Studies of St. Raymond* (fictional; named for St. Raymond of Peñafort, the Dominican canonist who, by tradition, asked Thomas to write the *Summa contra Gentiles*) is a big stone priory on a hill in **Capitol City** (DC-like), next to a Catholic university and across the avenue from a parish. It is **larger** than the friary: a choir chapel, two libraries, classrooms, a cloister garth, a refectory, and many cells.

**Bells (weekday, academic year).** St. Raymond's public prayer times follow the published schedule of the Priory of the Immaculate Conception at the Dominican House of Studies (Washington, DC) — see NOTES.md sources and GAME_RULES §3: **7:00 Lauds · 7:20 Mass · 12:00 Rosary and Sext · 5:30 Office of Readings and Vespers · 9:00 Compline (Mon–Thu)**. Sunday Mass is later (11:15 at DHS); summer Compline is earlier. The Salve Regina procession after Compline is kept as Dominican house custom for the fictional priory.

### Home base, room by room

| Room | What's there | What you do | Devotion stops |
|---|---|---|---|
| **1. Chapel and choir** | Choir stalls facing each other (Dominicans chant the Office antiphonally), altar, tabernacle, a few pews for guests, white walls and stained glass of Dominican saints | Mass, the Hours, **Salve Regina procession** after Compline, preaching practice (clerics) | Crucifix over the altar; Our Lady of the Rosary in a side chapel; St. Dominic and St. Thomas statues |
| **2. Library** | Tall shelves, long desks, green lamps; a locked rare-books room (unlocks at simple profession) | **Summa study sessions** (2 Vigor), spiritual reading | Crucifix on the end wall |
| **3. Classrooms** | Chalkboard, lectern, rows of desks | Class (philosophy, then theology), **Disputation** encounters, later **teaching** a class | Crucifix by the board |
| **Cloister walk + garth** | A square arcade around a garden with tall grass, a fountain, a tree | Walking meditation, small graces | **Our Lady of Sorrows** in the cloister corner; crucifix |
| **4. Refectory** | Long tables, a reader's lectern | Meals with table reading | Crucifix |
| **5. Cells** | Bed, desk, a shelf of books, a crucifix | Sleep, study, examen | Crucifix in each |
| **Front hall** | The **Prior** greets newcomers here | — | **Our Lady of Victory** at the stair |
| **Later rooms** | Rare-books room, a recording studio for preaching podcasts, the infirmary, the Prior's office | Unlock by rank | — |

### Capitol City, area by area (DC-like)

| Area | What it is | Activities | Devotion stops |
|---|---|---|---|
| **Hill Avenue** | The avenue in front of the house | Walk to ministries | — |
| **6. St. Hyacinth Parish** | A parish across the avenue (fictional) | Serve Mass, catechism class, the parish deacon year (clerics) | Our Lady of Sorrows side altar; crucifix |
| **The Long Green** | A great lawn with monuments (a Mall-like park), tall grass, paths | Street preaching (Disputation), small graces | **Our Lady, Undoer of Knots** at a park shrine |
| **7. Metro** | To other districts | Travel | — |
| **Later districts** | *Capitol Hospital* (sick calls), *St. Jerome University* (teaching, campus ministry), *the Basilica on the Hill* (a great Marian shrine, fictional), *the Hall of Laws* (a debate with a skeptic) | Unlock by rank | Crucifixes everywhere; Victory at the Basilica |

### First playable map: the House of Studies and Hill Avenue (40×24)

```
    0000000000111111111122222222223333333333
    0123456789012345678901234567890123456789
 0  ########################################
 1  #1....AtA.....#2bbbbbbbbbb#3WWWWWWWWWW.#
 2  #.............#...........#....L......x#
 3  #hh.........hh#bb.D.D.D.bb#.D.D.D.D.D..#
 4  #hh.........hh#bb...x...bb#............#
 5  #hh.........hh#bb.D.D.D.bb#.D.D.D.D.D..#
 6  #....PP.PP....#...........#............#
 7  #######+############+###########+#######
 8  #.....#.x......................v#......#
 9  #4KKK.#.....,,,,,,,,,,,,,,,,....#5.BB..#
10  #.DDD.+.....,,"""""",,,,T,,,....+......#
11  #.DDD.#.....,,"""""",,~,,,,,....#.BB...#
12  #.....#.....,,,,,,,,,,,,,,,,....#......#
13  #.....#.o...........N.........x.#......#
14  ####################+###################
15  ::::::::::::::::::::@:::::::::::::::::::
16  ===================|||==================
17  -------------------|||------------------
18  ===================|||==================
19  ::::::::::::::::::::::::::::::::::::::::
20  ,,#######+#######,,,,,T,,,,,,,,,,,,T,,,,
21  ,,#6..AtA.......#,::::::::::::::::::::::
22  ,,#.PP.PP.PP..o.#,,,n,,,,,""""""",,k,E7,
23  ,,###############,,,,,,,N,""""""",,,,,,,
```

**Rooms:** 1 Chapel and choir (`h` stalls) · 2 Library · 3 Classroom (`W` board, `L` lectern) · 4 Refectory · 5 Cells · center: cloister garth · 6 St. Hyacinth Parish · 7 Metro.

**Spawn and first objective:** you spawn at `@` (20,15) on the sidewalk at the front door in lay clothes. *"Find the Prior."* The **Prior** `N` waits in the front hall (20,13). Entry tasks: **Poverty** at the parish poor box (6), **Chastity** at the Our Lady of Sorrows statue `o` in the cloister, **Obedience** by setting the refectory exactly as asked.

---

## 3. Carmelite Monks: the Monastery of St. Elijah, the Thornback high country

> [CONCEPT IMAGE: docs/concepts/carmelite/monastery/aerial-snow-mountains.png] · [CONCEPT IMAGE: docs/concepts/carmelite/monastery/exterior-night-moon.png] · [CONCEPT IMAGE: docs/concepts/carmelite/monastery/church-stained-glass.png] · [CONCEPT IMAGE: docs/concepts/carmelite/monastery/refectory-reader-pulpit.png] · [CONCEPT IMAGE: docs/concepts/carmelite/monks-horses-barn.png] · [CONCEPT IMAGE: docs/concepts/carmelite/monk-cloister-corridor.png]

*The Monastery of St. Elijah* (fictional; Elijah is Carmel's "Holy Father") is a **castle-like gothic stone monastery** in the **Thornback Mountains**, a Wyoming-like range of pine valleys, high plains, and snow. It sits **inside a cloister wall** (the enclosure). The nearest town is *Willow Crossing*, an hour away. Monks rarely leave. Outside the inner enclosure but inside the monastery lands are the **ranch**: barn, paddock, pasture, gardens, and the creek.

### Home base, room by room (inside the enclosure)

| Room | What's there | What you do | Devotion stops |
|---|---|---|---|
| **1. Church and choir** | White gothic vaults, tall **stained-glass windows of Carmelite saints**, a carved wooden **choir screen**, choir stalls, high altar, tabernacle | Midnight Matins and Lauds, the little Hours, the **sung conventual Mass** (Latin, chant), Vespers, Compline with the holy-water sprinkling | Great crucifix over the altar; **Our Lady of Mount Carmel** with the scapular; St. Joseph; Teresa, John, Thérèse in the glass |
| **2. Chapter room + library** | Shelves of the Carmelite Doctors, desks, the Rule on a stand | Class, spiritual reading, **Interior Castle** and **Dark Night** readings | Crucifix |
| **3. Refectory** | Dark wood paneling, long wooden tables, a gothic arched door and stairs, and a **carved stone pulpit high on the wall** for the reader | Silent meals with **table reading**: listening to the reading gives a light Study and virtue gain (+1 Study, +1 Temperance; once per meal); serving at table; reading from the pulpit once you're a novice | Crucifix on the end wall |
| **Cloister arcade** | Long **travertine/cream stone corridors** with arches and shafts of light, wood cabinets; it links church, refectory, and hermitages | Walking in silence, the Rosary at a statue | **Our Lady of Sorrows**, **Our Lady of Victory**, **Our Lady, Undoer of Knots** in arcade niches; crucifix at each corner |
| **4. Hermitages** | A **row of individual hermitage cells**, each a little gabled stone house named for a Carmelite saint (the name carved over the door): bed, prie-dieu, crucifix, a picture of Our Lady | Sleep, mental prayer, private Rosary, spiritual reading before bed | A crucifix in every hermitage |
| **5. Cloister garden** | Raised beds inside the enclosure | Gardening obedience | Crucifix at the garden head |
| **Bell yard** (just outside the church front) | Bells on a low frame (`q`) | Ring the bell for the Hours (a novice obedience) | — |
| **Later rooms** | The infirmary, the cobbler's shop (sandals made by a brother), the scriptorium, a hermit's cave high on the ridge (epilogue) | Unlock by rank | — |

### The ranch and grounds (monastery lands, outside the inner enclosure)

| Area | What it is | Activities | Devotion stops |
|---|---|---|---|
| **6. Red barn and stable** | A big red barn, stalls, a chestnut mare and her foal, tack wall, iron lanterns on a stone wall | Feed, groom, and muck (work habit required; overalls "extraordinary work habit" for heavy jobs) | Crucifix over the barn door |
| **7. Paddock and pasture** | Fenced pasture, horses and cattle on the high plains | Move cattle, mend fence, walk the grounds | — |
| **Meadow** | Tall grass under the mountains | Small graces (wildflowers for Our Lady's altar, a lost calf) | Wayside **Our Lady of Victory** shrine on the track |
| **Creek and footbridge** | A cold creek with a plank bridge | Water the gardens, quiet walks | — |
| **8. Guest house** | Outside the enclosure: a few beds, a small parlor | **Spawn and observership**: you live here first, as the real monks' candidates do | — |
| **Mountains** | Snowy peaks, pine valley | Seen, rarely visited | A hermitage crucifix on the ridge (late) |

### Seasons and the liturgical calendar (Carmelite map)

- **Snow** covers the grounds and roofs from about **Advent to Easter**; the creek freezes in deep winter. Sandals in the snow are a real Wyoming penance, drawn as cold-breath puffs.
- **Lent:** purple in the church, the Stations along the cloister arcade.
- **Easter to summer:** green meadow, foals in the pasture, garden harvest.
- **Night:** the **Compline mood** uses the night-and-moon exterior: tan stone, glowing arched windows, the church apse with stained glass, a full moon over snow.

### First playable map: the Monastery of St. Elijah and the guest house (40×24)

```
    0000000000111111111122222222223333333333
    0123456789012345678901234567890123456789
 0  ^^^^TT^^^^^^^TT^^^^^^^^^TT^^^^^^^^^^^^^,
 1  ^TTT,,T^^^,,,,TT^^^,,,T,,,^^^TT,,,,T^^^,
 2  ,,XXXXXXXXXXXXXXXXXXXXXXXXXX,,,,,,,,,,,,
 3  ,,X########################X,##########,
 4  ,,X#1..AtA....#2bbbb#3KK..#X,#6HH.HH..#,
 5  ,,X#hh......hh#.D.D.#.DDD.#X,#........#,
 6  ,,X#hh......hh#....x#.DDD.#X,#h.h.....#,
 7  ,,X#..........#.....#....x#X,#.......x#,
 8  ,,X######+#######+#####+###X,####+#####,
 9  ,,X...o........v........k..X,,,,,,,,,,,,
10  ,,X##+###+###+###+###+###+#XFFFFFFFFFFFF
11  ,,X#Bx##Bx##Bx##Bx##Bx##Bx#XF7,,,,,,,,,F
12  ,,X#4.##..##..##..##..##..#XF,,h,,,,,,,F
13  ,,X########################XF,,,,w,,,,,F
14  ,,X.......x................XF,,,,,,w,,,F
15  ,,X5G.G.G.G.G.G.G.G.G.G.G.GXF,,,,,,,,,,F
16  ,,XXXXXXXXXXXX+XXXXXXXXXXXXXFFFFF+FFFFFF
17  ,,,,,,,,,,,qq,,,,,,,v,,,s,,,,,,,,@,,,,,,
18  ,,,,"""""""""""",,,,,,,,,,,,,,###+####,,
19  ,T,,"""""""""""",T,,,,,,,,T,,,#8.B.B.#,T
20  ,,,,"""""""""""",,,,,,,,,,,,,,#...N..#,,
21  ,,,,"""""""""""",,,,,,,,,,,,,,########,,
22  ~~~~~~~~~~~~~~~~~~~~==~~~~~~~~~~~~~~~~~~
23  ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
```

**Rooms:** 1 Church and choir · 2 Chapter room + library · 3 Refectory · 4 Hermitages (one row) · 5 Cloister garden · 6 Red barn and stable · 7 Pasture · 8 Guest house. Rows 9 and 14 inside the enclosure are the **cloister arcade**; `q q` is the **bell yard**.

**Spawn and first objective:** you spawn at `@` (33,17) outside the guest house in lay clothes. *"Find Father Prior."* **Father Prior** `N` waits in the guest house (8). After the observership he opens the enclosure gate (14,16). Entry tasks: **Poverty** at the gate (leave your things for the town thrift drive), **Chastity** at Our Lady of Sorrows `o` in the arcade, **Obedience** by mucking one stall exactly as asked.

---

## 4. Reading-thread moments: where they happen

| Thread | Moment | Where |
|---|---|---|
| Canticle: Brother Sun | Dawn after the Office of Readings | Friary yard |
| Canticle: Sister Moon and Stars | After Night Prayer, clear night | Friary yard |
| Canticle: Brother Wind | Outreach in wind or rain | Ironbridge Avenue / pocket park |
| Canticle: Sister Water | Soup pots and dishes | Labre House / friary kitchen |
| Canticle: Brother Fire | Light the stove or the chapel candles | Friary kitchen / chapel |
| Canticle: Sister Mother Earth | Plant or harvest | Friary garden |
| Canticle: those who pardon | Forgiveness in an Outer encounter | Anywhere in the city |
| Canticle: Sister Bodily Death | Hospice vigil or the Transitus (Oct 3) | Mercy Hospice / chapel |
| Summa articles | Study sessions | St. Raymond library; Disputations in classrooms and on the Long Green |
| Summa "straw" capstone | After Mass, late game | St. Raymond chapel → your cell |
| Interior Castle mansions | Spiritual reading | Carmelite library / hermitage |
| Dark Night stanzas | A dryness week persevered | Hermitage; the Toledo cutscene opens from the library |
| Little Way acts | Hidden kindnesses | Refectory, kitchen, stable (any path can do them; only Carmelites get the Thérèse readings) |

## 5. Style guides

- Franciscan: [`docs/concepts/franciscan/STYLE.md`](concepts/franciscan/STYLE.md)
- Dominican: [`docs/concepts/dominican/STYLE.md`](concepts/dominican/STYLE.md)
- Carmelite: [`docs/concepts/carmelite/STYLE.md`](concepts/carmelite/STYLE.md)
- **Shared lay-clothes sprite (spawn, all paths):** 32×40; plain light-blue button shirt or gray sweater, khaki or dark trousers, brown shoes, a small canvas shoulder bag (given away in the Poverty task, then removed from the sprite). Modest and neutral; 4 colors + skin.
