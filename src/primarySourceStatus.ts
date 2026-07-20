export type ExactTextStatusKind = "passed" | "pending" | "failed";

export type ExactTextStatusNote = {
  kind: ExactTextStatusKind;
  title: string;
  description: string;
};

export function exactTextStatusKind(status: string): ExactTextStatusKind {
  if (status === "passed") return "passed";
  if (status === "failed") return "failed";
  return "pending";
}

export function exactTextStatusNote(status: string): ExactTextStatusNote {
  const kind = exactTextStatusKind(status);
  if (kind === "passed") {
    return {
      kind,
      title: "Точный текст проверен.",
      description:
        "Испанский архив прошел exact-text проверку для этого источника. Русский слой неофициальный и нужен только для учебы.",
    };
  }
  if (kind === "failed") {
    return {
      kind,
      title: "Проверка точного текста не пройдена.",
      description:
        "Испанский архив требует исправления перед финальным релизом. Русский слой неофициальный и нужен только для учебы.",
    };
  }
  return {
    kind,
    title: "Проверка точного текста ожидается.",
    description:
      "До финального релиза испанский архив требует отдельной exact-text проверки. Русский слой неофициальный и нужен только для учебы.",
  };
}
