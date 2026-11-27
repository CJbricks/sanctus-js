/**
 * titleScene.js
 * Title screen drawn entirely with Pixi Graphics + Text.
 *
 * Flow: show SANCTUS → A starts a new calling pick, or Continue resumes
 * a Franciscan save into the friary overworld.
 * Atmosphere: night sky, soft stars, chapel silhouette with a steeple
 * cross (geometry only — never a sacrament token). Menu uses the shared
 * ornate panel frame so it matches the upgraded dialogue / overworld.
 */

import { Container, Graphics } from "pixi.js";
import { VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/constants";
import { COLORS, drawPanelFrame, fillRect, makeText } from "@/game/draw";
import { PALETTE } from "@/game/art/palette";
import { ditherSpeckle } from "@/game/art/pixelHelpers";

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

  // Night sky wash with a soft gradient band
  fillRect(bg, 0, 0, VIEW_WIDTH, VIEW_HEIGHT, COLORS.sky);
  fillRect(bg, 0, 0, VIEW_WIDTH, 40, PALETTE.skyDeep, 0.45);
  ditherSpeckle(bg, 8, 8, VIEW_WIDTH - 16, 100, COLORS.parchmentLit, 2);
  // Ground strip with shade
  fillRect(bg, 0, VIEW_HEIGHT - 52, VIEW_WIDTH, 52, COLORS.grass);
  fillRect(bg, 0, VIEW_HEIGHT - 52, VIEW_WIDTH, 4, PALETTE.grass.shade);
  // Chapel silhouette (geometry only — reverent, not playful)
  fillRect(bg, VIEW_WIDTH / 2 - 44, VIEW_HEIGHT - 128, 88, 76, 0x243044);
  fillRect(bg, VIEW_WIDTH / 2 - 44, VIEW_HEIGHT - 128, 88, 3, 0x3a4a64);
  fillRect(bg, VIEW_WIDTH / 2 - 12, VIEW_HEIGHT - 156, 24, 28, 0x243044);
  // Lit window
  fillRect(bg, VIEW_WIDTH / 2 - 8, VIEW_HEIGHT - 100, 10, 12, PALETTE.candle.mid);
  fillRect(bg, VIEW_WIDTH / 2 - 8, VIEW_HEIGHT - 100, 10, 1, PALETTE.candle.highlight);
  // Cross on the steeple (two rectangles)
  fillRect(bg, VIEW_WIDTH / 2 - 2, VIEW_HEIGHT - 176, 4, 22, COLORS.gold);
  fillRect(bg, VIEW_WIDTH / 2 - 8, VIEW_HEIGHT - 170, 16, 4, COLORS.gold);
  fillRect(bg, VIEW_WIDTH / 2 - 2, VIEW_HEIGHT - 176, 4, 1, COLORS.goldLit);

  root.addChild(bg);

  const title = makeText("SANCTUS", {
    x: VIEW_WIDTH / 2,
    y: 44,
    size: 16,
    color: COLORS.gold,
    align: "center",
  });
  root.addChild(title);

  const subtitle = makeText("A pilgrimage in pixel form", {
    x: VIEW_WIDTH / 2,
    y: 72,
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
    const h = options.length * 22 + 20;
    drawPanelFrame(panel, 20, VIEW_HEIGHT - 112, VIEW_WIDTH - 40, h);
    labels.forEach((label, i) => {
      label.style.fill = i === index ? COLORS.ink : COLORS.muted;
      if (i === index) {
        fillRect(panel, 32, VIEW_HEIGHT - 96 + i * 22, 6, 6, COLORS.ink);
        fillRect(panel, 33, VIEW_HEIGHT - 95 + i * 22, 4, 1, COLORS.gold);
      }
    });
  }

  paintMenu();

  let blink = 0;

  return {
    root,
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
