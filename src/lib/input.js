/**
 * input.js
 * Pure keyboard → game-action mapping.
 *
 * WHY pure (no window listeners here):
 * The React/Pixi layer owns the actual keydown events. This file only
 * answers "what does this key mean?" so tests can check the map without
 * a browser, and so touch buttons can fire the same action names.
 *
 * Layout mirrors early handheld RPGs:
 *   A = confirm / talk   (Z, Enter, Space)
 *   B = cancel / back    (X, Escape)
 *   D-pad = move         (Arrows or WASD)
 */

/** @typedef {"up" | "down" | "left" | "right" | "a" | "b"} GameAction */

/**
 * Map a KeyboardEvent.code (or key) to a game action.
 * Returns null when the key is not used by the game.
 *
 * WHY prefer `code` over `key`:
 * `code` is physical position (KeyZ stays Z on an AZERTY layout's
 * letter), which matches how console emulators usually bind keys.
 *
 * @param {string} code  KeyboardEvent.code, e.g. "KeyZ"
 * @param {string} [key] KeyboardEvent.key fallback, e.g. "z"
 * @returns {GameAction | null}
 */
export function actionFromKey(code, key = "") {
  switch (code) {
    case "ArrowUp":
    case "KeyW":
      return "up";
    case "ArrowDown":
    case "KeyS":
      return "down";
    case "ArrowLeft":
    case "KeyA":
      return "left";
    case "ArrowRight":
    case "KeyD":
      return "right";
    case "KeyZ":
    case "Enter":
    case "Space":
    case "NumpadEnter":
      return "a";
    case "KeyX":
    case "Escape":
    case "Backspace":
      return "b";
    default:
      break;
  }

  // Fallback for older browsers or synthetic events that only set `key`.
  const lower = String(key).toLowerCase();
  if (lower === "w" || lower === "arrowup") return "up";
  if (lower === "s" || lower === "arrowdown") return "down";
  if (lower === "a" || lower === "arrowleft") return "left";
  if (lower === "d" || lower === "arrowright") return "right";
  if (lower === "z" || lower === "enter" || lower === " ") return "a";
  if (lower === "x" || lower === "escape" || lower === "backspace") return "b";
  return null;
}

/** Human-readable help text for the title / pause screens. */
export const CONTROL_HELP =
  "Arrows/WASD move · Z/Enter/Space = A · X/Escape = B";
