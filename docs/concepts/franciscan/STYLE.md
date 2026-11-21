# Franciscan path: design style

> **Reference only.** All in-game art is original pixel art drawn in code. Photos and artwork in this folder guide mood, color, and costume accuracy. They're never traced, never shipped, and the real friary that inspired the chapel is never named in game. The in-game house is the fictional **St. Juniper Friary**.
>
> *Note for the docs PR:* this guide was written from CJ's descriptions of the four reference images. The subagent writing it couldn't open the private uploads, so the palette values are proposals to check against the photos once they're copied into this folder.

## Palette (GBC-era, ~12 colors)

GBC hardware allowed 4 colors per tile palette. We keep that spirit: each sprite or tile uses at most 4 colors from this master palette (plus transparency).

| Name | Hex | Used for |
|---|---|---|
| Habit gray, dark | `#4A4B50` | Habit shadow, hood folds |
| Habit gray, mid | `#7B7C82` | Habit body |
| Habit gray, light | `#A9AAB0` | Habit highlight |
| Cord cream | `#E9DFC3` | Cord, three knots, candle wax |
| Wood dark | `#4A2F1F` | Roof beams, pews, wooden cross, rosary beads |
| Wood mid | `#8B5B37` | Stairs, railing, tables, sandals |
| Wall cream | `#F2E7CE` | Chapel walls, plaster |
| Mural gold | `#D8A83B` | Angel mural sky glow, halos, lantern light, San Damiano border |
| Mural blue | `#4D7DB6` | Mural sky, Our Lady's mantle |
| Carpet red | `#A3272B` | Aisle carpet, sanctuary lamp glass |
| San Damiano vermilion | `#C2361F` | Cross panels |
| Icon black-brown | `#2A1B14` | Cross outlines, icon background panels, beards (dark) |

Skin tones: 4 swatches (light to deep) used across all paths. Beards: dark brown, black, red-brown, gray.

## Friar sprite (32×40)

- **Habit:** ankle-length gray tunic, wide sleeves; long pointed **Capuchin hood** (down indoors, up outdoors in winter).
- **Cord** at the waist, hanging on the right, with **three knots** drawn as three cream bumps (poverty, chastity, obedience).
- **Rosary** (dark wood beads) hanging at the left hip; the Franciscan Crown has 7 decades, but at 32 px it's a short loop of 8–10 beads with a tiny cross.
- **Wooden cross** (plain or Tau) on a cord at the chest, 3×4 px.
- **Hair:** short buzzed (a 1-px darker cap of stubble); some friars nearly shaved.
- **Beards:** 4 variants (short full, long full, long pointed, gray). Postulants and novices may be clean-shaven or with a young beard.
- **Feet:** **sandals**: two brown strap pixels with skin showing (bare toes); in deep winter, plain dark shoes are allowed (the CFR do this in the cold).
- **Walk cycle:** 4 frames per direction like Brick City; the hem sways, the cord swings 1 px.
- **Postulant:** lay clothes sprite (shared spec in WORLD.md §5) until investiture.

## Friary tiles and props

| Room | Tiles / props |
|---|---|
| **Chapel for Mass** | Cream wall tiles with a 1-px beam shadow at the top; dark-wood **ceiling beam** overlay (drawn on the wall's top row); a **mural wall** behind the altar (gold sky + blue + a simple angel silhouette with wings, 2×3 tiles; original design); **twin wooden staircases** at the back corners with a balcony **railing** strip; **hanging lanterns** (warm gold glow, 1 tile, flicker 2 frames); **red carpet** aisle tile; **white altar** (2 tiles wide) with two candles; **wooden pews** (1×1 tiles that join horizontally); small statue niches |
| **Adoration chapel** | Dim floor; a small altar with the monstrance (gold sunburst, drawn simply, never animated); kneelers; one lantern |
| **Kitchen / refectory** | Long plank table (joins horizontally), benches, a black iron stove with a flame frame (*Brother Fire*), a deep sink with water ripple (*Sister Water*), soup pots, a crucifix over the table |
| **Cells** | Narrow bed, wall hook with a spare habit, a small shelf, a crucifix |
| **Common room** | Worn couch, guitar on a stand, chess table, bookshelf |
| **Yard** | Tall grass, a vegetable bed, a stone **St. Francis** statue (with a bird on his hand) |

## The San Damiano cross (chapel fixture)

- Drawn **once** as a fixed wall sprite above the altar, **3×4 tiles (96×128 px)**.
- **Simplified original rendering** of the icon's shape: the cross outline in icon black-brown; vermilion side panels; a gold border; a pale, simple central figure (minimal detail, no face detail beyond a few pixels, arms outstretched, still); small flanking figures as simple colored shapes (Mary and John on one side, others on the other side), a small top medallion, and tiny angel shapes at the arm ends.
- **Theme rule:** it's a **reverent chapel fixture and devotional artifact**. It's never an item, never a weapon, never picked up, never fought, never animated. Pressing A in front of it opens a short prayer (the Franciscan "We adore You, O Christ…" or Francis's prayer before the crucifix, short public-domain translation) and counts as a crucifix devotion stop.
- It also appears on the **Franciscan title panel** of Choose Your Calling as a small static icon.

## Statues and crucifixes (devotion stops, all paths share the specs)

| Prop | Size | Silhouette / color key (so each title is instantly recognizable) |
|---|---|---|
| **Crucifix** (wall) | 32×32 | Dark wood cross, a small pale still figure (4–6 px tall), no animation |
| **Crucifix** (standing, wayside) | 32×64 | Taller cross on a stone base, tiny roof on wayside versions |
| **Our Lady of Sorrows** | 32×64 | **Black or deep-blue mantle**, white veil edge, hands clasped; a **red heart with silver sword strokes** (7 thin light lines) on the chest |
| **Our Lady of Victory / of the Rosary** | 32×64 | **Gold crown**, blue mantle over white or red, **the Child on her left arm**, a rosary hanging from her right hand |
| **Our Lady, Undoer of Knots** | 32×64 | Red dress, **blue mantle**, a halo of small stars, a **white ribbon with knots** across her hands, a small angel shape at each side, a **crescent moon and serpent** line at her feet |
| **St. Francis** | 32×64 | Gray-brown habit, a bird on the hand |
| **Founder statues on other paths** | 32×64 | Dominic (white/black, a star at the forehead, a dog with a torch at his feet), Thomas (white/black, a sun on the chest, a book), Our Lady of Mount Carmel (brown and white, holding out the scapular) |

## Reference images in this folder

| File | Status | Use |
|---|---|---|
| `cfr-friars-group.png` | Uploaded by CJ (copy pending, see README) | Habit, cord, rosary, wooden cross, beards, sandals |
| `cfr-friars-kitchen.png` | Uploaded by CJ (copy pending) | Kitchen/refectory mood, community life |
| `san-damiano-cross.png` | Uploaded by CJ (copy pending) | San Damiano cross colors and layout |
| `friary-chapel-interior.png` | Uploaded by CJ (copy pending) | Chapel mood (beams, mural, stairs, lanterns, carpet) |
