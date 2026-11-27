/**
 * characters.js
 * Original 32×40 character sprites (player + NPCs), code-drawn.
 *
 * WHY frames + facing live here:
 * The overworld only says "draw the player facing down, frame 2".
 * Clothes change when rank becomes postulant — street clothes first
 * (design docs), then a simple postulant outfit (not a habit yet).
 */

import { CHAR_HEIGHT, CHAR_WIDTH } from "@/lib/constants";
import { fillRect } from "@/game/draw";

/** @typedef {"up"|"down"|"left"|"right"} Facing */

const SKIN = 0xe8c39e;
const HAIR = 0x3a2a1a;
const SHOE = 0x2c2c2c;

/**
 * Leg offsets for a 4-frame walk. Frame 0/2 = plant; 1/3 = stride.
 * WHY tiny pixel shifts: GBC walk cycles read clearly at 32×40.
 */
const WALK_LEG = [
  { L: 0, R: 0 },
  { L: -2, R: 2 },
  { L: 0, R: 0 },
  { L: 2, R: -2 },
];

/**
 * @param {import("pixi.js").Graphics} g
 * @param {number} x  top-left of the 32×40 box (feet at bottom)
 * @param {number} y
 * @param {object} opts
 * @param {Facing} [opts.facing]
 * @param {number} [opts.frame]  0–3
 * @param {"street"|"postulant"|"servant"|"friar"|"neighbor"} [opts.look]
 */
export function drawCharacter(g, x, y, opts = {}) {
  const facing = opts.facing || "down";
  const frame = Math.abs(opts.frame || 0) % 4;
  const look = opts.look || "street";
  const legs = WALK_LEG[frame];

  const colors = paletteFor(look);

  // Shadow under feet (reads as grounded on grass/road)
  fillRect(g, x + 6, y + CHAR_HEIGHT - 2, 20, 2, 0x000000, 0.25);

  if (facing === "up") {
    drawBack(g, x, y, colors, legs);
  } else if (facing === "left") {
    drawSide(g, x, y, colors, legs, -1);
  } else if (facing === "right") {
    drawSide(g, x, y, colors, legs, 1);
  } else {
    drawFront(g, x, y, colors, legs);
  }
}

function paletteFor(look) {
  switch (look) {
    case "postulant":
      // Simple modest outfit — clearly not a habit (D24).
      return { tunic: 0x5a6a7a, trim: 0xc9a227, pants: 0x3a3a4a, hair: HAIR };
    case "servant":
      // Local Servant: gray Capuchin-style habit silhouette (original).
      return { tunic: 0x7a7a7a, trim: 0xf2e6c8, pants: 0x6a6a6a, hair: 0x2a2a2a };
    case "friar":
      return { tunic: 0x8a8a8a, trim: 0xf2e6c8, pants: 0x6a6a6a, hair: 0x4a3a2a };
    case "neighbor":
      return { tunic: 0x4a6fa5, trim: 0xc9a227, pants: 0x3a3a3a, hair: 0x5a3a1a };
    case "street":
    default:
      // Applicant arrives in ordinary lay clothes.
      return { tunic: 0x3d6b3d, trim: 0xc9a227, pants: 0x2c3a4a, hair: HAIR };
  }
}

function drawFront(g, x, y, c, legs) {
  fillRect(g, x + 8, y + 0, 16, 12, SKIN);
  fillRect(g, x + 8, y + 0, 16, 4, c.hair);
  fillRect(g, x + 4, y + 12, 24, 18, c.tunic);
  fillRect(g, x + 4, y + 28, 24, 2, c.trim);
  fillRect(g, x + 6, y + 30 + legs.L, 8, 8, c.pants);
  fillRect(g, x + 18, y + 30 + legs.R, 8, 8, c.pants);
  fillRect(g, x + 6, y + 36 + legs.L, 8, 4, SHOE);
  fillRect(g, x + 18, y + 36 + legs.R, 8, 4, SHOE);
}

function drawBack(g, x, y, c, legs) {
  fillRect(g, x + 8, y + 0, 16, 12, SKIN);
  fillRect(g, x + 6, y + 0, 20, 8, c.hair);
  fillRect(g, x + 4, y + 12, 24, 18, c.tunic);
  fillRect(g, x + 4, y + 28, 24, 2, c.trim);
  fillRect(g, x + 6, y + 30 + legs.R, 8, 8, c.pants);
  fillRect(g, x + 18, y + 30 + legs.L, 8, 8, c.pants);
  fillRect(g, x + 6, y + 36 + legs.R, 8, 4, SHOE);
  fillRect(g, x + 18, y + 36 + legs.L, 8, 4, SHOE);
}

function drawSide(g, x, y, c, legs, dir) {
  // dir: -1 left, +1 right — slight lean of the torso.
  const lean = dir > 0 ? 2 : -2;
  fillRect(g, x + 10 + lean, y + 0, 12, 12, SKIN);
  fillRect(g, x + 10 + lean, y + 0, 12, 4, c.hair);
  fillRect(g, x + 6 + lean, y + 12, 20, 18, c.tunic);
  fillRect(g, x + 6 + lean, y + 28, 20, 2, c.trim);
  fillRect(g, x + 8, y + 30 + legs.L, 8, 8, c.pants);
  fillRect(g, x + 16, y + 30 + legs.R, 8, 8, c.pants);
  fillRect(g, x + 8, y + 36 + legs.L, 8, 4, SHOE);
  fillRect(g, x + 16, y + 36 + legs.R, 8, 4, SHOE);
}

/** NPC look id from NPC map id. */
export function lookForNpc(npcId) {
  if (npcId === "local-servant") return "servant";
  if (npcId === "garden-friar") return "friar";
  if (npcId === "neighbor") return "neighbor";
  return "street";
}

/** Player look from rank. */
export function lookForRank(rank) {
  return rank === "postulant" ? "postulant" : "street";
}

export { CHAR_WIDTH, CHAR_HEIGHT };
