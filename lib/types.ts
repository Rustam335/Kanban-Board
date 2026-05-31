export type LabelColor =
  | "none"
  | "violet"
  | "blue"
  | "emerald"
  | "amber"
  | "rose"
  | "slate";

export interface Card {
  id: string;
  title: string;
  description?: string;
  label: LabelColor;
  createdAt: number;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  columns: Column[];
  cards: Record<string, Card>;
}

export const LABEL_META: Record<
  LabelColor,
  { name: string; dot: string; bar: string }
> = {
  none: { name: "None", dot: "bg-transparent", bar: "" },
  violet: { name: "Grape", dot: "bg-[#7c3aed]", bar: "bg-[#7c3aed]" },
  blue: { name: "Signal", dot: "bg-[#2563eb]", bar: "bg-[#2563eb]" },
  emerald: { name: "Mint", dot: "bg-[#15803d]", bar: "bg-[#15803d]" },
  amber: { name: "Zest", dot: "bg-[#d97706]", bar: "bg-[#d97706]" },
  rose: { name: "Punch", dot: "bg-[#dc2626]", bar: "bg-[#dc2626]" },
  slate: { name: "Steel", dot: "bg-[#64748b]", bar: "bg-[#64748b]" },
};

export const LABEL_ORDER: LabelColor[] = [
  "none",
  "violet",
  "blue",
  "emerald",
  "amber",
  "rose",
  "slate",
];
