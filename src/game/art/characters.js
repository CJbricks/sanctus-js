/**
 * characters.js
 * Original 32×40 character sprites (player + NPCs), code-drawn.
 *
 * WHY outlines + two-tone shading:
 * A dark rim and a lit edge make a tiny sprite readable on busy grass.
 * Walk frames add a 1px body bob and arm swing so motion has weight
 * (same *idea* as handheld RPGs; drawings are original to Sanctus).
 *
 * Looks: street clothes → postulant outfit (not a habit) → friar habit
 * with hood, cord knots, sandals, and beard for the brothers.
 */

import { CHAR_HEIGHT, CHAR_WIDTH } from "@/lib/constants";
import { fillRect } from "@/game/draw";
import { PALETTE } from "@/game/art/palette";
import {
  dropShadow,
  highlightDot,
  outlineRect,
} from "@/game/art/pixelHelpers";

/** @typedef {"up"|"down"|"left"|"right"} Facing */

/**
 * Leg / arm / bob offsets for a 4-frame walk.
 * Frames 0 & 2 = plant; 1 & 3 = stride with a 1px lift.
 */
const WALK = [
  { L: 0, R: 0, armL: 0, armR: 0, bob: 0 },
  { L: -2, R: 2, armL: 2, armR: -2, bob: 1 },
  { L: 0, R: 0, armL: 0, armR: 0, bob: 0 },
  { L: 2, R: -2, armL: -2, armR: 2, bob: 1 },
];

/**
 * @param {import("pixi.js").Graphics} g
 * @param {number} x
 * @param {number} y
 * @param {object} opts
 * @param {Facing} [opts.facing]
 * @param {number} [opts.frame]
 * @param {"street"|"postulant"|"servant"|"friar"|"neighbor"} [opts.look]
 */
export function drawCharacter(g, x, y, opts = {}) {
  const facing = opts.facing || "down";
  const frame = Math.abs(opts.frame || 0) % 4;
  const look = opts.look || "street";
  const walk = WALK[frame];
  const kit = kitFor(look);

  dropShadow(g, x + 6, y + CHAR_HEIGHT - 2, 20, 2, 0.28);

  const yy = y - walk.bob;
  if (facing === "up") {
    drawBack(g, x, yy, kit, walk, look);
  } else if (facing === "left") {
    drawSide(g, x, yy, kit, walk, look, -1);
  } else if (facing === "right") {
    drawSide(g, x, yy, kit, walk, look, 1);
  } else {
    drawFront(g, x, yy, kit, walk, look);
  }
}

function kitFor(look) {
  switch (look) {
    case "postulant":
      return {
        tunic: PALETTE.postulant,
        trim: PALETTE.gold.mid,
        pants: PALETTE.postulant.shade,
        hair: PALETTE.hair,
        shoe: PALETTE.wood.deep,
        beard: false,
        hood: false,
        cord: false,
        sandals: false,
      };
    case "servant":
    case "friar":
      return {
        tunic: PALETTE.habit,
        trim: PALETTE.cord,
        pants: PALETTE.habit.shade,
        hair: PALETTE.beard,
        shoe: PALETTE.wood.mid,
        beard: true,
        hood: true,
        cord: true,
        sandals: true,
      };
    case "neighbor":
      return {
        tunic: PALETTE.neighborCoat,
        trim: PALETTE.gold.mid,
        pants: PALETTE.asphalt.shade,
        hair: PALETTE.beard,
        shoe: PALETTE.asphalt.deep,
        beard: false,
        hood: false,
        cord: false,
        sandals: false,
      };
    case "street":
    default:
      return {
        tunic: PALETTE.streetTunic,
        trim: PALETTE.gold.mid,
        pants: PALETTE.sky.shade,
        hair: PALETTE.hair,
        shoe: PALETTE.asphalt.deep,
        beard: false,
        hood: false,
        cord: false,
        sandals: false,
      };
  }
}

function drawFront(g, x, y, kit, walk, look) {
  // Head
  outlineRect(g, x + 9, y + 1, 14, 12, PALETTE.skin.mid);
  fillRect(g, x + 10, y + 2, 12, 10, PALETTE.skin.mid);
  fillRect(g, x + 10, y + 2, 12, 1, PALETTE.skin.highlight);
  // Hair / hood
  if (kit.hood) {
    outlineRect(g, x + 8, y + 0, 16, 8, kit.tunic.mid);
    shadedHood(g, x + 9, y + 1, 14, 6, kit.tunic);
  } else {
    fillRect(g, x + 9, y + 1, 14, 5, kit.hair.mid);
    fillRect(g, x + 9, y + 1, 14, 1, kit.hair.highlight);
  }
  // Eyes
  fillRect(g, x + 12, y + 7, 2, 2, PALETTE.outline);
  fillRect(g, x + 18, y + 7, 2, 2, PALETTE.outline);
  highlightDot(g, x + 12, y + 7);
  highlightDot(g, x + 18, y + 7);
  if (kit.beard) {
    fillRect(g, x + 11, y + 10, 10, 3, kit.hair.mid);
    fillRect(g, x + 12, y + 10, 8, 1, kit.hair.highlight);
  }
  // Arms (behind / beside torso)
  fillRect(g, x + 2, y + 14 + walk.armL, 5, 12, kit.tunic.mid);
  fillRect(g, x + 25, y + 14 + walk.armR, 5, 12, kit.tunic.mid);
  fillRect(g, x + 2, y + 14 + walk.armL, 1, 12, kit.tunic.highlight);
  // Torso
  outlineRect(g, x + 6, y + 13, 20, 16, kit.tunic.mid);
  fillRect(g, x + 7, y + 14, 18, 14, kit.tunic.mid);
  fillRect(g, x + 7, y + 14, 18, 1, kit.tunic.highlight);
  fillRect(g, x + 7, y + 14, 2, 14, kit.tunic.highlight);
  fillRect(g, x + 23, y + 14, 2, 14, kit.tunic.shade);
  if (kit.cord) {
    fillRect(g, x + 6, y + 26, 20, 2, kit.trim);
    // Three knots (poverty, chastity, obedience — visual only)
    fillRect(g, x + 10, y + 27, 2, 3, kit.trim);
    fillRect(g, x + 15, y + 27, 2, 3, kit.trim);
    fillRect(g, x + 20, y + 27, 2, 3, kit.trim);
  } else {
    fillRect(g, x + 6, y + 27, 20, 2, kit.trim);
  }
  // Legs
  fillRect(g, x + 8, y + 29 + walk.L, 6, 8, kit.pants);
  fillRect(g, x + 18, y + 29 + walk.R, 6, 8, kit.pants);
  drawFeet(g, x + 8, y + 35 + walk.L, kit);
  drawFeet(g, x + 18, y + 35 + walk.R, kit);
  // Bag strap for street look (applicant still carries a bag)
  if (look === "street") {
    fillRect(g, x + 22, y + 16, 6, 8, PALETTE.wood.mid);
    fillRect(g, x + 22, y + 16, 6, 1, PALETTE.wood.highlight);
  }
}

function drawBack(g, x, y, kit, walk) {
  outlineRect(g, x + 9, y + 1, 14, 12, PALETTE.skin.mid);
  fillRect(g, x + 10, y + 2, 12, 10, PALETTE.skin.mid);
  if (kit.hood) {
    outlineRect(g, x + 7, y + 0, 18, 14, kit.tunic.mid);
    fillRect(g, x + 8, y + 1, 16, 12, kit.tunic.mid);
    fillRect(g, x + 8, y + 1, 16, 2, kit.tunic.highlight);
  } else {
    fillRect(g, x + 8, y + 1, 16, 8, kit.hair.mid);
  }
  fillRect(g, x + 2, y + 14 + walk.armR, 5, 12, kit.tunic.mid);
  fillRect(g, x + 25, y + 14 + walk.armL, 5, 12, kit.tunic.mid);
  outlineRect(g, x + 6, y + 13, 20, 16, kit.tunic.mid);
  fillRect(g, x + 7, y + 14, 18, 14, kit.tunic.mid);
  fillRect(g, x + 7, y + 14, 18, 1, kit.tunic.highlight);
  if (kit.cord) fillRect(g, x + 6, y + 26, 20, 2, kit.trim);
  else fillRect(g, x + 6, y + 27, 20, 2, kit.trim);
  fillRect(g, x + 8, y + 29 + walk.R, 6, 8, kit.pants);
  fillRect(g, x + 18, y + 29 + walk.L, 6, 8, kit.pants);
  drawFeet(g, x + 8, y + 35 + walk.R, kit);
  drawFeet(g, x + 18, y + 35 + walk.L, kit);
}

function drawSide(g, x, y, kit, walk, _look, dir) {
  const lean = dir > 0 ? 2 : -2;
  outlineRect(g, x + 11 + lean, y + 1, 10, 12, PALETTE.skin.mid);
  fillRect(g, x + 12 + lean, y + 2, 8, 10, PALETTE.skin.mid);
  if (kit.hood) {
    outlineRect(g, x + 10 + lean, y + 0, 12, 8, kit.tunic.mid);
    fillRect(g, x + 11 + lean, y + 1, 10, 6, kit.tunic.mid);
  } else {
    fillRect(g, x + 11 + lean, y + 1, 10, 5, kit.hair.mid);
  }
  fillRect(g, x + 14 + lean, y + 7, 2, 2, PALETTE.outline);
  highlightDot(g, x + 14 + lean, y + 7);
  if (kit.beard) fillRect(g, x + 12 + lean, y + 10, 8, 3, kit.hair.mid);
  // Far arm
  fillRect(g, x + 8 + lean, y + 14 + walk.armL, 4, 11, kit.tunic.shade);
  outlineRect(g, x + 8 + lean, y + 13, 16, 16, kit.tunic.mid);
  fillRect(g, x + 9 + lean, y + 14, 14, 14, kit.tunic.mid);
  fillRect(g, x + 9 + lean, y + 14, 14, 1, kit.tunic.highlight);
  // Near arm swing
  fillRect(g, x + 20 + lean, y + 14 + walk.armR, 4, 11, kit.tunic.mid);
  if (kit.cord) fillRect(g, x + 8 + lean, y + 26, 16, 2, kit.trim);
  fillRect(g, x + 10, y + 29 + walk.L, 5, 8, kit.pants);
  fillRect(g, x + 17, y + 29 + walk.R, 5, 8, kit.pants);
  drawFeet(g, x + 10, y + 35 + walk.L, kit);
  drawFeet(g, x + 17, y + 35 + walk.R, kit);
}

function shadedHood(g, x, y, w, h, ramp) {
  fillRect(g, x, y, w, h, ramp.mid);
  fillRect(g, x, y, w, 1, ramp.highlight);
  fillRect(g, x + w - 2, y + 1, 2, h - 1, ramp.shade);
}

function drawFeet(g, x, y, kit) {
  if (kit.sandals) {
    // Open sandal: sole + strap
    fillRect(g, x, y + 2, 6, 2, kit.shoe);
    fillRect(g, x + 1, y, 4, 2, PALETTE.skin.mid);
    fillRect(g, x + 1, y + 1, 4, 1, kit.shoe);
  } else {
    fillRect(g, x, y, 6, 4, kit.shoe);
    fillRect(g, x, y, 6, 1, PALETTE.habitLight.highlight);
  }
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

export { CHAR_WIDTH, CHAR_HEIGHT, WALK };
