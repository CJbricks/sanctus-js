/**
 * orderEmblems.test.js
 * Pure checks for emblem ids, grid size, and pixel bounds.
 * No Pixi / browser required.
 */

import { describe, expect, it } from "vitest";
import {
  EMBLEM_IDS,
  EMBLEM_SIZE,
  getEmblemDescriptor,
  listEmblemDescriptors,
  pixelsForEmblem,
  pixelsFromGrid,
} from "@/game/art/orderEmblems";

describe("getEmblemDescriptor", () => {
  it("maps each calling to a unique emblem id and 32×32 size", () => {
    const franciscan = getEmblemDescriptor("franciscan");
    const dominican = getEmblemDescriptor("dominican");
    const carmelite = getEmblemDescriptor("carmelite");

    expect(franciscan).toMatchObject({
      emblemId: EMBLEM_IDS.franciscan,
      title: "Franciscans",
      width: EMBLEM_SIZE,
      height: EMBLEM_SIZE,
      frameCount: 3,
    });
    expect(dominican.emblemId).toBe("hound-with-torch");
    expect(carmelite.emblemId).toBe("hands-in-prayer");
    expect(franciscan.emblemId).toBe("wolf-of-gubbio");

    const ids = [franciscan, dominican, carmelite].map((d) => d.emblemId);
    expect(new Set(ids).size).toBe(3);
  });

  it("returns null for an unknown calling", () => {
    expect(getEmblemDescriptor("jesuit")).toBeNull();
  });
});

describe("listEmblemDescriptors", () => {
  it("lists the three paths in menu order", () => {
    expect(listEmblemDescriptors().map((d) => d.callingId)).toEqual([
      "franciscan",
      "dominican",
      "carmelite",
    ]);
  });
});

describe("pixelsFromGrid", () => {
  it("skips dots and maps letters through the key", () => {
    const pixels = pixelsFromGrid([".A.", "B.."], { A: 0xff0000, B: 0x00ff00 });
    expect(pixels).toEqual([
      { x: 1, y: 0, color: 0xff0000 },
      { x: 0, y: 1, color: 0x00ff00 },
    ]);
  });
});

describe("pixelsForEmblem", () => {
  it("returns in-bounds pixels for every calling and frame", () => {
    for (const id of ["franciscan", "dominican", "carmelite"]) {
      for (let frame = 0; frame < 3; frame += 1) {
        const pixels = pixelsForEmblem(id, frame);
        expect(pixels.length).toBeGreaterThan(20);
        for (const px of pixels) {
          expect(px.x).toBeGreaterThanOrEqual(0);
          expect(px.y).toBeGreaterThanOrEqual(0);
          expect(px.x).toBeLessThan(EMBLEM_SIZE);
          expect(px.y).toBeLessThan(EMBLEM_SIZE);
          expect(typeof px.color).toBe("number");
        }
      }
    }
  });

  it("changes dominican flame pixels across frames (idle flicker)", () => {
    const a = pixelsForEmblem("dominican", 0);
    const b = pixelsForEmblem("dominican", 1);
    // Same shape count-ish, but at least one color/position differs in the flame.
    expect(JSON.stringify(a)).not.toBe(JSON.stringify(b));
  });

  it("returns an empty list for unknown callings", () => {
    expect(pixelsForEmblem("unknown")).toEqual([]);
  });
});
