/**
 * engine.js
 * Tiny Pixi scene host for the SANCTUS scaffold.
 *
 * Owns one Application, swaps title ↔ calling scenes, and forwards
 * game actions from the React input layer. Drawing stays in scenes;
 * this file is just the stage manager + ticker.
 *
 * WHY a thin engine:
 * Later we will add an overworld map, NPCs, and menus. Keeping scene
 * swap logic in one place means those systems plug in without rewriting
 * the React canvas host.
 */

import { Application, Container } from "pixi.js";
import { VIEW_HEIGHT, VIEW_WIDTH } from "@/lib/constants";
import { playConfirmBeep, playCursorTick } from "@/game/audio/engine";
import { createTitleScene } from "@/game/scenes/titleScene";
import { createCallingScene } from "@/game/scenes/callingScene";

/**
 * Boot Pixi into a DOM element and return a controller handle.
 *
 * @param {HTMLElement} host
 * @param {object} handlers
 * @param {(callingId: string) => void} handlers.onCallingChosen
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

  /** @type {{ root: Container, handleAction: Function, tick: Function, destroy: Function } | null} */
  let scene = null;

  function showScene(next) {
    if (scene) {
      stageRoot.removeChild(scene.root);
      scene.destroy();
    }
    scene = next;
    stageRoot.addChild(scene.root);
  }

  function showTitle() {
    handlers.onTitle?.();
    showScene(
      createTitleScene({
        onStart: () => showCalling(),
        onBeep: () => playConfirmBeep(),
      }),
    );
  }

  function showCalling() {
    showScene(
      createCallingScene({
        onChoose: (id) => handlers.onCallingChosen(id),
        onBack: () => showTitle(),
        onMove: () => playCursorTick(),
        onBeep: () => playConfirmBeep(),
      }),
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
    goTitle: showTitle,
    goCalling: showCalling,
    destroy() {
      if (scene) scene.destroy();
      scene = null;
      app.destroy(true);
      if (canvas.parentNode === host) host.removeChild(canvas);
    },
  };
}
