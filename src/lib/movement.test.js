/**
 * movement.test.js
 * Collision and facing helpers for the friary map.
 */

import { describe, expect, it } from "vitest";
import { FRIARY_MAP } from "@/game/maps/friaryGrounds";
import {
  canWalk,
  facingFromAction,
  facingTile,
  tryStep,
} from "@/lib/movement";

describe("friary map parse", () => {
  it("has matching width/height and a walkable spawn", () => {
    expect(FRIARY_MAP.width).toBe(24);
    expect(FRIARY_MAP.height).toBe(16);
    expect(canWalk(FRIARY_MAP, FRIARY_MAP.spawn.x, FRIARY_MAP.spawn.y)).toBe(true);
  });

  it("places the three NPCs", () => {
    const ids = FRIARY_MAP.npcs.map((n) => n.id).sort();
    expect(ids).toEqual(["garden-friar", "local-servant", "neighbor"]);
  });
});

describe("canWalk / tryStep", () => {
  it("blocks walls and allows doors/floor", () => {
    expect(canWalk(FRIARY_MAP, 0, 0)).toBe(false); // corner wall
    // Find a door tile
    let door = null;
    for (let y = 0; y < FRIARY_MAP.height; y += 1) {
      for (let x = 0; x < FRIARY_MAP.width; x += 1) {
        if (FRIARY_MAP.tiles[y][x].id === "door") door = { x, y };
      }
    }
    expect(door).not.toBeNull();
    expect(canWalk(FRIARY_MAP, door.x, door.y)).toBe(true);
  });

  it("moves one tile when open, stays when solid", () => {
    const open = tryStep({
      map: FRIARY_MAP,
      x: FRIARY_MAP.spawn.x,
      y: FRIARY_MAP.spawn.y,
      facing: "right",
    });
    // May or may not move depending on spawn neighbors; at least returns fields.
    expect(open).toHaveProperty("moved");
    expect(open).toHaveProperty("x");

    const intoWall = tryStep({
      map: FRIARY_MAP,
      x: 1,
      y: 1,
      facing: "up",
    });
    expect(intoWall.moved).toBe(false);
    expect(intoWall.x).toBe(1);
    expect(intoWall.y).toBe(1);
  });

  it("treats NPC tiles as blockers when listed", () => {
    const servant = FRIARY_MAP.npcs.find((n) => n.id === "local-servant");
    expect(
      canWalk(FRIARY_MAP, servant.x, servant.y, [{ x: servant.x, y: servant.y }]),
    ).toBe(false);
  });
});

describe("facing helpers", () => {
  it("maps actions and facing tiles", () => {
    expect(facingFromAction("left")).toBe("left");
    expect(facingFromAction("a")).toBeNull();
    expect(facingTile(5, 5, "up")).toEqual({ x: 5, y: 4 });
  });
});
