/**
 * dialogue.test.js
 * Typewriter + A/B advancement for the GBC text box.
 */

import { describe, expect, it } from "vitest";
import {
  advanceDialogue,
  isLineFullyShown,
  startDialogue,
  tickTypewriter,
  visibleText,
} from "@/lib/dialogue";

describe("startDialogue / typewriter", () => {
  it("reveals characters and snaps on A", () => {
    let d = startDialogue("Local Servant", ["Peace.", "Welcome."]);
    expect(visibleText(d)).toBe("");
    d = tickTypewriter(d, 3);
    expect(visibleText(d)).toBe("Pea");
    expect(isLineFullyShown(d)).toBe(false);

    const snap = advanceDialogue(d, "a");
    expect(visibleText(snap.dialogue)).toBe("Peace.");
    expect(snap.closed).toBe(false);

    const next = advanceDialogue(snap.dialogue, "a");
    expect(next.dialogue.index).toBe(1);
    expect(visibleText(next.dialogue)).toBe("");
  });

  it("closes after the last line on A, or early on B when full", () => {
    let d = startDialogue("", ["Only line"]);
    d = { ...d, charIndex: "Only line".length };
    const done = advanceDialogue(d, "a");
    expect(done.closed).toBe(true);
    expect(done.dialogue.done).toBe(true);

    let d2 = startDialogue("", ["Hello"]);
    d2 = { ...d2, charIndex: 5 };
    const cancel = advanceDialogue(d2, "b");
    expect(cancel.closed).toBe(true);
  });

  it("B while typing only finishes the current line", () => {
    let d = startDialogue("", ["Longer text here"]);
    d = tickTypewriter(d, 2);
    const sped = advanceDialogue(d, "b");
    expect(sped.closed).toBe(false);
    expect(isLineFullyShown(sped.dialogue)).toBe(true);
  });
});
