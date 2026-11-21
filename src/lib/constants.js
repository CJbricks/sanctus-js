/**
 * constants.js
 * Shared numbers and strings used across SANCTUS.
 *
 * WHY one file:
 * Tuning (tile size, save key, screen size) stays in one place so you
 * never hunt through menus or Pixi scenes to change a magic number.
 * Pure data only — no browser APIs — so tests can import it safely.
 */

/** Logical game canvas width in CSS pixels (before CSS scaling). */
export const VIEW_WIDTH = 320;

/** Logical game canvas height in CSS pixels. */
export const VIEW_HEIGHT = 288;

/** Overworld / sprite tile width and height in pixels. */
export const TILE_SIZE = 32;

/**
 * Character sprite footprint: 32 wide by 40 tall.
 * WHY taller than a tile: early handheld RPGs often let the head
 * overlap the tile above so walking looks natural. Four walk frames
 * are planned later; the scaffold draws a simple standing block.
 */
export const CHAR_WIDTH = 32;
export const CHAR_HEIGHT = 40;

/** localStorage key for the current save format. */
export const SAVE_KEY = "sanctus-save-v1";

/**
 * Integer version stamped into every save blob.
 * Bump this only when the shape becomes incompatible; prefer migrate()
 * filling missing fields so old saves keep working.
 */
export const SAVE_VERSION = 1;
