/**
 * input.test.js
 * Checks that keyboard codes map to the handheld A/B/D-pad actions.
 */

import { describe, expect, it } from "vitest";
import { actionFromKey } from "@/lib/input";

describe("actionFromKey", () => {
  it("maps arrows and WASD to directions", () => {
    expect(actionFromKey("ArrowUp")).toBe("up");
    expect(actionFromKey("ArrowDown")).toBe("down");
    expect(actionFromKey("ArrowLeft")).toBe("left");
    expect(actionFromKey("ArrowRight")).toBe("right");
    expect(actionFromKey("KeyW")).toBe("up");
    expect(actionFromKey("KeyA")).toBe("left");
    expect(actionFromKey("KeyS")).toBe("down");
    expect(actionFromKey("KeyD")).toBe("right");
  });

  it("maps A-button keys (Z / Enter / Space)", () => {
    expect(actionFromKey("KeyZ")).toBe("a");
    expect(actionFromKey("Enter")).toBe("a");
    expect(actionFromKey("Space")).toBe("a");
    expect(actionFromKey("NumpadEnter")).toBe("a");
  });

  it("maps B-button keys (X / Escape)", () => {
    expect(actionFromKey("KeyX")).toBe("b");
    expect(actionFromKey("Escape")).toBe("b");
    expect(actionFromKey("Backspace")).toBe("b");
  });

  it("falls back to event.key when code is unknown", () => {
    expect(actionFromKey("", "z")).toBe("a");
    expect(actionFromKey("", "x")).toBe("b");
    expect(actionFromKey("", "ArrowUp")).toBe("up");
  });

  it("returns null for unrelated keys", () => {
    expect(actionFromKey("KeyQ")).toBeNull();
    expect(actionFromKey("F1")).toBeNull();
    expect(actionFromKey("", "q")).toBeNull();
  });
});
