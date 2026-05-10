import type { DifficultyLevel } from "./data/content";

export const difficultyUi: Record<
  DifficultyLevel,
  {
    shortLabel: string;
    label: string;
    ariaLabel: string;
    className: string;
  }
> = {
  green: {
    shortLabel: "Зеленый",
    label: "Зеленый - легко",
    ariaLabel: "Сложность: зеленый, легко",
    className: "difficulty-green"
  },
  blue: {
    shortLabel: "Синий",
    label: "Синий - обычная",
    ariaLabel: "Сложность: синий, обычная",
    className: "difficulty-blue"
  },
  yellow: {
    shortLabel: "Желтый",
    label: "Желтый - внимательно",
    ariaLabel: "Сложность: желтый, разбирать внимательно",
    className: "difficulty-yellow"
  },
  red: {
    shortLabel: "Красный",
    label: "Красный - целевой повтор",
    ariaLabel: "Сложность: красный, целевой повтор",
    className: "difficulty-red"
  }
};

export function DifficultyIndicator({
  level,
  compact = false,
  label = "Уровень"
}: {
  level: DifficultyLevel;
  compact?: boolean;
  label?: "Уровень" | "Сложность билета" | "Сложность темы";
}) {
  const ui = difficultyUi[level];
  return (
    <span className={`difficulty-chip ${ui.className}`} aria-label={ui.ariaLabel} title={ui.ariaLabel}>
      <span className="difficulty-dot" aria-hidden="true" />
      <span>{compact ? ui.shortLabel : `${label}: ${ui.label}`}</span>
    </span>
  );
}
