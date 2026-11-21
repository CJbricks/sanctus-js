# SANCTUS: Game Rules

Every system in Sanctus and the rules that run it. Numbers are **first-pass and meant to be tuned**; they will live in one constants file (as in Brick City) once code exists. Facts about the orders are sourced in [`NOTES.md`](NOTES.md#sources).

**Contents**
1. [Theme rules (always on)](#1-theme-rules-always-on)
2. [Opening flow: title, Choose Your Calling, becoming a postulant](#2-opening-flow)
3. [The day: bells, slots, and Vigor](#3-the-day-bells-slots-and-vigor)
4. [The week and the liturgical year](#4-the-week-and-the-liturgical-year)
5. [Brick City → Sanctus mapping table](#5-brick-city--sanctus-mapping)
6. [Spiritual Health](#6-spiritual-health)
7. [The evangelical counsels: poverty, chastity, obedience](#7-the-evangelical-counsels)
8. [Fasting and penance](#8-fasting-and-penance)
9. [Virtues, skills, Constancy and Fervor](#9-virtues-skills-constancy-and-fervor)
10. [Encounters (what replaces races and battles)](#10-encounters-what-replaces-races-and-battles)
11. [The Rosary](#11-the-rosary)
12. [Ranks: formation and Holy Orders](#12-ranks-formation-and-holy-orders)
13. [Liturgical roles by rank](#13-liturgical-roles-by-rank)
14. [Failure states (without mocking the sacred)](#14-failure-states)
15. [Devotion stops: statues and crucifixes](#15-devotion-stops-statues-and-crucifixes)
16. [Reading threads: Canticle, Summa, Interior Castle, Dark Night, Little Way](#16-reading-threads)
17. [Collectibles and items](#17-collectibles-and-items)
18. [Saves](#18-saves)

---

## 1. Theme rules (always on)

These come from the Sanctus briefing and CJ's direction. Every system below obeys them.

1. **Reverence first.** Nothing in the game mocks, trivializes, or "games" the sacred.
2. **Christ and the Eucharist are never items, enemies, currency, or actors.** No pickups, no stats, no animation of Christ. Crucifixes, the tabernacle, and the monstrance are fixed, reverent fixtures in the world. A Christ figure on a crucifix is drawn small, simple, and still.
3. **The sacraments are not minigames.** Mass, confession, and ordination are reverent scenes. There's no score, no timing input, no way to "fail" them. The words of consecration are never a button press.
4. **Sacramentals are not power-ups.** A rosary, scapular, holy water, or medal *disposes the heart to prayer* (CCC 1670). In the game, a sacramental enables a prayer action or a reminder. It never works "magically" or gives a buff by itself (CCC 2111 warns against treating them that way).
5. **Relics are venerated, never equipped, sold, or traded.**
6. **Mary and the saints are intercessors, not summons.** You pray *to* them; they don't "attack" for you.
7. **People are never enemies.** Hard conversations are about love and understanding, not winning. Temptation is the only thing you "resist," and it's drawn as an abstract inner weight, never as a cute demon monster or a person.
8. **Fasting and penance are good, but always within obedience and health.** The game never rewards harming your body (see §8).
9. **Real orders, fictional places and people.** Houses, parishes, cities, and characters are invented. Real saints and their writings appear with care and sources.
10. **Original art and music, drawn in code.** Reference photos in `docs/concepts/` never ship.

## 2. Opening flow

```
Loading (saint quote) → Title (Resume / New Game) → Choose Your Calling → spawn on the grounds in lay clothes
  → find and speak to the superior → three entry tasks (Poverty, Chastity, Obedience) → POSTULANT
```

1. **Title.** Resume (only if a save exists) and New Game. The quote under the logo is a short line from a saint of a random path.
2. **Choose Your Calling.** Three panels: Franciscan Friars, Dominican Friars, Carmelite Monks. Each shows the patron saints, the habit (as a preview of what you'll grow into), the home base, and a one-line "your day leans toward…". Confirm is final for that save.
3. **No name entry.** You are never asked for a name. You are addressed only by role: *Postulant* → *Brother* (novice and professed) → *Father* after priestly ordination, or *Brother* for life on the brother track. A deacon is still *Brother* in the house (religious deacons customarily keep the title) and *Deacon* at the altar (see open questions). The save stores the role and rank, not a name. *(Decision: names matter less than the vocation. See NOTES.md.)* One exception follows real practice: at **novitiate investiture** the community may give you a **religious name** (e.g. "Brother ___ of the Cross"). This is an open question for CJ (on by default: picked from a list of saints, never typed).
4. **Spawn on the grounds** outside the house in **ordinary lay clothes** (32×40 sprite: plain button shirt or sweater, trousers, simple shoes, small bag; modest and neutral). The first objective marker reads **"Find the superior of the house."**
   - Franciscan (CFR usage): the **Local Servant** (CFR calls the local superior "Servant", not "Guardian").
   - Dominican: the **Prior**.
   - Carmelite: **Father Prior**. You first stay in the **guest house outside the enclosure** (an "observership", as the Wyoming monks do), then are invited in.
5. **Three entry tasks.** The superior explains the three evangelical counsels. *Postulants don't take vows* (vows come after the novitiate), so here you **embrace each counsel as your way of life** through a task:
   - **Poverty:** give away your worldly things (the bag, the watch, the extra jacket) to the poor box or to the outreach line. Franciscan: hand them out yourself on the soup line. Dominican: give them to the parish St. Vincent de Paul box across the avenue. Carmelite: leave them at the gate for the town's thrift drive, keeping only what the Prior allows.
   - **Chastity:** a quiet, tasteful scene of purity of heart: kneel before a statue of Our Lady, read a short prayer, and choose a resolution (custody of the eyes, guarding the heart, giving your love to God and neighbor). No romance content, no shame; dignified and age-appropriate.
   - **Obedience:** a humble chore done **exactly as asked** (sweep the chapel steps, set the refectory, muck one stall). Doing it differently than asked, even "better," earns a gentle correction and a retry. The lesson is the obedience, not the result.
6. Completing all three ends with a short **reception scene**. You become a **Postulant**. Your outfit changes to the postulant dress for your path (see §12): Carmelites receive brown postulant robes and a larger postulant scapular (as the Wyoming monks do); Franciscans and Dominicans stay in simple lay clothes, since their postulant dress is unverified (open question). The habit itself comes later, at investiture into the novitiate.

## 3. The day: bells, slots, and Vigor

Brick City had five clock slots and **10 energy blocks**. Sanctus keeps both ideas and adds **bells**.

- **Bells** are the fixed events of the house: the Hours, Mass, adoration, the Rosary, meals, Grand Silence. They **cost 0 Vigor**, but they move the clock and you're expected to be there. Missing one without a reason affects Spiritual Health (§6) and Community.
- **Vigor** (10 blocks a day) is spent only in the **open windows** between bells: outreach, class, study, manual work, chores.
- **Sleep** ends the day and refills Vigor. The Carmelite night is **split** (sleep, rise for Midnight Matins, sleep again). That's their normal rule, so split sleep counts as a full night for them.
- Each path's day uses the same six HUD slot names (Vigil, Morning, Midday, Afternoon, Evening, Night), but the bells fall differently. Times below follow the real communities' published horaria, simplified. The Dominican times are approximate (see open questions).

| Slot | Franciscan (CFR-style) | Dominican (house of studies) | Carmelite (Wyoming-style, cloistered) |
|---|---|---|---|
| **Vigil** | 6:00 Office of Readings · 6:30–7:30 meditation hour | ~6:00 Office of Readings, Lauds · mental prayer | **11:45 p.m.–1:00 Matins & Lauds** (previous night) · 6:00 Angelus, Prime |
| **Morning** | 7:30 Morning Prayer · 7:50 Mass · **window: outreach (4 Vigor)** | ~7:00 Mass · **window: class / disputation (4)** | 6:25 mental prayer · 7:25 Terce · 7:45 sung conventual Mass (Latin) · **window: work/class (3)** |
| **Midday** | 12:00 Midday Prayer · lunch | Midday Prayer · lunch · recreation | 11:40 Sext + examen · 12:00 Angelus, lunch, None · 12:45 recreation |
| **Afternoon** | **window: outreach / chores (4)** | **window: library study / teaching / city ministry (4)** | **window: work/class (3)** · 3:00 Litany of Our Lady + Divine Mercy Chaplet |
| **Evening** | 5:00–6:00 Evening Prayer + **Holy Hour of adoration** · supper · **window: night outreach (2)** | Vespers · Rosary · supper · **window: preaching prep / study (2)** | 5:00 Vespers · 5:30 mental prayer · 6:30 Angelus, collation |
| **Night** | 9:15 Night Prayer and Rosary · Grand Silence | Compline + **Salve Regina procession** · Grand Silence | 7:15 Rosary, examen, Compline · spiritual reading in the cell · 8:30 retire |
| **Open Vigor** | **10** (most time outside) | **10** (most time in study) | **6** (most time in choir and prayer; the rest of the day *is* liturgy) |

**How the paths differ:** Franciscans have the most open windows and spend them in the city. Dominicans spend theirs on study, class, and preaching, with some city ministry. Carmelites have the fewest open blocks and the most bells: every Hour, a sung Mass, two hours of mental prayer, the Rosary, and spiritual reading. Their windows go to gardening, horses, cattle, and walks on the grounds.

**Vigor costs (open windows only):** light chore 1 · class, study session, soup line shift, garden or stable work 2 · street outreach walk, teaching a class, hospital visit, hay or fence work 3 · preaching a homily or a mission talk (clerics), a long city mission 4. Meals, statues/devotion stops, and short visits to the Blessed Sacrament cost 0.

**Weariness** (Brick City's Fatigue) rises with work and falls with sleep, recreation, and Sundays. High Weariness doesn't hurt your Spiritual Health. It makes prayer scenes show "distracted" lines and lowers XP from work, which is a gentle nudge to rest. Above 80, the superior sends you to bed early. *That's obedience, not a penalty.*

## 4. The week and the liturgical year

- **Sunday** is the Lord's Day: no assigned work, no fasting (Sundays are never fast days), a festive meal, and extra recreation. Rest on Sunday never causes any decay.
- **Friday** is a day of penance: abstinence from meat in the refectory and an optional permitted penance (§8).
- **Weekly House Chapter** (Sunday night) replaces Brick City's Weekly Summary: Spiritual Health trend, virtues gained, encounters met, hours of outreach/study/work, the Rosary count, and a short word from the superior. Franciscans also get a **day of recollection** and a personal **hermitage day** each week (from the CFR rule of life).
- **The liturgical year** colors everything:

| Season / feast | Effect in game |
|---|---|
| **Advent** | Candle wreath in chapels, quieter music, extra Scripture readings (Isaiah) |
| **Christmas** | Feast meals, crèche props, Joyful Mysteries on Sundays (optional custom) |
| **Lent** | Fasting days open per permission (§8), Stations of the Cross devotion stops, purple in the chapel, Sorrowful Mysteries on Sundays (optional custom) |
| **Holy Week / Triduum** | Special non-interactive liturgy scenes; Good Friday fast; the tabernacle empty and open on Good Friday (accurate) |
| **Easter** | Alleluias return, flowers, Glorious Mysteries, big feast |
| **Ordinary Time** | Normal rhythm |
| **Sep 15 Our Lady of Sorrows** | Sorrows statues highlighted, Seven Sorrows chaplet devotion stop |
| **Oct 7 Our Lady of the Rosary** (originally "Our Lady of Victory," after Lepanto, 1571) + **October, the month of the Rosary** | Victory/Rosary statues highlighted; a full Rosary that day counts double for Constancy |
| **Path feasts** | Franciscan: St. Francis Oct 4 (and the Transitus Oct 3), St. Clare Aug 11. Dominican: St. Dominic Aug 8, St. Thomas Aquinas Jan 28. Carmelite: Our Lady of Mount Carmel Jul 16, St. Teresa Oct 15, St. John of the Cross Dec 14, St. Thérèse Oct 1 |
| **Weather and seasons** | Snow on the Carmelite mountains from roughly Advent to Easter; summer storms over the city. Feeds the Canticle thread (§16) |

## 5. Brick City → Sanctus mapping

Brick City's real systems, as read from `CJbricks/brick-city` (README.md and docs/NOTES.md at commit `53aa034`, 2026-11-21), mapped to Sanctus. **Kept** = same idea and rules. **Changed** = same slot in the design, new rules. **New** = no Brick City equivalent.

| Brick City system | Sanctus version | Status | Rules |
|---|---|---|---|
| **Calendar: 5 day slots + weeks** | **Horarium**: 6 slots (Vigil…Night) with fixed **bells** per path + weeks + **liturgical year** | Changed | Bells cost 0 Vigor but move the clock; each path has its own bell times (§3). Seasons and feasts change the days (§4). |
| **10 energy blocks** | **Vigor**: 10 blocks, spent only in open windows | Kept (renamed) | Costs 1–4 per task; Carmelites have only 6 open blocks. Sleep refills. No gels; a short visit to the Blessed Sacrament or recreation *doesn't* refill Vigor (prayer isn't a battery). |
| **Naps (+3 energy, up to 2/day)** | **Siesta / rest** after lunch | Changed | One rest per day, only if the superior allows it on that day (always on Sundays and for the sick): +2 Vigor, −10 Weariness. |
| **Sleep ends the day, quality matters** | **Grand Silence + sleep** | Kept | Going to bed after Night Prayer = good sleep. Staying up past Grand Silence lowers Community a little. Carmelite split sleep counts as full. |
| **Fatigue bar** | **Weariness** | Kept (renamed) | Rises with work/outreach, falls with sleep, recreation, Sundays. High Weariness → "distracted" prayer text, less work XP, never lower Spiritual Health. |
| **Nutrition bar; skipping meals hurts** | **Nourishment** + **fasting as good** | Changed (reversed) | Meals are free at the common table. A *permitted* fast raises Penance (§8). Nourishment has a **safety floor** that unpermitted fasting can never cross; going past permission earns nothing and costs Obedience. |
| **Bonk / DNF** | **Faltering** in an encounter | Changed | If Weariness is very high *and* you skipped prayer, an encounter may end early in "Not today." No penalty except missed growth; the next step is rest and prayer. |
| **Coins** | **None. The common life.** | Changed | Vow of poverty: you own nothing. The house has a **common store** (food, clothes, books, outreach supplies) that benefactors' alms refill. You get what you need by **asking permission** of the superior (§7). |
| **Run Store shifts (earn coins)** | **Obediences** (assigned work) | Changed | The superior assigns your job each week (porter, kitchen, soup line, sacristy, library, garden, stable). Doing it well raises Community and Labor/Service XP. It pays nothing, because you don't need pay. |
| **Grocery store / shops** | **Common store + city outreach pantry** | Changed | You request; you don't buy. Outreach supplies (sandwiches, socks, blankets) come from the house pantry and go to the poor. |
| **Gear (shoes, belts, vests) with boosts and trade-offs** | **Habit pieces, rosary, breviary, books** | Changed | Gear unlocks *actions* and marks rank, never stat boosts. Habit pieces come at investiture and profession. Rosary enables the Rosary (§11). A breviary lets you pray the Hours away from the house. Books unlock reading threads (§16). One trade-off kept: Carmelite **work habit** for labor vs. **choir habit** for liturgy (wear the wrong one and you must change before the bell). |
| **Shoe wear** | **Habit and sandal wear** | Changed | Habits and sandals (or Dominican black shoes) wear with work. Franciscans **patch** them (a sign of poverty) rather than replace. A replacement is always granted when truly needed. |
| **Attributes (Speed, Endurance, Strength, Recovery, Mental toughness)** | **Virtues** + **Skills** | Changed | Virtues: Charity, Humility, Obedience, Prudence, Fortitude, Temperance, Purity of heart. Skills: Prayer, Study, Service, Labor, Preaching, Chant (§9). |
| **Overall Endurance vs. Peak Fitness** | **Constancy vs. Fervor** | Changed | Constancy: slow, built by faithful days, fades slowly. Fervor: fast, from good prayer and feasts, fades within days. Readiness for encounters = Constancy + Fervor − Weariness (§9). |
| **XP tracks (Overall, Trail, Marathon, Ultra, Versatile)** | **Formation XP** + 5 skill tracks | Changed | Every faithful act adds Formation XP plus its track (Prayer, Study, Service, Labor, Preaching). Path emphasis: Franciscan → Service, Dominican → Study/Preaching, Carmelite → Prayer/Labor. |
| **Levels + level-gated unlocks** | **Ranks** (formation stages + Holy Orders) | Changed | Rank doesn't come from XP alone: time in stage + XP + Spiritual Health ≥ 60 + the community's approval (Chapter) + your free petition (§12). |
| **Races (5K → marathon → ultras)** | **Encounters** + **milestone ceremonies** | Changed | Temptations and hard conversations replace races (§10). Investiture, professions, and ordinations replace big races as milestones. |
| **Race Readiness screen** | **Examen screen** before big encounters and petitions | Changed | Shows Constancy, Fervor, Weariness, and the virtues the moment calls for. |
| **Rival (Remy) + rematches** | **Companion in holy rivalry** | Changed | A fellow postulant per path. You "compete" only in friendly ways (memorizing psalms, chant, soup line servings, disputation). Never an enemy; his story runs alongside yours. Rematches become joint tasks after ~10 days. |
| **Sponsors (brands) + obligations** | **Benefactors** and **apostolate requests** | Changed | Benefactors give alms *to the house* (refill the pantry and the building fund). Requests (a talk at a parish, a retreat, a hospital visit) take a window; declining is allowed but costs a little Community. No brands. |
| **Unlockable towns / mountain gate** | **Unlockable areas by rank** | Kept | New rooms, city districts, and grounds open by rank and task (e.g. enclosure areas at novitiate, the pulpit at diaconate). Locked areas show greyed out with a sign or a brother explaining. |
| **Town map + quick travel** | **House map + city map** | Kept | `P` opens the map. Quick travel works only to unlocked places and never during a bell. |
| **City guides** | **Guide brothers** | Kept | An older brother introduces each new area (fictional characters). |
| **Tall-grass finds (gels, socks…)** | **Small graces** in the garden, park, meadow, and street | Changed | Stepping on a new tall-grass tile has a small chance (~1 in 20) to find something: wildflowers for Our Lady's altar, a lost wallet to return, a stray animal to care for, a holy card left on a bench, or a person who needs help (starts an Outer encounter). **Nothing found is kept for yourself**: it goes to the common store, is returned, or is given away. Limit 3 per day, reset by sleep. |
| **Random life events (sickness, overtraining)** | **Sickness**, **consolation**, **dryness** | Changed | Sickness: rest in the infirmary. Excused from everything and never penalized; offering it up is a quiet option. Consolation: a rare good morning. Dryness: §14. |
| **Overtraining (Peak slips if Fatigue stays high)** | **Overextension** ("Martha without Mary") | Changed | Several days of max work with minimum prayer → Fervor slips each morning until you rebalance. No other loss. |
| **Detraining (rest days are free)** | **Tepidity drift** | Changed | Spiritual Health components decay only when habits are skipped *without reason* (§6). Sundays, sickness, and permitted absences never cost anything. |
| **PT clinic (treat injuries)** | **Infirmary** + **spiritual direction** + **confession** | Changed | Infirmary heals; spiritual direction gives a hint about your weakest virtue; confession is a reverent scene that restores Peace (§10). Nothing costs anything. |
| **Coffee shop / Race IQ / Wi-Fi hours** | **Library** + **spiritual reading** | Changed | Reading hours build Study and unlock reading threads (§16). Dominicans have the most. |
| **Run club (Cornerstone Pace Club)** | **Lay fraternity** (Secular Franciscans, Lay Dominicans, Secular Carmelites) | Changed | Visiting lay members join outreach or talks; leading their meeting is a professed/cleric task. |
| **Night runs** | **Night outreach**, **Compline**, **Midnight Matins** | Changed | Franciscan night street evangelization; Dominican Compline procession; Carmelite Midnight Office. Night ties into the Canticle (Moon and Stars). |
| **Weather** | **Weather + seasons** | Kept | Feeds the Canticle thread and Carmelite snow seasons. |
| **Watches, segments** | — | Dropped | No timing metrics on prayer. |
| **HUD status panel + ticker** | **Habit card HUD** | Changed | Spiritual Health (with 5 mini bars), Vigor, Weariness, next bell, current rank title. The ticker shows growth gently: "+2 Prayer ▲ · Constancy ▲". |
| **Loading screen + random quote** | **Loading screen with a saint's line** | Kept | Short lines from public-domain translations of the path's saints. |
| **Title screen** | **Title + Choose Your Calling** | Changed | §2. |
| **Gender choice + name entry** | **Removed** | Changed | All three are men's communities, so there's no choice; no name entry (§2). Women's branches are an open question. |
| **Save / Resume (localStorage)** | **Save / Resume** | Kept | Key `sanctus-save-v1`; stores path, role/rank, day, meters. Auto-saves after each action (§18). |
| **Chiptune music** | **Original chant-inspired chiptune** | Kept | Original melodies in the spirit of modal chant; whether to arrange public-domain Gregorian melodies is an open question. |
| **Win confetti** | **Bells and soft light** | Changed | No confetti in sacred spaces. Milestones ring the house bell. |
| **Brick City sign / motto** | **House motto plaque** | Kept | Franciscan "Pax et Bonum," Dominican "Veritas," Carmelite "Zelo zelatus sum…" (Elijah's words, the Carmelite motto). |

## 6. Spiritual Health

**Spiritual Health (SH)** is a 0–100 score built from five components, each also 0–100. It's a game measure of *faithfulness to the means of growth*, not a claim to measure anyone's real holiness. The UI says so once, gently, the first time it appears.

**SH = weighted sum of the components.** Weights by path:

| Component | What feeds it | Franciscan | Dominican | Carmelite |
|---|---|---|---|---|
| **Prayer (P)** | Liturgy of the Hours, mental prayer, Rosary, lectio divina, examen | 0.25 | 0.30 | 0.35 |
| **Mass (M)** | Daily Mass attendance and liturgical service | 0.25 | 0.25 | 0.25 |
| **Adoration (A)** | Holy Hour, visits to the Blessed Sacrament | 0.20 | 0.15 | 0.10 |
| **Penance (F)** | Permitted fasting, Friday abstinence, small mortifications, silence kept | 0.10 | 0.10 | 0.10 |
| **Community (C)** | Obediences done, recreation attended, helping brothers, charity in the house | 0.20 | 0.20 | 0.20 |

**Feeding rules (per day):**
- **Prayer:** each Hour +3 (Carmelite Matins +5) · meditation/mental prayer hour +6 · Rosary (5 decades) +5 · lectio divina / daily Scripture +3 · night examen +2. Cap +25 per day.
- **Mass:** attend +12. Serving, reading, chanting, or assisting adds **skill XP**, *not* more Mass points. Every rank gets the same Mass value, because Mass isn't "worth more" when you have a bigger role.
- **Adoration:** visit (any length, 0 Vigor) +3, up to 3 a day · Holy Hour +10.
- **Penance:** permitted fast day +6 · Friday abstinence +3 · small mortification (silence kept, no dessert, cold walk offered up) +2 each, max 2 a day · **unpermitted penance +0** and −Obedience.
- **Community:** obedience done +3 · recreation +2 · helping a brother +2 · chores left undone −5 · a sharp word in an encounter −2.

**Decay (applied at sleep):**
- A component decays only if you **skipped it without reason** that day: Prayer −8 (−2 if you prayed some), Mass −10, Adoration −4, Community −3. Penance drifts −2/day toward a **floor of 30** (penance isn't required daily).
- **Never decays for:** Sundays (Penance), sickness, permitted travel, assigned duty during a bell, Holy Week changes, or being sent to bed by the superior.
- **Diminishing returns:** above 85, gains in that component are halved. You can't "farm" holiness.

**What SH unlocks:**

| SH band | Name in UI | Effect |
|---|---|---|
| 0–29 | *Tepid* | The superior asks to see you (a kind talk). Rank petitions are paused. Encounters are harder (lower Readiness). |
| 30–59 | *Steady* | Normal play. |
| 60–79 | *Fervent* | **Rank petitions open** (if the 2-week average is ≥ 60 and the other gates are met). The encounter move *Aspiration* is strengthened. |
| 80–100 | *Recollected* | Contemplative prayer scenes, rare consolation events, mentor tasks (helping a newer postulant), deeper reading pages. |

**Dryness is separate from SH.** You can have high SH and still enter a season of dryness (§14). That's accurate: St. John of the Cross teaches that dryness often comes to the faithful as purification, not as a sign of failure.

## 7. The evangelical counsels

You *embrace* the counsels at the entry tasks (§2) and *profess* them as vows at first profession and again at solemn/perpetual profession (§12). They become standing rules:

| Counsel | Standing rule | Path flavor |
|---|---|---|
| **Poverty** | No money, no private possessions. You use what the community provides and **ask permission** for anything else (a new notebook, a book, sandals). The superior grants real needs and refuses luxuries kindly. Finds go to the common store. | **Franciscan: the most radical.** Fewest permissions (2 a week), patched habits, no extras. Their poverty is also *service*: the common store flows out to the poor. |
| **Chastity** | A **Purity of heart** virtue: custody of the eyes and heart, an undivided love for God that frees you to love everyone. It grows through prayer, Marian devotion, and choosing well in Inner encounters. Content is always dignified and age-appropriate; there's no romance content. | All paths the same. The Dominican angels' girdle story (St. Thomas) is a reverent saint-card scene. |
| **Obedience** | Your work is **assigned** by the superior. Doing it as asked raises Obedience; changing it on your own, even to "help," earns a gentle correction. You may *respectfully represent* a concern once (a real practice), then obey. | **Dominican:** the profession formula names **obedience** explicitly ("I make profession and promise obedience…"). It contains the other vows. **Carmelite:** obedience plus **enclosure** and **silence** rules: you leave the enclosure only with permission, and talking outside recreation lowers Penance slightly. |

## 8. Fasting and penance

Brick City punished skipped meals. Sanctus treats fasting and penance as **good**, but only inside **obedience and prudence**, the way the Church and every order actually practice it.

- **Permitted fasts:** Ash Wednesday and Good Friday (Church law), Fridays (abstinence), and Lent weekdays or a house's own customary fast days *if the superior permits*. A fast day in game = one full meal + two small ones (the Church's definition), never "no food."
- **Permission is required** for any extra fast or mortification. The superior refuses if Weariness is high, you're sick, or you have heavy work. *Prudence is the virtue being trained.*
- **Safety floor:** Nourishment can never fall below 40 from fasting. If you try to fast without permission, the game gives **zero** Penance and lowers Obedience, and the superior has a gentle talk about pride in penance.
- **Never on Sundays or solemnities.** Trying earns a note: "Today is a feast."
- **Small mortifications** (keeping silence, giving up a dessert, a cold walk offered up, an extra kindness to someone difficult) are the everyday penance. Each is +2 Penance, max 2 a day.
- **Nothing harmful is ever modeled as good:** no self-injury, no sleep deprivation beyond the community's own rule, no starving. This is a hard design rule.

## 9. Virtues, skills, Constancy and Fervor

**Virtues (0–100, grow slowly, never drop below what you've built except gently through repeated neglect):**

| Virtue | Grows from | Used in |
|---|---|---|
| **Charity** | Outreach, helping brothers, forgiving in encounters | Outer encounters (Listen, Give) |
| **Humility** | Obeying corrections, hidden acts (Little Way), not boasting after a win | Resisting pride; the "straw" capstone |
| **Obedience** | Doing obediences as asked, accepting refusals | Gate for every vow |
| **Prudence** | Asking permission, choosing rest wisely, careful study | Discernment moves, preaching |
| **Fortitude** | Faithfulness during dryness, cold, hard work | Persevering through long encounters |
| **Temperance** | Permitted fasting, moderation at meals | Resisting gluttony and comfort |
| **Purity of heart** | Marian devotion, custody of the eyes, choosing well | Resisting lust/vanity thoughts (abstract) |

**Skills (XP tracks):** Prayer, Study, Service, Labor, Preaching (clerics and Dominicans especially), Chant.

**Constancy vs. Fervor** (from Brick City's Endurance vs. Peak):
- **Constancy** builds slowly from *faithful days* (all bells kept, obedience done). It fades slowly. It's your foundation.
- **Fervor** builds quickly from good prayer, feasts, and consolations. It fades within days and drops during dryness.
- **Readiness** for an encounter = Constancy + Fervor − Weariness. Persevering through dryness (when Fervor is low) gives **double Constancy**: being faithful without feeling it is what grows you.

## 10. Encounters (what replaces races and battles)

### Options considered

| Option | How it works | Pros | Cons |
|---|---|---|---|
| **A. Virtue vs. Vice duel** | Classic turn-based JRPG fight. A vice (Pride, Envy, Wrath, Sloth…) has an HP-like "Pull" bar; your virtues are attack moves. | Instantly familiar; great GBC feel; teaches the vice/virtue pairs. | Risks making temptation a cartoon monster and grace a damage stat; only works for inner struggles. |
| **B. Hard Conversations** | Dialogue-driven turns with a person (a man on the soup line, a skeptical student, a grieving widow). Moves: Listen, Ask, Share, Pray silently, Give. A Trust bar instead of HP. | Humane, fits the Franciscan and Dominican street life beautifully, teaches charity. | Risk of treating people as targets to "win"; little to do for the cloistered Carmelites. |
| **C. Unified Encounters (recommended)** | One turn-based engine with two faces: **Inner** (temptation, drawn as abstract weather or a weight in the heart) and **Outer** (a hard conversation, never an enemy). Same menu, same virtues-as-moves, different goals. | Keeps the JRPG battle feel; covers all three paths (Carmelites mostly Inner, Franciscans mostly Outer, Dominicans both plus Disputation); one engine to build and test. | More design work up front; needs careful writing so Outer scenes never feel like "beating" a person. |

**Recommendation: Option C, Unified Encounters.**

### Encounter rules (Option C)

- **Your bar:** **Peace** (HP-like). It falls when a temptation pulls or a conversation goes badly; it never reaches "death". At 0 you **stumble** (Inner) or the conversation ends in **"Not today"** (Outer).
- **Menu (GBC-style 4 slots):** **VIRTUE** (choose a virtue as a move) · **PRAY** (an aspiration, or *Turn to prayer*: one decade of the Rosary, which takes a turn and steadies Peace) · **WORD** (recall a short Scripture verse or saint's line you've unlocked) · **WAIT** (patience: sometimes the right move is silence).
- **Inner encounters:** a temptation (pride after a success, envy of the rival, irritation in the kitchen, sloth at Matins, gluttony on a fast day) is drawn as an abstract shadowed weight, never a creature. Each vice has a matching virtue that counters it best (pride–humility, envy–charity, wrath–meekness/patience, sloth–fortitude, gluttony–temperance, greed–poverty, lust–purity of heart). **PRAY never runs out**: grace isn't a resource you spend.
- **Outer encounters:** a person with a need. The goal is **Trust and understanding**, not conversion or "victory." Endings: *Accompanied* (best), *A seed planted*, *Not today* (fine, try again another day). Charity grows even from *Not today*.
- **Dominican Disputation** (an Outer variant that follows the Summa's article method): an objection is raised → you choose the **sed contra** (an authority: Scripture, a Father, a saint) → you give the **respondeo** (pick the reasoning chain) → you answer each objection. It's used in class, teaching, and street preaching in the DC-like city.
- **After stumbling:** the night examen shows what happened, and the next day offers **confession** (a reverent, non-interactive scene with a priest NPC, or with your confessor if you're a priest yourself). It restores Peace fully. There's no penalty beyond the missed growth. *Mercy is the mechanic.*
- **Readiness** (Constancy + Fervor − Weariness) and virtues set your move strength. Being well rested and faithful makes encounters easier, just as good form helped in Brick City races.
- **Rewards:** virtue XP, Formation XP, sometimes a reading page or a Canticle stanza (§16).

## 11. The Rosary

The Rosary is a **primary, daily prayer on every path**. It's a sacramental and a prayer, **not a power-up or a weapon**.

- **When:** at the evening Rosary bell (every path), or any time at a devotion stop (a Marian statue is a natural spot). Costs 0 Vigor; takes one clock step for 5 decades.
- **Mysteries by weekday** (St. John Paul II, *Rosarium Virginis Mariae* 38): **Joyful** Monday and Saturday · **Sorrowful** Tuesday and Friday · **Glorious** Wednesday and Sunday · **Luminous** Thursday. Optional custom toggle: Joyful on Advent/Christmas Sundays, Sorrowful on Lent Sundays. The game picks today's set and lets you change it, as the Pope notes the pattern "is not intended to limit a rightful freedom."
- **Bead UI:** a GBC-style loop of beads at the bottom of the screen. The current bead glows. Each decade opens with the mystery's name, a pixel vignette (no depiction of Christ as an actor; scenes are tableaux or symbols), and a **short meditation** (one or two sentences plus a Scripture reference). Press A to advance bead by bead, or choose **Pray calmly**: the beads advance on their own at a slow, steady pace with the prayer text shown. **There's no reward for rushing**: a rushed Rosary (mashing A) gives the same points as a calm one, but only *Pray calmly* or reading each meditation grows Constancy.
- **Gains:** +5 Prayer (5 decades), +1 Purity of heart, +1 Humility, Constancy ▲. October and Oct 7: Constancy gain doubled. A decade inside an encounter steadies Peace (§10).
- **Path variants:**
  - **Franciscan Crown** (the Seraphic Rosary of the **seven joys** of Mary, seven decades): unlocked at novitiate as an alternative on Saturdays and Marian feasts.
  - **Dominican 15-decade rosary** worn at the left side of the belt (part of the habit by the Dominican Constitutions §50). St. Dominic receiving the Rosary from Our Lady is presented as **pious tradition** (Vatican News tells it that way). The Dominican Rosary bell is followed by the **Salve Regina** procession.
  - **Carmelite:** the most Rosaries. The common Rosary bell **plus** an optional private Rosary in the hermitage, plus the 3:00 Litany. The **Brown Scapular** is given at postulancy (the postulant's larger scapular, as in Wyoming) and is presented as a sign of entrustment to Our Lady of Mount Carmel (Directory on Popular Piety 205). It's a reminder prompt for a morning consecration, not a charm.
- **Visible on every sprite:** rosary beads hang at the left hip on all habit sprites (and from the postulant's belt once received).

## 12. Ranks: formation and Holy Orders

Real formation, mapped to game ranks. **Two facts shape everything:**
1. **You're a full friar or monk from your first profession**, not only at priesthood. Priesthood is a *different call within* the life, not a "higher" holiness.
2. **Brothers are a complete vocation.** The lay brother (CFR), the cooperator brother (Dominican), and the lay brother (Carmelite) are not a lower tier. The game has two **tracks** after profession: the **Brother track** and the **Clerical track** (toward diaconate and priesthood). Both have their own capstones and the same maximum Spiritual Health and virtues.

**Time compression (proposal):** 1 real formation year ≈ 2 in-game weeks. All stage lengths below are real, and the in-game lengths are open to tuning.

### Franciscan Friars (CFR-style)

| Rank | Real stage | In game | Address | Gate to petition |
|---|---|---|---|---|
| R0 | Discernment ("Come & See" ×2) | The spawn + entry tasks (§2) | "Postulant" after reception | Finish the 3 counsels tasks |
| R1 | **Postulancy** (~10 months) | Simple lay/work clothes (exact CFR postulant dress unverified: open question); Mass, Hours, Holy Hour, outreach | Postulant | 2 weeks + Formation XP + SH ≥ 60 |
| R2 | **Novitiate** (receives the habit) | Investiture scene; gray habit, cord, religious name; deeper prayer and study | Brother | 3 weeks + Chapter approval |
| R3 | **Temporary profession** (vows renewed yearly, at least 5 years) | First vows ceremony; mission rotations (a mission friary event) | Brother | 5 renewals (1 per week) + SH ≥ 60 |
| R4 | **Perpetual profession** | Solemn ceremony; **choose track** | Brother | — |
| R5b | **Brother track**: lay brother | Porter, cook, street evangelist, later **Local Servant** (a brother can be superior, per CFR) | Brother | Capstone: lead the house as Local Servant for a season |
| R5c | **Clerical track**: priestly studies (begin after perpetual vows, per CFR) | Seminary classes, instituted lector and acolyte | Brother | Study XP + SH |
| R6c | **Diaconate** | Ordination scene; Gospel, homily, Benediction | Brother (house) / Deacon (altar) | Preaching XP + time |
| R7c | **Priesthood** | Ordination scene; **celebrates Mass**, hears confessions | Father | Capstone |

### Dominican Friars (Province of St. Joseph–style)

| Rank | Real stage | In game | Address | Gate |
|---|---|---|---|---|
| R0 | Inquiry, aspirancy, application | Spawn + entry tasks | — | 3 counsels tasks |
| R1 | **Postulancy** (a few weeks) | Lay clothes (no habit until the Aug 8 clothing; exact postulant dress unverified); house of studies orientation | Postulant | 1 week + SH ≥ 60 |
| R2 | **Novitiate** (1 year; clothed in the habit on Aug 8, St. Dominic) | White habit, religious name; chant lessons, Constitutions, lives of Dominican saints | Brother | 2 weeks + Chapter |
| R3 | **Simple profession** (Aug 15; 3 years + a 4th renewal) | Studentate begins: **2 years philosophy, then theology** (Summa thread, §16); **choose track** (clerical or cooperator) | Brother | 4 weeks + Study XP |
| R4 | **Solemn profession** (usually the 5th studentate year) | Kneels before the Prior Provincial with the Constitutions | Brother | — |
| R5b | **Cooperator brother** (1 more year of formation) | Teaching, sacristy, hospital ministry, preaching (non-liturgical) | Brother | Capstone: a mission in the city |
| R5c / R6c | **Diaconate** (often with solemn vows, 5th year) → a **year as deacon in a parish** | Gospel, homily, Benediction; parish deacon year in the DC-like city | Brother / Deacon | Preaching XP |
| R7c | **Priesthood** (after 5–7 years of studies) | Celebrates Mass, hears confessions, preaches | Father | Capstone |

### Carmelite Monks (Wyoming-style)

| Rank | Real stage | In game | Address | Gate |
|---|---|---|---|---|
| R0 | Discernment retreat → **observership** (guest house, then inside the enclosure) | Spawn at the guest house + entry tasks | — | 3 counsels tasks |
| R1 | **Postulancy** (up to 1 year; clothed in brown postulant robes and a larger postulant scapular; "considered a brother") | Postulant robes; classes and daily spiritual direction | Postulant (house: Brother) | 2 weeks + SH ≥ 60 |
| R2 | **Novitiate** (2 years; full brown wool habit, new religious name, e.g. "Br. ___ of Jesus") | Hermitage cell, Rule and Constitutions, Carmelite Doctors | Brother | 4 weeks + Chapter |
| R3 | **Temporary profession** (3 years; long scapular and profession crucifix) | Greater responsibility, ranch work; **track** (lay brother or choir monk toward priesthood). *When the Wyoming monks discern this is unconfirmed: open question* | Brother | 6 weeks |
| R4 | **Perpetual profession** (after 6 years total; "usque ad mortem") | Solemn ceremony, white mantle at feasts | Brother | — |
| R5b | **Lay brother** ("sanctifies his day through manual labor") | Stable master, cobbler, gardener; Brother Lawrence reading thread | Brother | Capstone: a year of hidden faithfulness (Little Way) |
| R6c / R7c | **Diaconate → priesthood** (priests and seminarians wear the **corona** tonsure) | Celebrates the sung conventual Mass in the traditional Carmelite rite; spiritual direction | Father | Capstone |
| — | **Hermit-monk** (optional late call, "alone with the Alone") | Post-game epilogue, not a rank | — | Open question |

**Never-ending:** after the final rank, the game continues as "ongoing formation." There's no "beat the game" because holiness isn't finished.

## 13. Liturgical roles by rank

Only a **validly ordained priest** celebrates Mass (Code of Canon Law c. 900). The game follows that exactly:

| Rank | At Mass | At the Hours | Other |
|---|---|---|---|
| Postulant / novice | **Attends**, sings, may **serve** at the altar, may read a reading as lector if asked | Prays in choir | Sacristy help |
| Professed (either track) | Attends, serves, reads, cantor, sacristan | May lead (hebdomadary for the Office) | Porter, catechesis |
| Instituted lector / acolyte (clerical) | Reads; as acolyte assists at the altar and may help purify vessels | — | — |
| **Deacon** | **Proclaims the Gospel**, may preach the homily at the priest's direction, assists at the altar, announces the intentions, assists with Communion, purifies vessels (GIRM 171) | Leads the Office | Exposition and Benediction of the Blessed Sacrament |
| **Priest** | **Celebrates Mass** (unlocks here) | Leads | Hears confessions, anoints the sick, gives blessings |

**How a priest's Mass plays:** you prepare the homily (Preaching gameplay), vest with the vesting prayers (a calm sequence), and then the Mass is a **reverent non-interactive scene** with the bell at the consecration. No input, no score.

## 14. Failure states

None of these mock the sacred, and none are "game over."

| State | Cause | What happens | Way out |
|---|---|---|---|
| **Tepidity** | SH < 30 for several days (neglect) | A kind talk with the superior; petitions paused; prayer lines read flat | Keep the bells for a few days; confession; spiritual direction |
| **Dryness (the Dark Night)** | **Not caused by failure.** A season event that can come to faithful players, more often near a rank transition or a new mansion (§16) | Fervor stays low, prayer text shows aridity lines ("The psalms feel like dust today."). SH is not reduced | **Keep praying.** Each faithful day gives double Constancy and +Fortitude; finishing the season unlocks Dark Night stanza pages. Spiritual direction explains the signs, without diagnosing |
| **Overextension** | Max work, minimum prayer for days | Fervor slips each morning | Rebalance: adoration, rest |
| **Stumble** | Peace hits 0 in an Inner encounter | Examen at night | Confession scene restores Peace |
| **Delay of vows** | Petitioning with low SH, low Obedience, or no Chapter approval | The superior asks you to wait another week or two (realistic) | Meet the gates |
| **Discerning out** | Only by player choice, offered gently after a long Tepid stretch or at any petition | A respectful ending: "Not every postulant is called here, and that's not failure." Save kept | New game, or continue if chosen. *Whether this exists at all is an open question* |

**Sickness** is never a failure: you rest in the infirmary, are excused from everything, and can quietly offer it up.

## 15. Devotion stops: statues and crucifixes

CJ wants **many** statues and crucifixes throughout every house and city. They're **reverent interaction points**, never items, never collectible, never fought.

- **Pause to pray:** press A at a statue or crucifix → a short prayer text (two to four lines) → small gain → **once per stop per day**.
- **Gains:**
  - **Crucifix:** a short act of love or contrition: +1 Charity or +1 Humility, +1 Prayer.
  - **Our Lady of Sorrows** (Mater Dolorosa: seven swords or a pierced heart, blue/black mantle): +1 Fortitude; opens the **Seven Sorrows** devotion; highlighted on **Sep 15**.
  - **Our Lady of Victory / of the Rosary** (crowned, holding the Child, rosary in hand): +1 Constancy; a natural Rosary start; highlighted on **Oct 7** and all October.
  - **Our Lady, Undoer of Knots** (Mary untying a knotted white ribbon held by angels, crescent and serpent under her feet): +1 Prudence; lets you "hand over a knot" (pick a worry from the day, e.g. a hard conversation). That gives a small Peace bonus the next time you meet that encounter. This is a **devotion, not a liturgical feast**, so no calendar date (background in NOTES.md).
  - **Path statues** (St. Francis, St. Dominic, St. Thomas, Our Lady of Mount Carmel, St. Joseph, St. Thérèse…): +1 to the matching virtue.
- **Devotion route:** visiting all stops in an area in one day (optional) gives a quiet *pilgrim* line in the House Chapter. There's no badge grind.
- **Placement** is listed room by room in WORLD.md.

## 16. Reading threads

Each path has a **reading thread**, a slow progression through a saint's great work, shown in a **scroll/codex UI** (a parchment page in GBC style with a small illuminated initial). Pages unlock through fitting moments, never by grinding. Quotes in game are short; translations and licensing are in NOTES.md.

### Franciscan: The Canticle of the Creatures (St. Francis, c. 1225; the last stanza near his death in 1226)

Each stanza unlocks at a fitting moment and adds a weather/time tie-in to the overworld once found:

| Stanza | Unlock moment | Overworld tie-in after unlock |
|---|---|---|
| Opening ("Most High, all-powerful, good Lord") | First Morning Prayer as a postulant | The title appears on the codex |
| **Brother Sun** | Dawn: step outside after the Office of Readings on a clear morning | Sunrise light ray on the friary yard |
| **Sister Moon and the Stars** | Night Prayer, then step into the yard under a clear sky | Stars twinkle at Night |
| **Brother Wind** (and every kind of weather) | Do outreach on a windy or rainy day without going back inside | Wind animates the city's flags and trees |
| **Sister Water** | Fill the soup pots / wash dishes after the soup line | Fountain and puddle sparkle |
| **Brother Fire** | Light the kitchen stove at dawn, or the chapel candles as sacristan | Candle flicker in the chapels |
| **Sister Mother Earth** | Plant or harvest in the friary garden | Flowers bloom in the yard |
| **Those who pardon for love** | Finish an Outer encounter by **forgiving** someone (or asking forgiveness) in the city | A dove on the friary roof |
| **Sister Bodily Death** | Late-game: sit with a dying man at a hospice (an Outer encounter) or keep the Transitus vigil on Oct 3; a calm memento mori, never morbid | The cemetery bell at evening |
| Closing ("Praise and bless my Lord…") | All stanzas found | **Capstone:** the full Canticle as one illuminated page, sung over the closing scene of the Franciscan path |

### Dominican: the Summa Theologiae (St. Thomas Aquinas)

- **Structure taught in game:** four parts: **Prima Pars** (God, creation), **Prima Secundae** (the human person, happiness, virtues in general), **Secundae Secundae** (the particular virtues: faith, hope, charity, prudence, justice, fortitude, temperance), **Tertia Pars** (Christ, the sacraments). Each part → **questions** → **articles**. Each article has: *Objections*, *On the contrary* (sed contra), *I answer that* (respondeo), *Replies to objections*.
- **Study sessions** in the library each work through one famous article (2 Vigor): I q.1 a.1 (is sacred doctrine needed?), **I q.2 a.3 (whether God exists: the Five Ways)**, I q.13 (the divine names), I-II q.2–3 (what happiness is), I-II q.55 (what a virtue is), II-II q.1–2 (faith), II-II q.17 (hope), II-II q.23 (charity), II-II q.47 (prudence), II-II q.161 (humility), III q.1 a.2 (fittingness of the Incarnation).
- **The article method is the game mechanic:** Disputation encounters (§10) follow objection → sed contra → respondeo → replies. Class, teaching, and street preaching in the DC-like city all use it.
- **Gates:** finishing the Prima Pars set opens *teaching a class*; the Secundae Secundae virtue set opens *street preaching*; the Tertia Pars set is required to petition for the diaconate (clerical) or the city mission (cooperator).
- **Capstone: "straw."** Late in the path, after Mass, Thomas's tradition is told (in December 1273 he stopped writing, saying that what he'd written seemed like straw compared with what he had seen). The player chooses to **set down the pen**. Your Study is complete, and Humility jumps. The lesson: learning serves love.
- **Saint scenes:** the angels' girdle (purity of heart), the crucifix in the study ("You have written well of me, Thomas," told as tradition), with the crucifix only as a reverent backdrop.

### Carmelite: The Interior Castle (St. Teresa of Ávila) + Dark Night (St. John of the Cross) + the Little Way (St. Thérèse)

**Interior Castle: the seven dwelling places ("mansions")** as the Carmelite progression thread. You **read** them; you don't "achieve" them. Each mansion is framed as *"You read the Fourth Dwelling Places…"* with a reflection, never as a claim that the player has reached a mystical state.

| Mansion | Theme (Teresa) | Fitting gate to unlock the reading |
|---|---|---|
| 1st | Entering by prayer; self-knowledge; leaving distractions behind | Complete the entry tasks and your first full day of bells |
| 2nd | Perseverance amid the pull of the old life | 7 days in a row of all bells kept |
| 3rd | An ordered, disciplined life (and its risk of self-satisfaction) | Novitiate + Obedience ≥ 40 + one "pride after success" Inner encounter met with Humility |
| 4th | The prayer of quiet; recollection; the shift from effort to receiving | A dryness season persevered through + 14 days of mental prayer |
| 5th | Deeper union (the silkworm and the butterfly) | Temporary profession; **reading only** |
| 6th | Purifying trials and longing ("the betrothal") | Perpetual profession; **reading only** |
| 7th | Union ("the spiritual marriage"), with Martha and Mary together | Late-game; **reading only**; the text stresses humility and works of love |

Mansions 5–7 are **described, never granted**. There's no "Union" stat and no mystical-grace meter.

**The Dark Night** (St. John of the Cross) frames the **dryness** season (§14): the **night of sense** (common; appears around the 3rd–4th mansions) and the rarer **night of spirit** (late-game). The poem's **8 stanzas** unlock one per persevered dryness week. The **Toledo escape** (1578) is a reverent cutscene, and his small prison cell is the visual. Spiritual direction scenes paraphrase his three signs that dryness is purification and not lukewarmness.

**The Little Way** (St. Thérèse, *Story of a Soul*): small hidden acts of love (setting a brother's place, taking the worst chore, a smile in recreation). Each gives a **quiet daily bonus** (+1 Charity, +1 Humility, max 3 a day). They're **never announced** in the ticker; they show up only in the House Chapter. Hiddenness is the point.

## 17. Collectibles and items

**Theme rules for items:** nothing sacred is a weapon or a buff. Christ and the Eucharist are never items. Relics are never items. Sacramentals enable prayer actions. Books unlock reading.

| Category | Examples | Rule |
|---|---|---|
| **Saints' books** (unlock reading threads and WORD moves) | Franciscan: Canticle, Admonitions, the Rule, *Little Flowers*. Dominican: *Summa Theologiae*, St. Dominic's Nine Ways of Prayer, St. Catherine's *Dialogue*. Carmelite: *Interior Castle*, *The Way of Perfection*, *Dark Night*, *Ascent of Mount Carmel*, *Story of a Soul*, Br. Lawrence's *Practice of the Presence of God* (a lay brother's book, a natural fit for the brother track) | Borrowed from the library with permission (poverty). Returned when read. |
| **Sacramentals** | Rosary (path variants), Brown Scapular, holy water at chapel doors, blessed candles (Candlemas), palms, ashes, medals, Tau cross (Franciscan), profession crucifix (Carmelite) | Enable a prayer action or mark a rank. No stats. |
| **Habit pieces** | Tunic, cord/belt, hood/capuce/cowl, scapular, cappa (Dominican), white mantle (Carmelite), sandals or black shoes | Given at investiture/profession only. |
| **Holy cards album** | One card per saint met in stories, statues, and readings (portrait + 3-line bio) | The only "collect them all" item. Cards are images of saints, never relics, never Christ. |
| **Canticle stanzas / Summa articles / Mansion readings / Dark Night stanzas** | §16 | Pages in the codex UI. |
| **Common-store items** | Notebook, breviary, work gloves, a lantern, sandals | By permission; return or pass on. |
| **Outreach supplies** | Sandwiches, socks, blankets, coffee | Given away in the city; never "used" on yourself. |
| **Fixtures (never items)** | Crucifixes, the San Damiano cross, tabernacle, monstrance, relic reliquary, statues, Stations of the Cross | Interact to pray only. |

## 18. Saves

- `localStorage` key **`sanctus-save-v1`**, one JSON blob, auto-saved after each action (as in Brick City).
- Stores: path, **rank and role title** (no player name), religious name if given (an index into a saint list), day/week/season, Vigor, Weariness, Nourishment, SH components, virtues, skills, Constancy/Fervor, codex pages, holy cards, statue cooldowns, rival progress, and position (tile size 32).
- If the JSON is broken or the version doesn't match, Resume hides itself instead of crashing.
