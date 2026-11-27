/**
 * callings.js
 * Data for the "Choose Your Calling" start menu.
 *
 * WHY data lives here (not inside the Pixi scene):
 * The menu screen, the save system, and the tests all need the same
 * three paths. Keeping them in plain objects means a typo shows up in
 * `npm test` instead of only on screen.
 *
 * Houses, cities, and characters are fictional. Real orders inspire
 * the paths; real organization names and logos never appear in-game.
 *
 * House names (CJ 2026-11-22) honor Marian titles:
 *   Franciscan → Our Lady Mary Untier of Knots Friary
 *   Dominican  → Our Lady of Victory House of Studies
 *   Carmelite  → Our Lady of Sorrows Monastery
 * `home` is the full name (docs + dialogue). `homeShort` fits the
 * 320×288 Press Start menu row. Calling ids (`franciscan`, …) stay
 * stable so old saves keep working; see normalizeCallingId().
 */

/** @typedef {"franciscan" | "dominican" | "carmelite"} CallingId */

/**
 * The three religious families a new game can choose.
 * Order here is the on-screen list order (top to bottom).
 */
export const CALLINGS = [
  {
    id: "franciscan",
    label: "Franciscan Friars",
    home: "Our Lady Mary Untier of Knots Friary",
    // WHY short: full Marian title is too wide for one Press Start line.
    homeShort: "Untier of Knots Friary",
    world: "Five Bridges City",
    leansToward: "Service to the poor and adoration",
    patrons: "St. Francis, St. Clare",
  },
  {
    id: "dominican",
    label: "Dominican Friars",
    home: "Our Lady of Victory House of Studies",
    homeShort: "Our Lady of Victory",
    world: "Capitol City",
    leansToward: "Study, teaching, and preaching",
    patrons: "St. Dominic, St. Thomas Aquinas",
  },
  {
    id: "carmelite",
    label: "Carmelite Monks",
    home: "Our Lady of Sorrows Monastery",
    homeShort: "Our Lady of Sorrows",
    world: "Thornback",
    leansToward: "Liturgy, contemplation, and manual labor",
    patrons: "Our Lady of Mount Carmel, St. Teresa, St. John of the Cross",
  },
];

/**
 * Pre-rename house labels and any slug-style keys that might appear in
 * an early save. Maps to the stable calling id.
 *
 * WHY keep these strings here (and only here for runtime):
 * migrate() can still open a blob that stored the old house name as
 * callingId or home. Docs may mention the old names once in a changelog.
 */
export const LEGACY_CALLING_KEYS = {
  "St. Juniper Friary": "franciscan",
  "Friary of St. Juniper": "franciscan",
  "st-juniper": "franciscan",
  "st-juniper-friary": "franciscan",
  "House of St. Raymond": "dominican",
  "House of Studies of St. Raymond": "dominican",
  "st-raymond": "dominican",
  "house-of-st-raymond": "dominican",
  "Monastery of St. Elijah": "carmelite",
  "st-elijah": "carmelite",
  "monastery-of-st-elijah": "carmelite",
};

/**
 * Look up one calling by id.
 * @param {string} id
 * @returns {(typeof CALLINGS)[number] | null}
 */
export function getCalling(id) {
  return CALLINGS.find((calling) => calling.id === id) ?? null;
}

/**
 * Resolve a calling id from a current id, a legacy house name, or a slug.
 * @param {unknown} value
 * @returns {CallingId | null}
 */
export function normalizeCallingId(value) {
  if (typeof value !== "string" || !value) return null;
  if (getCalling(value)) return /** @type {CallingId} */ (value);
  const fromLegacy = LEGACY_CALLING_KEYS[value];
  if (fromLegacy && getCalling(fromLegacy)) {
    return /** @type {CallingId} */ (fromLegacy);
  }
  // Match current full or short home strings too (forward-friendly).
  const byHome = CALLINGS.find(
    (c) => c.home === value || c.homeShort === value,
  );
  return byHome ? /** @type {CallingId} */ (byHome.id) : null;
}

/**
 * Message after confirming a calling.
 * Franciscan opens the friary overworld (slice). Other paths are
 * "coming soon" so Choose Your Calling still lists all three.
 * @param {string} id
 */
export function callingPlaceholderMessage(id) {
  const calling = getCalling(normalizeCallingId(id) || id);
  if (!calling) return "That path is not yet known.";
  if (calling.id === "franciscan") {
    return (
      `You knock at the door of ${calling.home} in ${calling.world}. ` +
      `Find the Local Servant on the grounds.`
    );
  }
  return (
    `${calling.label}: coming soon. ` +
    `The house of ${calling.home} in ${calling.world} is not open yet. ` +
    `Choose the Franciscan path to play the first slice.`
  );
}

/** True when this calling has a playable overworld today. */
export function isCallingPlayable(id) {
  return normalizeCallingId(id) === "franciscan";
}
