# SANCTUS

*A Game Boy Color–style Catholic JRPG about growing in holiness.*

> Repo: [`CJbricks/sanctus-js`](https://github.com/CJbricks/sanctus-js). Status: **Franciscan playable slice + graphics upgrade**. Title → Choose Your Calling → friary grounds (detailed code-drawn tiles/sprites, walk, talk, entry tasks → Postulant). Dominican / Carmelite show "coming soon".

You are a young man who has just knocked on the door of a religious house. You don't win by beating anyone. You win by becoming a saint, slowly: one Office, one Mass, one soup line, one hard conversation at a time. The look and feel follow early Pokémon-era handhelds (a top-down tile overworld, dialogue boxes, menus, a rival, tall grass). All art, music, and names are **original and drawn in code**. *Brick City* (`CJbricks/brick-city`) is a **pattern reference only**: we reuse its ideas (calendar, energy blocks, meters, unlock gates), not its code or assets.

---

## Choose Your Calling

The start screen is **Choose Your Calling**. You pick one of three real Catholic religious families. Each one has its own patron saints, home base, outside world, look, and mix of daily tasks. The houses, cities, parishes, and characters in the game are **fictional**.

| | Franciscan Friars | Dominican Friars | Carmelite Monks |
|---|---|---|---|
| **Inspired by** | Franciscan Friars of the Renewal (CFR) | Order of Preachers (O.P.), Province of St. Joseph | Carmelite Monks of Wyoming (Discalced Carmelite reform, cloistered) |
| **Patrons** | St. Francis of Assisi, St. Clare; Our Lady of Guadalupe (CFR patroness) | St. Dominic, St. Thomas Aquinas; Our Lady of the Rosary | Our Lady of Mount Carmel, St. Elijah, St. Teresa of Ávila, St. John of the Cross, St. Thérèse of Lisieux |
| **Home base** | A small, simple friary: two chapels, common rooms, cells | A large house of studies: chapel and choir, libraries, classrooms, cloister | A castle-like mountain monastery inside a cloister wall: chapel, hermitages, gardens, stables |
| **Outside world** | *Five Bridges City*, a busy NYC-like city: soup line, streets, subway, shelters | *Capitol City*, a DC-like city: avenues, a university, parishes, hospitals, a long green | *The Thornback high country*, a Wyoming-like range: pasture, horses, cattle, creek, meadow |
| **Day leans toward** | Service to the poor + adoration | Study, teaching, preaching | Liturgy and contemplation (most Hours, Rosaries, mental prayer) + manual labor |
| **Look** | Gray Capuchin-style habit with long hood, white cord with three knots, beard, short buzzed hair, **sandals** | White tunic, scapular, and capuce; black cappa and capuce for outdoors and winter choir; leather belt; rosary at the left hip; neat short hair (no tonsure, see notes); **black shoes** | Brown wool habit, brown scapular, cowl, leather belt, rosary; white mantle for Mass and Office on feasts; shaved monastic tonsure (priests: a thin corona); **sandals** |

Every path has daily Mass, the Liturgy of the Hours (the Carmelites pray the traditional Divine Office in Latin), daily mental prayer, daily study, and daily Scripture reading.

> [CONCEPT IMAGE: docs/concepts/franciscan/habit.png] · [CONCEPT IMAGE: docs/concepts/dominican/habit.png] · [CONCEPT IMAGE: docs/concepts/carmelite/habit.png]

## Opening

Title → **Choose Your Calling** → you appear on the **grounds** outside the house in **ordinary lay clothes**. Your first task is to **find the superior**: the Local Servant (Franciscan), the Prior (Dominican), or Father Prior (Carmelite). He sets you three entry tasks, one for each evangelical counsel: **poverty** (give your things to the poor), **chastity** (a quiet resolution of purity of heart before Our Lady), and **obedience** (a humble chore done exactly as asked). Then you're received as a **Postulant** (simple postulant outfit — or Carmelite brown postulant robes). Vows come later, at first and solemn profession. There's **no typed name entry**: you're addressed by your role (Postulant, then Brother, then Father if ordained). At novitiate investiture you receive a **religious name** from a saint list. A deacon is *Brother* in the house and *Deacon* at the altar.

## Core loop

1. **Wake at the bell** and see your day: which Hours, Mass, obediences (assigned jobs), and free windows are on the board.
2. **Keep the bells.** Go to the Hours, Mass, adoration, and the Rosary. These are the spine of the day. They don't spend energy, but they set the clock.
3. **Spend your Vigor** (10 blocks a day) in the open windows: outreach in the city, study and class, manual work, helping a brother.
4. **Meet Encounters** (Unified: Inner temptation, Outer hard conversation, and Dominican Disputation). Your *virtues* are your moves; people are never enemies.
5. **Pray the Rosary** every day (mysteries by weekday; Joyful on Advent/Christmas Sundays and Sorrowful on Lent Sundays by default), and pause at the many statues and crucifixes along the way.
6. **Fast and do penance within obedience.** Penance is good here, but only what your superior permits. Prudence is a virtue too.
7. **Sleep, examine your conscience, and grow.** Spiritual Health and your virtues rise. You petition for the next stage of formation: postulant, novice, vows, and then either the brother's path or the path to diaconate and priesthood.

Each path also has a **reading thread**: St. Francis's *Canticle of the Creatures*, St. Thomas's *Summa*, or St. Teresa's *Interior Castle* with St. John of the Cross's *Dark Night* and St. Thérèse's Little Way.

A week ends with **Sunday** (rest, no fasting, a feast for the house) and a **House Chapter** summary. The liturgical seasons (Advent, Christmas, Lent, Easter, Ordinary Time) change what the days ask of you.

## The three paths at a glance

- **Franciscan Friars.** You'll spend the most time *outside*: feeding the homeless, walking the streets, visiting shelters. The friary is small and detailed. The evening Holy Hour in the adoration chapel is the heart of the day. The San Damiano cross hangs over the Mass chapel.
- **Dominican Friars.** "To contemplate and to hand on to others the fruits of contemplation." Your days are full of class, the library, disputations, and learning to preach, with outings into the city to teach and serve. You'll earn the most Study and Preaching XP.
- **Carmelite Monks.** Cloistered. You'll rarely leave the enclosure, and the day is the fullest of liturgy: Midnight Matins, the little Hours, a sung conventual Mass, two hours of mental prayer, the Rosary, and spiritual reading, broken up by gardening, horses, and cattle. The longest road, and the deepest prayer scenes.

## Stack (from the Sanctus briefing, matching Brick City)

- **Next.js 16** (App Router) in plain JavaScript, **React 19**, **PixiJS 8** for the tile map, **Chakra UI 3** for menus and dialogue.
- Deployed to **Vercel** from `CJbricks/sanctus-js` (standard `next build`; no custom server).
- Saves go to browser **localStorage** under `sanctus-save-v1`.
- Tests use **Vitest**, next to the rules they cover. Rules live in plain JS under `src/lib/`.
- **Original art drawn in code** (pixel tiles and sprites at 32×32), original chiptune music. Reference images in `docs/concepts/` are for reference only and never ship.
- Secrets (if any ever exist) live in Vercel environment variables only — none are required for the scaffold.
- **Learning notes:** every file gets a header comment, non-obvious code gets a plain-language "why" comment, and `docs/NOTES.md` is a beginner's guide.
- Work happens through cloud agents on PRs. **Nothing merges without CJ's approval.**

## Getting started

```bash
npm install
npm run dev      # then open the URL it prints (usually http://localhost:3000)
npm test         # pure rules in Node (save, input, callings)
npm run lint     # ESLint (Next 16 flat config)
npm run build    # production Next.js build (what Vercel runs)
npm start        # serve the production build locally
```

**Controls:** Arrows / WASD move · Z / Enter / Space = A · X / Escape = B · Tab / Menu = Start · on-screen D-pad and A/B for touch · M mute.

**What works today:** title (Continue / New) → Choose Your Calling → **Franciscan** friary grounds overworld (Local Servant + three entry tasks → Postulant, save/resume). Dominican / Carmelite paths show a coming-soon note. Daily horarium loop still to come.

**Env vars:** none required. If a future feature needs a secret, document it here and set it in the Vercel project settings — never commit secrets to the repo.

## Docs

| File | What's in it |
|---|---|
| [`docs/GAME_RULES.md`](docs/GAME_RULES.md) | Every system and its rules: the daily loop, the Brick City → Sanctus mapping, Spiritual Health, encounters, ranks, items |
| [`docs/WORLD.md`](docs/WORLD.md) | Each path's home base and outside world, room by room and area by area, plus the first playable map for each |
| [`docs/NOTES.md`](docs/NOTES.md) | Beginner learning notes, the decision log, open questions, women's-path roadmap, and cited sources |
| `docs/concepts/<franciscan\|dominican\|carmelite>/` | CJ's reference images (to be uploaded) |
