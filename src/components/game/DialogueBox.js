/**
 * DialogueBox.js
 * GBC-style text window overlaid on the Pixi canvas.
 *
 * WHY React (not Pixi Text) for dialogue:
 * Wrapping, focus, and accessibility are easier in the DOM. The canvas
 * keeps drawing the world underneath; this box sits on top via CSS.
 *
 * Typewriter reveal: parent passes `visible` (already sliced). A advances
 * or snaps; B speeds/closes — see dialogue.js for the pure rules.
 */

"use client";

import { Box, Text } from "@chakra-ui/react";

/**
 * @param {object} props
 * @param {string} props.text  currently visible characters
 * @param {string} [props.speaker]
 * @param {boolean} [props.showCursor]  ▼ when the line is fully shown
 * @param {() => void} [props.onAdvance]  A / click
 * @param {() => void} [props.onCancel]   B
 */
export function DialogueBox({
  text,
  speaker,
  showCursor = false,
  onAdvance,
  onCancel,
}) {
  if (text == null) return null;

  return (
    <Box
      className="dialogue-box"
      data-testid="dialogue-box"
      role="dialog"
      aria-live="polite"
      onClick={onAdvance}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "z" || event.key === "Z") {
          event.preventDefault();
          onAdvance?.();
        }
        if (event.key === "Escape" || event.key === "x" || event.key === "X") {
          event.preventDefault();
          onCancel?.();
        }
      }}
      tabIndex={0}
    >
      {speaker ? (
        <Text className="dialogue-speaker" mb={2}>
          {speaker}
        </Text>
      ) : null}
      <Text className="dialogue-body">
        {text}
        {showCursor ? " ▼" : ""}
      </Text>
      <Text className="dialogue-hint" mt={3}>
        A advance · B skip/close
      </Text>
    </Box>
  );
}
