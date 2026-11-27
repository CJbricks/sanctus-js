/**
 * save.test.js
 * Round-trip and migrate tests for the localStorage save.
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
import { MAP_ID } from "@/game/maps/friaryGrounds";
import { createEntryTasks } from "@/lib/quests";

describe("createNewSave", () => {
  it("stamps the current version, calling, map spawn, and tasks", () => {
    const save = createNewSave({ callingId: "franciscan" });
    expect(save.version).toBe(SAVE_VERSION);
    expect(save.callingId).toBe("franciscan");
    expect(save.spiritualHealth).toBe(100);
    expect(save.vigor).toBe(10);
    expect(save.position.mapId).toBe(MAP_ID);
    expect(save.facing).toBe("down");
    expect(save.tasks).toEqual(createEntryTasks());
    expect(save.hasBag).toBe(true);
  });

  it("rejects an unknown calling", () => {
    expect(() => createNewSave({ callingId: "jesuit" })).toThrow(/Unknown calling/);
  });
});

describe("serialize / deserialize round-trip", () => {
  it("survives JSON and comes back migrated with quest fields", () => {
    const original = createNewSave({ callingId: "dominican" });
    original.role = "postulant";
    original.rank = "postulant";
    original.calendar.day = 3;
    original.spiritualHealth = 88;
    original.facing = "left";
    original.position = { x: 4, y: 9, mapId: MAP_ID };
    original.tasks = {
      introduced: true,
      poverty: true,
      chastity: true,
      obedience: true,
      received: true,
    };
    original.hasBag = false;

    const again = deserialize(serialize(original));
    expect(again).not.toBeNull();
    expect(again.callingId).toBe("dominican");
    expect(again.role).toBe("postulant");
    expect(again.calendar.day).toBe(3);
    expect(again.spiritualHealth).toBe(88);
    expect(again.version).toBe(SAVE_VERSION);
    expect(again.facing).toBe("left");
    expect(again.position).toEqual({ x: 4, y: 9, mapId: MAP_ID });
    expect(again.tasks.received).toBe(true);
    expect(again.hasBag).toBe(false);
  });

  it("returns null for empty or garbage input", () => {
    expect(deserialize("")).toBeNull();
    expect(deserialize(null)).toBeNull();
    expect(deserialize("{not-json")).toBeNull();
  });
});

describe("migrate", () => {
  it("fills missing fields on a partial v1 blob (old save)", () => {
    const partial = {
      version: 1,
      callingId: "carmelite",
      // older saves might omit vigor / spiritualHealth / tasks / facing
    };
    const next = migrate(partial);
    expect(next).not.toBeNull();
    expect(next.callingId).toBe("carmelite");
    expect(next.vigor).toBe(10);
    expect(next.spiritualHealth).toBe(100);
    expect(next.position.mapId).toBe(MAP_ID);
    expect(next.facing).toBe("down");
    expect(next.tasks).toEqual(createEntryTasks());
    expect(next.hasBag).toBe(true);
  });

  it("maps legacy mapId 'grounds' and keeps task flags", () => {
    const next = migrate({
      version: 1,
      callingId: "franciscan",
      position: { x: 2, y: 3, mapId: "grounds" },
      facing: "up",
      tasks: { introduced: true, poverty: true },
    });
    expect(next.position.mapId).toBe(MAP_ID);
    expect(next.position.x).toBe(2);
    expect(next.facing).toBe("up");
    expect(next.tasks.introduced).toBe(true);
    expect(next.tasks.poverty).toBe(true);
    expect(next.tasks.chastity).toBe(false);
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
