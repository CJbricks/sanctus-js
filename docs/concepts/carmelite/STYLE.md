# Carmelite path: design style

> **Reference only.** All in-game art is original pixel art drawn in code. The in-game house is the fictional **Our Lady of Sorrows Monastery** in the Thornback high country.
>
> *Note:* written from CJ's descriptions of the uploaded references; the subagent couldn't open the private uploads, so check the palette against the photos once they're copied in.

## Palette (~12 colors)

| Name | Hex | Used for |
|---|---|---|
| Habit brown, dark | `#3B2618` | Habit shadow, cowl inside |
| Habit brown, mid | `#5E3F28` | Tunic, scapular, cowl |
| Habit brown, light | `#8A6444` | Highlights |
| Mantle white | `#F1ECE0` | White mantle (Mass and Office on major feasts), snow |
| Travertine cream | `#E3D3B3` | Cloister stone floors and walls |
| Stone tan | `#B79E78` | Gothic exterior stone, shadows |
| Slate roof | `#4A4F58` | Roofs |
| Barn red | `#9E2E24` | The red barn |
| Prairie gold | `#C9A85A` | Dry grass, hay, the plains |
| Sage | `#8A9A74` | Sagebrush, pasture, pines (with dark) |
| Sky blue | `#6FA3D6` | Day sky, glass |
| Iron black | `#1F1D1B` | Lanterns, hinges, rosary, belt, sandals |

## Monk sprite (32×40)

- **Brown wool tunic**, **brown scapular** front and back (worn *over* the cowl, as the Wyoming monks do), **cowl** (hood): up outdoors in winter and in procession, down indoors.
- **Leather belt**; a **long black rosary** hanging at the **left** (the belt end hangs on the right).
- **Profession crucifix** (from temporary profession) is *hidden under the scapular*, so it's not drawn, though it's noted in the status screen.
- **White mantle** over everything for Mass and the Office on **major feasts**; auto-swaps on feast days.
- **Work habit** (canvas tunic, same capuche and scapular) for ranch and garden; **overalls with the capuche** for heavy work. Swapping is required before a bell (GAME_RULES gear trade-off).
- **Head:** **shaved monastic tonsure** (bald, 1-px highlight) for brothers; **thin corona** (a ring of hair) for priests and seminarians; optional **dark skullcap** for warmth.
- **Feet:** **sandals** (poor leather, made by the brother cobbler); cold-breath puffs in snow.
- **Postulant:** brown postulant robes plus the **larger postulant scapular** (no cowl), per Wyoming practice.

## Monastery room by room (tiles and props)

| Room | Tiles / props |
|---|---|
| **Cloister corridors (arcade)** | Travertine floor tiles with a warm sheen; arched openings with **light shafts** (diagonal 2-frame light overlay); wood cabinets; statue niches (Sorrows, Victory, Undoer of Knots); a crucifix at each corner |
| **Church** | White gothic vaults (pointed-arch wall tiles), **tall stained-glass windows** (2×4 tiles, Carmelite saints' scenes in simple leaded shapes), high altar, tabernacle, sanctuary lamp |
| **Choir** | Facing choir stalls, a large chant book stand (lectern), a **carved wooden choir screen** separating choir and nave |
| **Hermitages / cells** | A row of little **gabled stone hermitages**, each with a saint's name board over the door; inside: bed, prie-dieu, crucifix, a small picture of Our Lady |
| **Library / chapter room** | Shelves, desks, the Rule on a stand |
| **Refectory** | Dark wood paneling, long wooden tables, a gothic arched doorway and stairs, a **carved stone pulpit high on the wall** with a reader (table reading) |
| **Bell yard** | Bells on a low timber frame in front of the church |

## Ranch and grounds

| Area | Tiles / props |
|---|---|
| **Barn** | A big **red barn** (4×4 tiles), white trim, open doors; stalls; a **chestnut mare and foal** (32×32 animals, 2-frame idle) |
| **Paddock and pasture** | Fence tiles, prairie-gold and sage grass, cattle, a water trough |
| **Garden** | Raised beds, a wheelbarrow, a hose (Sister Water ties in on all paths) |
| **Grounds** | Open dirt yard, a **stone wall with an iron lantern**, a wayside shrine (Our Lady of Victory), pines, the snowy range on the horizon |
| **Night / Compline mood** | Tan stone monastery, **glowing arched windows**, the church apse with stained glass and pinnacles, a slate roof under snow, a **full moon**: the Compline screen and the Night overworld palette |

Statue and crucifix specs are shared; see the Franciscan STYLE.md table.

## Saint cards

- **St. Teresa of Ávila** (`saint-teresa/teresa-portrait.png`, copy pending): Discalced Carmelite nun's habit: **brown**, **white mantle**, **white wimple**, **black veil**, hands clasped. Card emblems: a quill and a small castle (the *Interior Castle*).
- **St. John of the Cross** (`saint-john-of-the-cross/`, copies pending): brown habit with a **cream/white mantle and hood**, tonsure, a **small wooden crucifix** in his hand (portrait). The Toledo **prison cell** (a barred window, a wooden cross, an open book on the table) is the setting for the escape cutscene. The crucifix is a reverent backdrop only.
- **St. Thérèse of Lisieux:** brown habit, white mantle, black veil, roses and a crucifix in her arms (reference still wanted).
- **Our Lady of Mount Carmel:** brown and white, crowned, the Child on her arm, holding out the **Brown Scapular** (reference still wanted).
