/**
 * pixelHelpers.test.js
 * Deterministic tile variants and helper purity.
 */

import { describe, expect, it } from "vitest";
import {
  positionHash,
  tileVariant,
} from "@/game/art/pixelHelpers";
import { tileVariant as tileVariantFromTiles } from "@/game/art/tiles";

describe("positionHash / tileVariant", () => {
  it("is deterministic for the same coordinates", () => {
    expect(positionHash(3, 7)).toBe(positionHash(3, 7));
    expect(tileVariant(3, 7, 3)).toBe(tileVariant(3, 7, 3));
  });

  it("changes across nearby tiles (not a flat field)", () => {
    const set = new Set();
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        set.add(tileVariant(x, y, 3));
      }
    }
    expect(set.size).toBeGreaterThan(1);
  });

  it("stays in 0..count-1", () => {
    for (let i = 0; i < 40; i += 1) {
      const v = tileVariant(i, i * 2, 3);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(3);
    }
  });

  it("matches the re-export used by tiles.js", () => {
    expect(tileVariantFromTiles(4, 9, 3)).toBe(tileVariant(4, 9, 3));
  });
});
