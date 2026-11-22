/**
 * callingScene.js
 * "Choose Your Calling" menu — Franciscan, Dominican, Carmelite.
 *
 * Drawn with Pixi Graphics. Each row shows an original order emblem
 * (see orderEmblems.js) plus the path name in Press Start 2P.
 * Selecting a path fires onChoose(id); the React layer then shows a
 * dialogue placeholder (overworld comes later).
 */

import { Container, Graphics } from "pixi.js";
import { CALLINGS } from "@/lib/callings";
import { VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/constants";
import { COLORS, fillRect, makeText, strokeRect } from "@/game/draw";
import {
  EMBLEM_SIZE,
  EMBLEM_TITLES,
  drawOrderEmblem,
} from "@/game/art/orderEmblems";

const ROW_H = 56;
const PANEL_X = 16;
const PANEL_Y = 44;
/** Emblem sits on the left so the long house/world line still fits. */
const EMBLEM_X = PANEL_X + 6;
const TEXT_X = EMBLEM_X + EMBLEM_SIZE + 10;

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
    y: 16,
    size: 8,
    color: COLORS.ink,
    align: "center",
  });
  root.addChild(heading);

  let index = 0;
  let animFrame = 0;
  let animMs = 0;
  const rows = [];

  CALLINGS.forEach((calling, i) => {
    const y = PANEL_Y + i * ROW_H;
    const rowBg = new Graphics();
    const emblemGfx = new Graphics();
    root.addChild(rowBg);
    root.addChild(emblemGfx);

    // Short order name beside the emblem (Press Start via makeText).
    const orderName = makeText(EMBLEM_TITLES[calling.id] || calling.label, {
      x: TEXT_X,
      y: y + 6,
      size: 8,
      color: COLORS.ink,
    });
    const detail = makeText(`${calling.home}`, {
      x: TEXT_X,
      y: y + 22,
      size: 8,
      color: COLORS.muted,
    });
    const world = makeText(calling.world, {
      x: TEXT_X,
      y: y + 36,
      size: 8,
      color: COLORS.muted,
    });
    root.addChild(orderName, detail, world);
    rows.push({ rowBg, emblemGfx, orderName, detail, world, y, calling });
  });

  const hint = makeText("A select · B back · ↑↓ move", {
    x: VIEW_WIDTH / 2,
    y: VIEW_HEIGHT - 22,
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
        fillRect(row.rowBg, PANEL_X, row.y, VIEW_WIDTH - PANEL_X * 2, ROW_H - 4, 0xe8d9a8);
        strokeRect(row.rowBg, PANEL_X, row.y, VIEW_WIDTH - PANEL_X * 2, ROW_H - 4, COLORS.gold, 2);
        // Cursor triangle (code-drawn)
        fillRect(row.rowBg, PANEL_X + 2, row.y + 22, 6, 6, COLORS.ink);
      }

      // WHY only the selected emblem animates: keeps motion intentional,
      // not noisy, and makes the focus obvious on a small canvas / touch.
      drawOrderEmblem(row.emblemGfx, row.calling.id, EMBLEM_X, row.y + 8, {
        frame: selected ? animFrame : 0,
        selected,
      });
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
    tick(deltaMs) {
      animMs += deltaMs;
      // ~2.5 idle frames per second — readable, not frantic.
      if (animMs >= 400) {
        animMs = 0;
        animFrame = (animFrame + 1) % 3;
        paintSelection();
      }
    },
    destroy() {
      root.destroy({ children: true });
    },
  };
}
