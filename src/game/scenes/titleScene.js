/**
 * titleScene.js
 * Title screen drawn entirely with Pixi Graphics + Text.
 *
 * Flow: show SANCTUS → A starts a new calling pick, or Continue resumes
 * a Franciscan save into the friary overworld.
 * No image files. Atmosphere comes from a simple sky + cross motif
 * drawn as rectangles (a silhouette, never a sacrament token).
 */

import { Container, Graphics } from "pixi.js";
import { VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/constants";
import { COLORS, fillRect, makeText, strokeRect } from "@/game/draw";

/**
 * @param {object} hooks
 * @param {boolean} [hooks.hasSave]
 * @param {() => void} hooks.onStart  New game → Choose Your Calling
 * @param {() => void} [hooks.onContinue]
 * @param {() => void} [hooks.onBeep]
 */
export function createTitleScene({ hasSave = false, onStart, onContinue, onBeep }) {
  const root = new Container();
  const bg = new Graphics();

  // Night sky wash
  fillRect(bg, 0, 0, VIEW_WIDTH, VIEW_HEIGHT, COLORS.sky);
  // Ground strip
  fillRect(bg, 0, VIEW_HEIGHT - 48, VIEW_WIDTH, 48, COLORS.grass);
  // Simple chapel silhouette (geometry only — reverent, not playful)
  fillRect(bg, VIEW_WIDTH / 2 - 40, VIEW_HEIGHT - 120, 80, 72, 0x243044);
  fillRect(bg, VIEW_WIDTH / 2 - 10, VIEW_HEIGHT - 148, 20, 28, 0x243044);
  // Cross on the steeple (two rectangles)
  fillRect(bg, VIEW_WIDTH / 2 - 2, VIEW_HEIGHT - 168, 4, 22, COLORS.gold);
  fillRect(bg, VIEW_WIDTH / 2 - 8, VIEW_HEIGHT - 162, 16, 4, COLORS.gold);

  root.addChild(bg);

  const title = makeText("SANCTUS", {
    x: VIEW_WIDTH / 2,
    y: 48,
    size: 16,
    color: COLORS.gold,
    align: "center",
  });
  root.addChild(title);

  const subtitle = makeText("A pilgrimage in pixel form", {
    x: VIEW_WIDTH / 2,
    y: 76,
    size: 8,
    color: COLORS.parchment,
    align: "center",
  });
  root.addChild(subtitle);

  const options = hasSave
    ? [
        { id: "continue", label: "Continue" },
        { id: "new", label: "New Game" },
      ]
    : [{ id: "new", label: "Press A to begin" }];

  let index = 0;
  const panel = new Graphics();
  root.addChild(panel);
  const labels = options.map((opt, i) => {
    const t = makeText(opt.label, {
      x: VIEW_WIDTH / 2,
      y: VIEW_HEIGHT - 100 + i * 22,
      size: 8,
      color: COLORS.ink,
      align: "center",
    });
    root.addChild(t);
    return t;
  });

  function paintMenu() {
    panel.clear();
    const h = options.length * 22 + 16;
    fillRect(panel, 24, VIEW_HEIGHT - 108, VIEW_WIDTH - 48, h, COLORS.parchment, 0.95);
    strokeRect(panel, 24, VIEW_HEIGHT - 108, VIEW_WIDTH - 48, h, COLORS.ink, 2);
    labels.forEach((label, i) => {
      label.style.fill = i === index ? COLORS.ink : COLORS.muted;
      // Tiny cursor block beside the selected row
      if (i === index) {
        fillRect(panel, 36, VIEW_HEIGHT - 96 + i * 22, 6, 6, COLORS.ink);
      }
    });
  }

  paintMenu();

  let blink = 0;

  return {
    root,
    /** @param {import("@/lib/input").GameAction | null} action */
    handleAction(action) {
      if (action === "up" || action === "down") {
        if (options.length < 2) return;
        index = action === "up"
          ? (index + options.length - 1) % options.length
          : (index + 1) % options.length;
        paintMenu();
        return;
      }
      if (action === "a") {
        onBeep?.();
        const choice = options[index]?.id;
        if (choice === "continue") onContinue?.();
        else onStart();
      }
    },
    /** Soft blink so the prompt feels alive without noisy motion. */
    tick(deltaMs) {
      blink += deltaMs;
      const alpha = blink % 1000 < 700 ? 1 : 0.35;
      if (labels[index]) labels[index].alpha = alpha;
    },
    destroy() {
      root.destroy({ children: true });
    },
  };
}
