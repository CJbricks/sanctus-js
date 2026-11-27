/**
 * tiles.js
 * Original pixel tiles for the friary grounds (Pixi Graphics).
 *
 * WHY richer tiles:
 * Flat single-color squares read as a prototype. Shade ramps, mortar,
 * tufts, and 2–3 position-hashed variants make the grounds feel like a
 * handheld overworld while staying code-drawn and original.
 *
 * Crucifix and Our Lady are scenery — never inventory items.
 */

import { TILE_SIZE } from "@/lib/constants";
import { fillRect } from "@/game/draw";
import { PALETTE } from "@/game/art/palette";
import {
  brickPattern,
  ditherSpeckle,
  dropShadow,
  highlightDot,
  outlineRect,
  positionHash,
  shadedRect,
  tileVariant,
} from "@/game/art/pixelHelpers";

/**
 * Draw one 32×32 tile at pixel (px, py).
 * Pass map tile coords (tx, ty) so variants stay stable.
 *
 * @param {import("pixi.js").Graphics} g
 * @param {string} id
 * @param {number} px
 * @param {number} py
 * @param {{ tx?: number, ty?: number, flicker?: number }} [opts]
 */
export function drawTile(g, id, px, py, opts = {}) {
  const tx = opts.tx ?? 0;
  const ty = opts.ty ?? 0;
  const flicker = opts.flicker ?? 0;
  const v = tileVariant(tx, ty, 3);
  const t = TILE_SIZE;

  switch (id) {
    case "wall":
      drawStoneWall(g, px, py, t, v);
      break;
    case "building":
      drawBuilding(g, px, py, t, v);
      break;
    case "floor":
      drawFloor(g, px, py, t, v);
      break;
    case "grass":
      drawGrass(g, px, py, t, tx, ty, v);
      break;
    case "door":
      drawDoor(g, px, py, t);
      break;
    case "road":
      drawRoad(g, px, py, t, v);
      break;
    case "roadLine":
      drawRoad(g, px, py, t, v);
      fillRect(g, px, py + 14, t, 2, PALETTE.gold.mid);
      fillRect(g, px, py + 16, t, 1, PALETTE.gold.shade);
      break;
    case "sidewalk":
      drawSidewalk(g, px, py, t, v);
      break;
    case "crosswalk":
      drawRoad(g, px, py, t, v);
      for (let i = 0; i < 4; i += 1) {
        fillRect(g, px + 4, py + 2 + i * 8, t - 8, 4, PALETTE.crosswalk);
        fillRect(g, px + 4, py + 2 + i * 8, t - 8, 1, 0xffffff);
      }
      break;
    case "tree":
      drawTree(g, px, py, t, v);
      break;
    case "garden":
      drawGarden(g, px, py, t, tx, ty, v);
      break;
    case "bench":
      drawBench(g, px, py, t);
      break;
    case "altar":
      drawAltar(g, px, py, t);
      break;
    case "crucifix":
      drawCrucifix(g, px, py, t, flicker);
      break;
    case "ourLady":
      drawOurLady(g, px, py, t, flicker);
      break;
    default:
      fillRect(g, px, py, t, t, 0xff00ff);
  }
}

function drawStoneWall(g, px, py, t, v) {
  brickPattern(g, px, py, t, t, PALETTE.stone, PALETTE.mortar, v);
  fillRect(g, px, py + t - 3, t, 3, PALETTE.stone.deep);
  ditherSpeckle(g, px + 2, py + 2, t - 4, t - 6, PALETTE.stone.highlight, v);
}

function drawBuilding(g, px, py, t, v) {
  // Roof course on top, plaster wall below — reads as friary exterior.
  shadedRect(g, px, py, t, 10, PALETTE.roof);
  for (let i = 0; i < t; i += 4) {
    fillRect(g, px + i, py + 2, 3, 6, PALETTE.roof.shade);
  }
  brickPattern(g, px, py + 10, t, t - 10, PALETTE.brick, PALETTE.mortar, v);
  // Lit window (warm interior glow)
  if (v !== 2) {
    outlineRect(g, px + 10, py + 14, 12, 10, PALETTE.candle.mid);
    fillRect(g, px + 11, py + 15, 10, 8, PALETTE.candle.highlight);
    fillRect(g, px + 15, py + 14, 2, 10, PALETTE.wood.deep);
    fillRect(g, px + 10, py + 18, 12, 1, PALETTE.wood.deep);
  }
}

function drawFloor(g, px, py, t, v) {
  shadedRect(g, px, py, t, t, PALETTE.plaster);
  // Cobble / plank chips by variant
  if (v === 0) {
    fillRect(g, px + 4, py + 6, 8, 4, PALETTE.plaster.shade);
    fillRect(g, px + 18, py + 16, 6, 3, PALETTE.plaster.highlight);
  } else if (v === 1) {
    fillRect(g, px + 10, py + 10, 10, 2, PALETTE.plaster.shade);
    fillRect(g, px + 6, py + 22, 14, 2, PALETTE.plaster.shade);
  } else {
    ditherSpeckle(g, px + 2, py + 2, t - 4, t - 4, PALETTE.plaster.shade, 3);
  }
}

function drawGrass(g, px, py, t, tx, ty, v) {
  const ramp = v === 1 ? PALETTE.grassAlt : PALETTE.grass;
  fillRect(g, px, py, t, t, ramp.mid);
  // Checker soft shade so neighboring tiles don't look identical
  if ((tx + ty) % 2 === 0) {
    ditherSpeckle(g, px, py, t, t, ramp.shade, v);
  } else {
    ditherSpeckle(g, px, py, t, t, ramp.highlight, v + 1);
  }
  const n = positionHash(tx, ty);
  const tufts = [
    [3, 8],
    [12, 18],
    [22, 6],
    [8, 24],
    [26, 20],
  ];
  tufts.forEach(([bx, by], i) => {
    if (((n >>> i) & 1) === 0 && v !== i % 3) return;
    fillRect(g, px + bx, py + by, 1, 4, ramp.deep);
    fillRect(g, px + bx, py + by, 1, 2, ramp.highlight);
  });
  // Occasional wildflower (original colors — not Brick City's set)
  if (n % 7 === 0) {
    const fx = px + 6 + (n % 14);
    const fy = py + 8 + ((n >>> 4) % 12);
    fillRect(g, fx, fy + 2, 1, 3, ramp.deep);
    fillRect(g, fx - 1, fy, 3, 2, PALETTE.rose.mid);
    highlightDot(g, fx, fy, PALETTE.gold.highlight);
  }
}

function drawDoor(g, px, py, t) {
  // Path underfoot + framed wooden door / gate
  shadedRect(g, px, py, t, t, PALETTE.plaster);
  dropShadow(g, px + 5, py + 28, 22, 3, 0.2);
  outlineRect(g, px + 5, py + 2, 22, 28, PALETTE.woodDark.mid);
  shadedRect(g, px + 6, py + 3, 20, 26, PALETTE.woodDark);
  // Panels
  fillRect(g, px + 8, py + 5, 7, 10, PALETTE.wood.shade);
  fillRect(g, px + 17, py + 5, 7, 10, PALETTE.wood.shade);
  fillRect(g, px + 8, py + 17, 7, 10, PALETTE.wood.shade);
  fillRect(g, px + 17, py + 17, 7, 10, PALETTE.wood.shade);
  fillRect(g, px + 8, py + 5, 7, 1, PALETTE.wood.highlight);
  // Iron ring + gold latch
  fillRect(g, px + 22, py + 14, 3, 3, PALETTE.gold.mid);
  highlightDot(g, px + 23, py + 14, PALETTE.gold.highlight);
}

function drawRoad(g, px, py, t, v) {
  shadedRect(g, px, py, t, t, PALETTE.asphalt);
  ditherSpeckle(g, px + 1, py + 1, t - 2, t - 2, PALETTE.asphalt.highlight, v);
  if (v === 0) fillRect(g, px + 8, py + 10, 4, 2, PALETTE.asphalt.shade);
  if (v === 2) fillRect(g, px + 18, py + 20, 5, 2, PALETTE.asphalt.deep);
}

function drawSidewalk(g, px, py, t, v) {
  shadedRect(g, px, py, t, t, PALETTE.sidewalk);
  // Curb along the bottom edge
  fillRect(g, px, py + t - 4, t, 3, PALETTE.curb);
  fillRect(g, px, py + t - 1, t, 1, PALETTE.asphalt.deep);
  fillRect(g, px, py + t - 4, t, 1, PALETTE.sidewalk.highlight);
  // Slab seams
  const seam = 10 + v * 6;
  fillRect(g, px + seam, py + 2, 1, t - 6, PALETTE.sidewalk.shade);
  ditherSpeckle(g, px + 2, py + 2, t - 4, t - 8, PALETTE.sidewalk.highlight, v);
}

function drawTree(g, px, py, t, v) {
  // Grass under canopy
  fillRect(g, px, py, t, t, PALETTE.grass.mid);
  dropShadow(g, px + 8, py + 26, 16, 4, 0.3);
  // Trunk with lit edge
  outlineRect(g, px + 13, py + 18, 6, 12, PALETTE.trunk.mid);
  fillRect(g, px + 13, py + 18, 2, 12, PALETTE.trunk.highlight);
  fillRect(g, px + 17, py + 18, 2, 12, PALETTE.trunk.shade);
  // Layered canopy (dark → mid → lit)
  const bands = [
    [4, 2, 24, 14, PALETTE.leaf.deep],
    [6, 0, 20, 12, PALETTE.leaf.mid],
    [8, 2, 16, 8, PALETTE.leafLit.mid],
  ];
  if (v === 1) bands[0][0] = 3;
  if (v === 2) bands[1][1] = 1;
  bands.forEach(([x, y, w, h, color]) => {
    fillRect(g, px + x, py + y, w, h, color);
  });
  highlightDot(g, px + 12 + v, py + 4, PALETTE.leafLit.highlight);
  highlightDot(g, px + 18, py + 8, PALETTE.leafLit.highlight);
}

function drawGarden(g, px, py, t, tx, ty, v) {
  shadedRect(g, px, py, t, t, PALETTE.dirt);
  // Raised bed rim
  fillRect(g, px + 1, py + 1, t - 2, 2, PALETTE.wood.mid);
  fillRect(g, px + 1, py + t - 3, t - 2, 2, PALETTE.wood.shade);
  const plants = [
    [5, 10, PALETTE.leaf.mid],
    [14, 14, PALETTE.leafLit.mid],
    [22, 8, PALETTE.leaf.shade],
  ];
  plants.forEach(([x, y, c], i) => {
    const yo = (v + i) % 3;
    fillRect(g, px + x, py + y + yo, 5, 8, c);
    fillRect(g, px + x + 1, py + y + yo, 3, 2, PALETTE.leaf.highlight);
  });
  // Flower accents
  const n = positionHash(tx, ty);
  if (n % 2 === 0) {
    fillRect(g, px + 8, py + 12, 2, 2, PALETTE.rose.mid);
    fillRect(g, px + 20, py + 18, 2, 2, PALETTE.gold.mid);
  }
}

function drawBench(g, px, py, t) {
  fillRect(g, px, py, t, t, PALETTE.grass.mid);
  dropShadow(g, px + 2, py + 26, 28, 3, 0.25);
  outlineRect(g, px + 2, py + 16, 28, 6, PALETTE.wood.mid);
  shadedRect(g, px + 3, py + 17, 26, 4, PALETTE.wood);
  // Legs
  fillRect(g, px + 4, py + 22, 4, 6, PALETTE.wood.shade);
  fillRect(g, px + 24, py + 22, 4, 6, PALETTE.wood.shade);
  fillRect(g, px + 4, py + 22, 1, 6, PALETTE.wood.highlight);
  // Backrest
  fillRect(g, px + 4, py + 12, 24, 3, PALETTE.wood.mid);
  fillRect(g, px + 4, py + 12, 24, 1, PALETTE.wood.highlight);
}

function drawAltar(g, px, py, t) {
  // Reverent chapel furniture — scenery only.
  shadedRect(g, px, py, t, t, PALETTE.plaster);
  dropShadow(g, px + 4, py + 28, 24, 3, 0.2);
  outlineRect(g, px + 4, py + 12, 24, 16, PALETTE.parchment.mid);
  shadedRect(g, px + 5, py + 13, 22, 14, PALETTE.parchment);
  // Cloth stripe
  fillRect(g, px + 5, py + 13, 22, 3, PALETTE.mantle.mid);
  fillRect(g, px + 5, py + 13, 22, 1, PALETTE.mantle.highlight);
  // Cross motif on the frontal (geometry only)
  fillRect(g, px + 15, py + 4, 2, 8, PALETTE.gold.mid);
  fillRect(g, px + 12, py + 6, 8, 2, PALETTE.gold.mid);
  highlightDot(g, px + 15, py + 4, PALETTE.gold.highlight);
}

function drawCrucifix(g, px, py, t, flicker) {
  // Scenery: wooden crucifix with candles. Never a weapon or item.
  shadedRect(g, px, py, t, t, PALETTE.plaster);
  dropShadow(g, px + 8, py + 28, 16, 3, 0.22);
  // Stand
  fillRect(g, px + 10, py + 26, 12, 4, PALETTE.wood.deep);
  // Cross beam
  outlineRect(g, px + 14, py + 2, 4, 24, PALETTE.wood.mid);
  shadedRect(g, px + 15, py + 3, 2, 22, PALETTE.wood);
  outlineRect(g, px + 7, py + 8, 18, 4, PALETTE.wood.mid);
  shadedRect(g, px + 8, py + 9, 16, 2, PALETTE.wood);
  // Candles left / right with gentle flicker
  drawCandle(g, px + 4, py + 18, flicker);
  drawCandle(g, px + 24, py + 18, flicker + 1);
}

function drawCandle(g, x, y, flicker) {
  fillRect(g, x, y, 4, 8, PALETTE.parchment.mid);
  fillRect(g, x, y, 4, 1, PALETTE.parchment.highlight);
  const tip = (flicker | 0) % 3;
  fillRect(g, x + 1, y - 3 - (tip === 1 ? 1 : 0), 2, 3 + (tip === 2 ? 1 : 0), PALETTE.flame.mid);
  highlightDot(g, x + 1, y - 3, PALETTE.flame.highlight);
}

function drawOurLady(g, px, py, t, flicker) {
  // Our Lady Untier of Knots — original reverent statue (scenery).
  shadedRect(g, px, py, t, t, PALETTE.plaster);
  dropShadow(g, px + 8, py + 28, 16, 3, 0.22);
  // Pedestal
  outlineRect(g, px + 8, py + 26, 16, 5, PALETTE.stone.mid);
  shadedRect(g, px + 9, py + 27, 14, 3, PALETTE.stone);
  // Soft halo glow (dithered, not a cartoon sticker)
  const glow = PALETTE.gold.highlight;
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    const hx = px + 16 + Math.round(Math.cos(a) * 7);
    const hy = py + 6 + Math.round(Math.sin(a) * 5);
    fillRect(g, hx, hy, 1, 1, glow);
  }
  // Veil + face
  outlineRect(g, px + 11, py + 3, 10, 8, PALETTE.veil.mid);
  fillRect(g, px + 12, py + 4, 8, 6, PALETTE.skin.mid);
  fillRect(g, px + 12, py + 3, 8, 3, PALETTE.veil.mid);
  fillRect(g, px + 13, py + 6, 1, 1, PALETTE.outline); // eye
  fillRect(g, px + 17, py + 6, 1, 1, PALETTE.outline);
  highlightDot(g, px + 13, py + 6, 0xffffff);
  // Mantle / robes with two-tone folds
  outlineRect(g, px + 9, py + 11, 14, 15, PALETTE.mantle.mid);
  shadedRect(g, px + 10, py + 12, 12, 13, PALETTE.mantle);
  fillRect(g, px + 11, py + 14, 3, 10, PALETTE.mantle.highlight);
  fillRect(g, px + 18, py + 16, 3, 8, PALETTE.mantle.shade);
  // Ribbon / knot (Untier of Knots motif — modest accent)
  fillRect(g, px + 13, py + 18, 6, 2, PALETTE.rose.mid);
  fillRect(g, px + 14, py + 20, 4, 2, PALETTE.rose.shade);
  fillRect(g, px + 15, py + 17, 2, 5, PALETTE.rose.highlight);
  // Candle at the base (flicker)
  drawCandle(g, px + 4, py + 20, flicker);
}

/**
 * Paint every tile of a map into one Graphics object (once per scene).
 * @param {import("pixi.js").Graphics} g
 * @param {{ width: number, height: number, tiles: { id: string }[][] }} map
 * @param {{ flicker?: number, skipAnimated?: boolean }} [opts]
 */
export function drawMapTiles(g, map, opts = {}) {
  g.clear();
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      const id = map.tiles[y][x].id;
      // WHY skipAnimated: crucifix / Our Lady candles flicker on a
      // separate layer so the static map texture stays cached.
      if (opts.skipAnimated && (id === "crucifix" || id === "ourLady")) {
        drawTile(g, "floor", x * TILE_SIZE, y * TILE_SIZE, { tx: x, ty: y });
        continue;
      }
      drawTile(g, id, x * TILE_SIZE, y * TILE_SIZE, {
        tx: x,
        ty: y,
        flicker: opts.flicker ?? 0,
      });
    }
  }
}

export { tileVariant };
