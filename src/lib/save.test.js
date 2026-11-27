/**
 * save.test.js
 * Round-trip and migrate tests for the localStorage save stub.
 * Runs in Node — no browser required.
 */

import { describe, expect, it } from "vitest";
import {
  createNewSave,
  deserialize,
  migrate,
  serialize,
} from "@/lib/save";
import { SAVE_VERSION } from "@/lib/constants";

describe("createNewSave", () => {
  it("stamps the current version and calling", () => {
    const save = createNewSave({ callingId: "franciscan" });
    expect(save.version).toBe(SAVE_VERSION);
    expect(save.callingId).toBe("franciscan");
    expect(save.spiritualHealth).toBe(100);
    expect(save.vigor).toBe(10);
  });

  it("rejects an unknown calling", () => {
    expect(() => createNewSave({ callingId: "jesuit" })).toThrow(/Unknown calling/);
  });
});

describe("serialize / deserialize round-trip", () => {
  it("survives JSON and comes back migrated", () => {
    const original = createNewSave({ callingId: "dominican" });
    original.role = "postulant";
    original.rank = "postulant";
    original.calendar.day = 3;
    original.spiritualHealth = 88;

    const again = deserialize(serialize(original));
    expect(again).not.toBeNull();
    expect(again.callingId).toBe("dominican");
    expect(again.role).toBe("postulant");
    expect(again.calendar.day).toBe(3);
    expect(again.spiritualHealth).toBe(88);
    expect(again.version).toBe(SAVE_VERSION);
  });

  it("returns null for empty or garbage input", () => {
    expect(deserialize("")).toBeNull();
    expect(deserialize(null)).toBeNull();
    expect(deserialize("{not-json")).toBeNull();
  });
});

describe("migrate", () => {
  it("fills missing fields on a partial v1 blob", () => {
    const partial = {
      version: 1,
      callingId: "carmelite",
      // older saves might omit vigor / spiritualHealth
    };
    const next = migrate(partial);
    expect(next).not.toBeNull();
    expect(next.callingId).toBe("carmelite");
    expect(next.vigor).toBe(10);
    expect(next.spiritualHealth).toBe(100);
    expect(next.position.mapId).toBe("grounds");
  });

  it("keeps known fields and clamps ranges", () => {
    const next = migrate({
      version: 1,
      callingId: "franciscan",
      spiritualHealth: 140,
      vigor: -2,
      calendar: { day: 5.7, weekday: "fri" },
    });
    expect(next.spiritualHealth).toBe(100);
    expect(next.vigor).toBe(0);
    expect(next.calendar.day).toBe(5);
    expect(next.calendar.weekday).toBe("fri");
  });

  it("rejects wrong versions and unknown callings", () => {
    expect(migrate({ version: 99, callingId: "franciscan" })).toBeNull();
    expect(migrate({ version: 1, callingId: "unknown" })).toBeNull();
    expect(migrate(null)).toBeNull();
  });

  it("maps legacy house-name callingIds to the stable path ids", () => {
    // WHY: before the Marian rename, docs used St. Juniper / St. Raymond /
    // St. Elijah. A blob that stored those strings as callingId must Resume.
    expect(
      migrate({ version: 1, callingId: "St. Juniper Friary" })?.callingId,
    ).toBe("franciscan");
    expect(
      migrate({ version: 1, callingId: "House of St. Raymond" })?.callingId,
    ).toBe("dominican");
    expect(
      migrate({ version: 1, callingId: "Monastery of St. Elijah" })?.callingId,
    ).toBe("carmelite");
  });

  it("maps a legacy home field when callingId is missing or odd", () => {
    const next = migrate({
      version: 1,
      callingId: "legacy-unknown",
      home: "St. Juniper Friary",
      spiritualHealth: 70,
    });
    expect(next).not.toBeNull();
    expect(next.callingId).toBe("franciscan");
    expect(next.spiritualHealth).toBe(70);
  });
});
