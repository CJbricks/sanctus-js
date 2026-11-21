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
} from "@/lib/callings";

describe("CALLINGS menu data", () => {
  it("lists the three paths in the documented order", () => {
    expect(CALLINGS.map((c) => c.id)).toEqual([
      "franciscan",
      "dominican",
      "carmelite",
    ]);
  });

  it("names the fictional homes and worlds from the design docs", () => {
    expect(getCalling("franciscan")).toMatchObject({
      home: "St. Juniper Friary",
      world: "Five Bridges City",
    });
    expect(getCalling("dominican")).toMatchObject({
      home: "House of St. Raymond",
      world: "Capitol City",
    });
    expect(getCalling("carmelite")).toMatchObject({
      home: "Monastery of St. Elijah",
      world: "Thornback",
    });
  });

  it("returns null for an unknown id", () => {
    expect(getCalling("benedictine")).toBeNull();
  });

  it("builds a placeholder message that names the house", () => {
    const message = callingPlaceholderMessage("franciscan");
    expect(message).toContain("St. Juniper Friary");
    expect(message).toContain("Five Bridges City");
  });
});
