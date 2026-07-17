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
    className: "difficulty-green",
  },
  blue: {
    shortLabel: "Синий",
    label: "Синий - обычная",
    ariaLabel: "Сложность: синий, обычная",
    className: "difficulty-blue",
  },
  yellow: {
    shortLabel: "Желтый",
    label: "Желтый - внимательно",
    ariaLabel: "Сложность: желтый, разбирать внимательно",
    className: "difficulty-yellow",
  },
  red: {
    shortLabel: "Красный",
    label: "Красный - целевой повтор",
    ariaLabel: "Сложность: красный, целевой повтор",
    className: "difficulty-red",
  },
};
