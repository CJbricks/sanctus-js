/**
 * GameApp.js
 * Top-level client screen machine for SANCTUS.
 *
 * Flow today:
 *   boot → title (Continue / New) → Choose Your Calling
 *   → Franciscan overworld (friary grounds) OR "coming soon" dialogue
 *
 * Keyboard and touch both call the same action handler so Pixi scenes
 * never need to know which device pressed A.
 *
 * Audio only starts after a gesture (installAudio + unlock on input).
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
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
import {
  callingPlaceholderMessage,
  getCalling,
  isCallingPlayable,
} from "@/lib/callings";
import { CONTROL_HELP, actionFromKey } from "@/lib/input";
import {
  advanceDialogue,
  isLineFullyShown,
  startDialogue,
  tickTypewriter,
  visibleText,
} from "@/lib/dialogue";
import {
  createNewSave,
  loadSave,
  writeSave,
} from "@/lib/save";

export function GameApp() {
  const engineRef = useRef(null);
  const saveRef = useRef(null);
  const [ready, setReady] = useState(false);
  /** @type {[import("@/lib/dialogue").DialogueState | null, Function]} */
  const [dialogue, setDialogue] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [menuFlash, setMenuFlash] = useState("");

  useEffect(() => {
    installAudio();
    saveRef.current = loadSave();
    return subscribeAudio((snap) => setMutedState(snap.muted));
  }, []);

  // Typewriter tick while a dialogue is open.
  // WHY deps are speaker/index/done (not the whole dialogue):
  // charIndex changes every tick; restarting the interval then would stall.
  const dialogueActive = Boolean(dialogue && !dialogue.done);
  const dialogueLineKey = dialogue
    ? `${dialogue.speaker}:${dialogue.index}`
    : "";
  useEffect(() => {
    if (!dialogueActive) return undefined;
    const id = setInterval(() => {
      setDialogue((d) => (d && !d.done ? tickTypewriter(d, 1) : d));
    }, 28);
    return () => clearInterval(id);
  }, [dialogueActive, dialogueLineKey]);

  const closeDialogue = useCallback(() => {
    setDialogue(null);
  }, []);

  const handleDialogueButton = useCallback((button) => {
    setDialogue((d) => {
      if (!d) return null;
      const { dialogue: next, closed } = advanceDialogue(d, button);
      playConfirmBeep();
      return closed ? null : next;
    });
  }, []);

  const forwardAction = useCallback((action, opts = {}) => {
    if (!action) return;
    unlockAudio();

    if (menuOpen) {
      if (action === "b" || action === "start") {
        setMenuOpen(false);
        setMenuFlash("");
      }
      return;
    }

    if (dialogue) {
      if (action === "a" || action === "b") {
        handleDialogueButton(action);
      }
      return;
    }

    // Hold tracking for overworld walk (keydown/keyup + touch).
    if (opts.held === true || opts.held === false) {
      engineRef.current?.setHeld?.(action, opts.held);
      if (opts.held === false) return;
    }

    engineRef.current?.handleAction?.(action);
  }, [dialogue, handleDialogueButton, menuOpen]);

  useEffect(() => {
    function onKeyDown(event) {
      const action = actionFromKey(event.code, event.key);
      if (!action) return;
      // Avoid scrolling the page with arrows / space / tab while playing.
      event.preventDefault();
      if (event.repeat && (action === "a" || action === "b" || action === "start")) return;
      if (action === "up" || action === "down" || action === "left" || action === "right") {
        forwardAction(action, { held: true });
        return;
      }
      forwardAction(action);
    }
    function onKeyUp(event) {
      const action = actionFromKey(event.code, event.key);
      if (!action) return;
      if (action === "up" || action === "down" || action === "left" || action === "right") {
        engineRef.current?.setHeld?.(action, false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [forwardAction]);

  const handleCallingChosen = useCallback((callingId) => {
    const calling = getCalling(callingId);
    if (isCallingPlayable(callingId)) {
      const save = createNewSave({ callingId });
      writeSave(save);
      saveRef.current = save;
      // Brief knock line, then enter the grounds.
      setDialogue(
        startDialogue(calling ? calling.label : "Calling", [
          callingPlaceholderMessage(callingId),
        ]),
      );
      // After the player closes that line, overworld starts via effect below
      // if we stash intent — simpler: go overworld immediately and show dialogue on top.
      engineRef.current?.goOverworld?.(save);
      return;
    }
    // Dominican / Carmelite: coming soon, stay on calling flow.
    setDialogue(
      startDialogue(calling ? calling.label : "Calling", [
        callingPlaceholderMessage(callingId),
      ]),
    );
  }, []);

  const handleStateChange = useCallback((next) => {
    saveRef.current = next;
  }, []);

  const handleDialogue = useCallback((payload) => {
    setDialogue(startDialogue(payload.speaker || "", payload.lines || []));
  }, []);

  const handleOpenMenu = useCallback(() => {
    setMenuOpen(true);
    setMenuFlash("");
  }, []);

  const saveNow = useCallback(() => {
    if (saveRef.current) {
      writeSave(saveRef.current);
      setMenuFlash("Saved.");
      playConfirmBeep();
    } else {
      setMenuFlash("Nothing to save yet.");
    }
  }, []);

  const resumeFromMenu = useCallback(() => {
    const loaded = loadSave();
    if (loaded && engineRef.current?.getMode?.() === "overworld") {
      saveRef.current = loaded;
      engineRef.current.applySave?.(loaded);
      setMenuFlash("Resumed.");
    }
    setMenuOpen(false);
    playConfirmBeep();
  }, []);

  return (
    <Box className="game-shell" data-testid="game-app">
      <HStack className="game-topbar" justify="space-between" mb={3}>
        <Text className="game-brand">SANCTUS</Text>
        <HStack gap={2}>
          <Button
            size="xs"
            variant="outline"
            data-testid="menu-toggle"
            onClick={() => {
              unlockAudio();
              if (menuOpen) {
                setMenuOpen(false);
              } else {
                handleOpenMenu();
              }
            }}
          >
            Menu
          </Button>
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
      </HStack>

      <Box className="game-frame">
        <GameCanvas
          onCallingChosen={handleCallingChosen}
          onDialogue={handleDialogue}
          onStateChange={handleStateChange}
          onOpenMenu={handleOpenMenu}
          onReady={(engine) => {
            engineRef.current = engine;
            setReady(Boolean(engine));
          }}
        />
        {dialogue && !dialogue.done ? (
          <DialogueBox
            speaker={dialogue.speaker}
            text={visibleText(dialogue)}
            showCursor={isLineFullyShown(dialogue)}
            onAdvance={() => handleDialogueButton("a")}
            onCancel={() => handleDialogueButton("b")}
          />
        ) : null}
        {menuOpen ? (
          <Box className="start-menu" data-testid="start-menu">
            <Text className="dialogue-speaker" mb={3}>
              Start
            </Text>
            <VStack align="stretch" gap={2}>
              <Button size="sm" onClick={saveNow} data-testid="menu-save">
                Save
              </Button>
              <Button size="sm" onClick={resumeFromMenu} data-testid="menu-resume">
                Resume
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setMenuOpen(false);
                  setMenuFlash("");
                }}
              >
                Close
              </Button>
            </VStack>
            {menuFlash ? (
              <Text className="dialogue-hint" mt={3}>
                {menuFlash}
              </Text>
            ) : null}
          </Box>
        ) : null}
        {!ready ? (
          <Box className="boot-overlay">
            <Text>Loading…</Text>
          </Box>
        ) : null}
      </Box>

      <TouchControls
        onAction={forwardAction}
        onHold={(action, isDown) => forwardAction(action, { held: isDown })}
      />

      <Text className="control-help" mt={3}>
        {CONTROL_HELP} · M mute
      </Text>
    </Box>
  );
}
