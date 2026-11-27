/**
 * palette.js
 * Shared GBC-inspired color book for SANCTUS pixel art.
 *
 * WHY one palette module:
 * Every tile, sprite, and UI frame should feel like the same handheld
 * cart. Materials get several shades (light / mid / dark / outline) so
 * we can shade without inventing new hex codes in every drawer.
 *
 * All colors are original to Sanctus (warm friary parchment, habit gray,
 * Marian blue). Brick City is a *technique* reference only — we do not
 * copy its lawn greens, runner reds, or hex values.
 */

/**
 * Mix two 0xRRGGBB colors. t=0 → a, t=1 → b.
 * Pure — safe for Vitest.
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
export function mixHex(a, b, t) {
  const clamped = Math.max(0, Math.min(1, t));
  const ar = (a >> 16) & 255;
  const ag = (a >> 8) & 255;
  const ab = a & 255;
  const br = (b >> 16) & 255;
  const bg = (b >> 8) & 255;
  const bb = b & 255;
  const r = Math.round(ar + (br - ar) * clamped);
  const g = Math.round(ag + (bg - ag) * clamped);
  const bl = Math.round(ab + (bb - ab) * clamped);
  return ((r & 255) << 16) | ((g & 255) << 8) | (bl & 255);
}

/**
 * Build a 4-step shade ramp from a mid tone.
 * WHY ramps: GBC sprites read as solid shapes with a lit edge and a
 * shaded edge. One mid color alone looks flat.
 * @param {number} mid
 * @param {number} [outline]
 */
export function shadeRamp(mid, outline = 0x1c140f) {
  return {
    highlight: mixHex(mid, 0xfff8ea, 0.42),
    mid,
    shade: mixHex(mid, outline, 0.38),
    deep: mixHex(mid, outline, 0.58),
    outline,
  };
}

/** Global outline ink — keeps every sprite on the same edge weight. */
export const OUTLINE = 0x1c140f;

/**
 * Material books used by tiles / characters / UI.
 * Each entry is a shadeRamp (or a small named set).
 */
export const PALETTE = {
  outline: OUTLINE,
  // Sky / UI
  sky: shadeRamp(0x1a2a4a),
  skyDeep: 0x0d1524,
  parchment: shadeRamp(0xf2e6c8),
  ink: 0x2a1f14,
  gold: shadeRamp(0xc9a227),
  // Ground
  grass: shadeRamp(0x4a7a3a),
  grassAlt: shadeRamp(0x3f6e34),
  dirt: shadeRamp(0x8b6914),
  path: shadeRamp(0xb89a6a),
  // Stone / brick / wood
  stone: shadeRamp(0x8a7a68),
  brick: shadeRamp(0x8b5340),
  mortar: 0xc4b49a,
  wood: shadeRamp(0x6b4423),
  woodDark: shadeRamp(0x3a2210),
  // Buildings
  plaster: shadeRamp(0xc4a574),
  roof: shadeRamp(0x5a3a28),
  // Street
  asphalt: shadeRamp(0x5a5a5a),
  sidewalk: shadeRamp(0x9a9a9a),
  curb: 0x6a6a6a,
  crosswalk: 0xe8e8e8,
  // Nature
  leaf: shadeRamp(0x2f5e2f),
  leafLit: shadeRamp(0x4a8a3a),
  trunk: shadeRamp(0x6b4423),
  // Habit / clothes
  habit: shadeRamp(0x7a7a7a),
  habitLight: shadeRamp(0x9a9a9a),
  cord: 0xf2e6c8,
  postulant: shadeRamp(0x5a6a7a),
  streetTunic: shadeRamp(0x3d6b3d),
  neighborCoat: shadeRamp(0x4a6fa5),
  // Skin / hair
  skin: shadeRamp(0xe8c39e),
  hair: shadeRamp(0x3a2a1a),
  beard: shadeRamp(0x4a3a2a),
  // Marian / chapel
  mantle: shadeRamp(0x3a5a8a),
  veil: shadeRamp(0xf2e6c8),
  rose: shadeRamp(0xb85a6a),
  candle: shadeRamp(0xfff0c8),
  flame: shadeRamp(0xe8a020),
  // Shadow (drawn with alpha)
  shadow: 0x000000,
};

/** Flat COLORS alias for menus that still want single mid tones. */
export const UI_COLORS = {
  sky: PALETTE.sky.mid,
  skyDeep: PALETTE.skyDeep,
  parchment: PALETTE.parchment.mid,
  parchmentLit: PALETTE.parchment.highlight,
  parchmentShade: PALETTE.parchment.shade,
  ink: PALETTE.ink,
  gold: PALETTE.gold.mid,
  goldLit: PALETTE.gold.highlight,
  muted: PALETTE.stone.shade,
  grass: PALETTE.grass.mid,
  outline: OUTLINE,
  white: 0xffffff,
};
