/**
 * dialogue.js
 * Pure typewriter + line queue for GBC-style text boxes.
 *
 * WHY pure:
 * The React DialogueBox (or a Pixi overlay) only displays what this
 * module returns. Tests can advance lines without a DOM.
 */

/**
 * @typedef {{
 *   speaker: string,
 *   lines: string[],
 *   index: number,
 *   charIndex: number,
 *   done: boolean,
 * }} DialogueState
 */

/**
 * @param {string} speaker
 * @param {string[]} lines
 * @returns {DialogueState}
 */
export function startDialogue(speaker, lines) {
  const cleaned = (lines || []).map((l) => String(l)).filter((l) => l.length > 0);
  return {
    speaker: speaker || "",
    lines: cleaned.length ? cleaned : ["…"],
    index: 0,
    charIndex: 0,
    done: false,
  };
}

/** Visible text for the current line (typewriter slice). */
export function visibleText(dialogue) {
  if (!dialogue || dialogue.done) return "";
  const line = dialogue.lines[dialogue.index] || "";
  return line.slice(0, dialogue.charIndex);
}

export function isLineFullyShown(dialogue) {
  if (!dialogue) return true;
  const line = dialogue.lines[dialogue.index] || "";
  return dialogue.charIndex >= line.length;
}

/**
 * Tick the typewriter forward by `chars` characters.
 * @param {DialogueState} dialogue
 * @param {number} [chars]
 */
export function tickTypewriter(dialogue, chars = 1) {
  if (!dialogue || dialogue.done) return dialogue;
  const line = dialogue.lines[dialogue.index] || "";
  const charIndex = Math.min(line.length, dialogue.charIndex + chars);
  return { ...dialogue, charIndex };
}

/**
 * A: if still typing, snap to full line; if full, advance or finish.
 * B: skip to end of line (or close if already full — caller may close).
 *
 * @param {DialogueState} dialogue
 * @param {"a"|"b"} button
 * @returns {{ dialogue: DialogueState, closed: boolean }}
 */
export function advanceDialogue(dialogue, button) {
  if (!dialogue || dialogue.done) {
    return { dialogue: dialogue || startDialogue("", ["…"]), closed: true };
  }

  const line = dialogue.lines[dialogue.index] || "";

  if (button === "b") {
    if (!isLineFullyShown(dialogue)) {
      return { dialogue: { ...dialogue, charIndex: line.length }, closed: false };
    }
    // B on a finished line closes the box (cancel / speed out).
    return { dialogue: { ...dialogue, done: true }, closed: true };
  }

  // A
  if (!isLineFullyShown(dialogue)) {
    return { dialogue: { ...dialogue, charIndex: line.length }, closed: false };
  }

  if (dialogue.index + 1 >= dialogue.lines.length) {
    return { dialogue: { ...dialogue, done: true }, closed: true };
  }

  return {
    dialogue: {
      ...dialogue,
      index: dialogue.index + 1,
      charIndex: 0,
    },
    closed: false,
  };
}
