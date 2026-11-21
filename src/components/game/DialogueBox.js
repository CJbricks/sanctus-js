/**
 * DialogueBox.js
 * GBC-style text window overlaid on the Pixi canvas.
 *
 * WHY React (not Pixi Text) for dialogue:
 * Wrapping, focus, and accessibility are easier in the DOM. The canvas
 * keeps drawing the world underneath; this box sits on top via CSS.
 */

"use client";

import { Box, Text } from "@chakra-ui/react";

/**
 * @param {object} props
 * @param {string} props.text
 * @param {string} [props.speaker]
 * @param {() => void} [props.onAdvance]  A-button / click continues
 */
export function DialogueBox({ text, speaker, onAdvance }) {
  if (!text) return null;

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
      }}
      tabIndex={0}
    >
      {speaker ? (
        <Text className="dialogue-speaker" mb={2}>
          {speaker}
        </Text>
      ) : null}
      <Text className="dialogue-body">{text}</Text>
      <Text className="dialogue-hint" mt={3}>
        A / tap to continue
      </Text>
    </Box>
  );
}
