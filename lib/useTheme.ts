"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const THEME_KEY = "kanban.theme";

function subscribe(callback: () => void) {
  window.addEventListener("kanban:theme", callback);
  return () => window.removeEventListener("kanban:theme", callback);
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

/**
 * Reads the current theme from the <html> class (set before paint by the inline
 * script in the root layout) and exposes a toggle. Using useSyncExternalStore
 * keeps server/client snapshots explicit and avoids setState-in-effect churn.
 */
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  // `mounted` is true once we're reading the real client snapshot.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback(() => {
    const root = document.documentElement;
    const next: Theme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event("kanban:theme"));
  }, []);

  return { theme, toggle, mounted };
}
