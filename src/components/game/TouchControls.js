/**
 * TouchControls.js
 * On-screen D-pad plus A/B buttons for phones and tablets.
 *
 * WHY unlockAudio before preventDefault:
 * iOS Safari only resumes Web Audio inside the gesture turn. Calling
 * preventDefault first can swallow that turn and leave the game silent.
 *
 * Holding a direction uses pointer capture so a slight thumb slide does
 * not cancel the hold until pointerup. onHold keeps the overworld
 * stepping while the thumb stays down.
 */

"use client";

import { unlockAudio } from "@/game/audio/engine";

const PAD = [
  { dir: "up", label: "▲", style: { gridColumn: 2, gridRow: 1 } },
  { dir: "left", label: "◀", style: { gridColumn: 1, gridRow: 2 } },
  { dir: "down", label: "▼", style: { gridColumn: 2, gridRow: 3 } },
  { dir: "right", label: "▶", style: { gridColumn: 3, gridRow: 2 } },
];

/**
 * @param {object} props
 * @param {(action: string) => void} props.onAction
 * @param {(action: string, isDown: boolean) => void} [props.onHold]
 */
export function TouchControls({ onAction, onHold }) {
  function bindHold(dir) {
    return {
      onPointerDown: (event) => {
        unlockAudio();
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        onHold?.(dir, true);
        onAction(dir);
      },
      onPointerUp: (event) => {
        event.preventDefault();
        onHold?.(dir, false);
      },
      onPointerCancel: () => {
        onHold?.(dir, false);
      },
      onContextMenu: (event) => event.preventDefault(),
    };
  }

  return (
    <div className="touch-bar" data-testid="touch-bar">
      <div className="d-pad" data-testid="d-pad">
        {PAD.map((pad) => (
          <button
            key={pad.dir}
            type="button"
            className="pad-btn"
            style={pad.style}
            aria-label={pad.dir}
            {...bindHold(pad.dir)}
          >
            {pad.label}
          </button>
        ))}
      </div>
      <div className="face-row">
        <button
          type="button"
          className="face-btn"
          data-testid="btn-b"
          aria-label="B"
          onPointerDown={(event) => {
            unlockAudio();
            event.preventDefault();
            onAction("b");
          }}
        >
          B
        </button>
        <button
          type="button"
          className="face-btn"
          data-testid="btn-a"
          aria-label="A"
          onPointerDown={(event) => {
            unlockAudio();
            event.preventDefault();
            onAction("a");
          }}
        >
          A
        </button>
      </div>
    </div>
  );
}
