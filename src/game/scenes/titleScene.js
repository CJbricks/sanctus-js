/**
 * titleScene.js
 * Title screen drawn entirely with Pixi Graphics + Text.
 *
 * Flow: show SANCTUS → player presses A → advance to Choose Your Calling.
 * No image files. Atmosphere comes from a simple sky + cross motif
 * drawn as rectangles (a silhouette, never a sacrament token).
 */

import { Container, Graphics } from "pixi.js";
import { VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/constants";
import { COLORS, fillRect, makeText, strokeRect } from "@/game/draw";

/**
 * @param {object} hooks
 * @param {() => void} hooks.onStart  Called when A is pressed
 * @param {() => void} [hooks.onBeep]
 */
export function createTitleScene({ onStart, onBeep }) {
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
    y: 56,
    size: 16,
    color: COLORS.gold,
    align: "center",
  });
  root.addChild(title);

  const subtitle = makeText("A pilgrimage in pixel form", {
    x: VIEW_WIDTH / 2,
    y: 84,
    size: 8,
    color: COLORS.parchment,
    align: "center",
  });
  root.addChild(subtitle);

  const panel = new Graphics();
  fillRect(panel, 24, VIEW_HEIGHT - 100, VIEW_WIDTH - 48, 40, COLORS.parchment, 0.95);
  strokeRect(panel, 24, VIEW_HEIGHT - 100, VIEW_WIDTH - 48, 40, COLORS.ink, 2);
  root.addChild(panel);

  const prompt = makeText("Press A to begin", {
    x: VIEW_WIDTH / 2,
    y: VIEW_HEIGHT - 86,
    size: 8,
    color: COLORS.ink,
    align: "center",
  });
  root.addChild(prompt);

  let blink = 0;

  return {
    root,
    /** @param {import("@/lib/input").GameAction | null} action */
    handleAction(action) {
      if (action === "a") {
        onBeep?.();
        onStart();
      }
    },
    /** Soft blink so the prompt feels alive without noisy motion. */
    tick(deltaMs) {
      blink += deltaMs;
      prompt.alpha = blink % 1000 < 700 ? 1 : 0.25;
    },
    destroy() {
      root.destroy({ children: true });
    },
  };
}
