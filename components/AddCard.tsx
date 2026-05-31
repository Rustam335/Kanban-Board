"use client";

import { useEffect, useRef, useState } from "react";
import { PlusIcon } from "./icons";

export default function AddCard({ onAdd }: { onAdd: (title: string) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  const commit = () => {
    const trimmed = title.trim();
    if (trimmed) onAdd(trimmed);
    setTitle("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="tap focus-ring flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2 text-sm font-semibold text-[var(--muted)] shadow-[var(--shadow-sm)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        <PlusIcon className="h-4 w-4" strokeWidth={2.2} />
        Add Card
      </button>
    );
  }

  return (
    <div className="animate-pop-in">
      <textarea
        ref={ref}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            commit();
          } else if (e.key === "Escape") {
            setTitle("");
            setOpen(false);
          }
        }}
        rows={2}
        placeholder="What needs doing?"
        className="focus-ring w-full resize-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface)] px-3 py-2.5 text-sm font-medium text-[var(--foreground)] outline-none transition-shadow placeholder:font-normal placeholder:text-[var(--muted)]"
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={commit}
          className="tap focus-ring cursor-pointer rounded-lg bg-[var(--accent)] px-3 py-1.5 text-sm font-bold text-[var(--on-accent)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          Add
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setTitle("");
            setOpen(false);
          }}
          className="focus-ring cursor-pointer rounded-lg px-2.5 py-1.5 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
