# Dominican path: design style

> **Reference only.** All in-game art is original pixel art drawn in code. The in-game house is the fictional **Our Lady of Victory House of Studies** in Capitol City.

## Palette (~11 colors)

| Name | Hex | Used for |
|---|---|---|
| Habit white | `#F4F1E8` | Tunic, scapular, white capuce |
| Habit white shadow | `#C9C4B5` | Folds |
| Cappa black | `#1E1E24` | Black cappa and capuce, belt, shoes |
| Cappa highlight | `#44444E` | Cappa folds |
| Rosary black | `#2B2B2B` | 15-decade rosary at the left side |
| Stone gray | `#9C978C` | Priory stone, cloister arches |
| Library green | `#3E6B4E` | Lamp shades, desk felt |
| Book red | `#8E2A2A` | Book spines, the *Summa* volumes |
| Parchment | `#E8D9AE` | Codex UI pages |
| Glass gold | `#D6A53A` | Stained-glass and halos, Thomas's sun emblem |
| Glass blue | `#3F6FAE` | Stained glass, Our Lady's mantle |

## Friar sprite (32×40)

- **White tunic, white scapular, white capuce** (hood with a short shoulder cape) are always on.
- **Black cappa and black capuce** over them **outdoors, when preaching, and in choir from All Souls (Nov 2) to the Easter Vigil Gloria**. The sprite swaps automatically by place and season (accurate to Dominican custom).
- **Leather belt**; **15-decade rosary** hanging at the **left side** (a long loop of ~12 dark beads at 32 px).
- **Hair:** neat, short modern hair. **No tonsure on modern friars** (the clerical tonsure was ended in 1972 and the Province of St. Joseph doesn't wear one). **Saint art** (Thomas, Dominic) shows the historical tonsure, which is correct for the 13th century.
- **Feet:** **black shoes** (Dominicans aren't a discalced order; early constitutions speak of shoes, and the current Constitutions leave footwear to custom).
- Faces: clean-shaven by default, a few beard variants.

## House of studies tiles and props

| Room | Tiles / props |
|---|---|
| Chapel and choir | Facing choir stalls, white walls, stained-glass windows (Dominican saints), altar and tabernacle, Our Lady of the Rosary side chapel |
| Library | Tall shelves (2 tiles high), long desks, green lamps, a ladder, *Summa* volumes in red |
| Classroom | Chalkboard, lectern, desks |
| Cloister | Stone arches, garth with tall grass, fountain |
| Refectory | Long tables, reader's lectern |
| Cells | Bed, desk, shelf, crucifix |

Statue and crucifix prop specs are shared; see the Franciscan STYLE.md table.

## St. Thomas Aquinas saint card and portrait

Reference: `saint-thomas-aquinas/` (three artworks uploaded by CJ, copy pending; this text is from CJ's descriptions).
- **Card portrait (32×48 on a 64×64 card):** white habit and black cappa, historical **tonsure**, a **gold sun on the chest** (his classic emblem), quill in the right hand, a **red book**, a small **dove** above the shoulder (the Holy Spirit inspiring his teaching).
- **Scenes** (non-interactive cutscenes):
  1. *The study cell before the crucifix*: Thomas writing; the crucifix is a **reverent backdrop only** (stained-glass style, never animated). The words "You have written well of me, Thomas" are shown as a tradition ("It is told that…").
  2. *The angels' girdle*: two angels gird him with a cord (purity of heart), told as tradition.
  3. *Straw*: the pen set down after Mass (the Summa thread capstone).
- **Theme rule:** Christ appears only as a reverent backdrop (cutscene or stained glass), never as an item or anything interactive.
