"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LABEL_META, type Card } from "@/lib/types";
import { PencilIcon } from "./icons";

export function CardContent({
  card,
  onEdit,
  dragging = false,
}: {
  card: Card;
  onEdit?: () => void;
  dragging?: boolean;
}) {
  const meta = LABEL_META[card.label];
  const hasLabel = card.label !== "none";

  return (
    <div
      className={`group/card relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3.5 transition-[transform,box-shadow] duration-100 ${
        dragging
          ? "rotate-[-2deg] scale-[1.02] shadow-[var(--shadow-lg)] ring-2 ring-[var(--primary)]"
          : "shadow-[var(--shadow-sm)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
      }`}
    >
      {hasLabel && (
        <span
          className={`absolute left-0 top-0 h-full w-1.5 ${meta.bar}`}
          aria-hidden
        />
      )}
      <div className={`flex items-start justify-between gap-2 ${hasLabel ? "pl-2.5" : ""}`}>
        <p className="text-[14px] font-semibold leading-snug text-[var(--foreground)]">
          {card.title}
        </p>
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Edit card"
            className="tap focus-ring shrink-0 cursor-pointer rounded-lg p-1 text-[var(--muted)] opacity-0 transition-all hover:bg-[color:color-mix(in_srgb,var(--accent)_14%,transparent)] hover:text-[var(--accent)] focus-visible:opacity-100 group-hover/card:opacity-100"
          >
            <PencilIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        )}
      </div>
      {card.description ? (
        <p
          className={`mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-[var(--muted)] ${
            hasLabel ? "pl-2.5" : ""
          }`}
        >
          {card.description}
        </p>
      ) : null}
    </div>
  );
}

export default function KanbanCard({
  card,
  onEdit,
}: {
  card: Card;
  onEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card" } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab touch-none active:cursor-grabbing ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <CardContent card={card} onEdit={onEdit} />
    </div>
  );
}
