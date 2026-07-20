import type { DifficultyLevel } from "./data/content";
import { difficultyUi } from "./difficulty-meta";

export function DifficultyIndicator({
  level,
  compact = false,
  label = "Уровень",
}: {
  level: DifficultyLevel;
  compact?: boolean;
  label?: "Уровень" | "Сложность билета" | "Сложность темы";
}) {
  const ui = difficultyUi[level];
  return (
    <span
      className={`difficulty-chip ${ui.className}`}
      aria-label={ui.ariaLabel}
      title={ui.ariaLabel}
    >
      <span className="difficulty-dot" aria-hidden="true" />
      <span>{compact ? ui.shortLabel : `${label}: ${ui.label}`}</span>
    </span>
  );
}
