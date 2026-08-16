import type { CheckStatus, Grade } from "./types";

export const statusMeta: Record<
  CheckStatus,
  { label: string; dot: string; text: string; ring: string; badge: string }
> = {
  pass: {
    label: "Pass",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    ring: "ring-emerald-200",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  warn: {
    label: "Improve",
    dot: "bg-amber-500",
    text: "text-amber-700",
    ring: "ring-amber-200",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  fail: {
    label: "Fail",
    dot: "bg-rose-500",
    text: "text-rose-700",
    ring: "ring-rose-200",
    badge: "bg-rose-50 text-rose-700 ring-rose-200",
  },
};

export function gradeColor(grade: Grade): string {
  switch (grade) {
    case "A":
      return "text-emerald-600";
    case "B":
      return "text-lime-600";
    case "C":
      return "text-amber-600";
    case "D":
      return "text-orange-600";
    default:
      return "text-rose-600";
  }
}

export function scoreStroke(score: number): string {
  if (score >= 90) return "#10b981";
  if (score >= 75) return "#84cc16";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#f43f5e";
}
