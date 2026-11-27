/**
 * pixelHelpers.js
 * Small drawing helpers shared by tiles and characters.
 *
 * WHY these exist:
 * Outlines, shade ramps, dither, and soft shadows are the difference
 * between flat rectangles and readable GBC-style art. Keeping them in
 * one place means every drawer uses the same edge weight and dither
 * pattern. Techniques inspired by Brick City's approach (ramps, hash
 * variation, outlines) — colors and shapes stay original to Sanctus.
 */

import { OUTLINE, mixHex } from "@/game/art/palette";

/**
 * Low-level pixel fill (kept here so helpers do not import draw.js and
 * create a cycle: draw → helpers → draw).
 * @param {import("pixi.js").Graphics} g
 */
export function fillRect(g, x, y, w, h, color, alpha = 1) {
  g.rect(x, y, w, h);
  g.fill({ color, alpha });
}

/**
 * Deterministic hash of a tile position.
 * WHY deterministic: the same (x,y) always picks the same grass tuft /
 * cobble chip, so the map does not "sparkle" when you walk away and back.
 * Constants differ from other projects on purpose (original to Sanctus).
 * @param {number} x
 * @param {number} y
 */
export function positionHash(x, y) {
  let n = (Math.imul(x | 0, 2654435761) ^ Math.imul(y | 0, 1597334677)) | 0;
  n = Math.imul(n ^ (n >>> 15), 2246822519);
  n = Math.imul(n ^ (n >>> 13), 3266489917);
  return (n ^ (n >>> 16)) >>> 0;
}

/**
 * Pick a variant index 0..(count-1) from tile coords.
 * @param {number} x
 * @param {number} y
 * @param {number} [count]
 */
export function tileVariant(x, y, count = 3) {
  const n = Math.max(1, count | 0);
  return positionHash(x, y) % n;
}

/**
 * Soft elliptical drop shadow under a prop or character.
 * WHY: grounds the sprite so it does not float on the tile.
 * @param {import("pixi.js").Graphics} g
 */
export function dropShadow(g, x, y, w, h, alpha = 0.28) {
  fillRect(g, x, y, w, h, 0x000000, alpha);
}

/**
 * 1px outline around a filled rect (draw outline first, then fill).
 * WHY: GBC sprites read as solid shapes because a dark rim separates
 * them from busy grass/road behind them.
 * @param {import("pixi.js").Graphics} g
 */
export function outlineRect(g, x, y, w, h, fill, outline = OUTLINE) {
  fillRect(g, x - 1, y - 1, w + 2, h + 2, outline);
  fillRect(g, x, y, w, h, fill);
}

/**
 * Filled rect with a lit top edge and shaded bottom edge (two-tone).
 * @param {import("pixi.js").Graphics} g
 * @param {{ highlight: number, mid: number, shade: number }} ramp
 */
export function shadedRect(g, x, y, w, h, ramp) {
  fillRect(g, x, y, w, h, ramp.mid);
  if (h > 2) fillRect(g, x, y, w, 1, ramp.highlight);
  if (h > 3) fillRect(g, x, y + h - 1, w, 1, ramp.shade);
  if (w > 3) fillRect(g, x, y + 1, 1, h - 2, ramp.highlight);
  if (w > 3) fillRect(g, x + w - 1, y + 1, 1, h - 2, ramp.shade);
}

/**
 * Checker dither: sprinkle `color` on every other pixel in a box.
 * WHY: GBC carts faked extra shades with dither when the palette was short.
 * @param {import("pixi.js").Graphics} g
 */
export function ditherChecker(g, x, y, w, h, color, phase = 0) {
  for (let py = 0; py < h; py += 1) {
    for (let px = 0; px < w; px += 1) {
      if (((px + py + phase) & 1) === 0) {
        fillRect(g, x + px, y + py, 1, 1, color);
      }
    }
  }
}

/**
 * Sparse dither dots from a position hash (cheaper than full checker).
 * @param {import("pixi.js").Graphics} g
 */
export function ditherSpeckle(g, x, y, w, h, color, salt = 0) {
  const n = positionHash(x + salt, y + salt * 3);
  for (let i = 0; i < 6; i += 1) {
    const px = (n >>> (i * 3)) % Math.max(1, w);
    const py = (n >>> (i * 5 + 2)) % Math.max(1, h);
    fillRect(g, x + px, y + py, 1, 1, color);
  }
}

/**
 * Brick / stone courses with mortar lines.
 * @param {import("pixi.js").Graphics} g
 * @param {{ highlight: number, mid: number, shade: number }} ramp
 */
export function brickPattern(g, x, y, w, h, ramp, mortar = 0xc4b49a, salt = 0) {
  fillRect(g, x, y, w, h, ramp.mid);
  const rowH = 6;
  for (let row = 0; row < h; row += rowH) {
    fillRect(g, x, y + row, w, 1, mortar);
    const offset = ((row / rowH + salt) & 1) * 8;
    for (let col = offset; col < w; col += 16) {
      fillRect(g, x + col, y + row + 1, 1, rowH - 1, ramp.shade);
    }
    fillRect(g, x, y + row + 1, w, 1, ramp.highlight);
  }
}

/**
 * Highlight a single pixel (eye sparkle, candle tip, gold glint).
 */
export function highlightDot(g, x, y, color = 0xffffff) {
  fillRect(g, x, y, 1, 1, color);
}

export { mixHex, OUTLINE };
