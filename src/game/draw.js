/**
 * draw.js
 * Helpers that draw pixel-art shapes with PixiJS Graphics (no image files).
 *
 * WHY nearest-neighbor / integer sizes:
 * Soft GPU filtering would blur our hard 32×32 tiles. Everything here
 * uses whole-pixel rectangles so `image-rendering: pixelated` on the
 * canvas CSS keeps the Game Boy Color look when the page scales up.
 */

import { Graphics, Text } from "pixi.js";

/** Soft parchment background shared by title and calling screens. */
export const COLORS = {
  sky: 0x1a2a4a,
  parchment: 0xf2e6c8,
  ink: 0x2a1f14,
  gold: 0xc9a227,
  brick: 0x8b4513,
  grass: 0x3d6b3d,
  select: 0x5b2c6f,
  white: 0xffffff,
  muted: 0x6b5a45,
};

/**
 * Fill a solid rectangle. Coordinates are in logical game pixels.
 * @param {Graphics} g
 */
export function fillRect(g, x, y, w, h, color, alpha = 1) {
  g.rect(x, y, w, h);
  g.fill({ color, alpha });
}

/**
 * Draw a 1px outline box (GBC-style menu frame).
 * @param {Graphics} g
 */
export function strokeRect(g, x, y, w, h, color, width = 2) {
  g.rect(x, y, w, h);
  g.stroke({ width, color, alignment: 0 });
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
 * Simple standing character placeholder (32×40), code-drawn.
 * Four-frame walk cycles come later; this proves the footprint.
 * @param {number} bodyColor
 */
export function drawCharacterPlaceholder(g, x, y, bodyColor = 0x4a6fa5) {
  // Head
  fillRect(g, x + 8, y, 16, 12, 0xe8c39e);
  // Body / tunic
  fillRect(g, x + 4, y + 12, 24, 18, bodyColor);
  // Legs
  fillRect(g, x + 6, y + 30, 8, 10, 0x2c2c2c);
  fillRect(g, x + 18, y + 30, 8, 10, 0x2c2c2c);
}
