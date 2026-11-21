/**
 * GameApp.js
 * Top-level client screen machine for the SANCTUS scaffold.
 *
 * Flow today:
 *   boot (load Pixi) → title (Pixi) → Choose Your Calling (Pixi)
 *   → placeholder dialogue (React) → optional save stub write
 *
 * Keyboard and touch both call the same action handler so the Pixi
 * scenes never need to know which device pressed A.
 *
 * Audio only starts after a gesture (installAudio + unlock on input).
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { DialogueBox } from "@/components/game/DialogueBox";
import { GameCanvas } from "@/components/game/GameCanvas";
import { TouchControls } from "@/components/game/TouchControls";
import {
  getAudioState,
  installAudio,
  playConfirmBeep,
  setMuted,
  subscribeAudio,
  unlockAudio,
} from "@/game/audio/engine";
import { callingPlaceholderMessage, getCalling } from "@/lib/callings";
import { CONTROL_HELP, actionFromKey } from "@/lib/input";
import { createNewSave, writeSave } from "@/lib/save";

export function GameApp() {
  const engineRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [dialogue, setDialogue] = useState(null);
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    installAudio();
    return subscribeAudio((snap) => setMutedState(snap.muted));
  }, []);

  const forwardAction = useCallback((action) => {
    if (!action) return;
    unlockAudio();
    // When a dialogue is open, A/B dismisses it instead of feeding Pixi.
    if (dialogue) {
      if (action === "a" || action === "b") {
        playConfirmBeep();
        setDialogue(null);
        engineRef.current?.goTitle?.();
      }
      return;
    }
    engineRef.current?.handleAction?.(action);
  }, [dialogue]);

  useEffect(() => {
    function onKeyDown(event) {
      const action = actionFromKey(event.code, event.key);
      if (!action) return;
      // Avoid scrolling the page with arrows / space while playing.
      event.preventDefault();
      if (event.repeat && (action === "a" || action === "b")) return;
      forwardAction(action);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [forwardAction]);

  const handleCallingChosen = useCallback((callingId) => {
    const calling = getCalling(callingId);
    const save = createNewSave({ callingId });
    writeSave(save);
    setDialogue({
      speaker: calling ? calling.label : "Calling",
      text: callingPlaceholderMessage(callingId),
    });
  }, []);

  return (
    <Box className="game-shell" data-testid="game-app">
      <HStack className="game-topbar" justify="space-between" mb={3}>
        <Text className="game-brand">SANCTUS</Text>
        <Button
          size="xs"
          variant="outline"
          data-testid="mute-toggle"
          onClick={() => {
            unlockAudio();
            const next = !getAudioState().muted;
            setMuted(next);
          }}
        >
          {muted ? "Unmute" : "Mute"}
        </Button>
      </HStack>

      <Box className="game-frame">
        <GameCanvas
          onCallingChosen={handleCallingChosen}
          onReady={(engine) => {
            engineRef.current = engine;
            setReady(Boolean(engine));
          }}
        />
        {dialogue ? (
          <DialogueBox
            speaker={dialogue.speaker}
            text={dialogue.text}
            onAdvance={() => {
              playConfirmBeep();
              setDialogue(null);
              engineRef.current?.goTitle?.();
            }}
          />
        ) : null}
        {!ready ? (
          <Box className="boot-overlay">
            <Text>Loading…</Text>
          </Box>
        ) : null}
      </Box>

      <TouchControls onAction={forwardAction} />

      <Text className="control-help" mt={3}>
        {CONTROL_HELP} · M mute
      </Text>
    </Box>
  );
}
