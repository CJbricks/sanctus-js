/**
 * engine.js
 * Tiny Pixi scene host for SANCTUS.
 *
 * Owns one Application, swaps title ↔ calling ↔ overworld, and forwards
 * game actions from the React input layer. Drawing stays in scenes;
 * this file is just the stage manager + ticker.
 *
 * WHY a thin engine:
 * Overworld, menus, and future maps plug in here without rewriting the
 * React canvas host.
 */

import { Application, Container } from "pixi.js";
import { VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/constants";
import {
  playConfirmBeep,
  playCursorTick,
  startFriaryLoop,
  stopFriaryLoop,
} from "@/game/audio/engine";
import { createTitleScene } from "@/game/scenes/titleScene";
import { createCallingScene } from "@/game/scenes/callingScene";
import { createOverworldScene } from "@/game/scenes/overworldScene";
import { loadSave } from "@/lib/save";

/**
 * Boot Pixi into a DOM element and return a controller handle.
 *
 * @param {HTMLElement} host
 * @param {object} handlers
 * @param {(callingId: string) => void} handlers.onCallingChosen
 * @param {(payload: { speaker: string, lines: string[] }) => void} [handlers.onDialogue]
 * @param {(state: object) => void} [handlers.onStateChange]
 * @param {() => void} [handlers.onOpenMenu]
 * @param {() => void} [handlers.onTitle]
 */
export async function createGameEngine(host, handlers) {
  const app = new Application();
  await app.init({
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
    backgroundColor: 0x1a2a4a,
    antialias: false,
    // WHY roundPixels + nearest resolution: keeps 32×32 art crisp.
    roundPixels: true,
    resolution: 1,
    autoDensity: false,
  });

  // Force nearest-neighbor on the canvas element Pixi created.
  const canvas = app.canvas;
  canvas.style.imageRendering = "pixelated";
  canvas.style.width = "100%";
  canvas.style.height = "auto";
  canvas.style.display = "block";
  host.appendChild(canvas);

  const stageRoot = new Container();
  app.stage.addChild(stageRoot);

  /** @type {{ root: Container, handleAction: Function, tick: Function, destroy: Function, setHeld?: Function, clearHeld?: Function, applySave?: Function } | null} */
  let scene = null;
  /** @type {"title"|"calling"|"overworld"} */
  let mode = "title";

  function showScene(next, nextMode) {
    if (scene) {
      stageRoot.removeChild(scene.root);
      scene.destroy();
    }
    scene = next;
    mode = nextMode;
    stageRoot.addChild(scene.root);
  }

  function showTitle() {
    stopFriaryLoop();
    handlers.onTitle?.();
    const existing = loadSave();
    showScene(
      createTitleScene({
        hasSave: Boolean(existing),
        onStart: () => showCalling(),
        onContinue: () => {
          const save = loadSave();
          if (save?.callingId === "franciscan") {
            showOverworld(save);
          } else if (save) {
            // Non-Franciscan saves: back to calling with a note via React.
            handlers.onCallingChosen(save.callingId);
          } else {
            showCalling();
          }
        },
        onBeep: () => playConfirmBeep(),
      }),
      "title",
    );
  }

  function showCalling() {
    stopFriaryLoop();
    showScene(
      createCallingScene({
        onChoose: (id) => handlers.onCallingChosen(id),
        onBack: () => showTitle(),
        onMove: () => playCursorTick(),
        onBeep: () => playConfirmBeep(),
      }),
      "calling",
    );
  }

  function showOverworld(save) {
    startFriaryLoop();
    showScene(
      createOverworldScene({
        save,
        renderer: app.renderer,
        onStateChange: (next) => handlers.onStateChange?.(next),
        onDialogue: (payload) => handlers.onDialogue?.(payload),
        onOpenMenu: () => handlers.onOpenMenu?.(),
        onBeep: () => playConfirmBeep(),
      }),
      "overworld",
    );
  }

  showTitle();

  app.ticker.add((ticker) => {
    scene?.tick?.(ticker.deltaMS);
  });

  return {
    /** Forward a normalized game action from keyboard or touch. */
    handleAction(action) {
      if (!action) return;
      scene?.handleAction?.(action);
    },
    setHeld(action, isDown) {
      scene?.setHeld?.(action, isDown);
    },
    clearHeld() {
      scene?.clearHeld?.();
    },
    goTitle: showTitle,
    goCalling: showCalling,
    goOverworld: showOverworld,
    getMode: () => mode,
    applySave(save) {
      scene?.applySave?.(save);
    },
    destroy() {
      stopFriaryLoop();
      if (scene) scene.destroy();
      scene = null;
      app.destroy(true);
      if (canvas.parentNode === host) host.removeChild(canvas);
    },
  };
}
