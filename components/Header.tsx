"use client";

import { useTheme } from "@/lib/useTheme";
import { SunIcon, MoonIcon, LayersIcon } from "./icons";

export default function Header() {
  const { theme, toggle, mounted } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:color-mix(in_srgb,var(--surface)_88%,transparent)] backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--primary)] text-[var(--on-primary)] shadow-[var(--shadow-md)]">
            <LayersIcon className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="leading-none">
            <h1 className="text-xl font-extrabold tracking-tight text-[var(--foreground)]">
              Stacked
            </h1>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Kanban / Get it done
            </p>
          </div>
        </div>

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="tap focus-ring group grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-2)]"
        >
          {mounted ? (
            theme === "dark" ? (
              <SunIcon
                className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
                strokeWidth={2.2}
              />
            ) : (
              <MoonIcon
                className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12"
                strokeWidth={2.2}
              />
            )
          ) : (
            <span className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}
