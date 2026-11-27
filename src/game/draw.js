/**
 * draw.js
 * Helpers that draw pixel-art shapes with PixiJS Graphics (no image files).
 *
 * WHY nearest-neighbor / integer sizes:
 * Soft GPU filtering would blur our hard 32×32 tiles. Everything here
 * uses whole-pixel rectangles so `image-rendering: pixelated` on the
 * canvas CSS keeps the Game Boy Color look when the page scales up.
 *
 * Menu COLORS come from the shared palette so title / calling / overworld
 * share one look after the graphics upgrade.
 */

import { Text } from "pixi.js";
import { UI_COLORS } from "@/game/art/palette";
import { fillRect, shadedRect } from "@/game/art/pixelHelpers";

export { fillRect };

/** Soft parchment background shared by title and calling screens. */
export const COLORS = {
  sky: UI_COLORS.sky,
  parchment: UI_COLORS.parchment,
  parchmentLit: UI_COLORS.parchmentLit,
  parchmentShade: UI_COLORS.parchmentShade,
  ink: UI_COLORS.ink,
  gold: UI_COLORS.gold,
  goldLit: UI_COLORS.goldLit,
  brick: 0x8b5340,
  grass: UI_COLORS.grass,
  select: 0x5b2c6f,
  white: UI_COLORS.white,
  muted: UI_COLORS.muted,
  outline: UI_COLORS.outline,
};

/**
 * Draw a 1px outline box (GBC-style menu frame).
 * @param {Graphics} g
 */
export function strokeRect(g, x, y, w, h, color, width = 2) {
  g.rect(x, y, w, h);
  g.stroke({ width, color, alignment: 0 });
}

/**
 * Ornate GBC dialogue / menu frame: outer ink, gold mid, parchment fill,
 * corner ticks, and a soft inner shade line.
 * WHY: a plain border looks unfinished next to the richer tiles/sprites.
 * @param {Graphics} g
 */
export function drawPanelFrame(g, x, y, w, h) {
  fillRect(g, x, y, w, h, COLORS.outline);
  fillRect(g, x + 1, y + 1, w - 2, h - 2, COLORS.gold);
  fillRect(g, x + 3, y + 3, w - 6, h - 6, COLORS.parchment);
  // Inner shadow (bottom + right)
  fillRect(g, x + 3, y + h - 5, w - 6, 2, COLORS.parchmentShade, 0.55);
  fillRect(g, x + w - 5, y + 3, 2, h - 6, COLORS.parchmentShade, 0.35);
  // Lit top edge
  fillRect(g, x + 3, y + 3, w - 6, 1, COLORS.parchmentLit);
  // Corner ornaments
  const corners = [
    [x + 4, y + 4],
    [x + w - 8, y + 4],
    [x + 4, y + h - 8],
    [x + w - 8, y + h - 8],
  ];
  corners.forEach(([cx, cy]) => {
    fillRect(g, cx, cy, 4, 1, COLORS.gold);
    fillRect(g, cx, cy, 1, 4, COLORS.gold);
  });
}

/**
 * Create a Press Start–friendly Pixi Text object.
 * The CSS font family is set on <html> via next/font; Pixi reads it.
 */
export function makeText(content, options = {}) {
  const {
    x = 0,
    y = 0,
    size = 8,
    color = COLORS.ink,
    align = "left",
  } = options;

  const text = new Text({
    text: content,
    style: {
      fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
      fontSize: size,
      fill: color,
      align,
      // WHY pixelated resolution: Pixi text is a texture; higher
      // resolution keeps glyphs sharp when the canvas is CSS-scaled.
      padding: 2,
    },
  });
  text.x = x;
  text.y = y;
  if (align === "center") {
    text.anchor.set(0.5, 0);
  }
  // Nearest-neighbor for the text texture.
  text.roundPixels = true;
  return text;
}

/**
 * Legacy standing character stub — prefer characters.js for gameplay.
 * @param {number} bodyColor
 */
export function drawCharacterPlaceholder(g, x, y, bodyColor = 0x4a6fa5) {
  shadedRect(g, x + 8, y, 16, 12, {
    highlight: 0xf0d4b0,
    mid: 0xe8c39e,
    shade: 0xc4a080,
  });
  fillRect(g, x + 4, y + 12, 24, 18, bodyColor);
  fillRect(g, x + 6, y + 30, 8, 10, 0x2c2c2c);
  fillRect(g, x + 18, y + 30, 8, 10, 0x2c2c2c);
}
