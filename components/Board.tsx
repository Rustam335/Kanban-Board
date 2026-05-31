"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { BoardState, Card, LabelColor } from "@/lib/types";
import {
  createSeedBoard,
  loadBoard,
  saveBoard,
  uid,
} from "@/lib/storage";
import Column from "./Column";
import { CardContent } from "./KanbanCard";
import CardEditorModal from "./CardEditorModal";
import { PlusIcon } from "./icons";

export default function Board() {
  const [board, setBoard] = useState<BoardState | null>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const boardScrollRef = useRef<HTMLDivElement>(null);

  // Load from localStorage (or seed) on mount.
  useEffect(() => {
    setBoard(loadBoard() ?? createSeedBoard());
  }, []);

  // Persist on every change.
  useEffect(() => {
    if (board) saveBoard(board);
  }, [board]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (e: DragStartEvent) => {
    setActiveCardId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    setBoard((prev) => {
      if (!prev) return prev;
      const fromCol = prev.columns.find((c) => c.cardIds.includes(activeId));
      if (!fromCol) return prev;

      // Determine target column: over a card -> its column; over a column droppable -> that column.
      const overIsColumn = prev.columns.some((c) => c.id === overId);
      const toCol = overIsColumn
        ? prev.columns.find((c) => c.id === overId)
        : prev.columns.find((c) => c.cardIds.includes(overId));
      if (!toCol || toCol.id === fromCol.id) return prev;

      const columns = prev.columns.map((c) => ({
        ...c,
        cardIds: [...c.cardIds],
      }));
      const from = columns.find((c) => c.id === fromCol.id)!;
      const to = columns.find((c) => c.id === toCol.id)!;

      from.cardIds = from.cardIds.filter((id) => id !== activeId);

      let insertIndex = to.cardIds.length;
      if (!overIsColumn) {
        const idx = to.cardIds.indexOf(overId);
        if (idx >= 0) insertIndex = idx;
      }
      to.cardIds.splice(insertIndex, 0, activeId);

      return { ...prev, columns };
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveCardId(null);
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    setBoard((prev) => {
      if (!prev) return prev;
      const col = prev.columns.find((c) => c.cardIds.includes(activeId));
      if (!col) return prev;
      // Reorder within the same column.
      if (col.cardIds.includes(overId)) {
        const oldIndex = col.cardIds.indexOf(activeId);
        const newIndex = col.cardIds.indexOf(overId);
        if (oldIndex === newIndex) return prev;
        const columns = prev.columns.map((c) =>
          c.id === col.id
            ? { ...c, cardIds: arrayMove(c.cardIds, oldIndex, newIndex) }
            : c,
        );
        return { ...prev, columns };
      }
      return prev;
    });
  };

  // --- Card mutations ---
  const addCard = (columnId: string, title: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const id = uid("card");
      const card: Card = {
        id,
        title,
        label: "none",
        createdAt: Date.now(),
      };
      return {
        cards: { ...prev.cards, [id]: card },
        columns: prev.columns.map((c) =>
          c.id === columnId ? { ...c, cardIds: [...c.cardIds, id] } : c,
        ),
      };
    });
  };

  const updateCard = (
    cardId: string,
    patch: { title: string; description: string; label: LabelColor },
  ) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const existing = prev.cards[cardId];
      if (!existing) return prev;
      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            ...existing,
            title: patch.title,
            description: patch.description || undefined,
            label: patch.label,
          },
        },
      };
    });
  };

  const deleteCard = (cardId: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const { [cardId]: _removed, ...rest } = prev.cards;
      void _removed;
      return {
        cards: rest,
        columns: prev.columns.map((c) => ({
          ...c,
          cardIds: c.cardIds.filter((id) => id !== cardId),
        })),
      };
    });
  };

  // --- Column mutations ---
  const addColumn = () => {
    setBoard((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: [
          ...prev.columns,
          { id: uid("col"), title: "New Column", cardIds: [] },
        ],
      };
    });
    requestAnimationFrame(() => {
      const el = boardScrollRef.current;
      if (el) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    });
  };

  const renameColumn = (columnId: string, title: string) => {
    setBoard((prev) =>
      prev
        ? {
            ...prev,
            columns: prev.columns.map((c) =>
              c.id === columnId ? { ...c, title } : c,
            ),
          }
        : prev,
    );
  };

  const deleteColumn = (columnId: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const col = prev.columns.find((c) => c.id === columnId);
      if (!col) return prev;
      const cards = { ...prev.cards };
      col.cardIds.forEach((id) => delete cards[id]);
      return {
        cards,
        columns: prev.columns.filter((c) => c.id !== columnId),
      };
    });
  };

  const activeCard = useMemo(
    () => (activeCardId && board ? board.cards[activeCardId] : null),
    [activeCardId, board],
  );
  const editingCard = editingCardId && board ? board.cards[editingCardId] : null;

  // Skeleton while hydrating to avoid layout flash.
  if (!board) {
    return (
      <div className="flex gap-5 px-4 py-6 sm:px-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-80 w-[19rem] shrink-0 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] shadow-[var(--shadow-sm)]"
          />
        ))}
      </div>
    );
  }

  const totalCards = Object.keys(board.cards).length;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveCardId(null)}
      >
        <div
          ref={boardScrollRef}
          className="scrollbar-thin flex h-full items-start gap-5 overflow-x-auto px-4 pb-6 pt-5 sm:px-6"
        >
          {board.columns.map((column, i) => (
            <Column
              key={column.id}
              column={column}
              index={i}
              cards={column.cardIds
                .map((id) => board.cards[id])
                .filter(Boolean)}
              onAddCard={(title) => addCard(column.id, title)}
              onEditCard={(cardId) => setEditingCardId(cardId)}
              onRenameColumn={(title) => renameColumn(column.id, title)}
              onDeleteColumn={() => deleteColumn(column.id)}
            />
          ))}

          {/* Add column */}
          <button
            onClick={addColumn}
            className="tap focus-ring group flex w-[19rem] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface)]/40 px-4 py-4 text-sm font-bold text-[var(--muted)] transition-colors hover:border-[var(--primary)] hover:bg-[color:color-mix(in_srgb,var(--primary)_8%,transparent)] hover:text-[var(--primary)]"
          >
            <PlusIcon className="h-5 w-5" strokeWidth={2.4} />
            New Column
          </button>
        </div>

        <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
          {activeCard ? (
            <div className="w-[17.5rem] cursor-grabbing">
              <CardContent card={activeCard} dragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* footer stat for screen readers / subtle UI */}
      <p className="sr-only">{totalCards} cards on the board.</p>

      {editingCard && (
        <CardEditorModal
          card={editingCard}
          onClose={() => setEditingCardId(null)}
          onSave={(patch) => updateCard(editingCard.id, patch)}
          onDelete={() => deleteCard(editingCard.id)}
        />
      )}
    </>
  );
}
