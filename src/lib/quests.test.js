/**
 * quests.test.js
 * Entry-task flags → Postulant reception.
 */

import { describe, expect, it } from "vitest";
import {
  allTasksDone,
  applyQuestAction,
  createEntryTasks,
  currentObjective,
  receiveAsPostulant,
} from "@/lib/quests";
import { createNewSave } from "@/lib/save";

describe("entry tasks → postulant", () => {
  it("starts with no flags and an objective to find the Local Servant", () => {
    const save = createNewSave({ callingId: "franciscan" });
    expect(save.tasks).toEqual(createEntryTasks());
    expect(currentObjective(save)).toMatch(/Local Servant/);
  });

  it("introduces three tasks, then completes each counsel", () => {
    let state = createNewSave({ callingId: "franciscan" });

    let r = applyQuestAction(state, "servant-intro");
    state = r.state;
    expect(state.tasks.introduced).toBe(true);
    expect(r.lines.length).toBeGreaterThan(3);

    r = applyQuestAction(state, "poverty-give");
    state = r.state;
    expect(state.tasks.poverty).toBe(true);
    expect(state.hasBag).toBe(false);

    r = applyQuestAction(state, "chastity-pray");
    state = r.state;
    expect(state.tasks.chastity).toBe(true);

    r = applyQuestAction(state, "obedience-help");
    state = r.state;
    expect(state.tasks.obedience).toBe(true);
    expect(allTasksDone(state.tasks)).toBe(true);
    expect(state.rank).toBe("applicant");

    r = applyQuestAction(state, "servant-intro");
    state = r.state;
    expect(state.rank).toBe("postulant");
    expect(state.role).toBe("postulant");
    expect(state.tasks.received).toBe(true);
    expect(currentObjective(state)).toMatch(/bells/i);
  });

  it("receiveAsPostulant is a no-op until all tasks are done", () => {
    const early = receiveAsPostulant({
      rank: "applicant",
      tasks: createEntryTasks(),
    });
    expect(early.rank).toBe("applicant");
  });
});
