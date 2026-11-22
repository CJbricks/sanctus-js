/**
 * orderEmblems.js
 * Original pixel-art emblems for the Choose Your Calling screen.
 *
 * Each path gets a simple symbol drawn with Pixi Graphics (no image
 * files, no real order coats of arms or logos):
 *   - Franciscan → calm Wolf of Gubbio (St. Francis tamed the wolf)
 *   - Dominican  → hound with a lit torch ("Domini canes" / Bl. Jane's dream)
 *   - Carmelite  → clasped hands in prayer
 *
 * WHY pure pixel data + a separate draw helper:
 * Tests can check emblem ids and grid size in Node without booting Pixi.
 * The scene only asks "paint this calling at (x,y) for frame N."
 *
 * All art is original. Symbols are traditional Christian images, not
 * official seals of any living community.
 */

/** Logical size of every emblem sprite (fits beside menu text on 320×288). */
export const EMBLEM_SIZE = 32;

/**
 * Stable emblem ids — useful in saves/tests so a rename of the drawing
 * does not break "which symbol is this path?".
 */
export const EMBLEM_IDS = {
  franciscan: "wolf-of-gubbio",
  dominican: "hound-with-torch",
  carmelite: "hands-in-prayer",
};

/** Short Press Start labels shown next to each emblem. */
export const EMBLEM_TITLES = {
  franciscan: "Franciscans",
  dominican: "Dominicans",
  carmelite: "Carmelites",
};

/**
 * Why each symbol is here (for NOTES / learners — not drawn on screen).
 */
export const EMBLEM_MEANINGS = {
  franciscan:
    "The Wolf of Gubbio: the wolf St. Francis befriended. Drawn calm and gentle, never snarling.",
  dominican:
    "A dog with a lit torch — from Bl. Jane of Aza's dream before St. Dominic's birth, and the Domini canes (hounds of the Lord) pun.",
  carmelite:
    "Clasped hands in prayer — fitting a contemplative, cloistered path.",
};

/** Shared GBC-friendly palette for all three emblems. */
export const EMBLEM_PALETTE = {
  outline: 0x2a1f14,
  fur: 0x6b5a45,
  furLight: 0x9a8468,
  furDark: 0x3d3228,
  white: 0xf2e6c8,
  tongue: 0xb54a4a,
  torch: 0x8b5a2b,
  flame: 0xe8a020,
  flameHot: 0xfff0a0,
  skin: 0xe0b896,
  sleeve: 0x5c4030,
  glow: 0xc9a227,
  well: 0xe8d9a8,
  gold: 0xc9a227,
  ink: 0x2a1f14,
};

/**
 * Pure descriptor for one calling's emblem.
 * @param {string} callingId
 * @returns {{ callingId: string, emblemId: string, title: string, meaning: string, width: number, height: number, frameCount: number } | null}
 */
export function getEmblemDescriptor(callingId) {
  const emblemId = EMBLEM_IDS[callingId];
  if (!emblemId) return null;
  return {
    callingId,
    emblemId,
    title: EMBLEM_TITLES[callingId],
    meaning: EMBLEM_MEANINGS[callingId],
    width: EMBLEM_SIZE,
    height: EMBLEM_SIZE,
    // WHY 3 frames: enough for a soft idle (flame / tail / glow) without a big sheet.
    frameCount: 3,
  };
}

/** Every calling that has an emblem, in menu order. */
export function listEmblemDescriptors() {
  return ["franciscan", "dominican", "carmelite"]
    .map((id) => getEmblemDescriptor(id))
    .filter(Boolean);
}

/**
 * Expand a row-string grid into {x,y,color} pixels.
 * Characters map through `key` → palette hex. Spaces / `.` are empty.
 *
 * WHY strings instead of a PNG:
 * CJ can read and edit the shape in the source file. Tests can count
 * pixels without a canvas.
 *
 * @param {string[]} rows
 * @param {Record<string, number>} key
 * @returns {{ x: number, y: number, color: number }[]}
 */
export function pixelsFromGrid(rows, key) {
  const pixels = [];
  for (let y = 0; y < rows.length; y += 1) {
    const row = rows[y];
    for (let x = 0; x < row.length; x += 1) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      const color = key[ch];
      if (color == null) continue;
      pixels.push({ x, y, color });
    }
  }
  return pixels;
}

const P = EMBLEM_PALETTE;

/** Pad / trim a grid row to exactly EMBLEM_SIZE characters. */
function row32(s) {
  if (s.length === EMBLEM_SIZE) return s;
  if (s.length > EMBLEM_SIZE) return s.slice(0, EMBLEM_SIZE);
  return s + ".".repeat(EMBLEM_SIZE - s.length);
}

function grid32(rows) {
  const out = rows.map(row32);
  while (out.length < EMBLEM_SIZE) out.push(".".repeat(EMBLEM_SIZE));
  return out.slice(0, EMBLEM_SIZE);
}

/**
 * Franciscan: calm wolf facing right (Wolf of Gubbio).
 * Frame nudges the tail tip for a gentle idle — never a snarl.
 */
function wolfGrid(frame) {
  const tip = frame % 3 === 2 ? "D" : "F";
  return grid32([
    "................................",
    "................................",
    "..........FFFF..................",
    ".........FLLLLF.................",
    "........FLLLLLLF................",
    ".......FLLLWLLLF................",
    ".......FLLWWLLLF................",
    ".......FLWBBWLLF................",
    ".......FLLLLLLLF................",
    ".......FLLLTTLLF................",
    "........FLLLLLF.................",
    `.......${tip}FFLLLLLFFFF.............`,
    ".......FFLLLLLLLLLF.............",
    "........FLLLLLLLLLF.............",
    "........FLLLLLLLLF..............",
    ".........FLLLLLLF...............",
    ".........FLF..FLF...............",
    ".........FLF..FLF...............",
    ".........FFF..FFF...............",
  ]);
}

const WOLF_KEY = {
  F: P.furDark,
  L: P.fur,
  W: P.furLight,
  B: P.outline,
  T: P.tongue,
  D: P.fur,
};

/**
 * Dominican: hound carrying a lit torch in its mouth.
 * Frames swap flame colors for a flicker.
 */
function houndGrid(frame) {
  const flame = frame % 3 === 1 ? "H" : frame % 3 === 2 ? "Y" : "A";
  return grid32([
    "................................",
    `..........................${flame}.....`,
    `.........................A${flame}A....`,
    ".........................AAA....",
    ".........................TTT....",
    ".........................TTT....",
    "...........FFFF..........TTT....",
    "..........FLLLLF.........T......",
    ".........FLLLLLLF.......T.......",
    "........FLLLWLLLF......T........",
    "........FLLWWLLLF.....T.........",
    "........FLWBBWLLFTTTTT..........",
    "........FLLLLLLLF...............",
    ".........FLLLLLF................",
    "........FFLLLLLFFFF.............",
    ".......FLLLLLLLLLLLF............",
    ".......FLLLLLLLLLLLF............",
    "........FLLLLLLLLLF.............",
    ".........FLLLLLLLF..............",
    ".........FLF..FLF...............",
    ".........FLF..FLF...............",
    ".........FFF..FFF...............",
  ]);
}

const HOUND_KEY = {
  F: P.furDark,
  L: P.fur,
  W: P.furLight,
  B: P.outline,
  T: P.torch,
  A: P.flame,
  H: P.flameHot,
  Y: P.glow,
};

/**
 * Carmelite: clasped hands in prayer.
 * Later frames add a soft gold halo (glow pixels).
 */
function handsGrid(frame) {
  const glowOn = frame % 3 !== 0;
  const g = glowOn ? "G" : ".";
  return grid32([
    "................................",
    `........${g}${g}........${g}${g}........`,
    `.......${g}..${g}......${g}..${g}.......`,
    "......SSSS........SSSS..........",
    ".....SKKKKS......SKKKKS.........",
    ".....SKKKKS......SKKKKS.........",
    ".....SKKKKS......SKKKKS.........",
    "......SSSS........SSSS..........",
    ".......SS..........SS...........",
    ".......SK..........KS...........",
    ".......SKK........KKS...........",
    ".......SKKK......KKKS...........",
    "........SKKK....KKKS............",
    "........SKKKK..KKKKS............",
    ".........SKKKKKKKKS.............",
    ".........SKKKKKKKKS.............",
    "..........SKKKKKKS..............",
    "..........SSSSSSSS..............",
    "...........SSSSSS...............",
  ]);
}

const HANDS_KEY = {
  S: P.sleeve,
  K: P.skin,
  G: P.glow,
};

/**
 * Pure pixel list for one emblem + animation frame.
 * @param {string} callingId
 * @param {number} [frame]
 * @returns {{ x: number, y: number, color: number }[]}
 */
export function pixelsForEmblem(callingId, frame = 0) {
  const f = ((frame % 3) + 3) % 3;
  if (callingId === "franciscan") return pixelsFromGrid(wolfGrid(f), WOLF_KEY);
  if (callingId === "dominican") return pixelsFromGrid(houndGrid(f), HOUND_KEY);
  if (callingId === "carmelite") return pixelsFromGrid(handsGrid(f), HANDS_KEY);
  return [];
}

/**
 * Paint an emblem into a Pixi Graphics at (originX, originY).
 * Clears the graphics first so animation frames replace cleanly.
 *
 * WHY import Graphics only here:
 * Pure helpers above stay usable in Vitest (Node). Drawing needs Pixi.
 *
 * @param {import("pixi.js").Graphics} g
 * @param {string} callingId
 * @param {number} originX
 * @param {number} originY
 * @param {object} [opts]
 * @param {number} [opts.frame]
 * @param {boolean} [opts.selected]  gold frame when this row is focused
 */
export function drawOrderEmblem(g, callingId, originX, originY, opts = {}) {
  const { frame = 0, selected = false } = opts;
  g.clear();

  // Soft parchment well behind the pixels so the emblem reads on the menu.
  g.rect(originX, originY, EMBLEM_SIZE, EMBLEM_SIZE);
  g.fill({ color: P.well, alpha: selected ? 1 : 0.85 });
  g.rect(originX, originY, EMBLEM_SIZE, EMBLEM_SIZE);
  g.stroke({ width: selected ? 2 : 1, color: selected ? P.gold : P.ink, alignment: 0 });

  const pixels = pixelsForEmblem(callingId, frame);
  for (const px of pixels) {
    // One logical pixel = one filled rect (nearest-neighbor friendly).
    g.rect(originX + px.x, originY + px.y, 1, 1);
    g.fill({ color: px.color });
  }
}
