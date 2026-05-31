"use client";

import { LABEL_META, LABEL_ORDER, type LabelColor } from "@/lib/types";
import { CheckIcon, XIcon } from "./icons";

export default function LabelPicker({
  value,
  onChange,
}: {
  value: LabelColor;
  onChange: (label: LabelColor) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {LABEL_ORDER.map((label) => {
        const meta = LABEL_META[label];
        const selected = value === label;
        const isNone = label === "none";
        return (
          <button
            key={label}
            type="button"
            onClick={() => onChange(label)}
            title={meta.name}
            aria-label={`Label ${meta.name}`}
            aria-pressed={selected}
            className={`tap focus-ring grid h-8 w-8 cursor-pointer place-items-center rounded-full transition-transform duration-100 ${
              isNone
                ? "border border-[var(--border-strong)] bg-[var(--surface-2)] text-[var(--muted)]"
                : meta.dot
            } ${
              selected
                ? "ring-2 ring-[var(--ring)] ring-offset-2 ring-offset-[var(--surface)]"
                : ""
            }`}
          >
            {isNone ? <XIcon className="h-3.5 w-3.5" strokeWidth={2.2} /> : null}
            {selected && !isNone ? (
              <CheckIcon className="h-4 w-4 text-white" strokeWidth={3} />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
