import type { BoardState } from "./types";

const STORAGE_KEY = "kanban.board.v1";

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now()
    .toString(36)
    .slice(-4)}`;
}

export function createSeedBoard(): BoardState {
  const c = (
    title: string,
    label: BoardState["cards"][string]["label"],
    description?: string,
  ) => {
    const id = uid("card");
    return {
      id,
      card: { id, title, label, description, createdAt: Date.now() },
    };
  };

  const c1 = c(
    "Design system audit",
    "violet",
    "Review spacing, color tokens, and typography scale across the app.",
  );
  const c2 = c("Wire up authentication flow", "blue");
  const c3 = c(
    "Draft Q3 roadmap",
    "amber",
    "Collect input from product and engineering before the sync.",
  );
  const c4 = c("Refactor board state reducer", "emerald");
  const c5 = c("Fix drag overlay flicker on Safari", "rose");
  const c6 = c("Set up CI pipeline", "slate");
  const c7 = c("Ship dark mode", "violet", "Persist preference to localStorage.");
  const c8 = c("Write onboarding docs", "none");

  return {
    columns: [
      { id: "col_todo", title: "To Do", cardIds: [c1.id, c2.id, c3.id] },
      {
        id: "col_progress",
        title: "In Progress",
        cardIds: [c4.id, c5.id, c6.id],
      },
      { id: "col_done", title: "Done", cardIds: [c7.id, c8.id] },
    ],
    cards: {
      [c1.id]: c1.card,
      [c2.id]: c2.card,
      [c3.id]: c3.card,
      [c4.id]: c4.card,
      [c5.id]: c5.card,
      [c6.id]: c6.card,
      [c7.id]: c7.card,
      [c8.id]: c8.card,
    },
  };
}

export function loadBoard(): BoardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BoardState;
    if (!parsed || !Array.isArray(parsed.columns) || !parsed.cards) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveBoard(state: BoardState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable — ignore */
  }
}
