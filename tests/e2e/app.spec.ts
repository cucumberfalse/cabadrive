import { expect, test, type Locator, type Page } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
const translations = JSON.parse(readFileSync("content/translations/ru.translations.json", "utf8"));
const topicGuide = JSON.parse(readFileSync("content/guide/topic-study-guide.ru.json", "utf8"));
const processGuide = JSON.parse(readFileSync("content/guide/caba-exam-process.ru.json", "utf8"));
const primarySourceManifest = JSON.parse(readFileSync("content/official-documents/manifest.json", "utf8"));
const firstQuestionWrongAnswerIndex = questions[0].answers.findIndex((answer: { id: string }) => answer.id !== questions[0].correctAnswerId);
const canonicalQuestionById = new Map(questions.map((question: { id: string }) => [question.id, question]));
const translationByQuestionId = new Map(translations.map((translation: { questionId: string }) => [translation.questionId, translation]));
const difficultyAria: Record<string, string> = {
  green: "Сложность: зеленый, легко",
  blue: "Сложность: синий, обычная",
  yellow: "Сложность: желтый, разбирать внимательно",
  red: "Сложность: красный, целевой повтор"
};

type PrimarySourceChunk = {
  chunkId: string;
  order: number;
  officialLabel?: string;
  headingPath: string[];
  originalSpanish: string;
  fullTranslationRu: string;
  simpleRu: string;
};

type PrimarySourceDocument = {
  officialDocumentId: string;
  title: string;
  shortTitleRu: string;
  category: string;
  jurisdiction: string;
  officialSourceType: string;
  chunks: PrimarySourceChunk[];
};

function loadPrimarySourceDocuments() {
  const documentsById = new Map<string, PrimarySourceDocument>();
  for (const fileName of readdirSync("content/primary-sources/documents").filter((name) => name.endsWith(".json"))) {
    const shard = JSON.parse(readFileSync(join("content/primary-sources/documents", fileName), "utf8")).document as PrimarySourceDocument;
    const current = documentsById.get(shard.officialDocumentId) ?? { ...shard, chunks: [] };
    current.chunks.push(...shard.chunks);
    documentsById.set(shard.officialDocumentId, current);
  }
  return primarySourceManifest.entries.map((entry: { id: string }) => {
    const document = documentsById.get(entry.id);
    if (!document) throw new Error(`Missing primary source fixture document ${entry.id}`);
    return { ...document, chunks: [...document.chunks].sort((a, b) => a.order - b.order || a.chunkId.localeCompare(b.chunkId)) };
  });
}

const primarySourceDocuments = loadPrimarySourceDocuments();
const trafficLawSource = primarySourceDocuments.find((document) => document.officialDocumentId === "ley-24449-transito-seguridad-vial")!;
const cabaTrafficSource = primarySourceDocuments.find((document) => document.officialDocumentId === "ley-2148-caba-codigo-transito-transporte")!;
const longPrimarySource = primarySourceDocuments.find((document) => document.officialDocumentId === "ley-26994-codigo-civil-comercial")!;
const textSample = (value: string) => value.replace(/\s+/g, " ").trim().slice(0, 54);

async function storedAnswerCount(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("cabadrive.progress.v1") || "{\"answers\":[]}").answers.length);
}

async function openPrimarySources(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Источники/ }).click();
  await expect(page.getByRole("heading", { name: "Официальные первоисточники" })).toBeVisible();
  await expect(page.getByLabel("Покрытие корпуса источников").getByText(`${primarySourceManifest.entries.length} документов`, { exact: true })).toBeVisible();
}

async function openSourceDocument(page: Page, document: PrimarySourceDocument) {
  await page.getByRole("button", { name: new RegExp(document.shortTitleRu) }).click();
  await expect(page.getByTestId("source-detail-pane")).toBeVisible();
  await expect(page.getByRole("heading", { name: document.shortTitleRu })).toBeVisible();
}

test("learning flow renders category B image and records a mistake", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("unofficial category B practice set")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Тренажер теории/ })).toBeVisible();
  const card = page.getByTestId("question-card");
  await expect(card.getByText(`Билет ${questions[0].id}`, { exact: true })).toBeVisible();
  await expect(page.getByTestId("learning-ticket-timer")).toContainText("Темп билета");
  await expect(page.getByTestId("learning-ticket-timer-time")).toHaveText("1:15");
  const questionToggle = card.getByRole("button", { name: /¿Qué indica esta seña/ });
  await expect(card.locator(`[aria-label="${difficultyAria[questions[0].difficulty]}"]`)).toBeVisible();
  await expect(card.locator("img")).toBeVisible();
  await expect(page.getByText("Что означает этот жест?")).toHaveCount(0);
  await expect(page.getByText("Обгон справа.")).toHaveCount(0);
  await expect(page.getByText("Неофициальный перевод")).toHaveCount(0);
  await questionToggle.click();
  await expect(page.getByText("Что означает этот жест?")).toBeVisible();
  await expect(page.getByText("Обгон справа.")).toBeVisible();
  await expect(questionToggle).toHaveAttribute("aria-expanded", "true");
  await expect(
    card.evaluate((element) => {
      const official = element.querySelector(".official-block");
      const translation = element.querySelector(".support-block.translation");
      const image = element.querySelector(".question-image");
      const answers = element.querySelector(".answers");
      return Boolean(
        official &&
          translation &&
          image &&
          answers &&
          (official.compareDocumentPosition(translation) & Node.DOCUMENT_POSITION_FOLLOWING) &&
          (translation.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING) &&
          (translation.compareDocumentPosition(answers) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
    })
  ).resolves.toBe(true);
  await questionToggle.click();
  await expect(page.getByText("Что означает этот жест?")).toHaveCount(0);
  await questionToggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Что означает этот жест?")).toBeVisible();
  await page.getByRole("button", { name: /Сложный/ }).click();
  await page.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect(page.locator(".result")).toBeVisible();
  await expect.poll(() => storedAnswerCount(page)).toBe(1);
  await page.getByRole("button", { name: /Ошибки/ }).click();
  await expect(page.getByRole("heading", { name: "Ошибки" })).toBeVisible();
  await expect(page.locator(".side-list").locator(`[aria-label="${difficultyAria[questions[0].difficulty]}"]`)).toBeVisible();
  await expect(page.getByTestId("question-card").locator(`[aria-label="${difficultyAria[questions[0].difficulty]}"]`)).toBeVisible();
  await expect(page.getByText("Что означает этот жест?")).toHaveCount(0);
  const mistakeToggle = page.getByTestId("question-card").getByRole("button", { name: /¿Qué indica esta seña/ });
  await mistakeToggle.click();
  await expect(page.getByText("Что означает этот жест?")).toBeVisible();
  await mistakeToggle.click();
  await expect(page.getByText("Что означает этот жест?")).toHaveCount(0);
  await page.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect.poll(() => storedAnswerCount(page)).toBe(2);
  await page.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect.poll(() => storedAnswerCount(page)).toBe(3);
});

test("learning timer pauses, resumes, and does not count down invisible tickets", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.goto("/");

  const timer = page.getByTestId("learning-ticket-timer");
  const timerValue = page.getByTestId("learning-ticket-timer-time");
  await expect(timer).toContainText("Темп билета");
  await expect(timerValue).toHaveText("1:15");

  await page.clock.runFor(5_000);
  await expect(timerValue).toHaveText("1:10");

  const pauseButton = page.getByRole("button", { name: "Поставить таймер билета на паузу" });
  await pauseButton.focus();
  await expect(pauseButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(timer).toContainText("Пауза");
  await page.clock.runFor(10_000);
  await expect(timerValue).toHaveText("1:10");

  await page.getByRole("button", { name: "Продолжить таймер билета" }).click();
  await page.clock.runFor(1_000);
  await expect(timerValue).toHaveText("1:09");

  await page.getByRole("button", { name: "Следующий" }).click();
  await expect(timerValue).toHaveText("1:15");
  await page.clock.runFor(10_000);

  for (let i = 0; i < 24; i += 1) {
    await page.getByRole("button", { name: "Следующий" }).click();
  }
  await expect(timerValue).toHaveText("1:09");
});

test("learning timeout is unresolved only until the learner answers after the limit", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.goto("/");
  await expect(page.getByTestId("learning-ticket-timer-time")).toHaveText("1:15");

  await page.clock.runFor(76_000);
  await expect(page.getByText("Время вышло - билет пока не решен")).toBeVisible();
  await expect(page.locator(".answer.correct, .answer.incorrect")).toHaveCount(0);
  await expect.poll(() => storedAnswerCount(page)).toBe(0);

  await page.locator(".answer").first().click();
  await expect(page.getByText("Ответ после лимита")).toBeVisible();
  await expect.poll(() => storedAnswerCount(page)).toBe(1);
});

test("exam mode hides translation and explanation during active attempt and stores score", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Экзамен/ }).click();
  await expect(page.getByText(/45:00|44:59/)).toBeVisible();
  await expect(page.getByText(/Формат defined/)).toBeVisible();
  await expect(page.getByText("Темп билета")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /таймер билета/ })).toHaveCount(0);
  await expect(page.locator(".official-block[role='button']")).toHaveCount(0);
  await expect(page.locator(".support-block.translation")).toHaveCount(0);
  await expect(page.locator(".support-block.explanation")).toHaveCount(0);
  await expect(page.locator(".difficulty-chip")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Пояснение/ })).toHaveCount(0);
  await page.getByRole("button", { name: "Пропустить" }).click();
  await expect(page.getByText("2 / 40")).toBeVisible();
  for (let i = 0; i < 40; i += 1) {
    if (await page.locator(".answer").first().isVisible()) {
      await page.locator(".answer").first().click();
    }
  }
  await expect(page.getByText(/Пробный экзамен|Нужно повторить/)).toBeVisible();
});

test("vocabulary and guide are available", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Словарь/ }).click();
  await page.getByPlaceholder(/Buscar/).fill("balizas");
  await expect(page.getByText("balizas")).toBeVisible();
  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.getByRole("heading", { name: topicGuide.titleRu })).toBeVisible();
  await page.getByRole("button", { name: /Процесс/ }).click();
  await expect(page.getByRole("heading", { name: processGuide.titleRu })).toBeVisible();
  await page.getByRole("button", { name: /CABA\/RF/ }).click();
  await expect(page.getByText("Статус вопросов категории B")).toBeVisible();
  await expect(page.getByText("Входы в больницы и centros de salud")).toBeVisible();
});

test("process guide renders B1 Otorgamiento scope, official sources, volatile warnings, and glossary", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Процесс/ }).click();

  await expect(page.getByRole("heading", { name: processGuide.titleRu })).toBeVisible();
  await expect(page.getByText("Неофициальная русская поддержка")).toBeVisible();
  await expect(page.getByText(processGuide.officialActionWarningRu)).toBeVisible();
  await expect(page.getByText(/CABA · B1 · otorgamiento/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Официальная последовательность" })).toBeVisible();
  await expect(page.getByTestId("process-section-practical-car-exam")).toContainText("autos doble comando");
  await expect(page.getByTestId("process-section-exam-day-psychophysical")).toContainText("psicología, visión, audición");
  await expect(page.getByTestId("process-section-turno-bui-sede")).toContainText("Sedes, turnos");
  await expect(page.getByTestId("process-section-adjacent-paths")).toContainText("Renovación por cambio de jurisdicción");
  await expect(page.getByText("GCBA: Otorgamiento de Licencia de Conducir").first()).toBeVisible();
  await expect(page.getByText(`Проверено ${processGuide.lastReviewedAt}`).first()).toBeVisible();
  await expect(page.getByTestId("process-section-practical-car-exam").getByRole("link", { name: /GCBA: Examen práctico/ })).toHaveAttribute("href", /buenosaires\.gob\.ar/);
  await expect(page.getByRole("link", { name: /Manual de Procedimientos GCBA/ })).toHaveAttribute("href", /PE-DIS-SECGVC-DGHC-562-25-ANX\.pdf/);
  await expect(page.getByText("Declaración Jurada / DDJJ")).toBeVisible();
  await expect(page.getByText("siniestro vial / incidente vial / accidente vial")).toBeVisible();
  await expect(page.locator("iframe, embed, object")).toHaveCount(0);
});

test("process guide stays local-first without external requests, remote images, or PDF viewer", async ({ page }) => {
  const externalRequests: string[] = [];
  const pdfRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
    if (url.pathname.toLowerCase().endsWith(".pdf")) pdfRequests.push(request.url());
  });

  await page.goto("/");
  await page.getByRole("button", { name: /Процесс/ }).click();
  await expect(page.getByRole("heading", { name: processGuide.titleRu })).toBeVisible();
  await expect(page.locator("iframe, embed, object")).toHaveCount(0);
  await expect(page.locator(".process-view img")).toHaveCount(0);
  expect(externalRequests).toEqual([]);
  expect(pdfRequests).toEqual([]);
});

test("primary source reader opens, preserves app flows, and switches Russian/Spanish modes", async ({ page }) => {
  await openPrimarySources(page);
  await expect(page.getByTestId("source-list-pane")).toBeVisible();

  await openSourceDocument(page, trafficLawSource);
  await expect(page.getByTestId("source-mode-simple")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("source-chunk-reader")).toContainText(textSample(trafficLawSource.chunks[0].simpleRu));

  await page.getByTestId("source-mode-full").click();
  await expect(page.getByTestId("source-mode-full")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("source-chunk-reader")).toContainText(textSample(trafficLawSource.chunks[0].fullTranslationRu));

  await page.getByTestId("source-mode-spanish").click();
  await expect(page.getByTestId("source-mode-spanish")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("source-chunk-reader")).toContainText(textSample(trafficLawSource.chunks[0].originalSpanish));

  await expect(page.getByRole("button", { name: /Español simplificado|Spanish simplificado|Simple ES|Упрощенный испанский/i })).toHaveCount(0);
  await expect(page.locator(".source-reader")).not.toContainText(/simplified Spanish|español simplificado|spanish simple/i);

  await page.getByRole("button", { name: /Учить/ }).click();
  await expect(page.getByTestId("question-card")).toBeVisible();
  await page.getByRole("button", { name: /Экзамен/ }).click();
  await expect(page.getByText(/45:00|44:59/)).toBeVisible();
  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.getByRole("heading", { name: topicGuide.titleRu })).toBeVisible();
});

test("primary source search, filters, long-document TOC, and keyboard focus work locally", async ({ page }) => {
  await page.setViewportSize({ width: 1240, height: 900 });
  await openPrimarySources(page);

  const searchInput = page.getByRole("searchbox", { name: /Поиск по источникам/ });
  await searchInput.fill("seguridad vial");
  await expect(page.getByText(/Найдено:/)).toContainText("совпадений");
  await expect(page.getByRole("button", { name: new RegExp(trafficLawSource.shortTitleRu) })).toBeVisible();

  await page.getByLabel("Фильтр источников по практической категории").selectOption(trafficLawSource.category);
  await expect(page.getByRole("button", { name: new RegExp(trafficLawSource.shortTitleRu) })).toBeVisible();
  await page.getByLabel("Фильтр источников по юрисдикции или типу").selectOption(`jurisdiction:${trafficLawSource.jurisdiction}`);
  await expect(page.getByRole("button", { name: new RegExp(trafficLawSource.shortTitleRu) })).toBeVisible();

  await searchInput.fill("");
  await page.getByLabel("Фильтр источников по практической категории").selectOption("all");
  await page.getByLabel("Фильтр источников по юрисдикции или типу").selectOption("all");
  await openSourceDocument(page, longPrimarySource);
  await expect(page.getByRole("navigation", { name: "Оглавление фрагментов источника" })).toBeVisible();
  await expect(page.getByText(`${longPrimarySource.chunks.length} фрагментов`)).toBeVisible();
  await page.getByRole("button", { name: new RegExp(longPrimarySource.chunks[50].officialLabel!.slice(0, 30)) }).click();
  await expect(page.getByTestId("source-chunk-reader")).toContainText(textSample(longPrimarySource.chunks[50].simpleRu));
  await expect(page.getByTestId("source-chunk-reader")).not.toContainText(textSample(longPrimarySource.chunks[0].simpleRu));

  await searchInput.focus();
  await expect(searchInput).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Фильтр источников по практической категории")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Фильтр источников по юрисдикции или типу")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: new RegExp(primarySourceDocuments[0].shortTitleRu) })).toBeFocused();
});

test("primary source reader adapts between compact and expanded widths without runtime network or PDF dependencies", async ({ page }) => {
  const externalRequests: string[] = [];
  const pdfRequests: string[] = [];
  const backendLikeRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
    if (url.pathname.toLowerCase().endsWith(".pdf")) pdfRequests.push(request.url());
    if (/\/api\/|openai|live-ai|backend/i.test(url.pathname + url.hostname)) backendLikeRequests.push(request.url());
  });

  await page.setViewportSize({ width: 390, height: 900 });
  await openPrimarySources(page);
  await expect(page.getByTestId("source-list-pane")).toBeVisible();
  await expect(page.getByTestId("source-detail-pane")).toBeHidden();
  await openSourceDocument(page, cabaTrafficSource);
  await expect(page.getByTestId("source-list-pane")).toBeHidden();
  await expect(page.getByRole("button", { name: /К списку источников/ })).toBeVisible();
  await expect(page.getByTestId("source-chunk-reader")).toContainText(textSample(cabaTrafficSource.chunks[0].simpleRu));
  await page.getByRole("button", { name: /К списку источников/ }).click();
  await expect(page.getByTestId("source-list-pane")).toBeVisible();
  await openSourceDocument(page, cabaTrafficSource);
  await expect(page.getByTestId("source-list-pane")).toBeHidden();
  const compactSearchInput = page.getByTestId("source-search-input");
  await compactSearchInput.evaluate((input) => {
    const searchInput = input as HTMLInputElement;
    const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
    valueSetter?.call(searchInput, "licencia");
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await expect(page.getByTestId("source-list-pane")).toBeVisible();
  await expect(page.getByTestId("source-detail-pane")).toBeHidden();
  await page.getByRole("searchbox", { name: /Поиск по источникам/ }).fill("");

  await page.setViewportSize({ width: 1240, height: 900 });
  await expect(page.getByTestId("source-list-pane")).toBeVisible();
  await expect(page.getByTestId("source-detail-pane")).toBeVisible();
  await expect(page.locator("iframe, embed, object")).toHaveCount(0);
  await expect(page.locator(".source-reader a[href$='.pdf'], .source-reader a[href*='.pdf']")).toHaveCount(0);
  expect(externalRequests).toEqual([]);
  expect(pdfRequests).toEqual([]);
  expect(backendLikeRequests).toEqual([]);
});

test("materials view renders topic guide status, list, details, canonical ticket data, and local images", async ({ page }) => {
  const firstTopic = topicGuide.topics[0];
  const firstTicket = firstTopic.tickets[0];
  const canonicalQuestion = canonicalQuestionById.get(firstTicket.questionId) as {
    officialTextEs: string;
    difficulty: string;
    answers: { id: string; officialTextEs: string }[];
    correctAnswerId: string;
    image: { localPath: string };
  };
  const correctAnswer = canonicalQuestion.answers.find((answer) => answer.id === canonicalQuestion.correctAnswerId)!;
  const correctExplanation = firstTicket.answerExplanations.find((item: { answerId: string }) => item.answerId === correctAnswer.id)!;
  const incorrectExplanation = firstTicket.answerExplanations.find((item: { answerId: string }) => item.answerId !== correctAnswer.id)!;
  const translation = translationByQuestionId.get(firstTicket.questionId) as {
    questionTextRu: string;
    answerTranslations: Record<string, string>;
  };

  await page.goto("/");
  await page.getByRole("button", { name: /Материалы/ }).click();

  await expect(page.getByRole("heading", { name: topicGuide.titleRu })).toBeVisible();
  await expect(page.getByText("Черновик: материал неполный").first()).toBeVisible();
  await expect(page.getByText("Неофициальная учебная поддержка")).toBeVisible();
  await expect(page.getByText("Текущие билеты: неофициальная B-практика, не полная официальная база GCBA")).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(firstTopic.titleRu) })).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(firstTopic.titleRu) }).locator(`[aria-label="${difficultyAria[firstTopic.difficulty]}"]`)).toBeVisible();
  await expect(page.getByRole("heading", { name: firstTopic.titleRu })).toBeVisible();
  await expect(page.locator(".materials-topic-heading").locator(`[aria-label="${difficultyAria[firstTopic.difficulty]}"]`)).toBeVisible();
  await expect(page.getByText(firstTopic.summaryRu)).toBeVisible();
  await expect(page.getByText(firstTopic.learningMaterialRu[0])).toBeVisible();
  await expect(page.getByText(firstTopic.practicalReasoningRu[0])).toBeVisible();
  const firstTerm = page.locator(".materials-term").filter({ hasText: firstTopic.spanishTerms[0].translationRu });
  await expect(firstTerm.getByText(firstTopic.spanishTerms[0].termEs, { exact: true })).toBeVisible();
  await expect(firstTerm.getByText(firstTopic.spanishTerms[0].translationRu)).toBeVisible();
  await expect(page.getByText(firstTopic.trapNotes[0].textRu)).toBeVisible();

  const ticketBlock = page.getByTestId(`materials-ticket-${firstTicket.questionId}`);
  await expect(ticketBlock).toBeVisible();
  await expect(ticketBlock.locator(`[aria-label="${difficultyAria[canonicalQuestion.difficulty]}"]`)).toBeVisible();
  await expect(ticketBlock.getByText(canonicalQuestion.officialTextEs)).toBeVisible();
  await expect(ticketBlock.getByText(translation.questionTextRu)).toBeVisible();
  await expect(ticketBlock.getByText("Статус: неофициальная B-практика")).toHaveCount(0);
  const ticketAnswers = ticketBlock.locator(".materials-answers");
  for (const answer of canonicalQuestion.answers) {
    await expect(ticketAnswers.getByText(answer.officialTextEs, { exact: true })).toBeVisible();
    await expect(ticketAnswers.getByText(translation.answerTranslations[answer.id], { exact: true })).toBeVisible();
  }
  await expect(ticketAnswers.getByText("Правильный ответ", { exact: true })).toBeVisible();
  await expect(ticketBlock.locator(".material-answer p").filter({ hasText: correctExplanation.explanationRu }).first()).toBeVisible();
  await expect(ticketBlock.locator(".material-answer p").filter({ hasText: incorrectExplanation.explanationRu }).first()).toBeVisible();
  await expect(ticketBlock.locator("img")).toHaveAttribute("src", new RegExp(canonicalQuestion.image.localPath));
});

test("materials view renders a dual-topic ticket as a full block in both assigned topics", async ({ page }) => {
  const firstTopic = topicGuide.topics.find((topic: { slug: string }) => topic.slug === "parking-clearances-and-corners");
  const secondTopic = topicGuide.topics.find((topic: { slug: string }) => topic.slug === "right-of-way-special-situations");
  const dualQuestionId = "b-fallback-031";
  if (!firstTopic || !secondTopic) {
    throw new Error("Expected both dual-topic guide topics to exist.");
  }
  const firstTopicTicket = firstTopic.tickets.find((ticket: { questionId: string }) => ticket.questionId === dualQuestionId);
  const secondTopicTicket = secondTopic.tickets.find((ticket: { questionId: string }) => ticket.questionId === dualQuestionId);
  if (!firstTopicTicket || !secondTopicTicket) {
    throw new Error(`Expected ${dualQuestionId} to be present in both selected guide topics.`);
  }
  const canonicalQuestion = canonicalQuestionById.get(dualQuestionId) as {
    officialTextEs: string;
    difficulty: string;
    answers: { id: string; officialTextEs: string }[];
    correctAnswerId: string;
  };
  const translation = translationByQuestionId.get(dualQuestionId) as {
    questionTextRu: string;
    answerTranslations: Record<string, string>;
  };

  async function expectFullDualTopicTicket(ticketBlock: Locator, guideTicket: {
    answerExplanations: { explanationRu: string }[];
    }) {
    await expect(ticketBlock).toBeVisible();
    await expect(ticketBlock.getByText(canonicalQuestion.officialTextEs)).toBeVisible();
    await expect(ticketBlock.locator(`[aria-label="${difficultyAria[canonicalQuestion.difficulty]}"]`)).toBeVisible();
    const ticketAnswers = ticketBlock.locator(".materials-answers");
    for (const answer of canonicalQuestion.answers) {
      await expect(ticketAnswers.getByText(answer.officialTextEs, { exact: true })).toBeVisible();
      await expect(ticketAnswers.getByText(translation.answerTranslations[answer.id], { exact: true })).toBeVisible();
    }
    await expect(ticketBlock.getByText(translation.questionTextRu)).toBeVisible();
    await expect(ticketBlock.getByText("Статус: неофициальная B-практика")).toHaveCount(0);
    await expect(ticketAnswers.getByText("Правильный ответ", { exact: true })).toBeVisible();
    for (const explanation of guideTicket.answerExplanations) {
      await expect(ticketBlock.locator(".material-answer p").filter({ hasText: explanation.explanationRu }).first()).toBeVisible();
    }
  }

  await page.goto("/");
  await page.getByRole("button", { name: /Материалы/ }).click();

  await expect(page.getByRole("heading", { name: firstTopic.titleRu })).toBeVisible();
  let ticketBlock = page.getByTestId(`materials-ticket-${dualQuestionId}`);
  await expectFullDualTopicTicket(ticketBlock, firstTopicTicket);

  await page.getByRole("button", { name: new RegExp(secondTopic.titleRu) }).click();
  await expect(page.getByRole("heading", { name: secondTopic.titleRu })).toBeVisible();
  ticketBlock = page.getByTestId(`materials-ticket-${dualQuestionId}`);
  await expectFullDualTopicTicket(ticketBlock, secondTopicTicket);
});

test("materials view stays local-first without external requests or PDF viewer", async ({ page }) => {
  const externalRequests: string[] = [];
  const pdfRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
    if (url.pathname.toLowerCase().endsWith(".pdf")) pdfRequests.push(request.url());
  });

  await page.goto("/");
  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.getByRole("heading", { name: topicGuide.titleRu })).toBeVisible();
  await expect(page.locator("iframe, embed, object")).toHaveCount(0);
  expect(externalRequests).toEqual([]);
  expect(pdfRequests).toEqual([]);
});

test("offline reload works after first load", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByTestId("question-card")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect(page.getByTestId("question-card")).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByTestId("question-card")).toBeVisible();
});
