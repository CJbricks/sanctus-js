/**
 * overworldScene.js
 * First playable slice: friary grounds + street edge.
 *
 * Graphics upgrade notes:
 * - The tile map is baked once (optionally into a Pixi Texture) so we do
 *   not redraw every grass tuft every frame.
 * - Character poses are cached by look/facing/frame.
 * - Candle flicker redraws only the chapel props on a slow timer.
 */

import { Container, Graphics, Sprite } from "pixi.js";
import { drawMapTiles, drawTile } from "@/game/art/tiles";
import {
  drawCharacter,
  lookForNpc,
  lookForRank,
} from "@/game/art/characters";
import {
  bakeTexture,
  characterCacheKey,
  clearTextureCache,
  getOrCreate,
} from "@/game/art/textureCache";
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

const STEP_MS = 160;
const FRAME_MS = 120;
const FLICKER_MS = 220;

/**
 * @param {object} hooks
 * @param {object} hooks.save
 * @param {(next: object) => void} hooks.onStateChange
 * @param {(payload: { speaker: string, lines: string[] }) => void} hooks.onDialogue
 * @param {() => void} [hooks.onOpenMenu]
 * @param {() => void} [hooks.onBeep]
 * @param {() => void} [hooks.onStep]
 * @param {object} [hooks.renderer]  Pixi renderer for texture baking
 */
export function createOverworldScene(hooks) {
  const map = FRIARY_MAP;
  const renderer = hooks.renderer || null;
  const root = new Container();
  const world = new Container();
  root.addChild(world);

  // --- Static ground (baked once) ---
  const tileGfx = new Graphics();
  // Bake the ground without candle props; flicker layer draws those.
  drawMapTiles(tileGfx, map, { flicker: 0, skipAnimated: true });
  const mapTex = bakeTexture(renderer, tileGfx, `map:${MAP_ID}:static`);
  if (mapTex) {
    const mapSprite = new Sprite(mapTex);
    mapSprite.roundPixels = true;
    world.addChild(mapSprite);
    tileGfx.destroy();
  } else {
    world.addChild(tileGfx);
  }

  // Chapel candles / halo flicker (only those tiles — cheap).
  const flickerLayer = new Graphics();
  world.addChild(flickerLayer);

  // Actors: prefer cached textures; fall back to live Graphics.
  const actorLayer = new Container();
  world.addChild(actorLayer);
  const actorFallback = new Graphics();
  actorLayer.addChild(actorFallback);

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
  let flicker = 0;
  let flickerTimer = 0;
  /** @type {Map<string, Sprite>} */
  const actorSprites = new Map();

  function blockers() {
    return map.npcs.map((n) => ({ x: n.x, y: n.y }));
  }

  function characterTexture(look, facing, frame) {
    const key = characterCacheKey(look, facing, frame);
    return getOrCreate(key, () => {
      if (!renderer || typeof renderer.generateTexture !== "function") {
        return null;
      }
      const g = new Graphics();
      drawCharacter(g, 0, 0, { look, facing, frame });
      const tex = renderer.generateTexture(g);
      g.destroy();
      return tex;
    });
  }

  function placeActor(id, look, facing, frame, px, py) {
    const tex = characterTexture(look, facing, frame);
    if (!tex) {
      drawCharacter(actorFallback, px, py, { look, facing, frame });
      return;
    }
    let sprite = actorSprites.get(id);
    if (!sprite) {
      sprite = new Sprite(tex);
      sprite.roundPixels = true;
      actorSprites.set(id, sprite);
      actorLayer.addChild(sprite);
    } else if (sprite.texture !== tex) {
      sprite.texture = tex;
    }
    sprite.x = px;
    sprite.y = py;
    sprite.visible = true;
  }

  function paintFlicker() {
    flickerLayer.clear();
    for (const prop of map.props) {
      if (prop.id !== "crucifix" && prop.id !== "ourLady") continue;
      drawTile(
        flickerLayer,
        prop.id,
        prop.x * TILE_SIZE,
        prop.y * TILE_SIZE,
        { tx: prop.x, ty: prop.y, flicker },
      );
    }
  }

  function paint() {
    actorFallback.clear();
    for (const sprite of actorSprites.values()) sprite.visible = false;

    for (const npc of map.npcs) {
      const px = npc.x * TILE_SIZE;
      const py = npc.y * TILE_SIZE - (CHAR_HEIGHT - TILE_SIZE);
      placeActor(
        npc.id,
        lookForNpc(npc.id),
        npc.facing,
        0,
        px,
        py,
      );
    }
    const px = state.x * TILE_SIZE;
    const py = state.y * TILE_SIZE - (CHAR_HEIGHT - TILE_SIZE);
    placeActor(
      "player",
      lookForRank(state.rank),
      state.facing,
      moving ? walkFrame : 0,
      px,
      py,
    );
    centerCamera();
    paintHud();
  }

  function paintHud() {
    hud.clear();
    fillRect(hud, 0, 0, VIEW_WIDTH, 22, COLORS.sky, 0.78);
    fillRect(hud, 0, 21, VIEW_WIDTH, 1, COLORS.gold, 0.5);
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

  paintFlicker();
  paint();

  return {
    root,
    setHeld(action, isDown) {
      if (!action) return;
      if (isDown) held.add(action);
      else held.delete(action);
    },
    clearHeld() {
      held.clear();
    },
    handleAction(action) {
      if (!action) return;
      if (action === "start") {
        hooks.onOpenMenu?.();
        return;
      }
      const facing = facingFromAction(action);
      if (facing) {
        tryMove(facing);
        stepCooldown = STEP_MS;
        return;
      }
      if (action === "a") {
        interact();
      }
    },
    applySave(save) {
      state = syncFromSave(save);
      paint();
    },
    tick(deltaMs) {
      stepCooldown = Math.max(0, stepCooldown - deltaMs);
      flickerTimer += deltaMs;
      if (flickerTimer >= FLICKER_MS) {
        flickerTimer = 0;
        flicker = (flicker + 1) % 3;
        paintFlicker();
      }
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
      } else if (moving) {
        moving = false;
        walkFrame = 0;
        frameTimer = 0;
        paint();
      }
    },
    destroy() {
      clearTextureCache();
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
