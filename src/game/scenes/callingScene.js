/**
 * callingScene.js
 * "Choose Your Calling" menu — Franciscan, Dominican, Carmelite.
 *
 * Drawn with Pixi Graphics. Selecting a path fires onChoose(id); the
 * React layer then shows a dialogue placeholder (overworld comes later).
 */

import { Container, Graphics } from "pixi.js";
import { CALLINGS } from "@/lib/callings";
import { VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/constants";
import { COLORS, fillRect, makeText, strokeRect } from "@/game/draw";

const ROW_H = 52;
const PANEL_X = 16;
const PANEL_Y = 48;

/**
 * @param {object} hooks
 * @param {(id: string) => void} hooks.onChoose
 * @param {() => void} [hooks.onBack]
 * @param {() => void} [hooks.onMove]
 * @param {() => void} [hooks.onBeep]
 */
export function createCallingScene({ onChoose, onBack, onMove, onBeep }) {
  const root = new Container();
  const bg = new Graphics();
  fillRect(bg, 0, 0, VIEW_WIDTH, VIEW_HEIGHT, COLORS.sky);
  fillRect(bg, 8, 8, VIEW_WIDTH - 16, VIEW_HEIGHT - 16, COLORS.parchment);
  strokeRect(bg, 8, 8, VIEW_WIDTH - 16, VIEW_HEIGHT - 16, COLORS.ink, 3);
  root.addChild(bg);

  const heading = makeText("Choose Your Calling", {
    x: VIEW_WIDTH / 2,
    y: 20,
    size: 8,
    color: COLORS.ink,
    align: "center",
  });
  root.addChild(heading);

  let index = 0;
  const rows = [];

  CALLINGS.forEach((calling, i) => {
    const y = PANEL_Y + i * ROW_H;
    const rowBg = new Graphics();
    root.addChild(rowBg);

    const label = makeText(calling.label, {
      x: PANEL_X + 12,
      y: y + 8,
      size: 8,
      color: COLORS.ink,
    });
    const detail = makeText(`${calling.home} · ${calling.world}`, {
      x: PANEL_X + 12,
      y: y + 24,
      size: 8,
      color: COLORS.muted,
    });
    root.addChild(label, detail);
    rows.push({ rowBg, label, detail, y, calling });
  });

  const hint = makeText("A select · B back · ↑↓ move", {
    x: VIEW_WIDTH / 2,
    y: VIEW_HEIGHT - 28,
    size: 8,
    color: COLORS.muted,
    align: "center",
  });
  root.addChild(hint);

  function paintSelection() {
    rows.forEach((row, i) => {
      row.rowBg.clear();
      const selected = i === index;
      if (selected) {
        fillRect(row.rowBg, PANEL_X, row.y, VIEW_WIDTH - PANEL_X * 2, ROW_H - 6, 0xe8d9a8);
        strokeRect(row.rowBg, PANEL_X, row.y, VIEW_WIDTH - PANEL_X * 2, ROW_H - 6, COLORS.gold, 2);
        // Cursor triangle (code-drawn)
        fillRect(row.rowBg, PANEL_X + 2, row.y + 18, 6, 6, COLORS.ink);
      }
    });
  }

  paintSelection();

  return {
    root,
    /** @param {import("@/lib/input").GameAction | null} action */
    handleAction(action) {
      if (action === "up") {
        index = (index + CALLINGS.length - 1) % CALLINGS.length;
        onMove?.();
        paintSelection();
        return;
      }
      if (action === "down") {
        index = (index + 1) % CALLINGS.length;
        onMove?.();
        paintSelection();
        return;
      }
      if (action === "a") {
        onBeep?.();
        onChoose(CALLINGS[index].id);
        return;
      }
      if (action === "b") {
        onBack?.();
      }
    },
    tick() {},
    destroy() {
      root.destroy({ children: true });
    },
  };
}
