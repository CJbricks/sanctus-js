# SANCTUS: Notes for people learning the project

This is the beginner's map of Sanctus, plus the **decision log** and **sources**. The design itself is in [`GAME_RULES.md`](GAME_RULES.md) and [`WORLD.md`](WORLD.md). The scaffold code now exists under `src/`; start with **§1** and **§1b** below.

## 1. Learning notes (start here)

**What kind of game is this?** A top-down, tile-based RPG in the browser, styled like a Game Boy Color game. You walk a small map with the arrow keys or WASD (or an on-screen d-pad), press **Z/A** to talk or interact and **X/B** to go back, and menus and dialogue boxes do the rest. It's the same feel as Brick City.

**How is the code laid out?** (scaffold, matching Brick City's folder ideas)
```
src/app/                 Next.js App Router (layout + the one page)
src/components/game/     React UI: canvas host, dialogue box, touch D-pad/A/B
src/game/                Pixi scenes, engine, draw helpers (all art in code)
src/game/audio/          original Web Audio chiptune stub (no audio files)
src/lib/                 RULES: plain JavaScript (save, callings, input map, constants)
docs/                    these notes, the rules, the world, and concept references
```

**Why are the rules in plain functions?** Each system (the day and bells, Vigor, Spiritual Health, encounters, the Rosary, ranks) becomes a small file in `src/lib/` with a matching `*.test.js` beside it. The menus call those functions, and the tests call the same ones, so you can check the rules without opening a browser (`npm test`). That's how Brick City works too.

**Where do the numbers live?** In `src/lib/constants.js`, so tuning (tile size, save key, canvas size) never means hunting through menus.

**Key words you'll see:**
| Word | Meaning |
|---|---|
| *Bell* | A fixed event in the day (an Hour, Mass, the Rosary). It costs no Vigor but moves the clock. |
| *Vigor* | The day's 10 energy blocks for work, study, and outreach (Brick City's energy). |
| *Horarium* | A religious house's daily schedule. |
| *Obedience* | (1) the vow and virtue; (2) your assigned job in the house. |
| *Postulant / novice / professed* | The stages of entering religious life. |
| *Superior* | The head of the house: the Local Servant (CFR), the Prior (Dominican), Father Prior (Carmelite). |
| *Encounter* | A turn-based scene: a temptation (Inner) or a hard conversation (Outer). |
| *Devotion stop* | A statue or crucifix where you can pause to pray once a day. |
| *Codex* | The scroll/book UI for the reading threads (Canticle, Summa, Interior Castle, Dark Night). |

**Every source file starts with a header comment** saying what it's for, and non-obvious code has a short plain-language "why" comment.

## 1b. How the scaffold works (beginner guide)

Read this after cloning. It explains the code that actually runs today — not the full game loop in GAME_RULES, just the title → calling → placeholder path.

### Folder layout (who does what)

| Place | Job |
|---|---|
| `src/app/layout.js` | Loads **Press Start 2P** with `next/font/google`, sets metadata, wraps every page. |
| `src/app/page.js` | The only route. Puts `GameApp` inside Chakra `Providers`. |
| `src/components/game/GameApp.js` | Screen brain: installs audio, wires keyboard/touch, opens dialogue after a calling is chosen, writes the save stub. |
| `src/components/game/GameCanvas.js` | Creates/destroys the Pixi engine inside a DOM node. |
| `src/components/game/DialogueBox.js` | React text window on top of the canvas (GBC-style). |
| `src/components/game/TouchControls.js` | On-screen D-pad + A/B for phones. |
| `src/game/engine.js` | Pixi `Application` + scene swap (title ↔ calling). |
| `src/game/scenes/*.js` | What you see: title logo, calling list — drawn with `Graphics`, no PNGs. |
| `src/game/draw.js` | Shared pixel helpers (rects, text, character placeholder). |
| `src/game/audio/engine.js` | Tiny GB-style Web Audio stub (pulse + noise). Unlocks only after a gesture. |
| `src/lib/save.js` | `serialize` / `deserialize` / **`migrate`** / `loadSave` / `writeSave`. SSR-safe. |
| `src/lib/callings.js` | The three paths' menu data. |
| `src/lib/input.js` | Keyboard code → `up`/`down`/`left`/`right`/`a`/`b`. |

### How a frame gets drawn

1. `GameCanvas` mounts and calls `createGameEngine(host)`.
2. Pixi makes a **320×288** canvas (`VIEW_WIDTH` × `VIEW_HEIGHT`). CSS stretches it with `image-rendering: pixelated` so 32×32 tiles stay sharp.
3. The engine shows either `titleScene` or `callingScene`. Each scene owns a Pixi `Container` full of `Graphics` rectangles and `Text`.
4. Pixi's ticker calls `scene.tick(deltaMs)` every frame (used for the blinking "Press A" prompt).
5. When you pick a calling, React shows `DialogueBox` **over** the canvas — the world draw and the UI text stay separate on purpose.

### How input flows

```
Keydown or touch button
  → actionFromKey() or the button's action name ("a", "up", …)
  → GameApp.forwardAction(action)
      → unlockAudio()   // browsers need a gesture before sound
      → if dialogue open: A/B closes it
      → else engine.handleAction(action) → current Pixi scene
```

Keyboard map: Arrows/WASD move · Z/Enter/Space = A · X/Escape = B · M mute. Touch uses the same action names so scenes never care which device you used.

### How saves work

- Key: **`sanctus-save-v1`** (see `SAVE_KEY` in `constants.js`).
- Choosing a calling runs `createNewSave` → `writeSave` (stamps `updatedAt`).
- `loadSave` / `writeSave` check for `window` first so Next.js server render does not crash.
- **`migrate(data)`** fills missing fields and clamps meters. When we add Rosary counts or inventory later, old saves keep working by getting defaults instead of being thrown away. A wrong `version` still means "no save".

### How to run tests

```bash
npm test          # Vitest: save round-trip + migrate, input map, callings data
npm run lint      # ESLint with Next 16 flat config
npm run build     # production build (same as Vercel)
```

Tests live next to the code (`src/lib/*.test.js`) and run in **Node**, not a browser — because save/input/callings are pure functions.

### What to build next (for learners)

1. A tiny overworld map (40×24 tiles from WORLD.md) with collision.
2. A 4-frame walk cycle on the 32×40 character stub in `draw.js`.
3. Real dialogue from finding the superior (entry tasks).
4. Songs in `src/game/audio/` using the pulse / wave / noise channels.

## 2. Decision log

| # | Date (CT) | Decision | Why |
|---|---|---|---|
| D1 | 2026-11-21 | Docs only for now: README, GAME_RULES, WORLD, NOTES, concepts placeholders. No code, no cloud agents, no repo until CJ approves | CJ's instruction |
| D1b | 2026-11-21 | First code scaffold lands on `CJbricks/sanctus-js`: Next 16 / React 19 / Pixi 8 / Chakra 3 / Vitest; title → Choose Your Calling placeholder; docs kept as-is with Getting started + NOTES §1b | Scaffold briefing |
| D2 | 2026-11-21 | Repo name `CJbricks/sanctus-js` (was TBD `sanctus`) | Repo created |
| D3 | 2026-11-21 | Brick City is a **pattern reference only**; the mapping table was built from the real repo (README + NOTES at `53aa034`) | Accuracy |
| D4 | 2026-11-21 | Three paths named for real communities; all houses, cities, parishes, and characters fictional | CJ's theme rule |
| D5 | 2026-11-21 | **Encounters (Option C, Unified)** replace races and battles | Fits all three paths; people are never enemies |
| D6 | 2026-11-21 | **No coins.** Poverty = the common life + asking permission | Vow of poverty |
| D7 | 2026-11-21 | **Brother track and Clerical track** after profession, equal in dignity; you're a full friar/monk from first profession | Accuracy: brothers are a full vocation |
| D8 | 2026-11-21 | Only priests celebrate Mass; Mass is a non-interactive scene for every rank | c. 900; reverence |
| D9 | 2026-11-21 | Fasting/penance are good **only within permission and health**; hard safety floor | Prudence; never model harm |
| D10 | 2026-11-21 | Dryness is **not** a punishment and is separate from Spiritual Health | St. John of the Cross |
| D11 | 2026-11-21 | **Footwear:** CFR friars and Carmelite monks wear **sandals**; Dominicans wear **black shoes** | CJ's correction (see §3) |
| D12 | 2026-11-21 | **No name entry.** The player is addressed by role only (Postulant → Brother → Father, or Brother for life); the save stores the rank, not a name | CJ: names matter less than the vocation |
| D13 | 2026-11-21 | Opening: spawn on the grounds in **lay clothes** → find the superior → three counsels tasks → Postulant | CJ's opening flow |
| D14 | 2026-11-21 | Postulants **embrace** the counsels through tasks; **vows** are professed only at first and solemn/perpetual profession | Accuracy fix (told to CJ) |
| D15 | 2026-11-21 | The **Rosary** is a core daily system on every path, with weekday mysteries per *Rosarium Virginis Mariae* 38 | CJ's direction |
| D16 | 2026-11-21 | **Many** statues (Sorrows, Victory/Rosary, Undoer of Knots) and crucifixes as devotion stops; never items | CJ's direction |
| D17 | 2026-11-21 | Reading threads: Canticle (Franciscan), Summa (Dominican), Interior Castle + Dark Night + Little Way (Carmelite); mystical stages are **read, not achieved** | CJ's direction; reverence |
| D18 | 2026-11-21 | In-game text uses **public-domain** translations or our own paraphrase until permissions are confirmed | Licensing (§4) |

## 3. Facts checked and corrected from the original direction

| CJ's direction | What the sources say | What the game does |
|---|---|---|
| Dominicans: "tonsured hair" | The clerical tonsure was ended for the Latin Church in 1972 (*Ministeria quaedam*: "first tonsure is no longer conferred"); a Dominican friar notes "the tonsure is no longer given." Modern Province of St. Joseph friars don't wear one. Medieval saints (Thomas, Dominic) did | Modern Dominican sprites: neat short hair. Saint art keeps the historical tonsure |
| Dominicans: "white habit, black cappa/scapular" | Constitutions §50: white **tunic, scapular, and capuce**, plus a black **cappa and capuce**, a leather belt, and a rosary. The scapular is **white**, not black (black scapulars were for pre-Vatican II lay brothers) | White scapular; black cappa outdoors, preaching, and in winter choir |
| "All discalced, all sandals" (then corrected by CJ) | CFR: "We typically wear sandals, although in cold weather we may wear shoes" (Fr. Glenn Sudano). Wyoming Carmelites: "poor leather sandals crafted by their own Brother Cobbler"; they follow the Discalced reform. Dominicans aren't a discalced order: the primitive constitutions say "shoes and socks shall be worn as necessity requires," and medieval English Dominicans were called "shod" friars | Sandals for CFR and Carmelites; **black shoes** for Dominicans. *Note:* CFR are Capuchin-tradition friars who wear sandals; "discalced" is formally a Carmelite (and some other orders') term |
| "Carmelite **Monks**" | Carmelites (O.Carm., OCD) are historically **mendicant friars**: they began as hermits on Mount Carmel and joined the mendicant movement under Innocent IV (1247). The Wyoming community calls itself **monks**: a cloistered, monastic expression of the Discalced reform, canonically a **public association of the faithful "in itinere"** toward becoming a religious institute (per their site) | Path name "Carmelite Monks" kept (accurate to the inspiring community); NOTES explains the friar/monk distinction |
| Carmelites: "brown habits, tonsure" | Confirmed: brown wool habit, brown scapular, cowl, leather belt, rosary, **white mantle** for Mass and the Office on major feasts; **shaved monastic tonsure**, priests and seminarians a thin **corona** | As sourced |
| Carmelites: "Liturgy of the Hours" | They pray the traditional **Divine Office in Latin** (Matins, Lauds, Prime, Terce, Sext, None, Vespers, Compline) and a sung Latin Carmelite conventual Mass with chant | Carmelite bells use the traditional Hour names |
| "Rising through brother/deacon to priest and full friar" | You're a full friar/monk at first profession. "Brother" isn't a step below priest; lay/cooperator brothers are a complete vocation. CFR priestly studies begin after perpetual vows; Dominican clerical brothers are ordained deacons around solemn vows | Two tracks after profession (GAME_RULES §12) |
| "Postulants accept each vow" | No vows in postulancy; vows come at the end of the novitiate (temporary/simple), then solemn/perpetual | Entry tasks *embrace* the counsels; vows are professed later |
| CFR superior "guardian" | CFR call the local superior the **Local Servant** (and the General Servant) | "Local Servant" |
| Rosary weekdays | Confirmed by *Rosarium Virginis Mariae* 38: Joyful Mon/Sat, Sorrowful Tue/Fri, Glorious Wed/Sun, Luminous Thu | As sourced |
| Our Lady Undoer of Knots feast | A devotion, not a liturgical feast. The painting (c. 1700, Johann Georg Melchior Schmidtner) is in St. Peter am Perlach, Augsburg; Pope Francis spread it from Argentina after receiving a postcard of it (he said in 2017 he'd never been to Augsburg) | No calendar date |
| Our Lady of Victory | Instituted by St. Pius V after Lepanto (Oct 7, 1571) as Our Lady of Victory; renamed Our Lady of the Rosary by Gregory XIII | Oct 7 + October Rosary month |
| St. Dominic and the Rosary | Vatican News tells it as a tradition; historians debate it | Presented as pious tradition |

## 4. Texts and translations (licensing)

| Work | Sources fetched | Translation and status | Plan |
|---|---|---|---|
| **Canticle of the Creatures** (St. Francis, c. 1225 near San Damiano; by tradition the "pardon" stanza was added to make peace between Assisi's bishop and mayor, and "Sister Bodily Death" near his death on Oct 3, 1226) | Siena College PDF (bilingual, Umbrian original + English) and the official OFM 800th-anniversary card (`ofm.org/uploads/Cantico_EN.pdf`) | **Both are the same translation**: *Francis of Assisi: Early Documents*, vol. I (Armstrong, Hellman, Short; New City Press, 1999), pp. 113–114, the edition Pope Francis cites in *Laudato Si'*. It's copyrighted, and the OFM card shows no license. The Siena copy has OCR errors; the OFM card has small typos ("expecialy"). The **Umbrian original** (13th c.) is public domain. Note: Francis's "per" can mean "through," "for," or "by," which explains why translations differ | In game: the Umbrian line + a **public-domain English translation** (e.g. Paschal Robinson, *The Writings of Saint Francis of Assisi*, 1906; to verify that it includes the Canticle) or our own plain paraphrase. **Open question:** ask New City Press for permission to use the FA:ED wording |
| **Summa Theologiae** (St. Thomas) | New Advent `/summa/` and aquinas.cc (Aquinas Institute) | New Advent: the **1920 "Second and Revised Edition," literally translated by Fathers of the English Dominican Province** (public domain in the US as a pre-1929 publication), but the *online edition* says "Copyright © 2017 by Kevin Knight." Aquinas.cc: **Shapcote** translation "edited and revised by The Aquinas Institute," © Aquinas Institute, Inc. (2018); free to read online, but no reuse license found | Take the 1920 text from a **public-domain scan** (not New Advent's pages); quote short lines only. **Open question:** permission from New Advent/Aquinas Institute if CJ wants their editions |
| **Interior Castle** (St. Teresa) | `carmelitemonks.org/Vocation/StTeresa-TheInteriorCastle.pdf` | A Google Books scan of the **Rev. John Dalton translation (London: T. Jones, 1852)**, "The Interior Castle; or, The Mansions." Image-only (no text layer). **Public domain** | Use Dalton (or the Stanbrook 1912/1921 translation, also likely PD in the US) for short quotes. **Open question:** confirm the edition CJ prefers |
| **Dark Night of the Soul** (St. John of the Cross) | `basilica.ca/…Dark night of the soul.pdf` (Cloudflare blocked curl; read via the fetch tool) | **E. Allison Peers, 3rd revised ed. (Image Books, 1959)**. The electronic edition's preface (Harry Plantinga, 1994) says it was scanned from an "uncopyrighted 1959 Image Books third edition… and is therefore in the public domain." Peers died in 1952, so UK/EU status may differ | Short quotes only. **Open question:** confirm US-only PD is enough, or use David Lewis's 1864 translation (PD everywhere) |
| **Story of a Soul** (St. Thérèse) | Not fetched | Thomas N. Taylor's 1912 translation is PD in the US; modern ICS translation is copyrighted | Use Taylor or paraphrase |

**What the texts taught the design:**
- *Canticle:* ten parts. The opening praise, Brother Sun, Sister Moon and the Stars, Brother Wind (and every weather), Sister Water, Brother Fire, Sister Mother Earth, those who pardon and bear trials in peace, Sister Bodily Death, and the closing "Praise and bless my Lord… with great humility" (GAME_RULES §16).
- *Summa:* four parts → questions → articles; each article runs objections → *sed contra* → *respondeo* → replies. That's the Disputation mechanic. The Five Ways are I q.2 a.3 ("Whether God exists?").
- *Interior Castle:* seven "mansions"/dwelling places, entered by prayer and self-knowledge; the later ones are union, which is why they're **readings, not achievements**.
- *Dark Night:* the **night of sense** is common ("comes to many"); the **night of spirit** is "the portion of very few." Book I ch. IX gives signs that dryness is this purification rather than lukewarmness or illness, which is why the game separates *Dryness* from *Tepidity*.

## 5. Sources

**Franciscan (CFR)**
- Formation process (discernment, ~10-month postulancy, novitiate with the habit, temporary profession renewed yearly for at least five years, perpetual profession, priestly studies after perpetual vows, religious brothers): https://www.franciscanfriars.com/formation-process
- Prayer life and horarium (five Hours, daily Mass, evening Holy Hour, daily Rosary, weekly recollection and hermitage day, Our Lady of Guadalupe): https://www.franciscanfriars.com/prayer-life
- Religious (lay) brother, "Servant (superior) of a friary": https://www.franciscanfriars.com/vocations/religious-brother
- History, the gray "undyed wool" habit, Capuchin roots, 1987 South Bronx founding: https://www.franciscanfriars.com/history
- Friaries list (to avoid real names): https://www.franciscanfriars.com/friaries
- Habit, three-knot cord, sandals, beards (Fr. Glenn Sudano interview): https://www.catholicworldreport.com/2014/06/19/the-franciscan-friars-of-the-renewal-evangelizing-amid-poverty-and-secularism/
- "Local Servant" usage (CFR Europe): https://www.franciscanfriars.co.uk/friary/st-pio-bradford
- St. Francis (Benedict XVI audience, death Oct 3, 1226, the Canticle): https://www.vatican.va/content/benedict-xvi/en/audiences/2010/documents/hf_ben-xvi_aud_20100127.html
- Canticle (Siena College PDF): https://www.siena.edu/files/resources/canticle-with-no-paragraph.pdf
- Canticle (OFM): https://ofm.org/uploads/Cantico_EN.pdf
- *Laudato Si'* (cites FA:ED for the Canticle): https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html

**Dominican**
- Formation in the Province of St. Joseph (novitiate, simple and solemn profession, the profession formula of obedience, studentate, clerical vs. cooperator brothers): https://opeast.org/vocations/formation-in-the-province-of-st-joseph/
- Vocations (inquiry, aspirancy, philosophy then theology, solemn vows and diaconate in the 5th year, the deacon year): https://dominicanfriars.org/vocations/
- Postulancy, Aug 8 clothing, Aug 15 first profession, 5–7 years to ordination: https://dominicanfriars.org/freedom-for-god/
- Constitutions §50 (the habit): https://lco.opcentral.org/node/8109
- Dominican habit FAQ (cappa custom, shoes not specified, lay brothers' black scapular before Vatican II): https://english.op.org/godzdogz/quodlibet-31-faqs-about-the-dominican-habit/
- "Tonsure is no longer given" (Fr. Augustine Thompson, O.P.): https://www.newliturgicalmovement.org/2012/01/on-vesture-of-deacon-and-subdeacon-in.html
- Primitive Constitutions (shoes and socks): http://www.domcentral.org/trad/domdocs/0011.htm
- "Shod" friars (Gumbley, O.P.): http://www.domcentral.org/library/spir2day/863836gumbley.html
- St. Dominic (Benedict XVI): https://www.vatican.va/content/benedict-xvi/en/audiences/2010/documents/hf_ben-xvi_aud_20100203.html
- St. Thomas Aquinas (Benedict XVI): https://www.vatican.va/content/benedict-xvi/en/audiences/2010/documents/hf_ben-xvi_aud_20100602.html
- St. Thomas Aquinas (Catholic Encyclopedia, 1912; the angels' girdle; Reginald of Piperno): https://www.newadvent.org/cathen/14663b.htm. *The "straw" saying is from the early biographies; a primary-source citation is still to add (open question).*
- Summa (New Advent, 1920 English Dominican translation): https://www.newadvent.org/summa/ · Five Ways: https://www.newadvent.org/summa/1002.htm
- Summa (Aquinas Institute, Shapcote, Latin/English): https://aquinas.cc/la/en/~ST.I · copyright page: https://www.aquinasinstitute.org/_files/ugd/9cabc9_5727791d0c1b4340bd9ffbe24cf8d4e0.pdf

**Carmelite**
- Carmelite Monks of Wyoming (cloistered, Discalced reform, public association "in itinere," Latin Mass with chant, lay brothers and priests, possible hermit life): https://carmelitemonks.org/
- Formation process (observership, postulancy up to 1 year in brown robes with a larger scapular, 2-year novitiate with a religious name, 3 years of temporary vows with the long scapular, perpetual vows after 6 years): https://www.carmelitemonks.org/Vocation/FormationProcess.php
- The Holy Habit (brown wool, cincture, rosary at left, cowl, scapular over the cowl, sandals, profession crucifix, tonsure and the priests' corona, white mantle, work habit): https://www.carmelitemonks.org/HolyHabit.php
- Horarium (Midnight Matins/Lauds through Compline; two hours of mental prayer; common Rosary): https://www.carmelitemonkshorarium.org/
- Interior Castle (Dalton, 1852 scan): https://www.carmelitemonks.org/Vocation/StTeresa-TheInteriorCastle.pdf
- Dark Night (Peers, 1959): https://basilica.ca/documents/2016/10/St.%20John%20of%20the%20Cross-Dark%20night%20of%20the%20soul.pdf
- Carmelites as mendicant friars (O.Carm.): https://www.ocarm.org/en/our-way-of-life/who-are-the-carmelites · history: https://www.ocarm.org/en/our-way-of-life/history
- St. Teresa (Benedict XVI): https://www.vatican.va/content/benedict-xvi/en/audiences/2011/documents/hf_ben-xvi_aud_20110202.html
- St. John of the Cross (Benedict XVI): https://www.vatican.va/content/benedict-xvi/en/audiences/2011/documents/hf_ben-xvi_aud_20110216.html
- St. Thérèse (Benedict XVI): https://www.vatican.va/content/benedict-xvi/en/audiences/2011/documents/hf_ben-xvi_aud_20110406.html · Doctor of the Church, 1997: https://www.vatican.va/content/john-paul-ii/en/apost_letters/1997/documents/hf_jp-ii_apl_19101997_divini-amoris.html
- Brown Scapular (Directory on Popular Piety and the Liturgy, 2001): https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20020513_vers-direttorio_en.html

**Church law, liturgy, and doctrine**
- Only a priest confects the Eucharist (c. 900): https://www.vatican.va/archive/cod-iuris-canonici/eng/documents/cic_lib4-cann879-958_en.html
- Fast and abstinence (cc. 1249–1253): https://www.vatican.va/archive/cod-iuris-canonici/eng/documents/cic_lib4-cann1244-1253_en.html · USCCB: https://www.usccb.org/prayer-and-worship/liturgical-year-and-calendar/lent/catholic-information-on-lenten-fast-and-abstinence
- Sacramentals (cc. 1166ff.): https://www.vatican.va/archive/cod-iuris-canonici/eng/documents/cic_lib4-cann1166-1190_en.html · CCC 1667–1679: https://www.vatican.va/archive/ENG0015/__P58.HTM
- Superstition (CCC 2111): https://www.vatican.va/archive/ENG0015/__P7E.HTM
- Consecrated life and the evangelical counsels (CCC 914–933): https://www.vatican.va/archive/ENG0015/__P2A.HTM
- Religious institutes (cc. 573ff.): https://www.vatican.va/archive/cod-iuris-canonici/eng/documents/cic_lib2-cann573-606_en.html
- Deacon at Mass (GIRM 171): https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_en.html
- End of first tonsure (*Ministeria quaedam*, 1972): https://www.vatican.va/content/paul-vi/en/motu_proprio/documents/hf_p-vi_motu-proprio_19720815_ministeria-quaedam.html
- Rosary weekdays (*Rosarium Virginis Mariae* 38): https://www.vatican.va/content/john-paul-ii/en/apost_letters/2002/documents/hf_jp-ii_apl_20021016_rosarium-virginis-mariae.html
- Our Lady of the Rosary / Victory: https://vaticanstate.va/en/component/content/article/7-october-our-lady-of-the-rosary.html?Itemid=216&catid=51 · https://www.vaticannews.va/en/liturgical-holidays/memorial-of-our-lady-of-the-rosary.html · https://www.op.org/saints/b-mariae-virginis-a-rosario/
- Undoer of Knots: https://www.vaticannews.va/de/papst/news/2020-10/papst-augsburg-pilger-gebet-maria-knotenloeserin-generalaudienz.html · https://www.vaticannews.va/it/chiesa/news/2021-10/vergine-maria-scioglie-i-nodi-augsburg-germania-papa-francesco.html · https://www.ncregister.com/cna/how-pope-francis-spread-devotion-to-our-lady-undoer-of-knots

**Brick City** (pattern reference): https://github.com/CJbricks/brick-city (README.md, docs/NOTES.md, `src/lib/` at `53aa034`)

## 6. Open questions for CJ

1. **Repo name**: `CJbricks/sanctus`?
2. **Stack**: confirm it matches Brick City (Next.js JS, pixi.js, Chakra UI, Vercel, localStorage, Vitest), and whether any Brick City *code* may be copied or only its patterns.
3. **Time compression**: is ~2 in-game weeks per real formation year right? (It sets how long a full playthrough takes.)
4. **Religious name at novitiate**: on (picked from a saint list, never typed) or off (role titles only)?
5. **Deacon address**: "Brother" in the house and "Deacon" at the altar, or "Deacon" everywhere?
6. **Postulant dress**: Carmelites are sourced (brown postulant robes + larger scapular). For CFR and Dominican postulants, the exact dress wasn't found; is simple lay clothes OK until investiture?
7. **Carmelite track timing**: when does a Wyoming monk discern lay brother vs. priesthood? Not on their site; ask them or keep the game's choice at temporary profession?
8. **Dominican horarium**: the house of studies' exact times weren't published; OK to use the approximate schedule?
9. **Discerning out**: include a gentle "this isn't my calling" ending, or leave it out?
10. **Hermit-monk epilogue** for Carmelites: include?
11. **Women's communities** (Poor Clares, Dominican nuns/sisters, Discalced Carmelite nuns) as future paths?
12. **Rival**: should the companion stay all game, or could his story include discerning out (realistic, poignant)?
13. **Encounters**: approve Option C (Unified Encounters with Inner, Outer, and Dominican Disputation)?
14. **Mass at priest rank**: is a fully non-interactive scene right, with only homily prep and vesting playable?
15. **Canticle text**: ask New City Press for the FA:ED translation (the OFM's), or use a public-domain translation / our own paraphrase?
16. **Summa text**: use the 1920 English Dominican translation from a public-domain scan, or ask New Advent / the Aquinas Institute?
17. **Interior Castle**: Dalton (1852, from the Wyoming monks' PDF) or Stanbrook (1912/1921)?
18. **Dark Night**: Peers 1959 (stated public domain in the US) or Lewis 1864?
19. **"Straw" quote**: OK to tell it as tradition ("It is told that…") until we add a primary-source citation?
20. **Chant**: original chant-inspired melodies only, or arrangements of public-domain Gregorian melodies?
21. **Reference images**: the uploads (Franciscan 4, Aquinas 3, Carmelite 6 + 3 saint portraits) still need copying into `docs/concepts/` by the main agent; more are wanted (see each folder's README).
22. **Fictional names**: OK with St. Juniper Friary / Five Bridges City, House of Studies of St. Raymond / Capitol City, Monastery of St. Elijah / Thornback high country?
23. **Seasonal Rosary custom**: turn on Joyful/Sorrowful Sundays in Advent/Lent by default?
