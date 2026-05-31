"use client";

import { useEffect, useRef, useState } from "react";
import type { Card, LabelColor } from "@/lib/types";
import LabelPicker from "./LabelPicker";
import { XIcon, TrashIcon } from "./icons";

export default function CardEditorModal({
  card,
  onClose,
  onSave,
  onDelete,
}: {
  card: Card;
  onClose: () => void;
  onSave: (patch: { title: string; description: string; label: LabelColor }) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description ?? "");
  const [label, setLabel] = useState<LabelColor>(card.label);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
    titleRef.current?.select();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({ title: trimmed, description: description.trim(), label });
    onClose();
  };

  const labelClass =
    "mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[var(--muted)]";
  const fieldClass =
    "focus-ring w-full resize-none rounded-xl border border-[var(--border-strong)] bg-[var(--surface-2)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition-shadow placeholder:text-[var(--muted)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-[4px] animate-fade-in sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-pop-in w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-xl)]">
        <div className="mb-5 flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-lg font-extrabold tracking-tight text-[var(--foreground)]">
            Edit Card
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="tap focus-ring grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--foreground)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--destructive)_10%,transparent)] hover:text-[var(--destructive)]"
          >
            <XIcon className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        <label className={labelClass}>Title</label>
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
          }}
          rows={2}
          className={`${fieldClass} mb-4 font-semibold`}
          placeholder="What needs doing?"
        />

        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={`${fieldClass} mb-4`}
          placeholder="Add more detail (optional)…"
        />

        <label className={`${labelClass} mb-2`}>Label</label>
        <div className="mb-6">
          <LabelPicker value={label} onChange={setLabel} />
        </div>

        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="tap focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[color:color-mix(in_srgb,var(--destructive)_30%,transparent)] px-3 py-2 text-sm font-bold text-[var(--destructive)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--destructive)_10%,transparent)]"
          >
            <TrashIcon className="h-4 w-4" strokeWidth={2.1} />
            Delete
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="focus-ring cursor-pointer rounded-lg border-2 border-[var(--primary)] px-3 py-1.5 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--primary)_8%,transparent)]"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!title.trim()}
              className="tap focus-ring cursor-pointer rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-bold text-[var(--on-accent)] shadow-[var(--shadow-sm)] transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
