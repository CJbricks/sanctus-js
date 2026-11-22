/**
 * save.js
 * Versioned browser save for SANCTUS.
 *
 * The whole game state is one JSON blob in localStorage under
 * `sanctus-save-v1`. There is no account and no server. Never put a
 * secret in this file.
 *
 * WHY serialize / deserialize / migrate are separate:
 * - serialize / deserialize are pure → tests can round-trip without a browser.
 * - migrate() turns an older shape into today's shape so we can add
 *   fields later without wiping CJ's save.
 * - loadSave / writeSave / clearSave are thin localStorage wrappers.
 *   They guard for SSR: Next.js may import this module on the server,
 *   where `window` and `localStorage` do not exist.
 */

import { SAVE_KEY, SAVE_VERSION } from "@/lib/constants";
import { getCalling, normalizeCallingId } from "@/lib/callings";

/**
 * Build a brand-new save after the player picks a calling.
 * @param {{ callingId: string }} opts
 */
export function createNewSave({ callingId }) {
  const normalized = normalizeCallingId(callingId) || callingId;
  const calling = getCalling(normalized);
  if (!calling) {
    throw new Error(`Unknown calling: ${callingId}`);
  }
  return {
    version: SAVE_VERSION,
    callingId: calling.id,
    // Role title only — no typed name (see docs/GAME_RULES.md opening).
    role: "seeker",
    // Formation stage. Entry tasks will promote to "postulant".
    rank: "applicant",
    // Clock placeholders for the future day / horarium systems.
    calendar: {
      day: 1,
      weekday: "sun",
    },
    // Spiritual Health meter (0–100). Full heart at the start.
    spiritualHealth: 100,
    // Vigor blocks remaining today (10 max — see GAME_RULES).
    vigor: 10,
    // Pixel position on the first map (filled when overworld lands).
    position: { x: 0, y: 0, mapId: "grounds" },
    // Mute preference rides along so Resume restores it.
    muted: false,
    createdAt: null,
    updatedAt: null,
  };
}

/**
 * Upgrade an older (or partial) save object to the current shape.
 *
 * WHY migrate instead of rejecting:
 * As we add systems (Rosary, encounters, inventory), old blobs will be
 * missing fields. Filling defaults keeps Resume working. Only a wrong
 * or missing version means "no save".
 *
 * @param {unknown} data
 * @returns {object | null}
 */
export function migrate(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const raw = /** @type {Record<string, unknown>} */ (data);

  // Unknown future versions: refuse rather than guess.
  if (raw.version !== SAVE_VERSION) return null;

  // WHY normalizeCallingId:
  // Early docs/saves may have used the old house name (e.g. "St. Juniper
  // Friary") as a key. Map those to franciscan / dominican / carmelite
  // so Resume still works after the Marian house rename.
  let callingId = normalizeCallingId(raw.callingId);
  if (!callingId && typeof raw.home === "string") {
    callingId = normalizeCallingId(raw.home);
  }
  if (!callingId) return null;

  const next = createNewSave({ callingId });

  if (typeof raw.role === "string") next.role = raw.role;
  if (typeof raw.rank === "string") next.rank = raw.rank;

  if (raw.calendar && typeof raw.calendar === "object" && !Array.isArray(raw.calendar)) {
    const cal = /** @type {Record<string, unknown>} */ (raw.calendar);
    if (typeof cal.day === "number" && Number.isFinite(cal.day) && cal.day >= 1) {
      next.calendar.day = Math.floor(cal.day);
    }
    if (typeof cal.weekday === "string") next.calendar.weekday = cal.weekday;
  }

  if (typeof raw.spiritualHealth === "number" && Number.isFinite(raw.spiritualHealth)) {
    next.spiritualHealth = Math.max(0, Math.min(100, Math.round(raw.spiritualHealth)));
  }
  if (typeof raw.vigor === "number" && Number.isFinite(raw.vigor)) {
    next.vigor = Math.max(0, Math.min(10, Math.round(raw.vigor)));
  }

  if (raw.position && typeof raw.position === "object" && !Array.isArray(raw.position)) {
    const pos = /** @type {Record<string, unknown>} */ (raw.position);
    if (typeof pos.x === "number" && Number.isFinite(pos.x)) next.position.x = Math.round(pos.x);
    if (typeof pos.y === "number" && Number.isFinite(pos.y)) next.position.y = Math.round(pos.y);
    if (typeof pos.mapId === "string" && pos.mapId) next.position.mapId = pos.mapId;
  }

  if (typeof raw.muted === "boolean") next.muted = raw.muted;
  if (typeof raw.createdAt === "string" || raw.createdAt === null) next.createdAt = raw.createdAt;
  if (typeof raw.updatedAt === "string" || raw.updatedAt === null) next.updatedAt = raw.updatedAt;

  return next;
}

/** Turn a save object into a localStorage string. */
export function serialize(state) {
  return JSON.stringify(state);
}

/**
 * Parse + migrate a raw localStorage string.
 * @param {unknown} raw
 * @returns {object | null}
 */
export function deserialize(raw) {
  if (typeof raw !== "string" || raw.length === 0) return null;
  try {
    return migrate(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** True when we are in a browser that has localStorage. */
function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Load and migrate the current save, or null. Safe during SSR. */
export function loadSave() {
  if (!canUseStorage()) return null;
  return deserialize(window.localStorage.getItem(SAVE_KEY));
}

/** Write a save blob. Stamps updatedAt. Safe no-op during SSR. */
export function writeSave(state) {
  if (!canUseStorage() || !state) return;
  const stamped = {
    ...state,
    version: SAVE_VERSION,
    createdAt: state.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SAVE_KEY, serialize(stamped));
}

/** Delete the save. Safe no-op during SSR. */
export function clearSave() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SAVE_KEY);
}

/**
 * Tiny summary for the title screen's Resume row.
 * @param {object | null} state
 */
export function saveSummary(state) {
  if (!state) return null;
  const calling = getCalling(state.callingId);
  return {
    callingId: state.callingId,
    callingLabel: calling ? calling.label : state.callingId,
    role: state.role,
    rank: state.rank,
    day: state.calendar?.day ?? 1,
  };
}
