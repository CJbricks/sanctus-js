/**
 * GameCanvas.js
 * React host for the Pixi application.
 *
 * WHY a dedicated host component:
 * Pixi needs a real DOM node and must be created/destroyed with the
 * React lifecycle. Keeping that here means GameApp can stay focused on
 * screen flow (title → calling → dialogue) without touching WebGL.
 */

"use client";

import { useEffect, useRef } from "react";
import { createGameEngine } from "@/game/engine";

/**
 * @param {object} props
 * @param {(callingId: string) => void} props.onCallingChosen
 * @param {(engine: object | null) => void} [props.onReady]
 */
export function GameCanvas({ onCallingChosen, onReady }) {
  const hostRef = useRef(null);
  const engineRef = useRef(null);
  // Keep latest callbacks without re-booting Pixi on every render.
  const chosenRef = useRef(onCallingChosen);
  const readyRef = useRef(onReady);

  useEffect(() => {
    chosenRef.current = onCallingChosen;
  }, [onCallingChosen]);

  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    let cancelled = false;

    createGameEngine(host, {
      onCallingChosen: (id) => chosenRef.current?.(id),
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
