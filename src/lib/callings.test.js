/**
 * callings.test.js
 * Locks the Choose Your Calling menu data so a rename does not silently
 * break the start screen or save migration.
 */

import { describe, expect, it } from "vitest";
import {
  CALLINGS,
  callingPlaceholderMessage,
  getCalling,
  normalizeCallingId,
} from "@/lib/callings";

describe("CALLINGS menu data", () => {
  it("lists the three paths in the documented order", () => {
    expect(CALLINGS.map((c) => c.id)).toEqual([
      "franciscan",
      "dominican",
      "carmelite",
    ]);
  });

  it("names the Marian homes and worlds from CJ's rename", () => {
    expect(getCalling("franciscan")).toMatchObject({
      home: "Our Lady Mary Untier of Knots Friary",
      homeShort: "Untier of Knots Friary",
      world: "Five Bridges City",
    });
    expect(getCalling("dominican")).toMatchObject({
      home: "Our Lady of Victory House of Studies",
      homeShort: "Our Lady of Victory",
      world: "Capitol City",
    });
    expect(getCalling("carmelite")).toMatchObject({
      home: "Our Lady of Sorrows Monastery",
      homeShort: "Our Lady of Sorrows",
      world: "Thornback",
    });
  });

  it("returns null for an unknown id", () => {
    expect(getCalling("benedictine")).toBeNull();
  });

  it("builds a Franciscan knock line that uses the full house name", () => {
    const message = callingPlaceholderMessage("franciscan");
    expect(message).toContain("Our Lady Mary Untier of Knots Friary");
    expect(message).toContain("Five Bridges City");
  });

  it("marks non-Franciscan paths as coming soon", () => {
    expect(callingPlaceholderMessage("dominican")).toMatch(/coming soon/i);
    expect(callingPlaceholderMessage("carmelite")).toMatch(/coming soon/i);
  });
});

describe("normalizeCallingId", () => {
  it("passes through current ids", () => {
    expect(normalizeCallingId("dominican")).toBe("dominican");
  });

  it("maps legacy house names to calling ids", () => {
    expect(normalizeCallingId("St. Juniper Friary")).toBe("franciscan");
    expect(normalizeCallingId("House of St. Raymond")).toBe("dominican");
    expect(normalizeCallingId("Monastery of St. Elijah")).toBe("carmelite");
  });

  it("maps current full and short home strings", () => {
    expect(normalizeCallingId("Our Lady of Victory House of Studies")).toBe(
      "dominican",
    );
    expect(normalizeCallingId("Our Lady of Sorrows")).toBe("carmelite");
  });

  it("returns null for junk", () => {
    expect(normalizeCallingId("")).toBeNull();
    expect(normalizeCallingId(null)).toBeNull();
  });
});
