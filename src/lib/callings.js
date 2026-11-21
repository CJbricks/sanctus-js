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
    home: "St. Juniper Friary",
    world: "Five Bridges City",
    leansToward: "Service to the poor and adoration",
    patrons: "St. Francis, St. Clare",
  },
  {
    id: "dominican",
    label: "Dominican Friars",
    home: "House of St. Raymond",
    world: "Capitol City",
    leansToward: "Study, teaching, and preaching",
    patrons: "St. Dominic, St. Thomas Aquinas",
  },
  {
    id: "carmelite",
    label: "Carmelite Monks",
    home: "Monastery of St. Elijah",
    world: "Thornback",
    leansToward: "Liturgy, contemplation, and manual labor",
    patrons: "Our Lady of Mount Carmel, St. Teresa, St. John of the Cross",
  },
];

/**
 * Look up one calling by id.
 * @param {string} id
 * @returns {(typeof CALLINGS)[number] | null}
 */
export function getCalling(id) {
  return CALLINGS.find((calling) => calling.id === id) ?? null;
}

/**
 * Short placeholder line shown after the player confirms a calling.
 * Real overworld spawn comes later; this keeps the scaffold honest.
 * @param {string} id
 */
export function callingPlaceholderMessage(id) {
  const calling = getCalling(id);
  if (!calling) return "That path is not yet known.";
  return (
    `You knock at the door of ${calling.home} in ${calling.world}. ` +
    `The grounds await — find the superior. (Placeholder.)`
  );
}
