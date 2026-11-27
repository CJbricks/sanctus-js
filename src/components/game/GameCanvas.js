/**
 * GameCanvas.js
 * React host for the Pixi application.
 *
 * WHY a dedicated host component:
 * Pixi needs a real DOM node and must be created/destroyed with the
 * React lifecycle. Keeping that here means GameApp can stay focused on
 * screen flow without touching WebGL.
 */

"use client";

import { useEffect, useRef } from "react";
import { createGameEngine } from "@/game/engine";

/**
 * @param {object} props
 * @param {(callingId: string) => void} props.onCallingChosen
 * @param {(payload: { speaker: string, lines: string[] }) => void} [props.onDialogue]
 * @param {(state: object) => void} [props.onStateChange]
 * @param {() => void} [props.onOpenMenu]
 * @param {(engine: object | null) => void} [props.onReady]
 */
export function GameCanvas({
  onCallingChosen,
  onDialogue,
  onStateChange,
  onOpenMenu,
  onReady,
}) {
  const hostRef = useRef(null);
  const engineRef = useRef(null);
  // Keep latest callbacks without re-booting Pixi on every render.
  const chosenRef = useRef(onCallingChosen);
  const dialogueRef = useRef(onDialogue);
  const stateRef = useRef(onStateChange);
  const menuRef = useRef(onOpenMenu);
  const readyRef = useRef(onReady);

  useEffect(() => {
    chosenRef.current = onCallingChosen;
  }, [onCallingChosen]);
  useEffect(() => {
    dialogueRef.current = onDialogue;
  }, [onDialogue]);
  useEffect(() => {
    stateRef.current = onStateChange;
  }, [onStateChange]);
  useEffect(() => {
    menuRef.current = onOpenMenu;
  }, [onOpenMenu]);
  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let cancelled = false;

    createGameEngine(host, {
      onCallingChosen: (id) => chosenRef.current?.(id),
      onDialogue: (payload) => dialogueRef.current?.(payload),
      onStateChange: (s) => stateRef.current?.(s),
      onOpenMenu: () => menuRef.current?.(),
    }).then((engine) => {
      if (cancelled) {
        engine.destroy();
        return;
      }
      engineRef.current = engine;
      readyRef.current?.(engine);
    });

    return () => {
      cancelled = true;
      engineRef.current?.destroy();
      engineRef.current = null;
      readyRef.current?.(null);
    };
  }, []);

  return <div className="game-canvas-host" data-testid="game-canvas" ref={hostRef} />;
}
