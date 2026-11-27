/**
 * friaryGrounds.js
 * Editable tile map for the first Franciscan playable slice:
 * grounds of Our Lady Mary Untier of Knots Friary + a scrap of street.
 *
 * HOW TO EDIT:
 * Each character is one 32×32 tile (see LEGEND). Keep every row the
 * same length. Spawn `@` and NPC letters are replaced by floor when
 * the map is parsed; their positions become spawn / NPC coords.
 *
 * WHY a plain string grid:
 * CJ can change walls and props without touching Pixi code. Tests
 * import the same module the game uses.
 */

/** @typedef {"up"|"down"|"left"|"right"} Facing */

export const MAP_ID = "friary-grounds";

/**
 * Legend (solid tiles block walking):
 * # wall   . floor/yard   + door (walkable)   , grass
 * T tree (solid)   = road   - road edge   : sidewalk   | crosswalk
 * A altar (solid, interact later)   x crucifix (solid interact)
 * o Our Lady Untier of Knots statue (solid interact)
 * G garden bed (walkable)   n bench (solid)   B building roof/body
 * @ player spawn (becomes grass)   S Local Servant   F garden friar
 * N street neighbor
 */
export const LEGEND = {
  "#": { id: "wall", solid: true },
  ".": { id: "floor", solid: false },
  "+": { id: "door", solid: false },
  ",": { id: "grass", solid: false },
  T: { id: "tree", solid: true },
  "=": { id: "road", solid: false },
  "-": { id: "roadLine", solid: false },
  ":": { id: "sidewalk", solid: false },
  "|": { id: "crosswalk", solid: false },
  A: { id: "altar", solid: true },
  x: { id: "crucifix", solid: true },
  o: { id: "ourLady", solid: true },
  G: { id: "garden", solid: false },
  n: { id: "bench", solid: true },
  B: { id: "building", solid: true },
  "@": { id: "grass", solid: false },
  S: { id: "floor", solid: false },
  F: { id: "garden", solid: false },
  N: { id: "sidewalk", solid: false },
};

/**
 * 24 wide × 16 tall — fits a handheld screen while staying editable.
 * Top: friary + chapel + garden. Bottom: gate to Ironbridge street.
 */
export const RAW_ROWS = [
  // 24 characters wide — count carefully when editing
  "########################", // 0
  "#BBBBBB##BBBBBB#,,,,,,,T", // 1 friary + chapel shells
  "#B....B##B.Ao.B#,,TTT,,,", // 2 Our Lady o, altar A
  "#B....+##B..x.B#,,GGG,,,", // 3 crucifix x, doors +
  "#BBBBBB##BB+BBB#,,GGG,,,", // 4
  "#.................,,,,,,", // 5 yard (24)
  "#........S.......n,,,,,,", // 6 Local Servant S, bench n
  "#..............F.GG,,,,,", // 7 garden friar F
  "#,,,,n,,,,,,,,,,,GG,,,,,", // 8
  "#######+################", // 9 gate to street
  ":::::::|::::::::::::::::", // 10 sidewalk
  "=======|================", // 11 road
  "-------|----------------", // 12 center line
  "=======|================", // 13 road
  ":::::::|::::N:::::::::::", // 14 neighbor N
  "########################", // 15
];

/**
 * Parse RAW_ROWS into width/height, tiles[y][x], spawn, and NPCs.
 * Pure — safe for Vitest.
 */
export function parseFriaryMap() {
  const height = RAW_ROWS.length;
  const width = RAW_ROWS[0].length;
  for (const row of RAW_ROWS) {
    if (row.length !== width) {
      throw new Error("friaryGrounds: every row must be the same length");
    }
  }

  /** @type {{ id: string, solid: boolean, ch: string }[][]} */
  const tiles = [];
  let spawn = { x: 1, y: 5 };
  /** @type {{ id: string, name: string, x: number, y: number, facing: Facing }[]} */
  const npcs = [];

  for (let y = 0; y < height; y += 1) {
    const row = [];
    for (let x = 0; x < width; x += 1) {
      const ch = RAW_ROWS[y][x];
      const def = LEGEND[ch] || LEGEND["."];
      row.push({ id: def.id, solid: def.solid, ch });

      if (ch === "@") spawn = { x, y };
      // Default spawn if no @: open yard near servant
      if (ch === "S") {
        npcs.push({
          id: "local-servant",
          name: "Local Servant",
          x,
          y,
          facing: "down",
        });
        spawn = { x, y: y + 1 };
      }
      if (ch === "F") {
        npcs.push({
          id: "garden-friar",
          name: "Brother Garden",
          x,
          y,
          facing: "left",
        });
      }
      if (ch === "N") {
        npcs.push({
          id: "neighbor",
          name: "Neighbor",
          x,
          y,
          facing: "up",
        });
      }
    }
    tiles.push(row);
  }

  // Prefer grass south of the servant if that tile is walkable.
  if (tiles[spawn.y]?.[spawn.x]?.solid) {
    spawn = { x: 8, y: 5 };
  }

  return {
    id: MAP_ID,
    width,
    height,
    tiles,
    spawn,
    npcs,
    /** Interactables that are props, not NPCs. */
    props: findProps(tiles),
  };
}

function findProps(tiles) {
  const props = [];
  for (let y = 0; y < tiles.length; y += 1) {
    for (let x = 0; x < tiles[y].length; x += 1) {
      const id = tiles[y][x].id;
      if (id === "ourLady" || id === "crucifix" || id === "altar") {
        props.push({ id, x, y });
      }
    }
  }
  return props;
}

/** Cached parse for the game loop. */
export const FRIARY_MAP = parseFriaryMap();
