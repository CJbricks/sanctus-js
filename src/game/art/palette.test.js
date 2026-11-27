/**
 * palette.test.js
 * Shade ramps and mix helpers for the shared Sanctus palette.
 */

import { describe, expect, it } from "vitest";
import {
  OUTLINE,
  PALETTE,
  mixHex,
  shadeRamp,
} from "@/game/art/palette";

describe("mixHex / shadeRamp", () => {
  it("mixes toward white and black at the endpoints", () => {
    expect(mixHex(0x000000, 0xffffff, 0)).toBe(0x000000);
    expect(mixHex(0x000000, 0xffffff, 1)).toBe(0xffffff);
    // Midpoint rounds channel-wise (127.5 → 128).
    expect(mixHex(0x0000ff, 0xff0000, 0.5)).toBe(0x800080);
  });

  it("builds a 4-step ramp with outline", () => {
    const ramp = shadeRamp(0x4a7a3a, OUTLINE);
    expect(ramp.mid).toBe(0x4a7a3a);
    expect(ramp.outline).toBe(OUTLINE);
    expect(ramp.highlight).not.toBe(ramp.mid);
    expect(ramp.shade).not.toBe(ramp.mid);
    expect(ramp.deep).not.toBe(ramp.shade);
  });
});

describe("PALETTE materials", () => {
  it("exposes multi-shade books for core materials", () => {
    for (const key of ["grass", "stone", "wood", "habit", "skin", "gold", "mantle"]) {
      expect(PALETTE[key]).toMatchObject({
        highlight: expect.any(Number),
        mid: expect.any(Number),
        shade: expect.any(Number),
      });
    }
    expect(PALETTE.outline).toBe(OUTLINE);
  });
});
