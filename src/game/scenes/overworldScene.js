/**
 * overworldScene.js
 * First playable slice: friary grounds + street edge.
 *
 * Responsibilities:
 * - draw the tile map and characters (nearest-neighbor Graphics)
 * - grid movement with collision + camera follow
 * - A to talk / pray when facing an NPC or devotion prop
 * - report quest + position changes upward so React can save / dialogue
 *
 * WHY the scene stays "dumb" about dialogue text:
 * Quest lines come from applyQuestAction (pure). The scene only says
 * "player pressed A facing the Local Servant" and gets lines back.
 */

import { Container, Graphics } from "pixi.js";
import { drawMapTiles } from "@/game/art/tiles";
import {
  drawCharacter,
  lookForNpc,
  lookForRank,
} from "@/game/art/characters";
import { COLORS, fillRect, makeText } from "@/game/draw";
import { FRIARY_MAP, MAP_ID } from "@/game/maps/friaryGrounds";
import {
  CHAR_HEIGHT,
  TILE_SIZE,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from "@/lib/constants";
import {
  facingFromAction,
  facingTile,
  tryStep,
} from "@/lib/movement";
import { applyQuestAction, currentObjective } from "@/lib/quests";

/** Ms between grid steps while a direction is held. */
const STEP_MS = 160;
/** Ms between walk animation frames while moving. */
const FRAME_MS = 120;

/**
 * @param {object} hooks
 * @param {object} hooks.save  current save blob (mutated via onStateChange)
 * @param {(next: object) => void} hooks.onStateChange
 * @param {(payload: { speaker: string, lines: string[] }) => void} hooks.onDialogue
 * @param {() => void} [hooks.onOpenMenu]
 * @param {() => void} [hooks.onBeep]
 * @param {() => void} [hooks.onStep]
 */
export function createOverworldScene(hooks) {
  const map = FRIARY_MAP;
  const root = new Container();
  const world = new Container();
  root.addChild(world);

  const tileLayer = new Graphics();
  drawMapTiles(tileLayer, map);
  world.addChild(tileLayer);

  const actorLayer = new Graphics();
  world.addChild(actorLayer);

  // Soft HUD strip (objective). Drawn in screen space, not world space.
  const hud = new Graphics();
  root.addChild(hud);
  const objectiveText = makeText("", {
    x: 8,
    y: 6,
    size: 8,
    color: COLORS.parchment,
  });
  root.addChild(objectiveText);

  let state = syncFromSave(hooks.save);
  /** @type {Set<string>} */
  const held = new Set();
  let stepCooldown = 0;
  let frameTimer = 0;
  let walkFrame = 0;
  let moving = false;

  function blockers() {
    return map.npcs.map((n) => ({ x: n.x, y: n.y }));
  }

  function paint() {
    actorLayer.clear();
    // NPCs first, then player on top.
    for (const npc of map.npcs) {
      const px = npc.x * TILE_SIZE;
      const py = npc.y * TILE_SIZE - (CHAR_HEIGHT - TILE_SIZE);
      drawCharacter(actorLayer, px, py, {
        facing: npc.facing,
        frame: 0,
        look: lookForNpc(npc.id),
      });
    }
    const px = state.x * TILE_SIZE;
    const py = state.y * TILE_SIZE - (CHAR_HEIGHT - TILE_SIZE);
    drawCharacter(actorLayer, px, py, {
      facing: state.facing,
      frame: moving ? walkFrame : 0,
      look: lookForRank(state.rank),
    });
    centerCamera();
    paintHud();
  }

  function paintHud() {
    hud.clear();
    fillRect(hud, 0, 0, VIEW_WIDTH, 22, 0x1a2a4a, 0.72);
    objectiveText.text = currentObjective(state);
  }

  function centerCamera() {
    const focusX = state.x * TILE_SIZE + TILE_SIZE / 2;
    const focusY = state.y * TILE_SIZE + TILE_SIZE / 2;
    let camX = focusX - VIEW_WIDTH / 2;
    let camY = focusY - VIEW_HEIGHT / 2;
    const maxX = map.width * TILE_SIZE - VIEW_WIDTH;
    const maxY = map.height * TILE_SIZE - VIEW_HEIGHT;
    camX = Math.max(0, Math.min(maxX, camX));
    camY = Math.max(0, Math.min(maxY, camY));
    world.x = Math.round(-camX);
    world.y = Math.round(-camY);
  }

  function emitState() {
    const next = {
      ...hooks.save,
      ...state,
      position: {
        x: state.x,
        y: state.y,
        mapId: MAP_ID,
      },
      facing: state.facing,
      rank: state.rank,
      role: state.role,
      tasks: state.tasks,
      hasBag: state.hasBag,
    };
    hooks.onStateChange?.(next);
  }

  function tryMove(facing) {
    state.facing = facing;
    const result = tryStep({
      map,
      x: state.x,
      y: state.y,
      facing,
      blockers: blockers(),
    });
    if (result.moved) {
      state.x = result.x;
      state.y = result.y;
      moving = true;
      hooks.onStep?.();
      emitState();
    }
    paint();
  }

  function interact() {
    const front = facingTile(state.x, state.y, state.facing);
    const npc = map.npcs.find((n) => n.x === front.x && n.y === front.y);
    const prop = map.props.find((p) => p.x === front.x && p.y === front.y);

    let actionId = null;
    let speaker = "";

    if (npc?.id === "local-servant") {
      actionId = "servant-intro";
      speaker = "Local Servant";
    } else if (npc?.id === "garden-friar") {
      actionId = "obedience-help";
      speaker = "Brother Garden";
    } else if (npc?.id === "neighbor") {
      // Poverty task: give the bag when you still carry it and tasks began.
      if (state.tasks?.introduced && state.hasBag !== false && !state.tasks?.poverty) {
        actionId = "poverty-give";
      } else {
        actionId = "neighbor-chat";
      }
      speaker = "Neighbor";
    } else if (prop?.id === "ourLady") {
      actionId = "chastity-pray";
      speaker = "Our Lady Untier of Knots";
    } else if (prop?.id === "crucifix") {
      actionId = "crucifix-pray";
      speaker = "";
    } else if (prop?.id === "altar") {
      hooks.onDialogue?.({
        speaker: "",
        lines: ["The altar is set for Mass. You bow quietly and step back."],
      });
      hooks.onBeep?.();
      return;
    }

    if (!actionId) return;

    const result = applyQuestAction(state, actionId);
    state = {
      ...state,
      ...result.state,
      tasks: result.state.tasks,
      rank: result.state.rank ?? state.rank,
      role: result.state.role ?? state.role,
      hasBag: result.state.hasBag,
    };
    emitState();
    paint();
    hooks.onBeep?.();
    hooks.onDialogue?.({ speaker, lines: result.lines });
  }

  paint();

  return {
    root,
    /** Keep held directions for smooth stepping. */
    setHeld(action, isDown) {
      if (!action) return;
      if (isDown) held.add(action);
      else held.delete(action);
    },
    clearHeld() {
      held.clear();
    },
    /** @param {import("@/lib/input").GameAction | "start" | null} action */
    handleAction(action) {
      if (!action) return;
      if (action === "start") {
        hooks.onOpenMenu?.();
        return;
      }
      const facing = facingFromAction(action);
      if (facing) {
        // Instant face + step on press; hold continues in tick().
        tryMove(facing);
        stepCooldown = STEP_MS;
        return;
      }
      if (action === "a") {
        interact();
      }
    },
    /** Apply an external save (e.g. Resume from pause menu). */
    applySave(save) {
      state = syncFromSave(save);
      paint();
    },
    tick(deltaMs) {
      stepCooldown = Math.max(0, stepCooldown - deltaMs);
      const dir =
        firstHeld(["up", "down", "left", "right"], held) || null;
      if (dir) {
        frameTimer += deltaMs;
        if (frameTimer >= FRAME_MS) {
          frameTimer = 0;
          walkFrame = (walkFrame + 1) % 4;
        }
        if (stepCooldown <= 0) {
          tryMove(dir);
          stepCooldown = STEP_MS;
        } else {
          moving = true;
          paint();
        }
      } else {
        moving = false;
        walkFrame = 0;
        frameTimer = 0;
      }
    },
    destroy() {
      root.destroy({ children: true });
    },
  };
}

function firstHeld(order, held) {
  for (const key of order) {
    if (held.has(key)) return key;
  }
  return null;
}

function syncFromSave(save) {
  const spawn = FRIARY_MAP.spawn;
  const pos = save?.position || {};
  const mapOk = !pos.mapId || pos.mapId === MAP_ID || pos.mapId === "grounds";
  const x = mapOk && typeof pos.x === "number" ? pos.x : spawn.x;
  const y = mapOk && typeof pos.y === "number" ? pos.y : spawn.y;
  return {
    x: clamp(x, 0, FRIARY_MAP.width - 1),
    y: clamp(y, 0, FRIARY_MAP.height - 1),
    facing: save?.facing === "up" || save?.facing === "left" || save?.facing === "right"
      ? save.facing
      : "down",
    rank: save?.rank || "applicant",
    role: save?.role || "seeker",
    tasks: save?.tasks || {
      introduced: false,
      poverty: false,
      chastity: false,
      obedience: false,
      received: false,
    },
    hasBag: save?.hasBag !== false,
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, Math.round(n)));
}
