/**
 * movement.js
 * Pure grid movement + collision helpers for the overworld.
 *
 * WHY pure (no Pixi):
 * Vitest can check that walls block and doors open without a browser.
 * The overworld scene calls these, then draws the result.
 */

/** @typedef {"up"|"down"|"left"|"right"} Facing */

export const FACING_DELTA = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

/**
 * @param {Facing} facing
 * @returns {{ dx: number, dy: number }}
 */
export function deltaForFacing(facing) {
  return FACING_DELTA[facing] || FACING_DELTA.down;
}

/**
 * Is tile (x,y) inside the map and not solid?
 * @param {{ width: number, height: number, tiles: { solid: boolean }[][] }} map
 * @param {number} x
 * @param {number} y
 * @param {{ x: number, y: number }[]} [blockers]  NPC tiles, etc.
 */
export function canWalk(map, x, y, blockers = []) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  if (map.tiles[y][x].solid) return false;
  for (const b of blockers) {
    if (b.x === x && b.y === y) return false;
  }
  return true;
}

/**
 * Try one grid step. Returns the next position (or the same if blocked)
 * and whether we moved.
 *
 * @param {object} opts
 * @param {{ width: number, height: number, tiles: { solid: boolean }[][] }} opts.map
 * @param {number} opts.x
 * @param {number} opts.y
 * @param {Facing} opts.facing
 * @param {{ x: number, y: number }[]} [opts.blockers]
 */
export function tryStep({ map, x, y, facing, blockers = [] }) {
  const { dx, dy } = deltaForFacing(facing);
  const nx = x + dx;
  const ny = y + dy;
  if (!canWalk(map, nx, ny, blockers)) {
    return { x, y, moved: false, facing };
  }
  return { x: nx, y: ny, moved: true, facing };
}

/**
 * Tile in front of the player (for A-button interact).
 * @param {number} x
 * @param {number} y
 * @param {Facing} facing
 */
export function facingTile(x, y, facing) {
  const { dx, dy } = deltaForFacing(facing);
  return { x: x + dx, y: y + dy };
}

/**
 * Map a held move action to a facing. Returns null if not a direction.
 * @param {string | null} action
 * @returns {Facing | null}
 */
export function facingFromAction(action) {
  if (action === "up" || action === "down" || action === "left" || action === "right") {
    return action;
  }
  return null;
}
