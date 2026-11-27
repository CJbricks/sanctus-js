/**
 * tiles.js
 * Original pixel tiles for the friary grounds (drawn with Pixi Graphics).
 *
 * WHY one function per tile id:
 * The map module only stores ids like "grass" / "wall". This file turns
 * those ids into colored rectangles. CJ can recolor a tile without
 * touching collision or map data. Crucifix and Our Lady are scenery —
 * never inventory items (see GAME_RULES theme rules).
 */

import { TILE_SIZE } from "@/lib/constants";
import { fillRect } from "@/game/draw";

const C = {
  wall: 0x5a4632,
  wallDark: 0x3a2c1c,
  floor: 0xc4a574,
  grass: 0x4a7a3a,
  grassDark: 0x3d6b3d,
  road: 0x5a5a5a,
  roadLine: 0xc9a227,
  sidewalk: 0x9a9a9a,
  crosswalk: 0xe8e8e8,
  building: 0x6b5344,
  buildingRoof: 0x4a3428,
  treeTrunk: 0x6b4423,
  treeLeaf: 0x2f5e2f,
  garden: 0x6b8f3a,
  gardenDirt: 0x8b6914,
  bench: 0x8b5a2b,
  door: 0x3a2210,
  altar: 0xd4c4a0,
  wood: 0x7a5230,
  gold: 0xc9a227,
  cream: 0xf2e6c8,
  blue: 0x3a5a8a,
  rose: 0xb85a6a,
  ink: 0x2a1f14,
};

/**
 * Draw one 32×32 tile at pixel (px, py).
 * @param {import("pixi.js").Graphics} g
 * @param {string} id
 * @param {number} px
 * @param {number} py
 */
export function drawTile(g, id, px, py) {
  const t = TILE_SIZE;
  switch (id) {
    case "wall":
      fillRect(g, px, py, t, t, C.wall);
      fillRect(g, px, py + t - 4, t, 4, C.wallDark);
      break;
    case "building":
      fillRect(g, px, py, t, t, C.building);
      fillRect(g, px + 2, py + 2, t - 4, 6, C.buildingRoof);
      break;
    case "floor":
      fillRect(g, px, py, t, t, C.floor);
      fillRect(g, px + 14, py + 14, 4, 4, 0xb89460);
      break;
    case "grass":
      fillRect(g, px, py, t, t, C.grass);
      fillRect(g, px + 4, py + 8, 2, 6, C.grassDark);
      fillRect(g, px + 18, py + 16, 2, 6, C.grassDark);
      fillRect(g, px + 10, py + 22, 2, 4, C.grassDark);
      break;
    case "door":
      fillRect(g, px, py, t, t, C.floor);
      fillRect(g, px + 6, py + 4, 20, 28, C.door);
      fillRect(g, px + 22, py + 16, 3, 3, C.gold);
      break;
    case "road":
      fillRect(g, px, py, t, t, C.road);
      break;
    case "roadLine":
      fillRect(g, px, py, t, t, C.road);
      fillRect(g, px, py + 14, t, 4, C.roadLine);
      break;
    case "sidewalk":
      fillRect(g, px, py, t, t, C.sidewalk);
      fillRect(g, px, py + t - 2, t, 2, 0x7a7a7a);
      break;
    case "crosswalk":
      fillRect(g, px, py, t, t, C.road);
      for (let i = 0; i < 4; i += 1) {
        fillRect(g, px + 4, py + 2 + i * 8, t - 8, 4, C.crosswalk);
      }
      break;
    case "tree":
      fillRect(g, px, py, t, t, C.grass);
      fillRect(g, px + 12, py + 18, 8, 14, C.treeTrunk);
      fillRect(g, px + 4, py + 2, 24, 18, C.treeLeaf);
      fillRect(g, px + 8, py + 0, 16, 8, C.treeLeaf);
      break;
    case "garden":
      fillRect(g, px, py, t, t, C.gardenDirt);
      fillRect(g, px + 4, py + 8, 6, 10, C.garden);
      fillRect(g, px + 14, py + 12, 6, 10, C.garden);
      fillRect(g, px + 22, py + 6, 6, 10, C.garden);
      break;
    case "bench":
      fillRect(g, px, py, t, t, C.grass);
      fillRect(g, px + 2, py + 18, 28, 6, C.bench);
      fillRect(g, px + 4, py + 24, 4, 6, C.bench);
      fillRect(g, px + 24, py + 24, 4, 6, C.bench);
      break;
    case "altar":
      // Reverent chapel furniture — not an interactable "item".
      fillRect(g, px, py, t, t, C.floor);
      fillRect(g, px + 4, py + 10, 24, 18, C.altar);
      fillRect(g, px + 14, py + 4, 4, 8, C.gold);
      fillRect(g, px + 10, py + 6, 12, 3, C.gold);
      break;
    case "crucifix":
      // Scenery only: a simple wooden cross on a stand. Never a weapon or item.
      fillRect(g, px, py, t, t, C.floor);
      fillRect(g, px + 14, py + 2, 4, 26, C.wood);
      fillRect(g, px + 6, py + 8, 20, 4, C.wood);
      fillRect(g, px + 10, py + 28, 12, 4, C.ink);
      break;
    case "ourLady":
      // Our Lady Untier of Knots — modest original silhouette (statue).
      fillRect(g, px, py, t, t, C.floor);
      fillRect(g, px + 8, py + 26, 16, 4, C.ink); // pedestal
      fillRect(g, px + 10, py + 10, 12, 16, C.blue); // mantle
      fillRect(g, px + 12, py + 4, 8, 8, 0xe8c39e); // face
      fillRect(g, px + 10, py + 2, 12, 4, C.cream); // veil
      fillRect(g, px + 14, py + 18, 4, 6, C.rose); // knot accent
      break;
    default:
      fillRect(g, px, py, t, t, 0xff00ff);
  }
}

/**
 * Paint every tile of a map into one Graphics object.
 * @param {import("pixi.js").Graphics} g
 * @param {{ width: number, height: number, tiles: { id: string }[][] }} map
 */
export function drawMapTiles(g, map) {
  g.clear();
  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      drawTile(g, map.tiles[y][x].id, x * TILE_SIZE, y * TILE_SIZE);
    }
  }
}
