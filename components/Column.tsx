"use client";

import { useEffect, useRef, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Card, Column as ColumnType } from "@/lib/types";
import KanbanCard from "./KanbanCard";
import AddCard from "./AddCard";
import { TrashIcon, InboxIcon } from "./icons";

// Accent dot color per column (green → gold → secondary), cycling.
const ACCENTS = ["var(--primary)", "var(--accent)", "var(--secondary)"];

export default function Column({
  column,
  cards,
  index = 0,
  onAddCard,
  onEditCard,
  onRenameColumn,
  onDeleteColumn,
}: {
  column: ColumnType;
  cards: Card[];
  index?: number;
  onAddCard: (title: string) => void;
  onEditCard: (cardId: string) => void;
  onRenameColumn: (title: string) => void;
  onDeleteColumn: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  const accent = ACCENTS[index % ACCENTS.length];

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(column.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTitle) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editingTitle]);

  const commitTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed && trimmed !== column.title) onRenameColumn(trimmed);
    else setTitleDraft(column.title);
    setEditingTitle(false);
  };

  return (
    <div
      className={`animate-col-rise flex max-h-full w-[19rem] shrink-0 flex-col rounded-2xl border bg-[var(--surface-2)] transition-shadow duration-200 ${
        isOver
          ? "border-[var(--primary)] shadow-[var(--shadow-lg)]"
          : "border-[var(--border)] shadow-[var(--shadow-sm)]"
      }`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3.5 pb-2 pt-3">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        {editingTitle ? (
          <input
            ref={inputRef}
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                setTitleDraft(column.title);
                setEditingTitle(false);
              }
            }}
            className="focus-ring min-w-0 flex-1 rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-2 py-1 text-sm font-bold tracking-tight text-[var(--foreground)] outline-none"
          />
        ) : (
          <button
            onClick={() => {
              setTitleDraft(column.title);
              setEditingTitle(true);
            }}
            className="focus-ring min-w-0 flex-1 cursor-pointer truncate rounded-md text-left text-sm font-bold tracking-tight text-[var(--foreground)] transition-colors hover:text-[var(--primary)]"
            title="Click to rename"
          >
            {column.title}
          </button>
        )}

        <span className="grid h-6 min-w-[24px] place-items-center rounded-full bg-[color:color-mix(in_srgb,var(--primary)_14%,transparent)] px-2 text-xs font-bold text-[var(--primary)]">
          {cards.length}
        </span>

        <button
          onClick={onDeleteColumn}
          aria-label="Delete column"
          className="tap focus-ring grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[color:color-mix(in_srgb,var(--destructive)_12%,transparent)] hover:text-[var(--destructive)]"
        >
          <TrashIcon className="h-4 w-4" strokeWidth={2.1} />
        </button>
      </div>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={`scrollbar-thin flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-1 transition-colors duration-150 ${
          isOver
            ? "bg-[color:color-mix(in_srgb,var(--primary)_8%,transparent)]"
            : ""
        }`}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onEdit={() => onEditCard(card.id)}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="m-1 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border-strong)] py-9 text-center">
            <InboxIcon
              className="h-9 w-9 text-[var(--muted)] opacity-60"
              strokeWidth={1.6}
            />
            <p className="text-xs font-semibold text-[var(--muted)]">
              No cards yet — drop one here
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5">
        <AddCard onAdd={onAddCard} />
      </div>
    </div>
  );
}
