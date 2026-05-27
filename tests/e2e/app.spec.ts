import { expect, test, type Locator, type Page } from "@playwright/test";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
const translations = JSON.parse(readFileSync("content/translations/ru.translations.json", "utf8"));
const explanations = JSON.parse(readFileSync("content/explanations/ru.explanations.json", "utf8"));
const topicGuide = JSON.parse(readFileSync("content/guide/topic-study-guide.ru.json", "utf8"));
const learningImages = JSON.parse(readFileSync("content/learning-images/learning-images.runtime.json", "utf8"));
const processGuide = JSON.parse(readFileSync("content/guide/caba-exam-process.ru.json", "utf8"));
const primarySourceManifest = JSON.parse(readFileSync("content/official-documents/manifest.json", "utf8"));
const imageOverlays = JSON.parse(readFileSync("content/image-overlays/question-explanation-overlays.manifest.json", "utf8"));
const manualManifest = JSON.parse(readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/manual.ru.json", "utf8"));
const manualLayout = JSON.parse(readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/layout.ru.json", "utf8"));
const manualNavigation = JSON.parse(readFileSync("content/manuals/gcba-manual-vehiculo-4-ruedas-2023/navigation.ru.json", "utf8"));
const learningImageById = new Map(learningImages.images.map((image: { imageId: string }) => [image.imageId, image]));
const learningCoverageByUnitId = new Map(learningImages.coverage.map((record: { unitId: string }) => [record.unitId, record]));
const firstQuestionWrongAnswerIndex = questions[0].answers.findIndex((answer: { id: string }) => answer.id !== questions[0].correctAnswerId);
const canonicalQuestionById = new Map(questions.map((question: { id: string }) => [question.id, question]));
const translationByQuestionId = new Map(translations.map((translation: { questionId: string }) => [translation.questionId, translation]));
const explanationByQuestionId = new Map(explanations.map((explanation: { questionId: string }) => [explanation.questionId, explanation]));
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

function isPrimarySourceFixtureDocument(value: unknown): value is PrimarySourceDocument {
  const document = value as PrimarySourceDocument | undefined;
  return Boolean(document?.officialDocumentId && Array.isArray(document.chunks));
}

function normalizePrimarySourceFixtureShard(fileName: string, value: unknown) {
  const shard = value as { document?: unknown; documents?: unknown };
  const pluralDocuments = Array.isArray(shard.documents) ? shard.documents : [];
  const hasMalformedPluralDocument = pluralDocuments.some((document) => !isPrimarySourceFixtureDocument(document));
  const documents = [
    ...(isPrimarySourceFixtureDocument(shard.document) ? [shard.document] : []),
    ...pluralDocuments.filter(isPrimarySourceFixtureDocument)
  ];

  if (documents.length === 0 || hasMalformedPluralDocument) {
    throw new Error(`Malformed primary source fixture shard ${fileName}`);
  }
  return documents;
}

function loadPrimarySourceDocuments() {
  const documentsById = new Map<string, PrimarySourceDocument>();
  for (const fileName of readdirSync("content/primary-sources/documents").filter((name) => name.endsWith(".json"))) {
    const documents = normalizePrimarySourceFixtureShard(
      fileName,
      JSON.parse(readFileSync(join("content/primary-sources/documents", fileName), "utf8"))
    );
    for (const shard of documents) {
      const current = documentsById.get(shard.officialDocumentId) ?? { ...shard, chunks: [] };
      current.chunks.push(...shard.chunks);
      documentsById.set(shard.officialDocumentId, current);
    }
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

test("primary source fixture loader accepts singular and plural document shards", () => {
  const fixtureDocument: PrimarySourceDocument = {
    officialDocumentId: "fixture-doc",
    title: "Fixture document",
    shortTitleRu: "Тестовый источник",
    category: "traffic-law",
    jurisdiction: "national",
    officialSourceType: "law",
    chunks: [
      {
        chunkId: "fixture-doc--001",
        order: 1,
        headingPath: ["Fixture"],
        originalSpanish: "Texto uno",
        fullTranslationRu: "Полный перевод один",
        simpleRu: "Просто один"
      }
    ]
  };
  const secondDocument = {
    ...fixtureDocument,
    chunks: [{ ...fixtureDocument.chunks[0], chunkId: "fixture-doc--002", order: 2 }]
  };

  expect(normalizePrimarySourceFixtureShard("singular.json", { document: fixtureDocument })).toHaveLength(1);
  expect(normalizePrimarySourceFixtureShard("plural.json", { documents: [fixtureDocument, secondDocument] }).map((document) => document.chunks[0].chunkId)).toEqual([
    "fixture-doc--001",
    "fixture-doc--002"
  ]);
  expect(() => normalizePrimarySourceFixtureShard("mixed-plural.json", { documents: [fixtureDocument, { chunks: [] }] })).toThrow(/mixed-plural\.json/);
});

async function forceRandom(page: Page, randomValue: number) {
  await page.addInitScript((value) => {
    Math.random = () => value;
  }, randomValue);
}

async function storedAnswerCount(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("cabadrive.progress.v1") || "{\"answers\":[]}").answers.length);
}

async function openPrimarySources(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Источники/ }).click();
  await expect(page.getByRole("heading", { name: "Официальные первоисточники" })).toBeVisible();
  await expect(page.getByLabel("Покрытие корпуса источников").getByText(`${primarySourceManifest.entries.length} документов`, { exact: true })).toBeVisible();
}

async function openCompleteManual(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: /Руководство 4R/ }).click();
  await expect(page.getByRole("heading", { name: manualManifest.titleRu })).toBeVisible();
}

async function showCompleteManualList(page: Page) {
  const backButton = page.getByRole("button", { name: /К навигации/ });
  if (await backButton.isVisible()) await backButton.click();
}

type ManualRenderedBox = {
  id: string | null;
  type: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
  position: string;
  scrollWidth: number;
  clientWidth: number;
  scrollHeight: number;
  clientHeight: number;
  fontSize: number;
};

function boxesOverlap(first: ManualRenderedBox, second: ManualRenderedBox, tolerance = 0.75) {
  return (
    first.x < second.right - tolerance &&
    first.right > second.x + tolerance &&
    first.y < second.bottom - tolerance &&
    first.bottom > second.y + tolerance
  );
}

async function renderedManualBoxes(locator: Locator): Promise<ManualRenderedBox[]> {
  return locator.evaluateAll((elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return {
        id: element.getAttribute("data-block-id") ?? element.getAttribute("data-region-type"),
        type: element.getAttribute("data-block-type") ?? element.getAttribute("data-region-type"),
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
        position: style.position,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        fontSize: Number.parseFloat(style.fontSize)
      };
    })
  );
}

async function expectIndependentManualPageLayout(page: Page, pageNumber: number, minBlockCount = 3) {
  await expect(page.getByTestId("manual-page-detail")).toContainText(`${pageNumber} / 200`);
  await expect(page.locator(".manual-russian-page-flow")).toHaveCount(0);
  const blocks = page.getByTestId("manual-layout-block");
  await expect(blocks.first()).toBeVisible();
  const blockBoxes = await renderedManualBoxes(blocks);
  expect(blockBoxes.length).toBeGreaterThanOrEqual(minBlockCount);
  expect(new Set(blockBoxes.map((box) => `${Math.round(box.x)}:${Math.round(box.y)}:${Math.round(box.width)}:${Math.round(box.height)}`)).size).toBeGreaterThan(1);
  expect(blockBoxes.every((box) => box.position === "absolute")).toBe(true);
  for (const box of blockBoxes) {
    expect(box.scrollWidth, `manual block ${box.id} overflows horizontally on page ${pageNumber}`).toBeLessThanOrEqual(box.clientWidth + 2);
    expect(box.scrollHeight, `manual block ${box.id} overflows vertically on page ${pageNumber}`).toBeLessThanOrEqual(box.clientHeight + 2);
  }
  for (let index = 0; index < blockBoxes.length; index += 1) {
    for (let nextIndex = index + 1; nextIndex < blockBoxes.length; nextIndex += 1) {
      expect(boxesOverlap(blockBoxes[index], blockBoxes[nextIndex]), `manual blocks ${blockBoxes[index].id} and ${blockBoxes[nextIndex].id} overlap on page ${pageNumber}`).toBe(false);
    }
  }

  const visualBoxes = (await renderedManualBoxes(page.getByTestId("manual-preserved-visual-region"))).filter((box) => box.width > 0 && box.height > 0);
  expect(visualBoxes.length).toBeGreaterThan(0);
  for (const blockBox of blockBoxes) {
    for (const visualBox of visualBoxes) {
      expect(boxesOverlap(blockBox, visualBox), `manual block ${blockBox.id} overlaps preserved visual region ${visualBox.id} on page ${pageNumber}`).toBe(false);
    }
  }
}

async function expectReadableManualMobileBlocks(page: Page, pageNumber: number) {
  const blockBoxes = await renderedManualBoxes(page.getByTestId("manual-layout-block"));
  const instructionalBoxes = blockBoxes.filter((box) => box.type && !["pageNumber", "label", "footnote"].includes(box.type));
  expect(instructionalBoxes.length, `page ${pageNumber} has primary Russian instructional blocks`).toBeGreaterThan(0);
  for (const box of instructionalBoxes) {
    expect(box.fontSize, `manual block ${box.id} on page ${pageNumber} is too small for mobile reading`).toBeGreaterThanOrEqual(8);
    expect(box.height, `manual block ${box.id} on page ${pageNumber} has no practical text box height`).toBeGreaterThanOrEqual(box.fontSize * 0.95);
  }
}

async function openSourceDocument(page: Page, document: PrimarySourceDocument) {
  await page.getByRole("button", { name: new RegExp(document.shortTitleRu) }).click();
  await expect(page.getByTestId("source-detail-pane")).toBeVisible();
  await expect(page.getByRole("heading", { name: document.shortTitleRu })).toBeVisible();
}

async function visibleTicketId(page: Page) {
  const metaText = await page.getByTestId("question-card").locator(".question-meta").textContent();
  const match = metaText?.match(/Билет\s+(b-fallback-\d+)/);
  if (!match) throw new Error(`Could not find visible ticket id in ${metaText}`);
  return match[1];
}

async function firstVisibleTicketIds(page: Page, count: number) {
  const ids = [];
  const nav = page.getByTestId("question-card").locator(".question-flow-nav");
  for (let index = 0; index < count; index += 1) {
    ids.push(await visibleTicketId(page));
    if (index < count - 1) {
      await nav.getByRole("button", { name: "Следующий" }).click();
    }
  }
  return ids;
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes("default Learn exposes all questions")) return;
  await forceRandom(page, 0.999999);
});

test("default Learn exposes all questions and uses session-stable controlled shuffle", async ({ browser }) => {
  const canonicalPage = await browser.newPage();
  await forceRandom(canonicalPage, 0.999999);
  await canonicalPage.goto("/");
  const canonicalNav = canonicalPage.getByTestId("question-card").locator(".question-flow-nav");
  await expect(canonicalNav.getByText("1 / 460")).toBeVisible();
  const canonicalOrder = await firstVisibleTicketIds(canonicalPage, 3);
  expect(canonicalOrder).toEqual(questions.slice(0, 3).map((question: { id: string }) => question.id));

  await canonicalNav.getByRole("button", { name: "Предыдущий" }).click();
  await canonicalNav.getByRole("button", { name: "Предыдущий" }).click();
  await expect(canonicalPage.getByText(questions[0].officialTextEs)).toBeVisible();
  await canonicalPage.getByRole("button", { name: /Сложный/ }).click();
  await canonicalPage.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect(canonicalPage.locator(".result")).toBeVisible();
  const search = canonicalPage.getByPlaceholder("Поиск по испанскому, русскому, теме");
  await search.fill("b-fallback-004");
  await expect(canonicalNav.getByText("1 / 1")).toBeVisible();
  await expect(canonicalPage.getByText(questions[3].officialTextEs)).toBeVisible();
  await search.fill("");
  await expect(canonicalNav.getByText("1 / 460")).toBeVisible();
  expect(await firstVisibleTicketIds(canonicalPage, 3)).toEqual(canonicalOrder);
  await canonicalPage.close();

  const reshuffledPage = await browser.newPage();
  await forceRandom(reshuffledPage, 0);
  await reshuffledPage.goto("/");
  await expect(reshuffledPage.getByTestId("question-card").locator(".question-flow-nav").getByText("1 / 460")).toBeVisible();
  const reshuffledOrder = await firstVisibleTicketIds(reshuffledPage, 3);
  expect(reshuffledOrder).not.toEqual(canonicalOrder);
  await reshuffledPage.close();
});

test("learning flow renders category B image and records a mistake", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("unofficial category B practice set")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Тренажер теории/ })).toBeVisible();
  const card = page.getByTestId("question-card");
  await expect(card.getByText(`Билет ${questions[0].id}`, { exact: true })).toBeVisible();
  await expect(page.getByTestId("learning-ticket-timer")).toContainText("Темп билета");
  await expect(page.getByTestId("learning-ticket-timer-time")).toHaveText("1:15");
  await expect(page.locator(".toolbar").getByRole("button", { name: "Следующий" })).toHaveCount(0);
  const bottomNav = card.locator(".question-flow-nav");
  await expect(bottomNav).toBeVisible();
  await expect(bottomNav.getByText("1 / 460")).toBeVisible();
  await expect(bottomNav.getByRole("button", { name: "Предыдущий" })).toBeDisabled();
  await expect(bottomNav.getByRole("button", { name: "Следующий" })).toBeEnabled();
  const questionToggle = card.getByRole("button", { name: /¿Qué indica esta seña/ });
  await expect(card.locator(`[aria-label="${difficultyAria[questions[0].difficulty]}"]`)).toBeVisible();
  await expect(card.locator("img")).toBeVisible();
  await expect(card.getByTestId("image-explanation-overlay")).toHaveCount(0);
  await expect(card.getByTestId("image-overlay-fallback")).toHaveCount(0);
  await expect(page.getByText("Что означает этот жест?")).toHaveCount(0);
  await expect(page.getByText("Обгон справа.")).toHaveCount(0);
  await expect(page.locator(".support-block.explanation")).toHaveCount(0);
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
  await expect(page.locator(".support-block.translation")).toBeVisible();
  await expect(page.locator(".support-block.explanation")).toContainText((explanationByQuestionId.get(questions[0].id) as { textRu: string }).textRu);
  await expect(card.getByTestId("image-explanation-overlay")).toBeVisible();
  await expect(card.locator("[data-overlay-role='answer_critical_highlight']")).toBeVisible();
  await expect(card.locator("[data-overlay-role='background_irrelevant_dim']")).not.toHaveCount(0);
  await expect.poll(() => storedAnswerCount(page)).toBe(1);
  await bottomNav.getByRole("button", { name: "Следующий" }).click();
  await expect(page.getByText(questions[1].officialTextEs)).toBeVisible();
  await page.getByTestId("question-card").locator(".question-flow-nav").getByRole("button", { name: "Предыдущий" }).click();
  await expect(page.getByText(questions[0].officialTextEs)).toBeVisible();
  await expect(page.locator(".result")).toBeVisible();
  await expect(page.locator(".support-block.translation")).toBeVisible();
  await expect(page.locator(".support-block.explanation")).toContainText((explanationByQuestionId.get(questions[0].id) as { textRu: string }).textRu);
  await page.getByRole("button", { name: /Ошибки/ }).click();
  await expect(page.getByRole("heading", { name: "Ошибки" })).toBeVisible();
  await expect(page.locator(".side-list").locator(`[aria-label="${difficultyAria[questions[0].difficulty]}"]`)).toBeVisible();
  await expect(page.getByTestId("question-card").locator(`[aria-label="${difficultyAria[questions[0].difficulty]}"]`)).toBeVisible();
  await expect(page.getByText("Что означает этот жест?")).toHaveCount(0);
  await expect(page.locator(".support-block.explanation")).toHaveCount(0);
  const mistakesNav = page.getByTestId("question-card").locator(".question-flow-nav");
  await expect(mistakesNav.getByRole("button", { name: "Предыдущий" })).toBeDisabled();
  await expect(mistakesNav.getByRole("button", { name: "Следующий" })).toBeDisabled();
  const mistakeToggle = page.getByTestId("question-card").getByRole("button", { name: /¿Qué indica esta seña/ });
  await mistakeToggle.click();
  await expect(page.getByText("Что означает этот жест?")).toBeVisible();
  await mistakeToggle.click();
  await expect(page.getByText("Что означает этот жест?")).toHaveCount(0);
  await page.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect(page.getByText("Что означает этот жест?")).toBeVisible();
  await expect(page.locator(".support-block.explanation")).toContainText((explanationByQuestionId.get(questions[0].id) as { textRu: string }).textRu);
  await expect(page.getByTestId("question-card").getByTestId("image-explanation-overlay")).toBeVisible();
  await expect.poll(() => storedAnswerCount(page)).toBe(2);
  await page.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect.poll(() => storedAnswerCount(page)).toBe(3);
});

test("overlay data loads with full current coverage and question-specific reused-image entries", async () => {
  const imageBackedQuestions = questions.filter((question: { image?: unknown }) => question.image);
  expect(imageOverlays.overlays).toHaveLength(imageBackedQuestions.length);
  expect(new Set(imageOverlays.overlays.map((overlay: { questionId: string }) => overlay.questionId)).size).toBe(imageBackedQuestions.length);
  expect(imageOverlays.overlays.filter((overlay: { localPath: string }) => overlay.localPath.endsWith("/b2.jpg"))).toMatchObject([
    { questionId: "b-fallback-256", imageId: "question-image-b2" },
    { questionId: "b-fallback-303", imageId: "question-image-b2" }
  ]);
});

test("image explanation overlay bounds follow the rendered bitmap when image height is constrained", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const card = page.getByTestId("question-card");
  await page.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect(card.getByTestId("image-explanation-overlay")).toBeVisible();

  const geometry = await card.evaluate((element) => {
    const image = element.querySelector(".question-image-frame img");
    const overlay = element.querySelector("[data-testid='image-explanation-overlay']");
    const highlight = element.querySelector("[data-overlay-role='answer_critical_highlight']");
    const dimRegions = [...element.querySelectorAll("[data-overlay-role='background_irrelevant_dim']")];
    if (!(image instanceof HTMLImageElement) || !(overlay instanceof HTMLElement) || !(highlight instanceof HTMLElement)) {
      throw new Error("Expected image overlay geometry elements to exist.");
    }

    const rect = (target: Element) => {
      const box = target.getBoundingClientRect();
      return {
        left: box.left,
        top: box.top,
        right: box.right,
        bottom: box.bottom,
        width: box.width,
        height: box.height
      };
    };

    const imageRect = rect(image);
    const overlayRect = rect(overlay);
    const highlightRect = rect(highlight);
    const dimRects = dimRegions.map(rect);
    const imageAspect = image.naturalWidth / image.naturalHeight;
    const imageBoxAspect = imageRect.width / imageRect.height;

    return {
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight,
      imageAspect,
      imageBoxAspect,
      imageRect,
      overlayRect,
      highlightRect,
      dimRects
    };
  });

  expect(geometry.naturalWidth).toBe(537);
  expect(geometry.naturalHeight).toBe(344);
  expect(geometry.imageRect.height).toBeGreaterThan(350);
  expect(geometry.imageRect.height).toBeLessThanOrEqual(361);
  expect(Math.abs(geometry.imageBoxAspect - geometry.imageAspect)).toBeLessThan(0.01);
  expect(Math.abs(geometry.overlayRect.left - geometry.imageRect.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.overlayRect.top - geometry.imageRect.top)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.overlayRect.width - geometry.imageRect.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.overlayRect.height - geometry.imageRect.height)).toBeLessThanOrEqual(1);

  for (const region of [geometry.highlightRect, ...geometry.dimRects]) {
    expect(region.left).toBeGreaterThanOrEqual(geometry.imageRect.left - 1);
    expect(region.top).toBeGreaterThanOrEqual(geometry.imageRect.top - 1);
    expect(region.right).toBeLessThanOrEqual(geometry.imageRect.right + 1);
    expect(region.bottom).toBeLessThanOrEqual(geometry.imageRect.bottom + 1);
  }
});

test("cached image path navigation keeps the frame keyed to the current source dimensions", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const nextImagePath = (questions[1] as { image: { localPath: string } }).image.localPath;
  await page.evaluate(async (src) => {
    const image = new Image();
    image.src = src;
    await image.decode();
  }, `/${nextImagePath}`);

  await page.getByTestId("question-card").locator(".question-flow-nav").getByRole("button", { name: "Следующий" }).click();
  await expect(page.getByText(questions[1].officialTextEs)).toBeVisible();
  await expect(page.locator(".question-image-frame img")).toHaveAttribute("src", `/${nextImagePath}`);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

  const geometry = await page.getByTestId("question-card").evaluate((element) => {
    const frame = element.querySelector(".question-image-frame");
    const image = element.querySelector(".question-image-frame img");
    if (!(frame instanceof HTMLElement) || !(image instanceof HTMLImageElement)) {
      throw new Error("Expected cached current image frame to exist.");
    }

    const frameRect = frame.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    return {
      frameWidth: frameRect.width,
      imageWidth: imageRect.width,
      imageHeight: imageRect.height,
      naturalWidth: image.naturalWidth,
      naturalHeight: image.naturalHeight
    };
  });

  const expectedWidth = (360 * geometry.naturalWidth) / geometry.naturalHeight;
  expect(geometry.naturalWidth).toBe(573);
  expect(geometry.naturalHeight).toBe(367);
  expect(Math.abs(geometry.frameWidth - expectedWidth)).toBeLessThanOrEqual(1);
  expect(Math.abs(geometry.imageWidth - expectedWidth)).toBeLessThanOrEqual(3);
  expect(geometry.imageHeight).toBeGreaterThan(350);
  expect(geometry.imageHeight).toBeLessThanOrEqual(361);
  expect(geometry.frameWidth).toBeLessThan(590);
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
  await expect(timerValue).toHaveText("1:05");

  await page.getByRole("button", { name: "Предыдущий" }).click();
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

test("answered learning ticket restored by search does not restart as unresolved timer", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await page.goto("/");
  const search = page.getByPlaceholder("Поиск по испанскому, русскому, теме");
  const timer = page.getByTestId("learning-ticket-timer");
  const timerValue = page.getByTestId("learning-ticket-timer-time");

  await expect(page.getByText(questions[0].officialTextEs)).toBeVisible();
  await page.locator(".answer").nth(firstQuestionWrongAnswerIndex).click();
  await expect(page.locator(".result")).toBeVisible();
  await expect(timer).toContainText("В темпе");
  await expect(timerValue).toHaveText("1:15");

  await search.fill("b-fallback-004");
  await expect(page.getByText(questions[3].officialTextEs)).toBeVisible();
  await search.fill("b-fallback-001");
  await expect(page.getByText(questions[0].officialTextEs)).toBeVisible();
  await expect(page.locator(".result")).toBeVisible();
  await expect(page.locator(".support-block.explanation")).toBeVisible();
  await expect(timer).toContainText("В темпе");
  await expect(page.getByRole("button", { name: /таймер билета/ })).toHaveCount(0);

  await page.clock.runFor(80_000);
  await expect(timer).toContainText("В темпе");
  await expect(timerValue).toHaveText("1:15");
  await expect(page.getByText("Время вышло - билет пока не решен")).toHaveCount(0);
  await expect.poll(() => storedAnswerCount(page)).toBe(1);
});

test("learning search navigation keeps filtered context and boundary states", async ({ page }) => {
  await page.goto("/");
  const search = page.getByPlaceholder("Поиск по испанскому, русскому, теме");
  await search.fill("prioridad");
  const card = page.getByTestId("question-card");
  const nav = card.locator(".question-flow-nav");
  await expect(nav.getByText(/^1 \/ /)).toBeVisible();
  await expect(nav.getByRole("button", { name: "Предыдущий" })).toBeDisabled();
  await nav.getByRole("button", { name: "Следующий" }).click();
  await expect(nav.getByRole("button", { name: "Предыдущий" })).toBeEnabled();
  await nav.getByRole("button", { name: "Предыдущий" }).click();
  await expect(nav.getByRole("button", { name: "Предыдущий" })).toBeDisabled();
});

test("learning search with no matches does not fall back to an answerable question", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("question-card")).toBeVisible();
  await page.getByPlaceholder("Поиск по испанскому, русскому, теме").fill("zzzz-no-local-ticket-match");
  await expect(page.getByRole("heading", { name: "Ничего не найдено" })).toBeVisible();
  await expect(page.getByTestId("question-card")).toHaveCount(0);
  await expect(page.locator(".question-flow-nav")).toHaveCount(0);
  await expect(page.locator(".answer")).toHaveCount(0);
  await expect.poll(() => storedAnswerCount(page)).toBe(0);
});

test("mistake review with no mistakes does not render fallback question", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Ошибки/ }).click();
  await expect(page.getByRole("heading", { name: "Ошибки" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ошибок пока нет" })).toBeVisible();
  await expect(page.getByTestId("question-card")).toHaveCount(0);
  await expect(page.locator(".question-flow-nav")).toHaveCount(0);
  await expect(page.locator(".answer")).toHaveCount(0);
  await expect.poll(() => storedAnswerCount(page)).toBe(0);
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
  await expect(page.getByTestId("image-explanation-overlay")).toHaveCount(0);
  await expect(page.getByTestId("learning-image")).toHaveCount(0);
  await expect(page.locator(".difficulty-chip")).toHaveCount(0);
  await expect(page.getByText("есть отрицание/ловушка")).toHaveCount(0);
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
  await expect(page.getByRole("heading", { name: "balizas" })).toBeVisible();
  const balizasCoverage = learningCoverageByUnitId.get("vocabulary-term:term-balizas") as { imageIds: string[] };
  const balizasImage = learningImageById.get(balizasCoverage.imageIds[0]) as { localPath: string };
  const vocabularyImage = page.getByTestId("learning-image").first();
  await expect(vocabularyImage).toBeVisible();
  await expect(vocabularyImage.locator("img")).toHaveAttribute("src", new RegExp(balizasImage.localPath.replace(/\//g, "\\/")));
  await expect(vocabularyImage.locator("img")).toHaveAttribute("alt", /balizas|термина/i);
  await expect(page.locator("[lang='es']").filter({ hasText: "balizas" })).toBeVisible();
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

test("complete RU manual surface renders Russian layout pages with semantic navigation and local assets only", async ({ page }) => {
  const externalRequests: string[] = [];
  const pdfRequests: string[] = [];
  const backendLikeRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
    if (url.pathname.toLowerCase().endsWith(".pdf")) pdfRequests.push(request.url());
    if (/\/api\/|openai|live-ai|backend/i.test(url.pathname + url.hostname)) backendLikeRequests.push(request.url());
  });

  await openCompleteManual(page);
  await expect(page.getByLabel("Покрытие полного manual")).toContainText("200 / 200 страниц");
  await expect(page.getByLabel("Покрытие полного manual")).toContainText("200 страниц верстки");
  await expect(page.getByLabel("Покрытие полного manual")).toContainText(`${manualNavigation.entries.length} разделов`);
  await expect(page.getByLabel("Покрытие полного manual")).toContainText("200 локальных изображений");
  await expect(page.locator("iframe, embed, object")).toHaveCount(0);
  await expect(page.locator(".manual-reader a[href$='.pdf'], .manual-reader a[href*='.pdf']")).toHaveCount(0);
  await expect(page.locator(".manual-page-grid, .manual-visual, .manual-translation")).toHaveCount(0);
  await expect(page.locator(".manual-russian-page-flow")).toHaveCount(0);
  await expect(page.getByTestId("manual-navigation-panel")).toBeVisible();
  await expect(page.getByTestId("manual-nav-introduction")).toBeVisible();
  await expect(page.getByTestId("manual-nav-appendix-4-road-signs")).toBeVisible();

  if (!(await page.getByTestId("manual-page-canvas").isVisible())) {
    await page.getByTestId("manual-nav-introduction").click();
  }
  const manualImage = page.getByTestId("manual-page-local-visual");
  await expect(page.getByTestId("manual-page-detail")).toContainText("14 / 200");
  await expect(page.getByTestId("manual-page-canvas")).toBeVisible();
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText("ВВЕДЕНИЕ");
  await expectIndependentManualPageLayout(page, 14, 3);
  await expect(manualImage).toHaveAttribute("src", new RegExp(manualManifest.pages[13].visualAsset.localPath.replace(/\//g, "\\/")));
  await expect(manualImage).toHaveJSProperty("naturalWidth", manualManifest.pages[13].visualAsset.width);
  await expect(manualImage).toHaveJSProperty("naturalHeight", manualManifest.pages[13].visualAsset.height);

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-chapter-3-driving-rules").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("57 / 200");
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText("ОСНОВНЫЕ НОРМЫ");

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-app1-safety-elements").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("105 / 200");
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText("Элементы безопасности");
  await expectIndependentManualPageLayout(page, 105, 8);

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-appendix-2-passenger-transport").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("123 / 200");
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText("ПЕРЕВОЗКА ПАССАЖИРОВ");
  await expectIndependentManualPageLayout(page, 123, 3);

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-app4-signs-regulatory").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("185 / 200");
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText("Запрещающие");
  await expectIndependentManualPageLayout(page, 185, 3);
  await expect(manualImage).toHaveAttribute("src", new RegExp(manualManifest.pages[184].visualAsset.localPath.replace(/\//g, "\\/")));

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-ch4-stress").scrollIntoViewIfNeeded();
  await page.getByTestId("manual-nav-ch4-stress").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("94 / 200");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("Стресс");
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText("ВОЗ определяет");
  await expect(page.getByTestId("manual-page-russian-layout")).not.toContainText("Отвлечения");
  await expect(page.getByTestId("manual-nav-ch4-stress")).toHaveClass(/active/);

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-ch4-distractions").scrollIntoViewIfNeeded();
  await page.getByTestId("manual-nav-ch4-distractions").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("95 / 200");
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText("Отвлечения");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("Отвлечения");
  await expect(page.getByTestId("manual-selected-semantic-label")).not.toContainText("Стресс");
  await expect(page.getByTestId("manual-nav-ch4-distractions")).toHaveClass(/active/);
  await expect(page.getByTestId("manual-nav-ch4-stress")).not.toHaveClass(/active/);

  await showCompleteManualList(page);
  const pageAccess = page.getByTestId("manual-page-access");
  if (!(await pageAccess.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await pageAccess.locator("summary").click();
  }
  await page.getByTestId("manual-page-button-94").scrollIntoViewIfNeeded();
  await page.getByTestId("manual-page-button-94").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("94 / 200");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("Стресс");
  await expect(page.getByTestId("manual-selected-semantic-label")).not.toContainText("Сон и усталость");
  await expect(page.getByTestId("manual-nav-ch4-stress")).toHaveClass(/active/);
  await expect(page.getByTestId("manual-nav-ch4-sleep-fatigue")).not.toHaveClass(/active/);

  await showCompleteManualList(page);
  await page.getByTestId("manual-search-input").fill("ВОЗ определяет");
  await expect(page.getByText("Найдено: 1 страниц")).toBeVisible();
  await page.getByTestId("manual-page-button-94").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("94 / 200");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("Стресс");
  await expect(page.getByTestId("manual-selected-semantic-label")).not.toContainText("Сон и усталость");

  await showCompleteManualList(page);
  await page.getByTestId("manual-search-input").fill("");
  await page.getByTestId("manual-nav-ch5-equal-society").scrollIntoViewIfNeeded();
  await page.getByTestId("manual-nav-ch5-equal-society").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("100 / 200");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("К равноправному обществу");
  await expect(page.getByTestId("manual-nav-ch5-equal-society")).toHaveClass(/active/);

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-ch5-gender-violence-prevention").scrollIntoViewIfNeeded();
  await page.getByTestId("manual-nav-ch5-gender-violence-prevention").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("100 / 200");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("Профилактика и помощь");
  await expect(page.getByTestId("manual-selected-semantic-label")).not.toContainText("К равноправному обществу");
  await expect(page.getByTestId("manual-nav-ch5-gender-violence-prevention")).toHaveClass(/active/);
  await expect(page.getByTestId("manual-nav-ch5-equal-society")).not.toHaveClass(/active/);

  await showCompleteManualList(page);
  await page.getByTestId("manual-search-input").fill("Логотип города Буэнос-Айрес");
  await expect(page.getByText("Найдено: 1 страниц")).toBeVisible();
  await page.getByTestId("manual-page-button-200").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("200 / 200");
  await expect(manualImage).toHaveAttribute("src", new RegExp(manualManifest.pages[199].visualAsset.localPath.replace(/\//g, "\\/")));
  await expect(page.getByTestId("manual-page-russian-layout")).toContainText(manualManifest.pages[199].translation.fullTranslationRu);

  expect(externalRequests).toEqual([]);
  expect(pdfRequests).toEqual([]);
  expect(backendLikeRequests).toEqual([]);
});

test("complete RU manual mobile navigation rows and pages 114-123 remain readable without overlap", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await openCompleteManual(page);

  await page.getByTestId("manual-nav-appendix-1-private-cars").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("104 / 200");
  await page.getByRole("button", { name: /К навигации/ }).click();

  await page.getByTestId("manual-page-access").locator("summary").click();
  await page.getByTestId("manual-page-button-114").scrollIntoViewIfNeeded();

  const rowBoxes: Array<{ pageNumber: number; y: number; bottom: number }> = [];
  for (let pageNumber = 114; pageNumber <= 123; pageNumber += 1) {
    const row = page.getByTestId(`manual-page-button-${pageNumber}`);
    await expect(row).toBeVisible();
    const rowBox = await row.boundingBox();
    const markerBox = await row.locator("span").first().boundingBox();
    const titleBox = await row.locator("strong").first().boundingBox();
    const subtitleBox = await row.locator("small").first().boundingBox();
    if (!rowBox || !markerBox || !titleBox || !subtitleBox) throw new Error(`Missing mobile bounding box for manual page ${pageNumber}`);

    expect(markerBox.x + markerBox.width).toBeLessThanOrEqual(titleBox.x - 1);
    expect(titleBox.y).toBeGreaterThanOrEqual(rowBox.y);
    expect(subtitleBox.y).toBeGreaterThanOrEqual(titleBox.y);
    expect(subtitleBox.y + subtitleBox.height).toBeLessThanOrEqual(rowBox.y + rowBox.height + 0.5);
    rowBoxes.push({ pageNumber, y: rowBox.y, bottom: rowBox.y + rowBox.height });
  }

  for (let index = 1; index < rowBoxes.length; index += 1) {
    expect(rowBoxes[index - 1].bottom, `manual pages ${rowBoxes[index - 1].pageNumber}-${rowBoxes[index].pageNumber} overlap`).toBeLessThanOrEqual(rowBoxes[index].y + 0.5);
  }

  for (let pageNumber = 114; pageNumber <= 123; pageNumber += 1) {
    const row = page.getByTestId(`manual-page-button-${pageNumber}`);
    if (!(await row.isVisible())) {
      await page.getByTestId("manual-page-access").locator("summary").click();
      await row.scrollIntoViewIfNeeded();
    }
    await row.click();
    await expectIndependentManualPageLayout(page, pageNumber, Math.min(3, manualLayout.pages[pageNumber - 1].blocks.length));
    await expectReadableManualMobileBlocks(page, pageNumber);
    if (pageNumber < 123) await showCompleteManualList(page);
  }
});

test("non-manual startup defers the manual corpus chunk until the manual view opens", async ({ page }) => {
  const manualChunkRequests: string[] = [];
  const externalRequests: string[] = [];
  const pdfRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (/^\/assets\/manual4Ruedas-[^/]+\.js$/u.test(url.pathname)) manualChunkRequests.push(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
    if (url.pathname.toLowerCase().endsWith(".pdf")) pdfRequests.push(request.url());
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Тренажер теории/ })).toBeVisible();
  await page.waitForLoadState("networkidle");

  expect(manualChunkRequests).toEqual([]);

  await page.getByRole("button", { name: /Руководство 4R/ }).click();
  await expect(page.getByRole("heading", { name: manualManifest.titleRu })).toBeVisible();
  await expect(page.getByTestId("manual-page-detail")).toContainText("14 / 200");
  await expect(manualChunkRequests).toHaveLength(1);
  expect(externalRequests).toEqual([]);
  expect(pdfRequests).toEqual([]);
});

test("complete RU manual search with no matches keeps the detail pane empty", async ({ page }) => {
  await page.setViewportSize({ width: 1240, height: 900 });
  await openCompleteManual(page);

  await page.getByTestId("manual-search-input").fill("cabadrive-no-matching-manual-page");

  await expect(page.getByText("Найдено: 0 страниц")).toBeVisible();
  await expect(page.locator(".manual-page-list .source-empty-state")).toContainText("Ничего не найдено");
  await expect(page.getByTestId("manual-page-detail")).toHaveCount(0);
  await expect(page.getByTestId("manual-empty-detail")).toBeVisible();
  await expect(page.getByTestId("manual-empty-detail")).toContainText("Страница не выбрана");
  await expect(page.getByTestId("manual-empty-detail")).not.toContainText("PDF page 1");
  await expect(page.locator(".manual-page-counter")).toHaveCount(0);
  await expect(page.locator(".manual-actions")).toHaveCount(0);

  await page.getByRole("button", { name: "Сбросить поиск" }).click();

  await expect(page.getByTestId("manual-page-detail")).toContainText("14 / 200");
});

test("primary source reader opens, preserves app flows, and switches Russian/Spanish modes", async ({ page }) => {
  await openPrimarySources(page);
  await expect(page.getByTestId("source-list-pane")).toBeVisible();

  await openSourceDocument(page, trafficLawSource);
  await expect(page.getByTestId("source-detail-pane")).toContainText("Точный текст проверен.");
  await expect(page.getByTestId("source-detail-pane")).not.toContainText("Проверка точного текста ожидается.");
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
  const institutionDistanceTrapNote = firstTopic.trapNotes.find(
    (note: { textRu: string }) => note.textRu.includes("5 metros") && note.textRu.includes("10 metros")
  ) as { textRu: string } | undefined;
  if (!institutionDistanceTrapNote) throw new Error("Expected institution distance trap note in topic guide fixture.");
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
  await expect(page.getByText("Опубликованный учебный материал").first()).toBeVisible();
  await expect(page.getByText("Неофициальная учебная поддержка")).toBeVisible();
  await expect(page.getByText("Текущие билеты: неофициальная B-практика, не полная официальная база GCBA")).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(firstTopic.titleRu) })).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(firstTopic.titleRu) }).locator(`[aria-label="${difficultyAria[firstTopic.difficulty]}"]`)).toBeVisible();
  await expect(page.getByRole("heading", { name: firstTopic.titleRu })).toBeVisible();
  await expect(page.locator(".materials-topic-heading").locator(`[aria-label="${difficultyAria[firstTopic.difficulty]}"]`)).toBeVisible();
  await expect(page.getByText(firstTopic.summaryRu)).toBeVisible();
  const summaryImage = page.locator(`[data-learning-unit-id="topic-summary:${firstTopic.id}"]`);
  await expect(summaryImage).toBeVisible();
  await expect(summaryImage.locator("img")).toHaveAttribute("src", /content\/assets\/learning\/generated\/v1\/topic-/);
  await expect(summaryImage.locator("img")).toHaveAttribute("alt", /Учебная схема/);
  await expect(page.getByText(firstTopic.learningMaterialRu[0])).toBeVisible();
  await expect(page.getByText("hospital/centro de salud").first()).toBeVisible();
  await expect(page.getByText("10 metros de cada lado de la entrada").first()).toBeVisible();
  const institutionDistanceTrap = page.locator(".trap-note").filter({ hasText: institutionDistanceTrapNote.textRu }).first();
  await expect(institutionDistanceTrap).toBeVisible();
  await expect(institutionDistanceTrap).toContainText("5 metros");
  await expect(institutionDistanceTrap).toContainText(/похож|выбирайте/);
  await expect(page.getByText("en horas de clase").first()).toBeVisible();
  await expect(page.getByText("oficios/ceremonias").first()).toBeVisible();
  await expect(page.getByText("horario de atención al público").first()).toBeVisible();
  await expect(page.getByText(firstTopic.practicalReasoningRu[0])).toBeVisible();
  const firstTerm = page.locator(".materials-term").filter({ hasText: firstTopic.spanishTerms[0].translationRu });
  await expect(firstTerm.getByTestId("learning-image")).toBeVisible();
  await expect(firstTerm.locator("details.language-pair")).toHaveAttribute("open", "");
  await expect(firstTerm.getByText(firstTopic.spanishTerms[0].termEs, { exact: true })).toBeVisible();
  await expect(firstTerm.locator("[lang='es']").filter({ hasText: firstTopic.spanishTerms[0].termEs })).toBeVisible();
  await firstTerm.locator("summary").focus();
  await expect(firstTerm.locator("summary")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(firstTerm.locator("details.language-pair")).not.toHaveAttribute("open", "");
  await page.keyboard.press("Enter");
  await expect(firstTerm.locator("details.language-pair")).toHaveAttribute("open", "");
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
  const backendLikeRequests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
    if (url.pathname.toLowerCase().endsWith(".pdf")) pdfRequests.push(request.url());
    if (/\/api\/|openai|live-ai|backend|analytics/i.test(url.pathname + url.hostname)) backendLikeRequests.push(request.url());
  });

  await page.goto("/");
  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.getByRole("heading", { name: topicGuide.titleRu })).toBeVisible();
  await expect(page.getByTestId("learning-image").first()).toBeVisible();
  await expect(page.locator("iframe, embed, object")).toHaveCount(0);
  expect(externalRequests).toEqual([]);
  expect(pdfRequests).toEqual([]);
  expect(backendLikeRequests).toEqual([]);
});

test("learning-image manifest coverage matches rendered local material/vocabulary assets", async ({ page }) => {
  const topicUnitCount = topicGuide.topics.reduce((total: number, topic: {
    learningMaterialRu: string[];
    practicalReasoningRu?: string[];
    trapNotes: { textRu: string }[];
    spanishTerms: { termEs: string }[];
  }) => total + 1 + topic.learningMaterialRu.length + (topic.practicalReasoningRu?.length ?? 0) + topic.trapNotes.length + topic.spanishTerms.length, 0);
  const expectedCoverage = topicUnitCount + learningImages.coverage.filter((record: { unitKind: string }) => record.unitKind === "vocabularyTerm").length;
  expect(learningImages.coverage).toHaveLength(expectedCoverage);
  expect(learningImages.images).toHaveLength(expectedCoverage);
  expect(learningImages.coverage.every((record: { status: string }) => record.status === "direct")).toBeTruthy();
  expect(learningImages.images.every((image: { localPath: string }) => image.localPath.startsWith("content/assets/learning/generated/v1/"))).toBeTruthy();

  await page.goto("/");
  await page.getByRole("button", { name: /Словарь/ }).click();
  await expect(page.getByTestId("learning-image")).toHaveCount(10);
  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.getByTestId("learning-image").first()).toBeVisible();
  const imageSrcs = await page.getByTestId("learning-image").locator("img").evaluateAll((images) =>
    images.map((image) => (image as HTMLImageElement).getAttribute("src"))
  );
  expect(imageSrcs.every((src) => src?.startsWith("/content/assets/learning/generated/v1/"))).toBeTruthy();
});

test("modernized learning, vocabulary, and materials layouts avoid horizontal overflow on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await expect(page.getByTestId("question-card")).toBeVisible();
  await page.getByRole("button", { name: /Словарь/ }).click();
  await expect(page.getByTestId("learning-image").first()).toBeVisible();
  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.getByRole("heading", { name: topicGuide.titleRu })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
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
