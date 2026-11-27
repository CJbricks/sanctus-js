/**
 * quests.js
 * Franciscan entry tasks: Poverty, Chastity, Obedience → Postulant.
 *
 * WHY a small state machine in plain JS:
 * The overworld and the tests share one source of truth. Rank only
 * becomes "postulant" after all three flags and the Guardian's reception.
 * Formal vows are NOT taken here (see GAME_RULES §2).
 */

/** @typedef {{ introduced: boolean, poverty: boolean, chastity: boolean, obedience: boolean, received: boolean }} EntryTasks */

export function createEntryTasks() {
  return {
    introduced: false,
    poverty: false,
    chastity: false,
    obedience: false,
    received: false,
  };
}

/**
 * Fill missing task fields on an old save.
 * @param {unknown} raw
 * @returns {EntryTasks}
 */
export function normalizeEntryTasks(raw) {
  const base = createEntryTasks();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return base;
  const t = /** @type {Record<string, unknown>} */ (raw);
  return {
    introduced: Boolean(t.introduced),
    poverty: Boolean(t.poverty),
    chastity: Boolean(t.chastity),
    obedience: Boolean(t.obedience),
    received: Boolean(t.received),
  };
}

/** @param {EntryTasks} tasks */
export function allTasksDone(tasks) {
  return Boolean(tasks.poverty && tasks.chastity && tasks.obedience);
}

/**
 * After the Local Servant receives you: postulant rank + role.
 * @param {object} state  game save-like object
 */
export function receiveAsPostulant(state) {
  const tasks = normalizeEntryTasks(state.tasks);
  if (!allTasksDone(tasks) || tasks.received) {
    return { ...state, tasks };
  }
  return {
    ...state,
    rank: "postulant",
    role: "postulant",
    // Bag was given away in the poverty task.
    hasBag: false,
    tasks: { ...tasks, received: true },
  };
}

/**
 * Apply one quest action. Returns { state, lines } where lines are
 * dialogue strings for the UI (speaker set by caller).
 *
 * @param {object} state
 * @param {string} actionId
 */
export function applyQuestAction(state, actionId) {
  const tasks = normalizeEntryTasks(state.tasks);
  let next = { ...state, tasks: { ...tasks } };
  /** @type {string[]} */
  const lines = [];

  switch (actionId) {
    case "servant-intro": {
      if (!tasks.introduced) {
        next.tasks.introduced = true;
        lines.push(
          "Peace and all good. I am the Local Servant of this house.",
          "Before you may stay, embrace the three counsels — not as vows yet, but as your way of life.",
          "Poverty: give the bag you carry to our neighbor on the street.",
          "Chastity: pray quietly before Our Lady Untier of Knots in the chapel.",
          "Obedience: help Brother Garden exactly as he asks — no more, no less.",
          "Return to me when the three are done.",
        );
      } else if (allTasksDone(tasks) && !tasks.received) {
        next = receiveAsPostulant(next);
        lines.push(
          "You have kept the three tasks. The house receives you as a Postulant.",
          "You are not under vows yet. Live simply among us, and listen for the next bell.",
          "Welcome, Postulant.",
        );
      } else if (tasks.received) {
        lines.push("Go in peace, Postulant. Keep the bells and your chores.");
      } else {
        const left = [];
        if (!tasks.poverty) left.push("poverty (the neighbor)");
        if (!tasks.chastity) left.push("chastity (Our Lady in the chapel)");
        if (!tasks.obedience) left.push("obedience (Brother Garden)");
        lines.push(`Still to do: ${left.join("; ")}.`);
      }
      break;
    }
    case "poverty-give": {
      if (tasks.poverty) {
        lines.push("You already gave what you carried. Travel light.");
      } else if (state.hasBag === false) {
        lines.push("You have nothing left to give away.");
      } else {
        next.tasks.poverty = true;
        next.hasBag = false;
        lines.push(
          "You hand over the bag. The neighbor nods thanks.",
          "Poverty: what you had is no longer yours. (Task complete.)",
        );
      }
      break;
    }
    case "chastity-pray": {
      if (tasks.chastity) {
        lines.push("You already prayed here today. Rest in that resolution.");
      } else {
        next.tasks.chastity = true;
        lines.push(
          "Before Our Lady Untier of Knots, you ask for a pure and undivided heart.",
          "You choose custody of the eyes and kindness of speech. (Task complete.)",
        );
      }
      break;
    }
    case "obedience-help": {
      if (tasks.obedience) {
        lines.push("The beds are weeded. Thank you, friend.");
      } else {
        next.tasks.obedience = true;
        lines.push(
          "Brother Garden: \"Pull only the weeds in this row — leave the seedlings.\"",
          "You do exactly that. Obedience is the lesson, not the size of the pile. (Task complete.)",
        );
      }
      break;
    }
    case "crucifix-pray": {
      lines.push("You pause at the crucifix. \"Jesus, meek and humble of heart…\"");
      break;
    }
    case "neighbor-chat": {
      if (tasks.poverty) {
        lines.push("Neighbor: \"God bless you. The bag will help.\"");
      } else if (state.hasBag !== false) {
        // Offering the give action is handled by the scene choosing poverty-give
        // when A is pressed while facing the neighbor with a bag.
        lines.push("Neighbor: \"You look new. Need anything?\"");
      } else {
        lines.push("Neighbor: \"Peace to you.\"");
      }
      break;
    }
    default:
      lines.push("…");
  }

  return { state: next, lines };
}

/** Objective line for a simple HUD / servant reminder. */
export function currentObjective(state) {
  const tasks = normalizeEntryTasks(state.tasks);
  if (tasks.received || state.rank === "postulant") {
    return "Keep the bells. Explore the grounds.";
  }
  if (!tasks.introduced) return "Find the Local Servant.";
  if (!tasks.poverty) return "Poverty: give your bag to the neighbor.";
  if (!tasks.chastity) return "Chastity: pray before Our Lady in the chapel.";
  if (!tasks.obedience) return "Obedience: help Brother Garden as asked.";
  return "Return to the Local Servant.";
}
