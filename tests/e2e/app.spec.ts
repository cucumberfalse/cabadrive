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
  await page.goto("/?legacyManual=1");
  await expect(page.getByRole("heading", { name: manualManifest.titleRu })).toBeVisible();
}

async function showCompleteManualList(page: Page) {
  const backButton = page.getByRole("button", { name: /К навигации/ });
  if (await backButton.isVisible()) await backButton.click();
}

async function openCompleteManualPage(page: Page, pageNumber: number) {
  await showCompleteManualList(page);
  const pageAccess = page.getByTestId("manual-page-access");
  if (!(await pageAccess.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await pageAccess.locator("summary").click();
  }
  await page.getByTestId(`manual-page-button-${pageNumber}`).scrollIntoViewIfNeeded();
  await page.getByTestId(`manual-page-button-${pageNumber}`).click();
  await expect(page.getByTestId("manual-page-detail")).toContainText(`${pageNumber} / 200`);
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

async function expectAppendixIVSourceMasks(
  page: Page,
  pageNumber: number,
  samples: Array<{ role: string; x: number; y: number; label: string }>
) {
  await expect(page.getByTestId("manual-page-detail")).toContainText(`${pageNumber} / 200`);
  await expect(page.getByTestId("manual-source-mask").first()).toBeVisible();
  const result = await page.getByTestId("manual-page-canvas").evaluate((canvas, samplePoints) => {
    const canvasRect = canvas.getBoundingClientRect();
    return (samplePoints as Array<{ role: string; x: number; y: number; label: string }>).map((sample) => {
      const point = {
        x: canvasRect.x + sample.x * canvasRect.width,
        y: canvasRect.y + sample.y * canvasRect.height
      };
      const masks = [...canvas.querySelectorAll(".manual-source-mask")].map((mask) => {
        const rect = mask.getBoundingClientRect();
        const style = window.getComputedStyle(mask);
        return {
          id: mask.getAttribute("data-mask-id"),
          role: mask.getAttribute("data-mask-role"),
          geometry: mask.getAttribute("data-source-geometry"),
          background: style.backgroundColor,
          opacity: Number.parseFloat(style.opacity),
          coversPoint: point.x >= rect.x && point.x <= rect.right && point.y >= rect.y && point.y <= rect.bottom
        };
      });
      return {
        ...sample,
        coveringMask: masks.find((mask) => mask.role === sample.role && mask.coversPoint)
      };
    });
  }, samples);

  for (const sample of result) {
    expect(sample.coveringMask, `${sample.label} is covered by a source mask`).toBeTruthy();
    expect(sample.coveringMask?.geometry, `${sample.label} uses source geometry`).toMatch(/^source_page_/);
    expect(sample.coveringMask?.background, `${sample.label} mask uses page-colored fill`).toBe("rgb(255, 253, 248)");
    expect(sample.coveringMask?.opacity, `${sample.label} mask is opaque enough`).toBeGreaterThanOrEqual(0.99);
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

async function assertSourceTocGeometry(page: Page, options: { checkHorizontalOverflow?: boolean } = {}) {
  const problems = await page.locator(".source-toc-list").evaluate((list, checkHorizontalOverflow) => {
    const tolerance = 1;
    const issues: string[] = [];
    const listRect = list.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;

    if (checkHorizontalOverflow && document.documentElement.scrollWidth > viewportWidth + tolerance) {
      issues.push(`document horizontal overflow: ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }

    const visibleButtons = Array.from(list.querySelectorAll("button"))
      .map((button, index) => ({ button, index, rect: button.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width > 0 && rect.height > 0 && rect.bottom > listRect.top + tolerance && rect.top < listRect.bottom - tolerance)
      .sort((a, b) => a.rect.top - b.rect.top || a.index - b.index);

    visibleButtons.forEach(({ button, index, rect }, visibleIndex) => {
      const span = button.querySelector("span");
      const small = button.querySelector("small");
      if (!span || !small) {
        issues.push(`toc button ${index} is missing label or subtitle`);
        return;
      }

      const spanRect = span.getBoundingClientRect();
      const smallRect = small.getBoundingClientRect();
      if (spanRect.bottom > smallRect.top + tolerance) {
        issues.push(`toc button ${index} label overlaps subtitle`);
      }
      for (const [name, childRect] of [
        ["label", spanRect],
        ["subtitle", smallRect]
      ] as const) {
        if (
          childRect.top < rect.top - tolerance ||
          childRect.bottom > rect.bottom + tolerance ||
          childRect.left < rect.left - tolerance ||
          childRect.right > rect.right + tolerance
        ) {
          issues.push(`toc button ${index} ${name} is clipped by the button box`);
        }
      }

      const next = visibleButtons[visibleIndex + 1];
      if (next && next.rect.top < rect.bottom - tolerance) {
        issues.push(`toc button ${index} overlaps following visible button ${next.index}`);
      }
      if (checkHorizontalOverflow && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        issues.push(`toc button ${index} overflows viewport horizontally`);
      }
    });

    return issues;
  }, Boolean(options.checkHorizontalOverflow));

  expect(problems).toEqual([]);
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
  await expectAppendixIVSourceMasks(page, 14, [{ role: "source-heading", x: 0.481, y: 0.39, label: "page 14 Spanish introduction heading" }]);
  await expect(manualImage).toHaveAttribute("src", new RegExp(manualManifest.pages[13].visualAsset.localPath.replace(/\//g, "\\/")));
  await expect(manualImage).toHaveJSProperty("naturalWidth", manualManifest.pages[13].visualAsset.width);
  await expect(manualImage).toHaveJSProperty("naturalHeight", manualManifest.pages[13].visualAsset.height);

  await openCompleteManualPage(page, 24);
  await expectAppendixIVSourceMasks(page, 24, [
    { role: "source-heading", x: 0.481, y: 0.175, label: "page 24 Spanish body heading" },
    { role: "source-body", x: 0.33, y: 0.285, label: "page 24 Spanish body text" }
  ]);

  await openCompleteManualPage(page, 75);
  await expectAppendixIVSourceMasks(page, 75, [{ role: "source-list", x: 0.507, y: 0.36, label: "page 75 Spanish list text" }]);

  await openCompleteManualPage(page, 114);
  await expectAppendixIVSourceMasks(page, 114, [
    { role: "source-list", x: 0.337, y: 0.254, label: "page 114 Spanish list text" },
    { role: "source-footnote", x: 0.68, y: 0.879, label: "page 114 Spanish footnote text" }
  ]);

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
  await expectAppendixIVSourceMasks(page, 185, [
    { role: "source-heading", x: 0.36, y: 0.288, label: "page 185 Spanish category heading" },
    { role: "source-heading", x: 0.36, y: 0.315, label: "page 185 Spanish subheading" },
    { role: "sign-caption", x: 0.36, y: 0.369, label: "page 185 first-row sign captions" },
    { role: "sign-caption", x: 0.58, y: 0.536, label: "page 185 middle sign captions" }
  ]);
  await expect(page.getByTestId("manual-page-russian-layout")).not.toContainText("Reglamentarias");
  await expect(page.getByTestId("manual-page-russian-layout")).not.toContainText("De prohibición");
  await expect(manualImage).toHaveAttribute("src", new RegExp(manualManifest.pages[184].visualAsset.localPath.replace(/\//g, "\\/")));

  await page.getByRole("button", { name: /Следующая/ }).click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("186 / 200");
  await expectAppendixIVSourceMasks(page, 186, [
    { role: "source-heading", x: 0.36, y: 0.288, label: "page 186 Spanish heading" },
    { role: "source-heading", x: 0.36, y: 0.533, label: "page 186 priority heading" },
    { role: "sign-caption", x: 0.46, y: 0.409, label: "page 186 sign captions" }
  ]);

  await showCompleteManualList(page);
  await page.getByTestId("manual-nav-app4-signs-temporary").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("193 / 200");
  await expectAppendixIVSourceMasks(page, 193, [
    { role: "source-heading", x: 0.36, y: 0.288, label: "page 193 Spanish heading" },
    { role: "sign-caption", x: 0.46, y: 0.493, label: "page 193 temporary sign captions" }
  ]);

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
  const transitionPageAccess = page.getByTestId("manual-page-access");
  if (!(await transitionPageAccess.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await transitionPageAccess.locator("summary").click();
  }
  await page.getByTestId("manual-page-button-93").scrollIntoViewIfNeeded();
  await page.getByTestId("manual-page-button-93").click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("93 / 200");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("Сон и усталость");
  await page.getByRole("button", { name: /Следующая/ }).click();
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
  await page.getByTestId("manual-search-input").fill("ch5-gender-violence-prevention");
  await expect(page.getByText("Найдено: 1 страниц")).toBeVisible();
  const genderViolenceSearchResult = page.locator('[data-search-result-id="section-ch5-gender-violence-prevention"]');
  await expect(genderViolenceSearchResult).toBeVisible();
  await expect(genderViolenceSearchResult).toHaveAttribute("data-result-entry-id", "ch5-gender-violence-prevention");
  await expect(genderViolenceSearchResult).toContainText("Профилактика и помощь");
  await genderViolenceSearchResult.click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("100 / 200");
  await expect(page.getByTestId("manual-selected-semantic-label")).toContainText("Профилактика и помощь");
  await expect(page.getByTestId("manual-selected-semantic-label")).not.toContainText("К равноправному обществу");
  await showCompleteManualList(page);
  await page.getByTestId("manual-search-input").fill("");
  await expect(page.getByTestId("manual-nav-ch5-gender-violence-prevention")).toHaveClass(/active/);
  await expect(page.getByTestId("manual-nav-ch5-equal-society")).not.toHaveClass(/active/);

  await showCompleteManualList(page);
  await page.getByTestId("manual-search-input").fill("100");
  await expect(page.getByText("Найдено: 1 страниц")).toBeVisible();
  const equalSocietyPageNumberResult = page.locator('[data-search-result-id="section-ch5-equal-society"]');
  const genderViolencePageNumberResult = page.locator('[data-search-result-id="section-ch5-gender-violence-prevention"]');
  await expect(equalSocietyPageNumberResult).toBeVisible();
  await expect(genderViolencePageNumberResult).toBeVisible();
  await expect(equalSocietyPageNumberResult).toHaveAttribute("data-result-entry-id", "ch5-equal-society");
  await expect(genderViolencePageNumberResult).toHaveAttribute("data-result-entry-id", "ch5-gender-violence-prevention");
  await expect(page.getByTestId("manual-page-button-100")).toHaveCount(2);
  await equalSocietyPageNumberResult.click();
  await expect(page.getByTestId("manual-page-detail")).toContainText("100 / 200");
  const manualSearchPagingControls = page.locator(".manual-actions");
  await expect(manualSearchPagingControls).toContainText("1 / 1");
  await expect(manualSearchPagingControls.getByRole("button", { name: /Предыдущая/ })).toBeDisabled();
  await expect(manualSearchPagingControls.getByRole("button", { name: /Следующая/ })).toBeDisabled();

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

  await page.goto("/?legacyManual=1");
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

test("Pandemia vial prototype opens as a one-section native Russian PDF-faithful composition", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Материалы/ }).click();
  const ordinaryMaterialsBodyTextSize = await page.locator(".material-unit-copy p").first().evaluate((element) =>
    Number.parseFloat(window.getComputedStyle(element).fontSize)
  );
  await page.getByTestId("pandemia-nav-entry").click();
  await expect(page).toHaveURL(/#pandemia-vial$/);

  const prototype = page.getByTestId("pandemia-prototype");
  const pageCanvas = prototype.getByTestId("pandemia-page");
  await expect(prototype).toBeVisible();
  await expect(prototype.getByTestId("pandemia-responsive-prose")).toHaveCount(2);
  await expect(prototype.getByTestId("pandemia-stage-scroll").locator('[data-prose-role="responsive"]')).toHaveCount(0);
  await expect(pageCanvas).toHaveAttribute("data-rendering", "native-html-css-svg");
  await expect(prototype.getByTestId("pandemia-native-layer")).toBeVisible();
  await expect(prototype.getByTestId("pandemia-native-shape")).toHaveCount(12);
  await expect(prototype.getByTestId("pandemia-crop-asset")).toHaveCount(7);
  await expect(prototype.getByTestId("pandemia-svg-icon")).toHaveCount(0);
  await expect(prototype.getByTestId("pandemia-native-region")).toHaveCount(0);
  await expect(pageCanvas.locator('[data-shape-id="corner-motif"]')).toHaveCount(0);
  await expect(pageCanvas.locator('[data-segment-id="page-marker"]')).toHaveCount(0);
  await expect(pageCanvas.locator('[data-segment-id="footnote"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Дорожная пандемия" })).toBeVisible();
  await expect(prototype.getByText(/Дорожное движение - одна из самых сложных систем/)).toBeVisible();
  await expect(prototype.getByTestId("pandemia-segment").filter({ hasText: /В мире/ })).toBeVisible();
  await expect(prototype.getByTestId("pandemia-segment").filter({ hasText: /В городе\s+Буэнос-Айрес/ })).toBeVisible();
  await expect(prototype.getByText(/1,4 МИЛЛИОНА/)).toBeVisible();
  await expect(prototype.getByText(/50 МИЛЛИОНОВ/)).toBeVisible();
  await expect(prototype.getByText(/людей ранены за год/)).toBeVisible();
  await expect(prototype.getByText(/96\s+погибших/)).toBeVisible();
  await expect(prototype.getByText(/48%\s+на мото/)).toBeVisible();
  await expect(prototype.getByText(/34%\s+пешком/)).toBeVisible();
  await expect(prototype.getByText(/11%\s+в авто/)).toBeVisible();
  await expect(prototype.getByText(/8 из 10/)).toBeVisible();
  await expect(prototype.getByText(/49%\s+от 25 до 54 лет/)).toBeVisible();
  await expect(prototype.getByText(/Это показывает: чтобы дороги стали безопаснее/)).toBeVisible();
  await expect(prototype.getByText(/GCBA, OSV/)).toHaveCount(0);
  await expect(prototype.getByText(/Эти данные взяты из статистического отчета/)).toHaveCount(0);
  await expect(prototype.getByText(/Отчет подготовила Обсерватория/)).toHaveCount(0);
  await expect(prototype.getByText(/Больше статистических отчетов/)).toHaveCount(0);
  await expect(prototype.getByText(/observatoriovial/i)).toHaveCount(0);
  await expect(prototype.getByTestId("pandemia-source-mask")).toHaveCount(0);
  await expect(pageCanvas.locator("img")).toHaveCount(7);
  await expect(pageCanvas).not.toHaveAttribute("style", /page-015\.jpg/);
  await expect(prototype.getByTestId("pandemia-zoom-fit")).toHaveCount(0);
  await expect(prototype.getByTestId("pandemia-zoom-actual")).toHaveCount(0);
  await expect(prototype.getByTestId("pandemia-focus-global-context")).toHaveCount(0);
  await expect(prototype.getByTestId("pandemia-focus-city-context")).toHaveCount(0);
  await expect(prototype.getByText("Вписать", { exact: true })).toHaveCount(0);
  await expect(prototype.getByText("100%", { exact: true })).toHaveCount(0);
  await expect(prototype.getByRole("button", { name: /Мировой контекст|Контекст города/ })).toHaveCount(0);
  await expect(prototype.getByTestId("pandemia-provenance")).toHaveCount(0);
  await expect(prototype.getByText("Источник и реконструкция", { exact: true })).toHaveCount(0);

  const cropAssets = await prototype.getByTestId("pandemia-crop-asset").evaluateAll((assets) =>
    assets.map((asset) => {
      const image = asset as HTMLImageElement;
      return {
        id: image.getAttribute("data-asset-id"),
        src: image.currentSrc,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        kind: image.getAttribute("data-asset-kind"),
        cleanupStatus: image.getAttribute("data-cleanup-status")
      };
    })
  );
  for (const asset of cropAssets) {
    expect(asset.src).toContain("/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/sections/pandemia-vial/");
    expect(asset.src).not.toContain("/pages/page-015.jpg");
    expect(asset.src).not.toMatch(/-clean\.svg|icon-people-grid-8m-2f\.svg/);
    expect(asset.src, `${asset.id} uses the accepted source-derived crop`).toMatch(/-source\.png(?:[?#].*)?$/);
    expect(asset.naturalWidth, "visual asset is not a full page raster").toBeLessThan(500);
    expect(asset.naturalHeight, "visual asset is not a full page raster").toBeLessThan(500);
    expect(asset.kind, "accepted artwork uses source-derived crops").toBe("cleaned-source-crop");
    expect(asset.cleanupStatus).toMatch(/no Spanish text|cleaned/i);
  }

  await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);
  await expect(page.getByTestId("manual-page-canvas")).toHaveCount(0);
  await expect(prototype.getByText("Pandemia vial", { exact: true })).toHaveCount(0);
  await expect(prototype.getByText("Contexto Mundial", { exact: true })).toHaveCount(0);

  const stageBox = await prototype.getByTestId("pandemia-stage-scroll").boundingBox();
  const pageBox = await pageCanvas.boundingBox();
  expect(pageBox?.width ?? 0).toBeGreaterThan(0);
  expect(pageBox?.width ?? 0, "desktop uses a content-sized web frame, not a tiny island").toBeGreaterThan(850);
  const pageAspect = (pageBox?.width ?? 1) / (pageBox?.height ?? 1);
  expect(pageAspect, "prototype is reframed away from the full PDF page aspect").toBeGreaterThan(0.68);
  expect(pageAspect, "prototype is not the tall full PDF page canvas").toBeLessThan(0.9);
  const headingBox = await page.getByRole("heading", { name: "Дорожная пандемия" }).boundingBox();
  expect(headingBox?.y ?? 9999, "first viewport starts on meaningful content, not blank PDF whitespace").toBeLessThan((pageBox?.y ?? 0) + 80);
  expect(headingBox?.x ?? 9999, "content is close to the web frame edge, not a centered PDF island").toBeLessThan((pageBox?.x ?? 0) + 90);
  const contentBounds = await pageCanvas.evaluate((article) => {
    const articleRect = article.getBoundingClientRect();
    const elementRects = [
      ...article.querySelectorAll('[data-testid="pandemia-segment"], [data-testid="pandemia-crop-asset"], [data-testid="pandemia-native-shape"]')
    ]
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    const left = Math.min(...elementRects.map((rect) => rect.left)) - articleRect.left;
    const top = Math.min(...elementRects.map((rect) => rect.top)) - articleRect.top;
    const right = articleRect.right - Math.max(...elementRects.map((rect) => rect.right));
    const bottom = articleRect.bottom - Math.max(...elementRects.map((rect) => rect.bottom));
    return {
      leftRatio: left / articleRect.width,
      topRatio: top / articleRect.height,
      rightRatio: right / articleRect.width,
      bottomRatio: bottom / articleRect.height
    };
  });
  expect(contentBounds.leftRatio, "content frame has no huge left PDF margin").toBeLessThan(0.08);
  expect(contentBounds.topRatio, "content frame has no huge top PDF margin").toBeLessThan(0.05);
  expect(contentBounds.rightRatio, "content frame has no huge right PDF margin").toBeLessThan(0.12);
  expect(contentBounds.bottomRatio, "content frame has no huge bottom PDF margin").toBeLessThan(0.08);
  if (testInfo.project.name === "mobile") {
    expect(pageBox?.width ?? 0, "mobile keeps a larger readable fixed-format document").toBeGreaterThan(stageBox?.width ?? 0);
    const scrollLeft = await prototype.getByTestId("pandemia-stage-scroll").evaluate((element) => element.scrollLeft);
    expect(scrollLeft, "mobile starts at the reframed content edge instead of panning across blank PDF margin").toBeLessThan(8);
  }

  await prototype.screenshot({
    path: testInfo.outputPath(`pandemia-vial-${testInfo.project.name}.png`)
  });

  async function requireBox(locator: Locator, label: string) {
    const box = await locator.boundingBox();
    expect(box, `${label} has a rendered box`).not.toBeNull();
    return box!;
  }

  function overlaps(
    first: { x: number; y: number; width: number; height: number },
    second: { x: number; y: number; width: number; height: number }
  ) {
    return (
      first.x < second.x + second.width &&
      first.x + first.width > second.x &&
      first.y < second.y + second.height &&
      first.y + first.height > second.y
    );
  }

  for (const circle of [
    { segment: "motorcyclists", asset: "motorcyclist-icon", shape: "motorcyclists-circle" },
    { segment: "pedestrians", asset: "pedestrian-icon", shape: "pedestrians-circle" },
    { segment: "car-occupants", asset: "car-icon", shape: "car-occupants-circle" }
  ]) {
    const assetLocator = pageCanvas.locator(`[data-asset-id="${circle.asset}"]`);
    await assetLocator.scrollIntoViewIfNeeded();
    const textBox = await requireBox(pageCanvas.locator(`[data-segment-id="${circle.segment}"]`), `${circle.segment} text`);
    const assetBox = await requireBox(assetLocator, `${circle.asset} crop`);
    const shapeBox = await requireBox(pageCanvas.locator(`[data-shape-id="${circle.shape}"]`), `${circle.shape} shape`);

    expect(textBox.y, `${circle.segment} text starts inside circle`).toBeGreaterThanOrEqual(shapeBox.y - 1);
    expect(assetBox.x, `${circle.asset} crop starts inside circle`).toBeGreaterThanOrEqual(shapeBox.x - 1);
    expect(assetBox.x + assetBox.width, `${circle.asset} crop ends inside circle`).toBeLessThanOrEqual(shapeBox.x + shapeBox.width + 1);
    expect(assetBox.y, `${circle.asset} crop starts inside circle`).toBeGreaterThanOrEqual(shapeBox.y - 1);
    expect(assetBox.y + assetBox.height, `${circle.asset} crop stays inside circle`).toBeLessThanOrEqual(shapeBox.y + shapeBox.height + 1);
    expect(textBox.y + textBox.height, `${circle.segment} text stays above icon crop`).toBeLessThanOrEqual(assetBox.y - 4);
    expect(overlaps(textBox, assetBox), `${circle.segment} text does not overlap icon crop`).toBe(false);
    const topElementAssetId = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest("[data-asset-id]")?.getAttribute("data-asset-id"),
      { x: assetBox.x + assetBox.width / 2, y: assetBox.y + assetBox.height / 2 }
    );
    expect(topElementAssetId, `${circle.asset} is not covered by text layers or circle backgrounds`).toBe(circle.asset);
  }

  const peopleGridBox = await requireBox(pageCanvas.locator('[data-asset-id="people-grid-icon"]'), "people grid icon");
  const peopleGridSemantics = await pageCanvas.locator('[data-asset-id="people-grid-icon"]').evaluate((element) => ({
    maleCount: element.getAttribute("data-male-count"),
    femaleCount: element.getAttribute("data-female-count"),
    totalCount: element.getAttribute("data-total-count"),
    maleSignature: element.getAttribute("data-male-signature"),
    femaleSignature: element.getAttribute("data-female-signature"),
    malePictogramsIdentical: element.getAttribute("data-male-pictograms-identical")
  }));
  expect(peopleGridSemantics).toEqual({
    maleCount: "8",
    femaleCount: "2",
    totalCount: "10",
    maleSignature: "source-pdf-male-silhouette",
    femaleSignature: "source-pdf-female-silhouette",
    malePictogramsIdentical: "true"
  });
  const maleVictimsBox = await requireBox(pageCanvas.locator('[data-segment-id="male-victims"]'), "male victims row");
  const maleVictimsPanelBox = await requireBox(pageCanvas.locator('[data-shape-id="male-victims-panel"]'), "male victims gray panel");
  const peoplePairBox = await requireBox(pageCanvas.locator('[data-asset-id="people-pair-icon"]'), "people pair icon");
  const ageRangeBox = await requireBox(pageCanvas.locator('[data-segment-id="age-range"]'), "age range row");
  const ageRangePanelBox = await requireBox(pageCanvas.locator('[data-shape-id="age-range-panel"]'), "age range gray panel");
  const lowerRowTopAlignmentTolerance = 4;
  const lowerRowGapMinimum = 28;
  const lowerRowPanelMaxHeight = 115;
  const lowerTextPaddingMinimum = 6;
  expect(
    Math.abs(peopleGridBox.y - maleVictimsPanelBox.y),
    "8 из 10 gray row starts on the same horizontal as the people-grid icon"
  ).toBeLessThanOrEqual(lowerRowTopAlignmentTolerance);
  expect(
    Math.abs(peoplePairBox.y - ageRangePanelBox.y),
    "49% gray row starts on the same horizontal as the people-pair icon"
  ).toBeLessThanOrEqual(lowerRowTopAlignmentTolerance);
  expect(maleVictimsPanelBox.x - (peopleGridBox.x + peopleGridBox.width), "people-grid icon keeps a source-like white gap before the 8 из 10 gray panel").toBeGreaterThanOrEqual(lowerRowGapMinimum);
  expect(ageRangePanelBox.x - (peoplePairBox.x + peoplePairBox.width), "people-pair icon keeps a source-like white gap before the 49% gray panel").toBeGreaterThanOrEqual(lowerRowGapMinimum);
  expect(maleVictimsPanelBox.height, "8 из 10 gray panel is not vertically oversized").toBeLessThanOrEqual(lowerRowPanelMaxHeight);
  expect(ageRangePanelBox.height, "49% gray panel is not vertically oversized").toBeLessThanOrEqual(lowerRowPanelMaxHeight);
  for (const row of [
    { iconBox: peopleGridBox, textBox: maleVictimsBox, panelBox: maleVictimsPanelBox, label: "male victims text" },
    { iconBox: peoplePairBox, textBox: ageRangeBox, panelBox: ageRangePanelBox, label: "age range text" }
  ]) {
    const rowCenterDelta = Math.abs(row.iconBox.y + row.iconBox.height / 2 - (row.panelBox.y + row.panelBox.height / 2));
    const rowBottomDelta = Math.abs(row.iconBox.y + row.iconBox.height - (row.panelBox.y + row.panelBox.height));
    const panelToIconHeightRatio = row.panelBox.height / row.iconBox.height;
    const lowerPanelEmptySpaceRatio = Math.max(0, row.panelBox.height - row.textBox.height) / row.panelBox.height;
    const lowerTextBottomPadding = row.panelBox.y + row.panelBox.height - (row.textBox.y + row.textBox.height);
    expect(rowCenterDelta, `${row.label} gray panel stays vertically centered with its pictogram row`).toBeLessThanOrEqual(3);
    expect(rowBottomDelta, `${row.label} gray panel bottom aligns with its pictogram row`).toBeLessThanOrEqual(3);
    expect(panelToIconHeightRatio, `${row.label} gray panel height matches the pictogram row`).toBeGreaterThanOrEqual(0.94);
    expect(panelToIconHeightRatio, `${row.label} gray panel height matches the pictogram row`).toBeLessThanOrEqual(1.06);
    expect(row.textBox.x, `${row.label} starts inside the aligned gray panel`).toBeGreaterThanOrEqual(row.panelBox.x - 1);
    expect(row.textBox.y - row.panelBox.y, `${row.label} has source-like top padding inside the gray panel`).toBeGreaterThanOrEqual(lowerTextPaddingMinimum);
    expect(row.textBox.x + row.textBox.width, `${row.label} ends inside the aligned gray panel`).toBeLessThanOrEqual(row.panelBox.x + row.panelBox.width + 1);
    expect(lowerTextBottomPadding, `${row.label} has source-like bottom padding inside the gray panel`).toBeGreaterThanOrEqual(lowerTextPaddingMinimum);
    expect(lowerTextBottomPadding, `${row.label} has no large lower empty area`).toBeLessThanOrEqual(row.panelBox.height * 0.24);
    expect(lowerPanelEmptySpaceRatio, `${row.label} gray panel remains compact around the text`).toBeLessThanOrEqual(0.32);
  }
  const airplaneStripBox = await requireBox(pageCanvas.locator('[data-shape-id="airplane-strip-panel"]'), "airplane blue strip");
  const airplaneCapBox = await requireBox(pageCanvas.locator('[data-shape-id="airplane-strip-cap"]'), "airplane localized blue cap");
  const airplanePanelBox = await requireBox(pageCanvas.locator('[data-shape-id="airplane-card-panel"]'), "airplane gray card");
  const airplaneIconBox = await requireBox(pageCanvas.locator('[data-asset-id="airplane-icon"]'), "airplane icon");
  const airplaneCardTextBox = await requireBox(pageCanvas.locator('[data-segment-id="airplane-card"]'), "airplane card text");
  const stadiumStripBox = await requireBox(pageCanvas.locator('[data-shape-id="stadium-strip-panel"]'), "stadium blue strip");
  const stadiumCapBox = await requireBox(pageCanvas.locator('[data-shape-id="stadium-strip-cap"]'), "stadium localized blue cap");
  const stadiumPanelBox = await requireBox(pageCanvas.locator('[data-shape-id="stadium-card-panel"]'), "stadium gray card");
  const stadiumIconBox = await requireBox(pageCanvas.locator('[data-asset-id="stadium-icon"]'), "stadium icon");
  const stadiumCardTextBox = await requireBox(pageCanvas.locator('[data-segment-id="stadium-card"]'), "stadium card text");
  const blueStripCornerRadii = await pageCanvas.locator('[data-shape-id$="-strip-panel"]').evaluateAll((elements) =>
    elements.map((element) => {
      const style = window.getComputedStyle(element);
      return {
        id: element.getAttribute("data-shape-id"),
        topLeft: style.borderTopLeftRadius,
        topRight: style.borderTopRightRadius,
        bottomLeft: style.borderBottomLeftRadius,
        bottomRight: style.borderBottomRightRadius
      };
    })
  );
  const globalCardTextPaddingMinimum = 4;
  const globalCardHeightAlignmentTolerance = 2;
  const globalCardBottomAlignmentTolerance = 2;
  expect(Math.abs(airplanePanelBox.height - stadiumPanelBox.height), "airplane and stadium gray panels use matching source-like height").toBeLessThanOrEqual(globalCardHeightAlignmentTolerance);
  expect(
    Math.abs(airplanePanelBox.y + airplanePanelBox.height - (stadiumPanelBox.y + stadiumPanelBox.height)),
    "airplane and stadium gray panel bottoms align on the same baseline grid"
  ).toBeLessThanOrEqual(globalCardBottomAlignmentTolerance);
  for (const radius of blueStripCornerRadii) {
    expect(radius.topLeft, `${radius.id} keeps a flat rectangular top-left corner`).toBe("0px");
    expect(radius.topRight, `${radius.id} keeps a flat rectangular top-right corner`).toBe("0px");
    expect(radius.bottomLeft, `${radius.id} keeps a flat rectangular bottom-left corner`).toBe("0px");
    expect(radius.bottomRight, `${radius.id} keeps a flat rectangular bottom-right corner`).toBe("0px");
  }
  for (const card of [
    { panelBox: airplanePanelBox, textBox: airplaneCardTextBox, stripBox: airplaneStripBox, capBox: airplaneCapBox, iconBox: airplaneIconBox, label: "airplane" },
    { panelBox: stadiumPanelBox, textBox: stadiumCardTextBox, stripBox: stadiumStripBox, capBox: stadiumCapBox, iconBox: stadiumIconBox, label: "stadium" }
  ]) {
    const topPadding = card.textBox.y - card.panelBox.y;
    const bottomPadding = card.panelBox.y + card.panelBox.height - (card.textBox.y + card.textBox.height);
    const emptySpaceRatio = Math.max(0, card.panelBox.height - card.textBox.height) / card.panelBox.height;
    const panelCenterOffset = Math.abs(card.textBox.y + card.textBox.height / 2 - (card.panelBox.y + card.panelBox.height / 2));
    expect(card.panelBox.height, `${card.label} gray card is not vertically oversized`).toBeLessThanOrEqual(110);
    expect(topPadding, `${card.label} card text keeps source-like top padding`).toBeGreaterThanOrEqual(globalCardTextPaddingMinimum);
    expect(bottomPadding, `${card.label} card text keeps source-like bottom padding`).toBeGreaterThanOrEqual(globalCardTextPaddingMinimum);
    expect(bottomPadding, `${card.label} card has no large lower empty area`).toBeLessThanOrEqual(card.panelBox.height * 0.26);
    expect(emptySpaceRatio, `${card.label} gray card density stays close to the source`).toBeLessThanOrEqual(0.38);
    expect(panelCenterOffset, `${card.label} text remains vertically balanced in the gray card`).toBeLessThanOrEqual(card.panelBox.height * 0.12);
    expect(card.stripBox.y + card.stripBox.height, `${card.label} blue strip touches the gray card`).toBeGreaterThanOrEqual(card.panelBox.y - 1);
    expect(card.stripBox.y + card.stripBox.height, `${card.label} blue strip does not drift past the gray card seam`).toBeLessThanOrEqual(card.panelBox.y + 2);
    expect(card.capBox.width, `${card.label} cap is localized, not a full-width rounded strip`).toBeLessThanOrEqual(card.stripBox.width * 0.55);
    expect(card.capBox.x, `${card.label} cap starts inside the flat strip width`).toBeGreaterThan(card.stripBox.x);
    expect(card.capBox.x + card.capBox.width, `${card.label} cap ends inside the flat strip width`).toBeLessThan(card.stripBox.x + card.stripBox.width);
    expect(Math.abs((card.capBox.x + card.capBox.width / 2) - (card.iconBox.x + card.iconBox.width / 2)), `${card.label} cap is centered under the source icon`).toBeLessThanOrEqual(card.iconBox.width * 0.25);
    expect(card.capBox.y, `${card.label} cap rises above the flat strip`).toBeLessThan(card.stripBox.y);
    expect(card.capBox.y + card.capBox.height, `${card.label} localized cap merges into the flat strip without a white seam`).toBeGreaterThanOrEqual(card.stripBox.y + card.stripBox.height - 1);
    expect(card.capBox.y + card.capBox.height, `${card.label} localized cap remains aligned with the strip bottom instead of becoming a separate dome`).toBeLessThanOrEqual(card.stripBox.y + card.stripBox.height + 1);
    expect(card.iconBox.y + card.iconBox.height, `${card.label} icon visually links into the localized cap`).toBeGreaterThanOrEqual(card.capBox.y + 1);
    expect(card.iconBox.y, `${card.label} icon remains visibly above the localized strip cap`).toBeLessThan(card.capBox.y);
  }
  for (const shapeId of ["motorcyclists-circle", "pedestrians-circle", "car-occupants-circle"]) {
    const shapeBox = await requireBox(pageCanvas.locator(`[data-shape-id="${shapeId}"]`), `${shapeId} shape`);
    expect(shapeBox.y + shapeBox.height, `${shapeId} leaves vertical gap before people-grid icon`).toBeLessThanOrEqual(peopleGridBox.y - 8);
    expect(shapeBox.y + shapeBox.height, `${shapeId} leaves vertical gap before male-victims row`).toBeLessThanOrEqual(maleVictimsBox.y - 8);
    expect(overlaps(shapeBox, peopleGridBox), `${shapeId} does not overlap people-grid icon`).toBe(false);
    expect(overlaps(shapeBox, maleVictimsBox), `${shapeId} does not overlap male-victims row`).toBe(false);
  }

  const readableSizes = await prototype.getByTestId("pandemia-segment").evaluateAll((elements) =>
    elements.map((element) => {
      const style = window.getComputedStyle(element);
      return {
        id: element.getAttribute("data-segment-id"),
        role: element.getAttribute("data-segment-role"),
        fontSize: Number.parseFloat(style.fontSize),
        whiteSpace: style.whiteSpace,
        textContent: element.textContent,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        pointerEvents: style.pointerEvents,
        userSelect: style.userSelect
      };
    })
  );
  for (const size of readableSizes) {
    const minimum = Math.max(14, ordinaryMaterialsBodyTextSize * 0.875);
    expect(size.fontSize, `${size.id} remains comparable to ordinary study-material text`).toBeGreaterThanOrEqual(minimum);
    expect(size.scrollWidth, `${size.id} does not overflow horizontally`).toBeLessThanOrEqual(size.clientWidth + 2);
    expect(size.scrollHeight, `${size.id} does not overflow vertically`).toBeLessThanOrEqual(size.clientHeight + 4);
    expect(size.pointerEvents, `${size.id} remains selectable/copyable DOM text`).not.toBe("none");
    expect(size.userSelect, `${size.id} does not disable text selection`).not.toBe("none");
  }
  for (const paragraph of readableSizes.filter((size) => size.role === "intro" || size.role === "body")) {
    expect(paragraph.fontSize, `${paragraph.id} matches ordinary Materials body text`).toBeGreaterThanOrEqual(ordinaryMaterialsBodyTextSize - 0.5);
    expect(paragraph.fontSize, `${paragraph.id} does not become oversized relative to Materials body text`).toBeLessThanOrEqual(ordinaryMaterialsBodyTextSize + 2);
    expect(paragraph.whiteSpace, `${paragraph.id} uses adaptive paragraph wrapping`).toBe("normal");
    expect(paragraph.textContent, `${paragraph.id} has no forced PDF-style line breaks`).not.toMatch(/\n/);
  }

  const typographyMetrics = await prototype.getByTestId("pandemia-segment").evaluateAll((elements) =>
    elements.map((element) => {
      const style = window.getComputedStyle(element);
      const fontSize = Number.parseFloat(style.fontSize);
      const firstLine = window.getComputedStyle(element, "::first-line");
      return {
        id: element.getAttribute("data-segment-id"),
        role: element.getAttribute("data-segment-role"),
        fontFamily: style.fontFamily,
        fontWeight: Number.parseFloat(style.fontWeight),
        lineHeight: Number.parseFloat(style.lineHeight),
        lineHeightRatio: Number.parseFloat(style.lineHeight) / fontSize,
        letterSpacing: style.letterSpacing,
        firstLineFontWeight: Number.parseFloat(firstLine.fontWeight),
        firstLineFontFamily: firstLine.fontFamily
      };
    })
  );
  const headingNoWrapMetrics = await page.getByRole("heading", { name: "Дорожная пандемия" }).evaluate((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      height: rect.height,
      lineHeight: Number.parseFloat(style.lineHeight),
      maxWidth: style.maxWidth,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth
    };
  });
  expect(headingNoWrapMetrics.maxWidth, "heading does not keep the rejected forced 16ch/narrow max-width").not.toMatch(/ch$/);
  if (testInfo.project.name !== "mobile") {
    expect(headingNoWrapMetrics.height, "desktop heading stays on one line at normal in-app width").toBeLessThanOrEqual(headingNoWrapMetrics.lineHeight * 1.35);
  }
  expect(headingNoWrapMetrics.scrollWidth, "heading is not clipped after removing forced wrap").toBeLessThanOrEqual(headingNoWrapMetrics.clientWidth + 2);
  for (const metrics of typographyMetrics) {
    expect(metrics.fontFamily, `${metrics.id} uses the readable modern UI Pandemia stack`).toMatch(/system-ui|-apple-system|BlinkMacSystemFont|Segoe UI|Roboto|Noto Sans|Helvetica Neue|Arial/i);
    expect(metrics.fontFamily, `${metrics.id} does not use the rejected SF rounded stack`).not.toMatch(/^"?SFNSRounded|^"?SF Compact Rounded|^"?SF Pro Rounded|Arial Rounded/i);
    expect(metrics.fontFamily, `${metrics.id} does not use Avenir as the primary stack`).not.toMatch(/^"?Avenir/i);
    expect(metrics.fontFamily, `${metrics.id} does not use app Inter as the Pandemia primary stack`).not.toMatch(/Inter/i);
    expect(metrics.letterSpacing, `${metrics.id} keeps non-negative readable letter spacing`).not.toMatch(/^-/);
  }
  const headingTypography = typographyMetrics.find((metrics) => metrics.id === "heading");
  const introTypography = typographyMetrics.find((metrics) => metrics.id === "intro");
  const bodyTypography = typographyMetrics.find((metrics) => metrics.id === "body");
  const infographicTypography = typographyMetrics.filter((metrics) =>
    ["context-label", "stat-strip", "stat-card", "city-stat"].includes(metrics.role ?? "")
  );
  expect(headingTypography?.fontWeight, "heading uses a readable strong UI weight").toBeGreaterThanOrEqual(680);
  expect(headingTypography?.fontWeight, "heading avoids an over-heavy decorative weight").toBeLessThanOrEqual(760);
  expect(headingTypography?.lineHeightRatio, "heading keeps compact readable line height").toBeGreaterThanOrEqual(1.02);
  expect(headingTypography?.lineHeightRatio, "heading keeps compact readable line height").toBeLessThanOrEqual(1.16);
  for (const metrics of [introTypography, bodyTypography]) {
    expect(metrics?.fontWeight, `${metrics?.id} uses a normal readable UI body weight`).toBeGreaterThanOrEqual(390);
    expect(metrics?.fontWeight, `${metrics?.id} uses a normal readable UI body weight`).toBeLessThanOrEqual(430);
    expect(metrics?.lineHeightRatio, `${metrics?.id} uses comfortable paragraph rhythm`).toBeGreaterThanOrEqual(1.55);
    expect(metrics?.lineHeightRatio, `${metrics?.id} uses looser paragraph rhythm`).toBeLessThanOrEqual(1.75);
  }
  expect(infographicTypography.length, "infographic text roles are included in computed typography evidence").toBeGreaterThanOrEqual(8);
  for (const metrics of infographicTypography) {
    expect(metrics.fontWeight, `${metrics.id} infographic label/statistic uses readable strong UI weight`).toBeGreaterThanOrEqual(680);
    expect(metrics.fontWeight, `${metrics.id} infographic label/statistic avoids an ultra-heavy decorative weight`).toBeLessThanOrEqual(760);
    expect(metrics.lineHeight, `${metrics.id} records a concrete infographic line-height`).toBeGreaterThan(0);
  }
  const contextTypography = typographyMetrics.filter((metrics) => metrics.role === "context-label");
  expect(contextTypography.map((metrics) => metrics.id).sort()).toEqual(["city-label", "global-label"]);
  expect(new Set(contextTypography.map((metrics) => metrics.fontWeight)).size).toBe(1);
  for (const metrics of contextTypography) {
    expect(metrics.firstLineFontWeight, `${metrics.id} has no partial context-label first-line weight override`).toBe(metrics.fontWeight);
    expect(metrics.firstLineFontFamily, `${metrics.id} has no partial context-label first-line font override`).toBe(metrics.fontFamily);
  }

  const selectedProseText = await prototype.evaluate((root) => {
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    const intro = root.querySelector('[data-segment-id="intro"]');
    const body = root.querySelector('[data-segment-id="body"]');
    if (!intro || !body || !selection) return "";
    range.setStartBefore(intro);
    range.setEndAfter(body);
    selection.addRange(range);
    const selected = selection.toString();
    selection.removeAllRanges();
    return selected;
  });
  expect(selectedProseText, "intro/body prose can be selected as real DOM text").toContain("Дорожное движение - одна из самых сложных систем");
  expect(selectedProseText, "bottom conclusion can be selected as real DOM text").toContain("Это показывает: чтобы дороги стали безопаснее");

  async function expectResponsiveProseFitsViewport(label: string) {
    const problems = await prototype.evaluate((root) => {
      const tolerance = 2;
      const viewportWidth = document.documentElement.clientWidth;
      const issues: string[] = [];
      if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
        issues.push(`document requires horizontal scroll: ${document.documentElement.scrollWidth} > ${viewportWidth}`);
      }
      const stage = root.querySelector('[data-testid="pandemia-stage-scroll"]');
      for (const element of Array.from(root.querySelectorAll('[data-prose-role="responsive"]'))) {
        const segmentId = element.getAttribute("data-segment-id") ?? "unknown";
        const role = element.getAttribute("data-segment-role") ?? "unknown";
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        if (stage?.contains(element)) issues.push(`${segmentId} prose is inside the horizontal-scroll stage`);
        if (style.position === "absolute" || style.position === "fixed") issues.push(`${segmentId} prose is pinned instead of responsive flow`);
        if (rect.left < -tolerance || rect.right > viewportWidth + tolerance) {
          issues.push(`${segmentId} prose overflows viewport horizontally: ${rect.left}..${rect.right} of ${viewportWidth}`);
        }
        if (element.scrollWidth > element.clientWidth + tolerance) {
          issues.push(`${segmentId} prose content is clipped horizontally: ${element.scrollWidth} > ${element.clientWidth}`);
        }
        if ((role === "intro" || role === "body") && style.whiteSpace !== "normal") {
          issues.push(`${segmentId} prose does not use normal wrapping: ${style.whiteSpace}`);
        }
      }
      return issues;
    });
    expect(problems, label).toEqual([]);
  }

  await expectResponsiveProseFitsViewport(`${testInfo.project.name} responsive prose`);
  if (testInfo.project.name === "chromium") {
    await page.setViewportSize({ width: 760, height: 900 });
    await expectResponsiveProseFitsViewport("narrow in-app viewport responsive prose");
    await prototype.screenshot({
      path: testInfo.outputPath("pandemia-vial-narrow.png")
    });
  }

  await expect(prototype.getByTestId("pandemia-focus-frame")).toHaveCount(0);
  await expect(prototype.getByTestId("pandemia-focus-note")).toHaveCount(0);
});

test("Introduction index routes open as separate native Russian document pages", async ({ page }, testInfo) => {
  async function requireBox(locator: Locator, label: string) {
    const box = await locator.boundingBox();
    expect(box, `${label} has a rendered box`).not.toBeNull();
    return box!;
  }

  function isInside(
    inner: { x: number; y: number; width: number; height: number },
    outer: { x: number; y: number; width: number; height: number },
    padding: number
  ) {
    return (
      inner.x >= outer.x + padding &&
      inner.y >= outer.y + padding &&
      inner.x + inner.width <= outer.x + outer.width - padding &&
      inner.y + inner.height <= outer.y + outer.height - padding
    );
  }

  const introRoutes = [
    {
      id: "intro-road-pandemic",
      hash: "#pandemia-vial",
      title: "Дорожная пандемия",
      sample: /Дорожное движение - одна из самых сложных систем/,
      forbiddenSpanish: [/Pandemia vial/, /Contexto Mundial/]
    },
    {
      id: "intro-ethical-civic-approach",
      hash: "#intro-enfoque-etico",
      title: "Этико-гражданский подход в дорожной культуре",
      sample: /В CABA действует Закон 2148/,
      forbiddenSpanish: [/Enfoque/, /En CABA rige/]
    },
    {
      id: "intro-incident",
      hash: "#intro-accidente-incidente",
      title: "Авария или дорожный инцидент?",
      sample: /Если этого можно избежать, это не авария/,
      forbiddenSpanish: [/Accidente/, /Factores de Riesgo/, /Recomendaciones/]
    },
    {
      id: "intro-road-safety-plan",
      hash: "#intro-plan-seguridad-vial",
      title: "План дорожной безопасности города Буэнос-Айрес",
      sample: /Vision Zero/,
      forbiddenSpanish: [/Plan de seguridad vial/, /Objetivos/, /Ejes de trabajo/, /El tránsito es un sistema/]
    }
  ];

  for (const route of introRoutes) {
    await page.goto(`/${route.hash}`);
    await expect(page).toHaveURL(new RegExp(`${route.hash.replace("#", "#")}$`));
    const reader = page.getByTestId("introduction-reader");
    await expect(reader).toBeVisible();
    await expect(page.getByRole("button", { name: /^Руководство$/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Руководство 4R/ })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^Введение$/ })).toHaveCount(0);
    await expect(reader.getByTestId("manual-guide-shell")).toBeVisible();
    await expect(reader.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-group-id", "introduction");
    await expect(reader.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-child-id", route.id);
    await expect(reader.getByTestId("manual-guide-nav")).toContainText("Предисловие");
    await expect(reader.getByTestId("manual-guide-nav")).toContainText("Глава 1. К устойчивой мобильности");
    await expect(reader.getByTestId("manual-guide-nav")).toContainText("Приложение IV. Дорожные знаки и сигналы");
    await expect(reader.getByTestId("manual-guide-pending-section-front-presentation")).toHaveAttribute("data-status", "implemented");
    await expect(reader.getByTestId("manual-guide-pending-section-front-glossary")).toHaveAttribute("data-status", "implemented");
    await expect(reader.locator('[data-testid="intro-index-nav"]')).toHaveCount(0);
    const activeIntroRoute = page.getByTestId(`intro-route-${route.id}`);
    const activeRouteItem = reader.getByTestId(`manual-guide-route-item-${route.id}`);
    await expect(activeRouteItem).toHaveAttribute("role", "listitem");
    await expect(activeRouteItem.getByRole("button", { name: route.title, exact: true })).toBeVisible();
    await expect(activeIntroRoute).not.toHaveAttribute("role", "listitem");
    await expect(activeIntroRoute).toHaveClass(/active/);
    await expect(activeIntroRoute).toHaveAttribute("aria-current", "page");
    await expect(activeIntroRoute).toHaveAttribute("aria-label", route.title);
    await expect(reader.locator('[data-guide-entry-id="introduction"] .manual-guide-children button.active')).toHaveCount(1);
    await expect(reader.locator('[data-guide-entry-id="introduction"] .manual-guide-children button[aria-current="page"]')).toHaveCount(1);
    await expect(reader.locator('button[role="listitem"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: route.title })).toBeVisible();
    await expect(reader).toContainText(route.sample);
    await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);
    await expect(page.getByTestId("manual-page-canvas")).toHaveCount(0);
    await expect(reader.locator("iframe, object, embed")).toHaveCount(0);
    await expect(reader.locator('[data-testid="manual-source-mask"], [data-testid="pandemia-source-mask"]')).toHaveCount(0);
    for (const forbidden of route.forbiddenSpanish) {
      await expect(reader.getByText(forbidden)).toHaveCount(0);
    }

    const issues = await reader.evaluate((root) => {
      const tolerance = 2;
      const viewportWidth = document.documentElement.clientWidth;
      const problems: string[] = [];
      if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
        problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
      }
      for (const element of Array.from(root.querySelectorAll('[data-testid="intro-article-block"], [data-testid="pandemia-segment"][data-prose-role="responsive"]'))) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const id = element.getAttribute("data-block-id") ?? element.getAttribute("data-segment-id") ?? "unknown";
        if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
          problems.push(`${id} overflows viewport horizontally`);
        }
        if (style.pointerEvents === "none") problems.push(`${id} disables pointer interaction`);
        if (style.userSelect === "none") problems.push(`${id} disables text selection`);
        if (style.whiteSpace === "pre" || style.whiteSpace === "pre-line") {
          const kind = element.getAttribute("data-block-kind");
          const role = element.getAttribute("data-segment-role");
          if (kind === "paragraph" || kind === "lead" || role === "intro" || role === "body") problems.push(`${id} forces PDF-style line breaks`);
        }
      }
      return problems;
    });
    expect(issues).toEqual([]);

    if (route.id === "intro-road-safety-plan") {
      const photo = reader.getByTestId("intro-photo-crop");
      await expect(photo).toBeVisible();
      await expect(photo).toHaveAttribute("src", /sections\/intro-road-safety-plan\/child-seat-photo-source\.jpg/);
      await expect(photo).toHaveAttribute("data-cleanup-status", /excludes the Spanish quote/);
      await expect(reader).toContainText("Дорожное движение - это система, которую строят все граждане");
    }

    if (route.id === "intro-incident") {
      await expect(reader.getByTestId("intro-source-artwork")).toHaveCount(3);
      await expect(reader.locator('[data-artwork-id="recommendation-clipboard"]')).toHaveCount(0);
      await expect(reader.locator(".intro-recommendation-icon")).toHaveCount(0);
      for (const assetId of ["risk-ambiental", "risk-vehicular", "risk-humano"]) {
        const artwork = reader.locator(`[data-artwork-id="${assetId}"]`);
        await expect(artwork).toBeVisible();
        await expect(artwork).toHaveAttribute("data-source-page", "17");
        await expect(artwork).toHaveAttribute("data-visible-spanish", "false");
        await expect(artwork).toHaveAttribute("data-fidelity-role", /page 17/);
        const box = await artwork.boundingBox();
        const maxRenderedComponentSize = 180;
        expect(box?.width ?? 0, `${assetId} remains bounded source component art, not a full page raster`).toBeLessThan(
          maxRenderedComponentSize
        );
        expect(box?.height ?? 0, `${assetId} remains bounded source component art, not a full page raster`).toBeLessThan(
          maxRenderedComponentSize
        );
      }
      const riskCards = reader.locator(".intro-risk-card");
      await expect(riskCards).toHaveCount(3);
      for (const riskId of ["ambiental", "vehicular", "humano"]) {
        const card = reader.locator(`.intro-risk-card[data-risk-id="${riskId}"]`);
        const lobe = card.locator(".intro-risk-lobe");
        const symbol = card.locator(".intro-risk-symbol");
        const cardBox = await requireBox(card, `${riskId} risk card`);
        const lobeBox = await requireBox(lobe, `${riskId} circular lobe`);
        const symbolBox = await requireBox(symbol, `${riskId} source pictogram`);
        const riskTitleBox = await requireBox(card.locator("h4"), `${riskId} risk title`);
        const riskTextBox = await requireBox(card.locator("p"), `${riskId} risk text`);
        const lobeStyles = await lobe.evaluate((element) => {
          const style = window.getComputedStyle(element);
          return {
            borderRadius: style.borderRadius,
            overflow: style.overflow,
            backgroundColor: style.backgroundColor
          };
        });
        const symbolStyles = await symbol.evaluate((element) => {
          const style = window.getComputedStyle(element);
          return {
            objectFit: style.objectFit,
            mixBlendMode: style.mixBlendMode
          };
        });
        const naturalSymbolBounds = await symbol.evaluate(async (element) => {
          const image = element as HTMLImageElement;
          if (!image.complete) {
            await image.decode();
          }
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext("2d");
          if (!context) {
            throw new Error("Canvas context unavailable for page 17 risk pictogram bounds check");
          }
          context.drawImage(image, 0, 0);
          const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let minX = canvas.width;
          let minY = canvas.height;
          let maxX = -1;
          let maxY = -1;
          for (let y = 0; y < canvas.height; y += 1) {
            for (let x = 0; x < canvas.width; x += 1) {
              const alpha = data[(y * canvas.width + x) * 4 + 3];
              if (alpha <= 8) continue;
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
          return {
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            marginLeft: minX,
            marginTop: minY,
            marginRight: canvas.width - 1 - maxX,
            marginBottom: canvas.height - 1 - maxY,
            contentWidth: maxX - minX + 1,
            contentHeight: maxY - minY + 1
          };
        });
        const panelGeometry = await card.evaluate((element) => {
          const cardRect = element.getBoundingClientRect();
          const lobeRect = element.querySelector(".intro-risk-lobe")!.getBoundingClientRect();
          const before = window.getComputedStyle(element, "::before");
          const cardStyle = window.getComputedStyle(element);
          const toPixels = (value: string) => {
            const parsed = Number.parseFloat(value);
            return Number.isFinite(parsed) ? parsed : 0;
          };
          const panelTopOffset = toPixels(before.top);
          const panelLeftOffset = toPixels(before.left);
          const panelHeight = toPixels(before.height);
          return {
            cardBackground: cardStyle.backgroundColor,
            panelBackground: before.backgroundColor,
            panelContent: before.content,
            panelBorderRadius: before.borderRadius,
            panel: {
              x: cardRect.x + panelLeftOffset,
              y: cardRect.y + panelTopOffset,
              height: panelHeight,
              right: cardRect.x + cardRect.width
            },
            lobe: {
              x: lobeRect.x,
              y: lobeRect.y,
              width: lobeRect.width,
              height: lobeRect.height
            }
          };
        });
        expect(Math.abs(lobeBox.width - lobeBox.height), `${riskId} lobe is circular`).toBeLessThanOrEqual(1);
        expect(lobeBox.width, `${riskId} circular lobe rejects the previous too-small/compressed risk row`).toBeGreaterThanOrEqual(110);
        expect(lobeBox.x, `${riskId} lobe is integrated into the left edge, not a square crop box`).toBeLessThan(cardBox.x + 4);
        expect(lobeBox.x + lobeBox.width, `${riskId} lobe overlaps the long rounded panel`).toBeGreaterThan(cardBox.x + 28);
        expect(panelGeometry.cardBackground, `${riskId} card container itself is transparent so no full-height rectangle protrudes`).toBe("rgba(0, 0, 0, 0)");
        expect(panelGeometry.panelContent, `${riskId} right panel is drawn by the tested pseudo-element`).not.toBe("none");
        expect(panelGeometry.panel.height, `${riskId} right rectangle rejects the previous too-short compressed panel`).toBeGreaterThanOrEqual(92);
        expect(panelGeometry.panel.height, `${riskId} right rectangle stays lower than the circular lobe`).toBeLessThan(panelGeometry.lobe.height - 2);
        expect(panelGeometry.panel.y, `${riskId} rectangle top sits inside the circle, hiding square seam corners`).toBeGreaterThan(panelGeometry.lobe.y + 2);
        expect(
          panelGeometry.panel.y + panelGeometry.panel.height,
          `${riskId} rectangle bottom sits inside the circle, hiding square seam corners`
        ).toBeLessThan(panelGeometry.lobe.y + panelGeometry.lobe.height - 2);
        expect(panelGeometry.panel.x, `${riskId} rectangle enters the circle instead of starting after it`).toBeGreaterThan(panelGeometry.lobe.x + panelGeometry.lobe.width * 0.5);
        expect(panelGeometry.panel.x, `${riskId} circle overlaps the rectangle seam enough to mask square corners`).toBeLessThan(
          panelGeometry.lobe.x + panelGeometry.lobe.width - 12
        );
        expect(panelGeometry.panelBorderRadius, `${riskId} right panel keeps only a soft right-side corner`).toMatch(/5px|4px/);
        const riskTextTop = Math.min(riskTitleBox.y, riskTextBox.y);
        const riskTextBottom = Math.max(riskTitleBox.y + riskTitleBox.height, riskTextBox.y + riskTextBox.height);
        expect(riskTextTop - panelGeometry.panel.y, `${riskId} text keeps source-like top padding inside the panel`).toBeGreaterThanOrEqual(7.5);
        expect(
          panelGeometry.panel.y + panelGeometry.panel.height - riskTextBottom,
          `${riskId} text keeps source-like bottom padding inside the panel`
        ).toBeGreaterThanOrEqual(7.5);
        expect(isInside(symbolBox, lobeBox, 2), `${riskId} pictogram is fully inside the circular lobe with padding`).toBe(true);
        expect(lobeStyles.borderRadius, `${riskId} lobe uses circular geometry`).toMatch(/999px|50%/);
        expect(lobeStyles.overflow, `${riskId} lobe does not hard-crop the source icon`).not.toBe("hidden");
        expect(symbolStyles.objectFit, `${riskId} source pictogram is contained, not force-cropped`).toBe("contain");
        expect(symbolStyles.mixBlendMode, `${riskId} source crop blends away any square bitmap background`).toBe("multiply");
        expect(naturalSymbolBounds.naturalWidth, `${riskId} source pictogram PNG rejects the old tight natural crop width`).toBeGreaterThanOrEqual(256);
        expect(naturalSymbolBounds.naturalHeight, `${riskId} source pictogram PNG rejects the old tight natural crop height`).toBeGreaterThanOrEqual(256);
        expect(naturalSymbolBounds.naturalWidth / symbolBox.width, `${riskId} source pictogram is never browser-upscaled`).toBeGreaterThanOrEqual(2);
        expect(naturalSymbolBounds.naturalHeight / symbolBox.height, `${riskId} source pictogram is never browser-upscaled`).toBeGreaterThanOrEqual(2);
        for (const [edge, margin] of Object.entries({
          left: naturalSymbolBounds.marginLeft,
          top: naturalSymbolBounds.marginTop,
          right: naturalSymbolBounds.marginRight,
          bottom: naturalSymbolBounds.marginBottom
        })) {
          expect(margin, `${riskId} source pictogram has transparent ${edge} padding and is not clipped by the PNG bounds`).toBeGreaterThanOrEqual(10);
        }
        const renderedAlphaBox = {
          x: symbolBox.x + (naturalSymbolBounds.marginLeft / naturalSymbolBounds.naturalWidth) * symbolBox.width,
          y: symbolBox.y + (naturalSymbolBounds.marginTop / naturalSymbolBounds.naturalHeight) * symbolBox.height,
          width: (naturalSymbolBounds.contentWidth / naturalSymbolBounds.naturalWidth) * symbolBox.width,
          height: (naturalSymbolBounds.contentHeight / naturalSymbolBounds.naturalHeight) * symbolBox.height
        };
        const lobeCenter = { x: lobeBox.x + lobeBox.width / 2, y: lobeBox.y + lobeBox.height / 2 };
        const iconCenter = { x: renderedAlphaBox.x + renderedAlphaBox.width / 2, y: renderedAlphaBox.y + renderedAlphaBox.height / 2 };
        expect(Math.abs(iconCenter.x - lobeCenter.x), `${riskId} visible pictogram is centered in the circular lobe`).toBeLessThanOrEqual(
          lobeBox.width * 0.08
        );
        expect(Math.abs(iconCenter.y - lobeCenter.y), `${riskId} visible pictogram is vertically centered in the circular lobe`).toBeLessThanOrEqual(
          lobeBox.height * 0.08
        );
        expect(
          Math.max(renderedAlphaBox.width, renderedAlphaBox.height) / lobeBox.width,
          `${riskId} visible pictogram occupies a source-like fraction of the circle`
        ).toBeGreaterThanOrEqual(0.72);
        expect(
          Math.max(renderedAlphaBox.width, renderedAlphaBox.height) / lobeBox.width,
          `${riskId} visible pictogram does not overfill or crop against the lobe edge`
        ).toBeLessThanOrEqual(0.9);
        expect(isInside(renderedAlphaBox, lobeBox, 4), `${riskId} visual alpha bounds stay inside the circular lobe`).toBe(true);
        if (riskId === "humano") {
          expect(lobeStyles.backgroundColor, "human risk lobe preserves the yellow source row").toBe("rgb(245, 229, 31)");
          expect(panelGeometry.panelBackground, "human risk rectangle preserves the yellow source row").toBe("rgb(245, 229, 31)");
        } else {
          expect(lobeStyles.backgroundColor, `${riskId} risk lobe preserves the gray source row`).toBe("rgb(231, 232, 230)");
          expect(panelGeometry.panelBackground, `${riskId} risk rectangle preserves the gray source row`).toBe("rgb(231, 232, 230)");
        }
      }
      const riskGaps = await riskCards.evaluateAll((cards) =>
        cards.map((card) => {
          const cardRect = card.getBoundingClientRect();
          const lobeRect = card.querySelector(".intro-risk-lobe")!.getBoundingClientRect();
          return {
            id: card.getAttribute("data-risk-id"),
            card: { y: cardRect.y, height: cardRect.height },
            lobe: { y: lobeRect.y, height: lobeRect.height }
          };
        })
      );
      for (let index = 1; index < riskGaps.length; index += 1) {
        const previous = riskGaps[index - 1];
        const current = riskGaps[index];
        const cardGap = current.card.y - (previous.card.y + previous.card.height);
        const lobeGap = current.lobe.y - (previous.lobe.y + previous.lobe.height);
        expect(cardGap, `${previous.id} and ${current.id} risk rows keep source-like vertical whitespace`).toBeGreaterThanOrEqual(10);
        expect(lobeGap, `${previous.id} and ${current.id} circular lobes do not touch or visually merge`).toBeGreaterThanOrEqual(10);
      }
      await expect(reader.locator(".intro-recommendation")).toHaveCSS("border-top-width", "2px");
      await expect(reader.locator(".intro-recommendation strong")).toHaveText("Рекомендации");
      const recommendation = reader.locator(".intro-recommendation");
      const recommendationBox = await requireBox(recommendation, "recommendation border");
      const recommendationTabBox = await requireBox(recommendation.locator("strong"), "recommendation blue tab");
      const recommendationTextBox = await requireBox(recommendation.locator("p"), "recommendation text");
      const recommendationStyles = await recommendation.evaluate((element) => {
        const style = window.getComputedStyle(element);
        const tabStyle = window.getComputedStyle(element.querySelector("strong")!);
        return {
          overflow: style.overflow,
          borderColor: style.borderTopColor,
          tabBackground: tabStyle.backgroundColor
        };
      });
      const oldIconHit = await page.evaluate(
        ({ x, y }) =>
          document
            .elementsFromPoint(x, y)
            .map((element) => element.closest("[data-artwork-id]")?.getAttribute("data-artwork-id"))
            .find(Boolean) ?? null,
        { x: recommendationBox.x + 24, y: recommendationBox.y - 10 }
      );
      expect(recommendationStyles.overflow, "recommendation callout keeps the raised tab unclipped").toBe("visible");
      expect(recommendationStyles.borderColor, "recommendation border stays aligned with the blue tab").toBe("rgb(39, 135, 166)");
      expect(recommendationStyles.tabBackground, "recommendation tab keeps the source blue").toBe("rgb(39, 135, 166)");
      expect(recommendationTabBox.x, "recommendation tab starts inside the border without an icon gap").toBeGreaterThanOrEqual(
        recommendationBox.x + 12
      );
      expect(recommendationTabBox.x + recommendationTabBox.width, "recommendation tab fits within the callout border").toBeLessThan(
        recommendationBox.x + recommendationBox.width - 12
      );
      expect(recommendationTabBox.y, "recommendation tab remains raised above the top border").toBeLessThan(recommendationBox.y);
      expect(
        recommendationTabBox.y + recommendationTabBox.height,
        "recommendation tab visually attaches to the top border instead of floating"
      ).toBeGreaterThan(recommendationBox.y - 2);
      expect(recommendationTextBox.y, "recommendation text clears the raised tab").toBeGreaterThan(recommendationTabBox.y + recommendationTabBox.height + 8);
      expect(oldIconHit, "the old decorative clipboard/notebook artwork is not rendered or clipped at the callout edge").toBeNull();
    }

    if (route.id === "intro-road-safety-plan") {
      await expect(reader.getByTestId("intro-consequence-diagram")).toBeVisible();
      await expect(reader.getByTestId("intro-consequence-diagram").getByTestId("intro-source-artwork")).toHaveCount(1);
      const consequenceBackground = reader.locator('[data-artwork-id="consequence-diagram-background"]');
      await expect(consequenceBackground).toBeVisible();
      await expect(consequenceBackground).toHaveAttribute("src", /diagram-consequences-clean-source\.png/);
      await expect(consequenceBackground).toHaveAttribute("data-source-page", "18");
      await expect(consequenceBackground).toHaveAttribute("data-visible-spanish", "false");
      await expect(consequenceBackground).toHaveAttribute(
        "data-cleanup-status",
        /high-DPI PDF source crop from page 18.*local background restoration/
      );
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /Spanish\/source text cleanup is limited to the original text-bearing regions/);
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /category labels retain source-shaped text-free label backings from the asset/);
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /center circle uses circular local-field cleanup inside the original circle, not rectangular\/block cover-up/);
      await expect(consequenceBackground).toHaveAttribute(
        "data-cleanup-status",
        /rectangular cover-up masks are forbidden even when color-matched to the background/
      );
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /no white rectangular mask remnants at category label corners/);
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /no masks cutting connector lines/);
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /no white marks on the black fatal-victims label or wedge/);
      await expect(consequenceBackground).toHaveAttribute(
        "data-cleanup-status",
        /no non-source beige horizontal bars below the diagram or under the institutions block/
      );
      await expect(consequenceBackground).toHaveAttribute(
        "data-cleanup-status",
        /no non-source black horizontal protrusion to the right of the fatal-victims wedge/
      );
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /no hard-edged center ring\/circle patch seam/);
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /no redrawn geometry/);
      await expect(consequenceBackground).toHaveAttribute("data-cleanup-status", /no native\/CSS\/SVG reconstruction/);
      await expect(consequenceBackground).toHaveAttribute("data-source-render-scale", "6");
      await expect(consequenceBackground).toHaveAttribute("data-fidelity-role", /complete original consequences gauge high-DPI PDF source crop/);
      await expect(consequenceBackground).toHaveJSProperty("naturalWidth", 3720);
      await expect(consequenceBackground).toHaveJSProperty("naturalHeight", 1560);
      const sourceCropAudit = await consequenceBackground.evaluate(async (element) => {
        const image = element as HTMLImageElement;
        if (!image.complete) await image.decode();
        const source = new Image();
        source.src =
          "/content/assets/manuals/gcba-manual-vehiculo-4-ruedas-2023/pages/page-018.jpg";
        await source.decode();
        const crop = { x: 280, y: 560, width: 620, height: 260 };
        const masks = [
          { id: "family-label", x: 145, y: 2, width: 170, height: 20, tone: "light" },
          { id: "family-items", x: 137, y: 26, width: 155, height: 31, tone: "light" },
          { id: "health-label", x: 340, y: 2, width: 96, height: 20, tone: "light" },
          { id: "health-items", x: 338, y: 26, width: 160, height: 45, tone: "light" },
          { id: "institutions-label", x: 97, y: 82, width: 130, height: 20, tone: "light" },
          { id: "institutions-item-1", x: 96, y: 107, width: 135, height: 13, tone: "light" },
          { id: "institutions-item-2", x: 96, y: 120, width: 140, height: 13, tone: "light" },
          { id: "institutions-item-3", x: 96, y: 133, width: 136, height: 13, tone: "light" },
          { id: "institutions-tail", x: 242, y: 133, width: 20, height: 13, tone: "light" },
          { id: "fatalities-label", x: 405, y: 90, width: 115, height: 12, tone: "dark" },
          { id: "center-label-top", x: 286, y: 174, width: 83, height: 20, tone: "light" },
          { id: "center-label-bottom", x: 309, y: 197, width: 44, height: 18, tone: "light" },
          { id: "center-left-remnant", x: 283, y: 181, width: 4, height: 14, tone: "light" },
          { id: "center-middle-remnant", x: 309, y: 196, width: 6, height: 6, tone: "light" },
          { id: "center-bottom-remnant", x: 307, y: 202, width: 12, height: 9, tone: "light" }
        ];
        const cleanedCanvas = document.createElement("canvas");
        cleanedCanvas.width = crop.width;
        cleanedCanvas.height = crop.height;
        const cleanedContext = cleanedCanvas.getContext("2d");
        if (!cleanedContext) throw new Error("no cleaned canvas context");
        cleanedContext.drawImage(image, 0, 0, crop.width, crop.height);
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = crop.width;
        sourceCanvas.height = crop.height;
        const sourceContext = sourceCanvas.getContext("2d");
        if (!sourceContext) throw new Error("no source canvas context");
        sourceContext.drawImage(source, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
        const cleanedData = cleanedContext.getImageData(0, 0, crop.width, crop.height).data;
        const sourceData = sourceContext.getImageData(0, 0, crop.width, crop.height).data;
        const pointInTriangle = (
          point: { x: number; y: number },
          triangle: Array<{ x: number; y: number }>
        ) => {
          const [p0, p1, p2] = triangle;
          const area = (p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y);
          const s = ((p0.y - p2.y) * (point.x - p2.x) + (p2.x - p0.x) * (point.y - p2.y)) / area;
          const t = ((p2.y - p1.y) * (point.x - p2.x) + (p1.x - p2.x) * (point.y - p2.y)) / area;
          const u = 1 - s - t;
          return s >= -0.035 && t >= -0.035 && u >= -0.035;
        };
        const isCenterLocalCleanup = (x: number, y: number) => {
          const dx = x - 329.2;
          const dy = y - 177.1;
          const pointer = [
            { x: 344, y: 166 },
            { x: 473, y: 132 },
            { x: 363, y: 187 }
          ];
          return Math.sqrt(dx * dx + dy * dy) <= 45.2 && !pointInTriangle({ x, y }, pointer);
        };
        const isMasked = (x: number, y: number) =>
          isCenterLocalCleanup(x, y) ||
          masks.some((mask) => x >= mask.x && y >= mask.y && x < mask.x + mask.width && y < mask.y + mask.height);
        let comparedPixels = 0;
        let totalDelta = 0;
        let changedPixels = 0;
        let maxDelta = 0;
        for (let y = 0; y < crop.height; y += 1) {
          for (let x = 0; x < crop.width; x += 1) {
            if (isMasked(x, y)) continue;
            const index = (y * crop.width + x) * 4;
            const delta =
              (Math.abs(cleanedData[index] - sourceData[index]) +
                Math.abs(cleanedData[index + 1] - sourceData[index + 1]) +
                Math.abs(cleanedData[index + 2] - sourceData[index + 2])) /
              3;
            comparedPixels += 1;
            totalDelta += delta;
            if (delta > 8) changedPixels += 1;
            if (delta > maxDelta) maxDelta = delta;
          }
        }
        const maskCleanliness = masks.map((zone) => {
          let darkPixels = 0;
          let lightPixels = 0;
          const zoneData = cleanedContext.getImageData(zone.x, zone.y, zone.width, zone.height).data;
          for (let index = 0; index < zoneData.length; index += 4) {
            const red = zoneData[index];
            const green = zoneData[index + 1];
            const blue = zoneData[index + 2];
            const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
            if (luma < 110) darkPixels += 1;
            if (luma > 170) lightPixels += 1;
          }
          const total = zoneData.length / 4;
          return { id: zone.id, tone: zone.tone, darkRatio: darkPixels / total, lightRatio: lightPixels / total };
        });
        const artifactCanvas = document.createElement("canvas");
        artifactCanvas.width = image.naturalWidth;
        artifactCanvas.height = image.naturalHeight;
        const artifactContext = artifactCanvas.getContext("2d");
        if (!artifactContext) throw new Error("no artifact canvas context");
        artifactContext.drawImage(image, 0, 0);
        const scale = image.naturalWidth / crop.width;
        const zoneStats = (zone: { id: string; x: number; y: number; width: number; height: number }) => {
          const sx = Math.round(zone.x * scale);
          const sy = Math.round(zone.y * scale);
          const sw = Math.round(zone.width * scale);
          const sh = Math.round(zone.height * scale);
          const data = artifactContext.getImageData(sx, sy, sw, sh).data;
          let whitePixels = 0;
          let nonWhitePixels = 0;
          let totalLuma = 0;
          for (let index = 0; index < data.length; index += 4) {
            const red = data[index];
            const green = data[index + 1];
            const blue = data[index + 2];
            const luma = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
            totalLuma += luma;
            if (luma > 245) whitePixels += 1;
            if (luma < 220) nonWhitePixels += 1;
          }
          const total = data.length / 4;
          return { id: zone.id, whiteRatio: whitePixels / total, nonWhiteRatio: nonWhitePixels / total, averageLuma: totalLuma / total };
        };
        const labelCornerZones = [
          { id: "family-left-corner", x: 147, y: 6, width: 18, height: 10 },
          { id: "family-right-corner", x: 293, y: 6, width: 18, height: 10 },
          { id: "health-left-corner", x: 342, y: 6, width: 14, height: 10 },
          { id: "health-right-corner", x: 418, y: 6, width: 14, height: 10 },
          { id: "institutions-left-corner", x: 100, y: 88, width: 18, height: 10 },
          { id: "institutions-right-corner", x: 207, y: 88, width: 18, height: 10 }
        ].map(zoneStats);
        const connectorZones = [{ id: "institutions-vertical-connector", x: 230, y: 98, width: 10, height: 58 }].map(zoneStats);
        const fatalBlackZones = [{ id: "fatal-victims-black-label", x: 405, y: 90, width: 115, height: 12 }].map(zoneStats);
        const rectanglePatchZones = [
          { id: "institutions-old-vertical-white-block", x: 204, y: 105, width: 36, height: 58 },
          { id: "institutions-old-arc-white-block", x: 210, y: 125, width: 55, height: 42 },
          { id: "center-old-color-matched-block", x: 285, y: 170, width: 90, height: 42 }
        ].map((zone) => {
          let changedPixels = 0;
          let whitePixels = 0;
          let totalDelta = 0;
          for (let y = zone.y; y < zone.y + zone.height; y += 1) {
            for (let x = zone.x; x < zone.x + zone.width; x += 1) {
              const index = (y * crop.width + x) * 4;
              const delta =
                (Math.abs(cleanedData[index] - sourceData[index]) +
                  Math.abs(cleanedData[index + 1] - sourceData[index + 1]) +
                  Math.abs(cleanedData[index + 2] - sourceData[index + 2])) /
                3;
              const luma =
                0.2126 * cleanedData[index] + 0.7152 * cleanedData[index + 1] + 0.0722 * cleanedData[index + 2];
              totalDelta += delta;
              if (delta > 20) changedPixels += 1;
              if (luma > 245) whitePixels += 1;
            }
          }
          const total = zone.width * zone.height;
          return {
            id: zone.id,
            averageDelta: totalDelta / total,
            changedRatio: changedPixels / total,
            whiteRatio: whitePixels / total
          };
        });
        const restoredSourceZones = [
          { id: "institutions-lower-non-source-beige-bar", x: 94, y: 150, width: 148, height: 31 },
          { id: "bottom-left-non-source-beige-bar", x: 138, y: 232, width: 184, height: 28 },
          { id: "bottom-right-non-source-beige-bar", x: 336, y: 232, width: 104, height: 28 },
          { id: "fatality-right-non-source-black-bar", x: 426, y: 151, width: 114, height: 31 }
        ].map((zone) => {
          let changedPixels = 0;
          let nonWhitePixels = 0;
          let totalDelta = 0;
          let totalLuma = 0;
          for (let y = zone.y; y < zone.y + zone.height; y += 1) {
            for (let x = zone.x; x < zone.x + zone.width; x += 1) {
              const index = (y * crop.width + x) * 4;
              const delta =
                (Math.abs(cleanedData[index] - sourceData[index]) +
                  Math.abs(cleanedData[index + 1] - sourceData[index + 1]) +
                  Math.abs(cleanedData[index + 2] - sourceData[index + 2])) /
                3;
              const luma =
                0.2126 * cleanedData[index] + 0.7152 * cleanedData[index + 1] + 0.0722 * cleanedData[index + 2];
              totalDelta += delta;
              totalLuma += luma;
              if (delta > 20) changedPixels += 1;
              if (luma < 230) nonWhitePixels += 1;
            }
          }
          const total = zone.width * zone.height;
          return {
            id: zone.id,
            averageDelta: totalDelta / total,
            averageLuma: totalLuma / total,
            changedRatio: changedPixels / total,
            nonWhiteRatio: nonWhitePixels / total
          };
        });
        const seamStats = (zone: { id: string; x: number; y: number; width: number; height: number }) => {
          const sx = Math.round(zone.x * scale);
          const sy = Math.round(zone.y * scale);
          const sw = Math.round(zone.width * scale);
          const sh = Math.round(zone.height * scale);
          const data = artifactContext.getImageData(sx, sy, sw, sh).data;
          const rowAverages: number[] = [];
          const columnAverages: number[] = [];
          for (let y = 0; y < sh; y += 1) {
            let total = 0;
            for (let x = 0; x < sw; x += 1) {
              const index = (y * sw + x) * 4;
              total += 0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2];
            }
            rowAverages.push(total / sw);
          }
          for (let x = 0; x < sw; x += 1) {
            let total = 0;
            for (let y = 0; y < sh; y += 1) {
              const index = (y * sw + x) * 4;
              total += 0.2126 * data[index] + 0.7152 * data[index + 1] + 0.0722 * data[index + 2];
            }
            columnAverages.push(total / sh);
          }
          const maxAdjacentDelta = (values: number[]) =>
            values.slice(1).reduce((max, value, index) => Math.max(max, Math.abs(value - values[index])), 0);
          return {
            id: zone.id,
            maxHorizontalEdge: maxAdjacentDelta(rowAverages),
            maxVerticalEdge: maxAdjacentDelta(columnAverages)
          };
        };
        const centerSeamZones = [
          { id: "center-left-clean-field", x: 288, y: 169, width: 42, height: 44 },
          { id: "center-lower-clean-field", x: 310, y: 193, width: 42, height: 24 }
        ].map(seamStats);
        return {
          comparedPixels,
          averageDelta: totalDelta / comparedPixels,
          changedRatio: changedPixels / comparedPixels,
          maxDelta,
          maskCleanliness,
          labelCornerZones,
          connectorZones,
          fatalBlackZones,
          rectanglePatchZones,
          restoredSourceZones,
          centerSeamZones,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        };
      });
      expect(sourceCropAudit.comparedPixels, "page 18 source-crop comparison covers the full non-text diagram artwork").toBeGreaterThan(
        100_000
      );
      expect(sourceCropAudit.naturalWidth, "page 18 runtime image rejects the old low-resolution 620px natural crop").toBe(3720);
      expect(sourceCropAudit.naturalHeight, "page 18 runtime image rejects the old low-resolution 260px natural crop").toBe(1560);
      expect(sourceCropAudit.averageDelta, "page 18 non-text artwork remains source-derived after high-DPI cleanup, not a redraw").toBeLessThan(12);
      expect(sourceCropAudit.changedRatio, "page 18 arcs, pointer, sectors, label boxes, connectors, and icons are retained").toBeLessThan(
        0.13
      );
      for (const zone of sourceCropAudit.maskCleanliness) {
        if (zone.tone === "dark") {
          expect(zone.lightRatio, `${zone.id} black label has no residual white Spanish text`).toBeLessThan(0.01);
        } else if (zone.id.startsWith("center-")) {
          expect(zone.darkRatio, `${zone.id} cleaned center keeps no visible Spanish while preserving the dark ring edge`).toBeLessThan(0.02);
        } else {
          expect(zone.darkRatio, `${zone.id} cleaned page 18 background has no residual dark Spanish/text artifacts`).toBeLessThan(0.01);
        }
      }
      for (const zone of sourceCropAudit.labelCornerZones) {
        expect(zone.whiteRatio, `${zone.id} has no white rectangular mask remnant at the category label corner`).toBeLessThan(0.02);
        expect(zone.averageLuma, `${zone.id} remains beige source label material, not white cover-up`).toBeLessThan(210);
      }
      for (const zone of sourceCropAudit.connectorZones) {
        expect(zone.nonWhiteRatio, `${zone.id} is preserved and not cut by a white cleanup mask`).toBeGreaterThan(0.2);
      }
      for (const zone of sourceCropAudit.fatalBlackZones) {
        expect(zone.whiteRatio, `${zone.id} has no white text-mask marks on the black label`).toBeLessThan(0.005);
        expect(zone.averageLuma, `${zone.id} remains black after local source-text cleanup`).toBeLessThan(30);
      }
      for (const zone of sourceCropAudit.rectanglePatchZones) {
        expect(zone.whiteRatio, `${zone.id} rejects the stale white rectangular cleanup patch`).toBeLessThan(0.35);
        expect(zone.changedRatio, `${zone.id} rejects block-level/color-matched rectangular cover-up outside glyph strokes`).toBeLessThan(0.3);
      }
      for (const zone of sourceCropAudit.restoredSourceZones) {
        expect(zone.changedRatio, `${zone.id} is restored from source pixels instead of a non-source horizontal rectangle`).toBeLessThan(0.04);
        expect(zone.averageDelta, `${zone.id} matches the source crop background after cleanup`).toBeLessThan(4);
        expect(zone.averageLuma, `${zone.id} has no visible dark/beige bar artifact`).toBeGreaterThan(235);
        expect(zone.nonWhiteRatio, `${zone.id} rejects leftover horizontal bar pixels`).toBeLessThan(0.2);
      }
      for (const zone of sourceCropAudit.centerSeamZones) {
        expect(zone.maxHorizontalEdge, `${zone.id} has no horizontal hard-edged center patch seam`).toBeLessThan(8);
        expect(zone.maxVerticalEdge, `${zone.id} has no vertical hard-edged center patch seam`).toBeLessThan(8);
      }
      const consequenceBox = await requireBox(reader.getByTestId("intro-consequence-diagram"), "page 18 consequence diagram");
      const consequenceBackgroundBox = await requireBox(consequenceBackground, "page 18 cleaned source background");
      await expect(consequenceBackground).toHaveCSS("object-fit", "contain");
      expect(
        3720 / consequenceBackgroundBox.width,
        "page 18 source crop natural pixels are at least 2x the rendered width, avoiding browser upscaling"
      ).toBeGreaterThanOrEqual(2);
      expect(
        1560 / consequenceBackgroundBox.height,
        "page 18 source crop natural pixels are at least 2x the rendered height, avoiding browser upscaling"
      ).toBeGreaterThanOrEqual(2);
      const consequenceCenterBox = await requireBox(reader.locator(".intro-consequence-center"), "page 18 center incident label");
      if (testInfo.project.name === "mobile") {
        expect(consequenceBackgroundBox.width, "mobile keeps the complete page 18 gauge visible within the article").toBeLessThanOrEqual(
          consequenceBox.width + 1
        );
        expect(consequenceBackgroundBox.width, "mobile still renders the complete page 18 gauge, not a clipped fragment").toBeGreaterThan(280);
      } else {
        expect(consequenceBackgroundBox.width, "desktop page 18 source crop renders as the full gauge composition").toBeGreaterThan(680);
        expect(consequenceBackgroundBox.height, "desktop page 18 source crop preserves gauge proportions").toBeGreaterThan(280);
      }
      expect(
        Math.abs(consequenceBackgroundBox.width / consequenceBackgroundBox.height - 620 / 260),
        "page 18 gauge keeps complete source crop aspect ratio"
      ).toBeLessThan(0.03);
      expect(
        isInside(consequenceCenterBox, consequenceBackgroundBox, testInfo.project.name === "mobile" ? 16 : 40),
        "center Russian label sits inside the original gauge ring area"
      ).toBe(true);
      const consequenceComposition = await reader.getByTestId("intro-consequence-diagram").evaluate((diagram) => {
        const labels = Array.from(diagram.querySelectorAll(".intro-consequence-card")).map((element) => {
          const rect = element.getBoundingClientRect();
          const heading = element.querySelector("h4")?.getBoundingClientRect();
          const headingElement = element.querySelector("h4");
          const headingStyle = headingElement ? window.getComputedStyle(headingElement) : null;
          const textRange = headingElement ? document.createRange() : null;
          if (textRange && headingElement) {
            textRange.selectNodeContents(headingElement);
          }
          const textRect = textRange?.getBoundingClientRect();
          textRange?.detach();
          return {
            id: element.getAttribute("data-consequence-id"),
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            heading: heading ? { x: heading.x, y: heading.y, width: heading.width, height: heading.height } : null,
            text: textRect ? { x: textRect.x, y: textRect.y, width: textRect.width, height: textRect.height } : null,
            headingStyle: headingStyle
              ? {
                  alignItems: headingStyle.alignItems,
                  backgroundColor: headingStyle.backgroundColor,
                  backgroundImage: headingStyle.backgroundImage,
                  borderTopWidth: headingStyle.borderTopWidth,
                  borderRadius: headingStyle.borderRadius,
                  boxShadow: headingStyle.boxShadow,
                  beforeContent: window.getComputedStyle(headingElement!, "::before").content,
                  beforeBackgroundColor: window.getComputedStyle(headingElement!, "::before").backgroundColor,
                  afterContent: window.getComputedStyle(headingElement!, "::after").content,
                  afterBackgroundColor: window.getComputedStyle(headingElement!, "::after").backgroundColor,
                  fontSize: headingStyle.fontSize,
                  fontWeight: headingStyle.fontWeight,
                  lineHeight: headingStyle.lineHeight,
                  paddingLeft: headingStyle.paddingLeft,
                  paddingRight: headingStyle.paddingRight,
                  textTransform: headingStyle.textTransform
                }
              : null,
            overflow: window.getComputedStyle(element).overflow
          };
        });
        const centerElement = diagram.querySelector(".intro-consequence-center")!;
        const center = centerElement.getBoundingClientRect();
        const centerStyle = window.getComputedStyle(centerElement);
        const centerBeforeStyle = window.getComputedStyle(centerElement, "::before");
        const centerAfterStyle = window.getComputedStyle(centerElement, "::after");
        const background = diagram.querySelector('[data-artwork-id="consequence-diagram-background"]')!.getBoundingClientRect();
        return {
          labels,
          center: { x: center.x, y: center.y, width: center.width, height: center.height },
          centerStyle: {
            backgroundColor: centerStyle.backgroundColor,
            backgroundImage: centerStyle.backgroundImage,
            borderTopWidth: centerStyle.borderTopWidth,
            boxShadow: centerStyle.boxShadow,
            beforeContent: centerBeforeStyle.content,
            beforeBackgroundColor: centerBeforeStyle.backgroundColor,
            afterContent: centerAfterStyle.content,
            afterBackgroundColor: centerAfterStyle.backgroundColor
          },
          background: { x: background.x, y: background.y, width: background.width, height: background.height }
        };
      });
      expect(consequenceComposition.centerStyle.backgroundColor, "center incident text has no visible background rectangle").toBe(
        "rgba(0, 0, 0, 0)"
      );
      expect(consequenceComposition.centerStyle.backgroundImage, "center incident text has no background image").toBe("none");
      expect(consequenceComposition.centerStyle.borderTopWidth, "center incident text has no DOM border").toBe("0px");
      expect(consequenceComposition.centerStyle.boxShadow, "center incident text has no rectangular shadow").toBe("none");
      expect(consequenceComposition.centerStyle.beforeContent, "center incident text has no ::before backing").toBe("none");
      expect(consequenceComposition.centerStyle.afterContent, "center incident text has no ::after backing").toBe("none");
      expect(consequenceComposition.labels).toHaveLength(4);
      const sourceLabelBoxes: Record<string, { x: number; y: number; width: number; height: number }> = {
        "family-economy": { x: 145, y: 2, width: 170, height: 20 },
        health: { x: 340, y: 2, width: 96, height: 20 },
        institutions: { x: 97, y: 82, width: 130, height: 20 },
        fatalities: { x: 405, y: 90, width: 115, height: 12 }
      };
      const familyLabel = consequenceComposition.labels.find((label) => label.id === "family-economy");
      expect(familyLabel?.headingStyle?.fontSize, "family/economy label exposes the shared page 18 category label font size").toBeTruthy();
      for (const label of consequenceComposition.labels) {
        expect(label.overflow, `${label.id} Russian label is not clipped by its own container`).toBe("visible");
        expect(isInside(label.rect, consequenceComposition.background, -2), `${label.id} label stays within the source gauge crop frame`).toBe(true);
        expect(label.heading, `${label.id} has a rendered label heading`).not.toBeNull();
        expect(label.text, `${label.id} has measurable text ink for optical centering`).not.toBeNull();
        expect(label.headingStyle?.alignItems, `${label.id} label text uses vertical centering`).toBe("center");
        expect(label.headingStyle?.backgroundColor, `${label.id} label text does not add a mismatched DOM backing plate`).toBe(
          "rgba(0, 0, 0, 0)"
        );
        expect(label.headingStyle?.backgroundImage, `${label.id} label text has no DOM background image`).toBe("none");
        expect(label.headingStyle?.borderTopWidth, `${label.id} label text has no DOM border plate`).toBe("0px");
        expect(
          Number.parseFloat(label.headingStyle?.borderRadius ?? "0"),
          `${label.id} label corners come from the cleaned source asset, not a second DOM plate`
        ).toBe(0);
        expect(label.headingStyle?.boxShadow, `${label.id} label text has no rectangular backing shadow`).toBe("none");
        expect(label.headingStyle?.beforeContent, `${label.id} label text has no ::before backing`).toBe("none");
        expect(label.headingStyle?.afterContent, `${label.id} label text has no ::after backing`).toBe("none");
        expect(label.headingStyle?.fontSize, `${label.id} category typography matches the other category labels`).toBe(
          familyLabel?.headingStyle?.fontSize
        );
        expect(label.headingStyle?.fontWeight, `${label.id} category typography uses the shared weight`).toBe(familyLabel?.headingStyle?.fontWeight);
        expect(label.headingStyle?.lineHeight, `${label.id} category typography uses the shared line-height`).toBe(familyLabel?.headingStyle?.lineHeight);
        expect(label.headingStyle?.textTransform, `${label.id} category label keeps the shared uppercase treatment`).toBe("uppercase");
        const sourceBox = sourceLabelBoxes[label.id ?? ""];
        if (!sourceBox) {
          throw new Error(`${label.id} has no known source label box`);
        }
        const sourceCenterY = consequenceComposition.background.y + ((sourceBox.y + sourceBox.height / 2) / 260) * consequenceComposition.background.height;
        const sourceBackingWidth = (sourceBox.width / 620) * consequenceComposition.background.width;
        const paddingLeft = Number.parseFloat(label.headingStyle?.paddingLeft ?? "0");
        const paddingRight = Number.parseFloat(label.headingStyle?.paddingRight ?? "0");
        const expectedBackingWidth = Math.max(sourceBackingWidth, label.text!.width + paddingLeft + paddingRight);
        const headingCenterY = label.heading!.y + label.heading!.height / 2;
        const textCenterY = label.text!.y + label.text!.height / 2;
        expect(Math.abs(headingCenterY - sourceCenterY), `${label.id} Russian label text is vertically centered in the source box`).toBeLessThanOrEqual(
          testInfo.project.name === "mobile" ? 5 : 6
        );
        expect(Math.abs(textCenterY - sourceCenterY), `${label.id} visible text ink is vertically centered, not top- or bottom-pinned`).toBeLessThanOrEqual(
          testInfo.project.name === "mobile" ? 7 : 7
        );
        expect(
          label.heading!.width,
          `${label.id} label backing is not smaller than source width or Russian text plus padding`
        ).toBeGreaterThanOrEqual(expectedBackingWidth - 1);
        expect(
          label.heading!.width,
          `${label.id} label backing only widens as needed for Russian text`
        ).toBeLessThanOrEqual(expectedBackingWidth + (testInfo.project.name === "mobile" ? 3 : 4));
        if (label.id === "health") {
          const sourceHeight = (sourceBox.height / 260) * consequenceComposition.background.height;
          expect(
            Math.abs(label.heading!.height - sourceHeight),
            "health label preserves the source-height while the transparent DOM text wrapper fits the source-like asset backing"
          ).toBeLessThanOrEqual(5);
          expect(
            label.heading!.width,
            "health label transparent DOM text wrapper is wide enough for the Russian word"
          ).toBeGreaterThanOrEqual(label.text!.width + paddingLeft + paddingRight - 1);
        }
        const overlapX = Math.max(0, Math.min(label.rect.x + label.rect.width, consequenceComposition.center.x + consequenceComposition.center.width) - Math.max(label.rect.x, consequenceComposition.center.x));
        const overlapY = Math.max(0, Math.min(label.rect.y + label.rect.height, consequenceComposition.center.y + consequenceComposition.center.height) - Math.max(label.rect.y, consequenceComposition.center.y));
        expect(overlapX * overlapY, `${label.id} label does not collide with the center ring text`).toBe(0);
      }
      for (const assetId of ["consequence-family-economy", "consequence-health", "consequence-institutions", "consequence-fatalities"]) {
        await expect(reader.locator(`[data-artwork-id="${assetId}"]`)).toHaveCount(0);
      }
      for (const assetId of ["axis-infrastructure", "axis-education", "axis-control", "axis-participation"]) {
        const artwork = reader.locator(`[data-artwork-id="${assetId}"]`);
        await expect(artwork).toBeVisible();
        await expect(artwork).toHaveAttribute("data-source-page", "19");
        await expect(artwork).toHaveAttribute("data-visible-spanish", "false");
      }
      await expect(reader.locator(".intro-consequence-arc")).toHaveCount(0);
      await expect(reader.locator(".intro-axis-circle")).toHaveCount(4);
      await expect(reader.locator(".intro-axis-card")).toHaveCount(4);
      const axisCircleBoxes: Record<string, { x: number; y: number; width: number; height: number }> = {};
      for (const axisId of ["safe-infrastructure", "education", "control-legislation", "citizen-participation"]) {
        const axisCard = reader.locator(`.intro-axis-card[data-axis-id="${axisId}"]`);
        const titleBox = await requireBox(axisCard.locator("h4"), `${axisId} axis title`);
        const circleBox = await requireBox(axisCard.locator(".intro-axis-circle"), `${axisId} gray circle`);
        axisCircleBoxes[axisId] = circleBox;
        const icon = axisCard.locator(".intro-axis-symbol");
        const iconBox = await requireBox(icon, `${axisId} source icon`);
        const bodyBox = await requireBox(axisCard.locator("p"), `${axisId} axis text`);
        const circleStyles = await axisCard.locator(".intro-axis-circle").evaluate((element) => {
          const style = window.getComputedStyle(element);
          return {
            borderRadius: style.borderRadius,
            overflow: style.overflow,
            backgroundColor: style.backgroundColor
          };
        });
        const iconStyles = await icon.evaluate((element) => {
          const style = window.getComputedStyle(element);
          return {
            objectFit: style.objectFit,
            mixBlendMode: style.mixBlendMode
          };
        });
        const naturalIconBounds = await icon.evaluate(async (element) => {
          const image = element as HTMLImageElement;
          if (!image.complete) await image.decode();
          const tightSource = new Image();
          tightSource.src = image.currentSrc.replace(/\.png(?:\?.*)?$/u, ".jpg");
          await tightSource.decode();
          const canvas = document.createElement("canvas");
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext("2d");
          if (!context) throw new Error("no axis icon canvas context");
          context.drawImage(image, 0, 0);
          const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
          let minX = Number.POSITIVE_INFINITY;
          let minY = Number.POSITIVE_INFINITY;
          let maxX = -1;
          let maxY = -1;
          for (let y = 0; y < canvas.height; y += 1) {
            for (let x = 0; x < canvas.width; x += 1) {
              const alpha = data[(y * canvas.width + x) * 4 + 3];
              if (alpha <= 8) continue;
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
          return {
            naturalWidth: image.naturalWidth,
            naturalHeight: image.naturalHeight,
            previousTightWidth: tightSource.naturalWidth,
            previousTightHeight: tightSource.naturalHeight,
            marginLeft: minX,
            marginTop: minY,
            marginRight: canvas.width - maxX - 1,
            marginBottom: canvas.height - maxY - 1
          };
        });
        expect(titleBox.y + titleBox.height, `${axisId} title stays above the gray circle as in the source`).toBeLessThanOrEqual(circleBox.y + 4);
        expect(bodyBox.y, `${axisId} body text stays below the gray circle`).toBeGreaterThan(circleBox.y + circleBox.height - 2);
        expect(Math.abs(circleBox.width - circleBox.height), `${axisId} gray field remains circular`).toBeLessThanOrEqual(1);
        expect(isInside(iconBox, circleBox, 6), `${axisId} pictogram is complete inside the gray circle with padding`).toBe(true);
        expect(naturalIconBounds.naturalWidth, `${axisId} source asset has high-DPI padded natural width`).toBeGreaterThanOrEqual(192);
        expect(naturalIconBounds.naturalHeight, `${axisId} source asset has high-DPI padded natural height`).toBeGreaterThanOrEqual(192);
        expect(naturalIconBounds.naturalWidth / iconBox.width, `${axisId} source pictogram is never browser-upscaled`).toBeGreaterThanOrEqual(2);
        expect(naturalIconBounds.naturalHeight / iconBox.height, `${axisId} source pictogram is never browser-upscaled`).toBeGreaterThanOrEqual(2);
        expect(naturalIconBounds.naturalWidth, `${axisId} padded PNG is wider than the previous tight JPG crop`).toBeGreaterThan(
          naturalIconBounds.previousTightWidth
        );
        expect(naturalIconBounds.naturalHeight, `${axisId} padded PNG is taller than the previous tight JPG crop`).toBeGreaterThan(
          naturalIconBounds.previousTightHeight
        );
        for (const [edge, margin] of Object.entries({
          left: naturalIconBounds.marginLeft,
          top: naturalIconBounds.marginTop,
          right: naturalIconBounds.marginRight,
          bottom: naturalIconBounds.marginBottom
        })) {
          expect(margin, `${axisId} source pictogram alpha bounds have ${edge} padding and are not tight-cropped`).toBeGreaterThanOrEqual(
            14
          );
        }
        expect(circleStyles.borderRadius, `${axisId} axis field uses circular geometry`).toMatch(/999px|50%/);
        expect(circleStyles.overflow, `${axisId} circle does not clip the original pictogram`).not.toBe("hidden");
        expect(circleStyles.backgroundColor, `${axisId} circle preserves the source gray field`).toBe("rgb(236, 236, 234)");
        expect(iconStyles.objectFit, `${axisId} source pictogram is contained, not force-cropped`).toBe("contain");
        expect(iconStyles.mixBlendMode, `${axisId} source crop blends away square crop backgrounds`).toBe("multiply");
      }
      if (testInfo.project.name !== "mobile") {
        const center = (box: { x: number; y: number; width: number; height: number }) => ({
          x: box.x + box.width / 2,
          y: box.y + box.height / 2
        });
        const topLeft = center(axisCircleBoxes["safe-infrastructure"]);
        const topRight = center(axisCircleBoxes.education);
        const bottomLeft = center(axisCircleBoxes["control-legislation"]);
        const bottomRight = center(axisCircleBoxes["citizen-participation"]);
        const diameters = Object.entries(axisCircleBoxes).map(([id, box]) => ({ id, diameter: box.width, height: box.height }));
        for (const { id, diameter, height } of diameters) {
          expect(Math.abs(diameter - height), `${id} axis circle keeps equal width/height`).toBeLessThanOrEqual(1);
          expect(Math.abs(diameter - axisCircleBoxes["safe-infrastructure"].width), `${id} axis circle diameter matches the grid`).toBeLessThanOrEqual(1);
        }
        expect(Math.abs(topLeft.y - topRight.y), "page 19 top-row circle centers align on desktop").toBeLessThanOrEqual(1);
        expect(Math.abs(bottomLeft.y - bottomRight.y), "page 19 bottom-row circle centers align on desktop").toBeLessThanOrEqual(1);
        expect(Math.abs(topLeft.x - bottomLeft.x), "page 19 left-column circle centers align on desktop").toBeLessThanOrEqual(1);
        expect(Math.abs(topRight.x - bottomRight.x), "page 19 right-column circle centers align on desktop").toBeLessThanOrEqual(1);
        expect(Math.abs((bottomLeft.y - topLeft.y) - (bottomRight.y - topRight.y)), "page 19 row gaps stay consistent").toBeLessThanOrEqual(1);
      }
    }

    await reader.screenshot({
      path: testInfo.outputPath(`intro-route-${route.id}-${testInfo.project.name}.png`)
    });
    if (testInfo.project.name === "chromium" && ["intro-incident", "intro-road-safety-plan"].includes(route.id)) {
      await page.setViewportSize({ width: 760, height: 900 });
      await reader.screenshot({
        path: testInfo.outputPath(`intro-route-${route.id}-narrow.png`)
      });
      await page.setViewportSize({ width: 1280, height: 720 });
    }
  }

  await page.goto("/");
  await page.getByTestId("pandemia-nav-entry").click();
  await expect(page).toHaveURL(/#pandemia-vial$/);
  for (const route of introRoutes.slice(1)) {
    await page.getByTestId(`intro-route-${route.id}`).click();
    await expect(page).toHaveURL(new RegExp(`${route.hash}$`));
    await expect(page.getByRole("heading", { name: route.title })).toBeVisible();
  }
});

test("Manual guide exposes implemented Chapter 1, Chapter 2, Chapter 3, and Chapter 4 section pages", async ({ page }, testInfo) => {
  await page.goto("/#pandemia-vial");
  const reader = page.getByTestId("introduction-reader");
  const nav = reader.getByTestId("manual-guide-nav");
  const content = reader.getByTestId("manual-guide-content");

  await expect(reader).toBeVisible();
  await expect(nav).toHaveAttribute("data-active-group-id", "introduction");
  await expect(content.getByRole("heading", { name: "Дорожная пандемия" })).toBeVisible();

  const chapter1 = nav.locator('[data-guide-entry-id="chapter-1-sustainable-mobility"]');
  const chapter2 = nav.locator('[data-guide-entry-id="chapter-2-responsibility"]');
  const chapter3 = nav.locator('[data-guide-entry-id="chapter-3-driving-rules"]');
  const chapter4 = nav.locator('[data-guide-entry-id="chapter-4-natural-capacity"]');
  const chapter5 = nav.locator('[data-guide-entry-id="chapter-5-driving-behavior"]');
  if (!(await chapter1.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await chapter1.locator("summary").click();
  }
  if (!(await chapter2.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await chapter2.locator("summary").click();
  }
  if (!(await chapter3.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await chapter3.locator("summary").click();
  }
  if (!(await chapter4.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await chapter4.locator("summary").click();
  }
  if (!(await chapter5.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await chapter5.locator("summary").click();
  }

  await expect(chapter1.getByText("Глава 1. К устойчивой мобильности")).toBeVisible();
  await expect(chapter2.getByText("Глава 2. Вождение - ответственное действие")).toBeVisible();
  await expect(chapter3.getByText("Глава 3. Основные нормы вождения")).toBeVisible();
  await expect(chapter4.getByText("Глава 4. Естественная способность")).toBeVisible();
  await expect(chapter5.getByText("Глава 5. Поведение за рулем")).toBeVisible();
  await expect(chapter1).toHaveAttribute("data-status", "active");
  await expect(chapter2).toHaveAttribute("data-status", "active");
  await expect(chapter3).toHaveAttribute("data-status", "active");
  await expect(chapter4).toHaveAttribute("data-status", "active");
  await expect(chapter5).toHaveAttribute("data-status", "active");
  await expect(chapter1.locator("summary small")).toHaveCount(0);
  await expect(chapter2.locator("summary small")).toHaveCount(0);
  await expect(chapter3.locator("summary small")).toHaveCount(0);
  await expect(chapter4.locator("summary small")).toHaveCount(0);
  await expect(chapter5.locator("summary small")).toHaveCount(0);
  await expect(chapter1.getByText("Пешеходный приоритет")).toBeVisible();
  await expect(chapter1.getByText("Велосипед")).toBeVisible();
  await expect(chapter2.getByText("Обязательные документы")).toBeVisible();
  await expect(chapter2.getByText("Обязанности в случае дорожных инцидентов")).toBeVisible();
  await expect(chapter3.getByText("Приоритет норм")).toBeVisible();
  await expect(chapter3.getByText("Скорость")).toBeVisible();
  await expect(chapter3.getByText("Остановка и стоянка")).toBeVisible();
  await expect(chapter4.getByText("Употребление алкоголя и наркотиков")).toBeVisible();
  await expect(chapter4.getByText("Сон и усталость")).toBeVisible();
  await expect(chapter4.getByText("Стресс")).toBeVisible();
  await expect(chapter4.getByText("Отвлечения")).toBeVisible();
  await expect(chapter5.getByText("Типы установок")).toBeVisible();
  await expect(chapter5.getByText("К равноправному обществу")).toBeVisible();
  await expect(chapter5.getByText("Профилактика и помощь в ситуациях гендерного насилия")).toBeVisible();
  await expect(chapter5.getByText("Предупредительное и эффективное вождение")).toBeVisible();

  const cities = reader.getByTestId("manual-guide-pending-section-ch1-cities-for-people");
  const sustainable = reader.getByTestId("manual-guide-pending-section-ch1-sustainable-mobility");
  const pedestrian = reader.getByTestId("manual-guide-pending-section-ch1-pedestrian-priority");
  const bicycle = reader.getByTestId("manual-guide-pending-section-ch1-bicycle");
  const publicTransport = reader.getByTestId("manual-guide-pending-section-ch1-public-transport-system");
  const sharedTrip = reader.getByTestId("manual-guide-pending-section-ch1-shared-trip");
  const legal = reader.getByTestId("manual-guide-pending-section-ch2-legal-responsibility");
  const requiredDocuments = reader.getByTestId("manual-guide-pending-section-ch2-required-documents");
  const incidentObligations = reader.getByTestId("manual-guide-pending-section-ch2-incident-obligations");
  const scoring = reader.getByTestId("manual-guide-pending-section-ch2-scoring");
  const priorityOfRules = reader.getByTestId("manual-guide-pending-section-ch3-priority-of-rules");
  const rightOfWay = reader.getByTestId("manual-guide-pending-section-ch3-right-of-way");
  const lights = reader.getByTestId("manual-guide-pending-section-ch3-lights");
  const speed = reader.getByTestId("manual-guide-pending-section-ch3-speed");
  const turns = reader.getByTestId("manual-guide-pending-section-ch3-turns");
  const overtaking = reader.getByTestId("manual-guide-pending-section-ch3-overtaking");
  const highways = reader.getByTestId("manual-guide-pending-section-ch3-highways");
  const adverseConditions = reader.getByTestId("manual-guide-pending-section-ch3-adverse-conditions");
  const stoppingParking = reader.getByTestId("manual-guide-pending-section-ch3-stopping-parking");
  const alcoholDrugs = reader.getByTestId("manual-guide-pending-section-ch4-alcohol-drugs");
  const sleepFatigue = reader.getByTestId("manual-guide-pending-section-ch4-sleep-fatigue");
  const stress = reader.getByTestId("manual-guide-pending-section-ch4-stress");
  const distractions = reader.getByTestId("manual-guide-pending-section-ch4-distractions");
  const attitudeTypes = reader.getByTestId("manual-guide-pending-section-ch5-attitude-types");
  const equalSociety = reader.getByTestId("manual-guide-pending-section-ch5-equal-society");
  const genderViolencePrevention = reader.getByTestId("manual-guide-pending-section-ch5-gender-violence-prevention");
  const anticipatoryEfficientDriving = reader.getByTestId("manual-guide-pending-section-ch5-anticipatory-efficient-driving");
  await expect(cities).toBeVisible();
  await expect(sustainable).toBeVisible();
  await expect(bicycle).toBeVisible();
  for (const sectionButton of [
    cities,
    sustainable,
    pedestrian,
    bicycle,
    publicTransport,
    sharedTrip,
    legal,
    requiredDocuments,
    incidentObligations,
    scoring,
    priorityOfRules,
    rightOfWay,
    lights,
    speed,
    turns,
    overtaking,
    highways,
    adverseConditions,
    stoppingParking,
    alcoholDrugs,
    sleepFatigue,
    stress,
    distractions,
    attitudeTypes,
    equalSociety,
    genderViolencePrevention,
    anticipatoryEfficientDriving
  ]) {
    await expect(sectionButton).toBeEnabled();
    await expect(sectionButton).toHaveAttribute("data-status", "implemented");
    await expect(sectionButton).toHaveAttribute("data-source-region-metadata-status", "recorded");
    await expect(sectionButton).toHaveAttribute("data-visual-evidence-status", "recorded");
  }

  await expect(cities).toHaveAttribute("data-route-hash", "#manual-section-ch1-cities-for-people");
  await expect(cities).toHaveAttribute("data-source-pages", "22");
  await expect(sustainable).toHaveAttribute("data-route-hash", "#manual-section-ch1-sustainable-mobility");
  await expect(sustainable).toHaveAttribute("data-source-pages", "23");
  await expect(pedestrian).toHaveAttribute("data-route-hash", "#manual-section-ch1-pedestrian-priority");
  await expect(pedestrian).toHaveAttribute("data-source-pages", "24-29");
  await expect(bicycle).toHaveAttribute("data-route-hash", "#manual-section-ch1-bicycle");
  await expect(bicycle).toHaveAttribute("data-source-pages", "30-38");
  await expect(publicTransport).toHaveAttribute("data-route-hash", "#manual-section-ch1-public-transport-system");
  await expect(publicTransport).toHaveAttribute("data-source-pages", "39-40");
  await expect(sharedTrip).toHaveAttribute("data-route-hash", "#manual-section-ch1-shared-trip");
  await expect(sharedTrip).toHaveAttribute("data-source-pages", "41-42");
  await expect(legal).toHaveAttribute("data-route-hash", "#manual-section-ch2-legal-responsibility");
  await expect(legal).toHaveAttribute("data-source-pages", "44-45");
  await expect(requiredDocuments).toHaveAttribute("data-route-hash", "#manual-section-ch2-required-documents");
  await expect(requiredDocuments).toHaveAttribute("data-source-pages", "46-50");
  await expect(incidentObligations).toHaveAttribute("data-route-hash", "#manual-section-ch2-incident-obligations");
  await expect(incidentObligations).toHaveAttribute("data-source-pages", "51-55");
  await expect(scoring).toHaveAttribute("data-route-hash", "#manual-section-ch2-scoring");
  await expect(scoring).toHaveAttribute("data-source-pages", "55");
  await expect(priorityOfRules).toHaveAttribute("data-route-hash", "#manual-section-ch3-priority-of-rules");
  await expect(priorityOfRules).toHaveAttribute("data-source-pages", "58-63");
  await expect(rightOfWay).toHaveAttribute("data-route-hash", "#manual-section-ch3-right-of-way");
  await expect(rightOfWay).toHaveAttribute("data-source-pages", "64-66");
  await expect(lights).toHaveAttribute("data-route-hash", "#manual-section-ch3-lights");
  await expect(lights).toHaveAttribute("data-source-pages", "67-68");
  await expect(speed).toHaveAttribute("data-route-hash", "#manual-section-ch3-speed");
  await expect(speed).toHaveAttribute("data-source-pages", "69-74");
  await expect(turns).toHaveAttribute("data-route-hash", "#manual-section-ch3-turns");
  await expect(turns).toHaveAttribute("data-source-pages", "75");
  await expect(overtaking).toHaveAttribute("data-route-hash", "#manual-section-ch3-overtaking");
  await expect(overtaking).toHaveAttribute("data-source-pages", "76-77");
  await expect(highways).toHaveAttribute("data-route-hash", "#manual-section-ch3-highways");
  await expect(highways).toHaveAttribute("data-source-pages", "78");
  await expect(adverseConditions).toHaveAttribute("data-route-hash", "#manual-section-ch3-adverse-conditions");
  await expect(adverseConditions).toHaveAttribute("data-source-pages", "79-82");
  await expect(stoppingParking).toHaveAttribute("data-route-hash", "#manual-section-ch3-stopping-parking");
  await expect(stoppingParking).toHaveAttribute("data-source-pages", "83-88");
  await expect(alcoholDrugs).toHaveAttribute("data-route-hash", "#manual-section-ch4-alcohol-drugs");
  await expect(alcoholDrugs).toHaveAttribute("data-source-pages", "90-93");
  await expect(sleepFatigue).toHaveAttribute("data-route-hash", "#manual-section-ch4-sleep-fatigue");
  await expect(sleepFatigue).toHaveAttribute("data-source-pages", "93-94");
  await expect(stress).toHaveAttribute("data-route-hash", "#manual-section-ch4-stress");
  await expect(stress).toHaveAttribute("data-source-pages", "94-95");
  await expect(distractions).toHaveAttribute("data-route-hash", "#manual-section-ch4-distractions");
  await expect(distractions).toHaveAttribute("data-source-pages", "95-97");
  await expect(attitudeTypes).toHaveAttribute("data-route-hash", "#manual-section-ch5-attitude-types");
  await expect(attitudeTypes).toHaveAttribute("data-source-pages", "99");
  await expect(equalSociety).toHaveAttribute("data-route-hash", "#manual-section-ch5-equal-society");
  await expect(equalSociety).toHaveAttribute("data-source-pages", "99-100");
  await expect(genderViolencePrevention).toHaveAttribute("data-route-hash", "#manual-section-ch5-gender-violence-prevention");
  await expect(genderViolencePrevention).toHaveAttribute("data-source-pages", "100-101");
  await expect(anticipatoryEfficientDriving).toHaveAttribute("data-route-hash", "#manual-section-ch5-anticipatory-efficient-driving");
  await expect(anticipatoryEfficientDriving).toHaveAttribute("data-source-pages", "101-103");
  await expect(reader.locator('[data-route-hash="#manual-page-021"]')).toHaveCount(0);
  await expect(reader.locator('[data-route-hash="#manual-page-043"]')).toHaveCount(0);
  await expect(reader.locator('[data-route-hash="#manual-page-056"]')).toHaveCount(0);
  await expect(reader.locator('[data-route-hash="#manual-page-057"]')).toHaveCount(0);
  await expect(reader.locator('[data-route-hash="#manual-page-089"]')).toHaveCount(0);
  await expect(reader.locator('[data-route-hash="#manual-page-098"]')).toHaveCount(0);
  await expect(reader.locator('[data-manual-page-id^="manual-page-"]')).toHaveCount(0);
  await expect(content).not.toContainText("К УСТОЙЧИВОЙ МОБИЛЬНОСТИ");
  await expect(content).not.toContainText("placeholder");

  await cities.click();
  await expect(page).toHaveURL(/#manual-section-ch1-cities-for-people$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch1-cities-for-people");
  await expect(cities).toHaveAttribute("aria-current", "page");
  await expect(chapter1.locator(".manual-guide-children button.active")).toHaveCount(1);
  await expect(sustainable).not.toHaveClass(/active/);

  const section = content.getByTestId("manual-guide-section");
  await expect(section).toBeVisible();
  await expect(section).toHaveAttribute("data-manual-section-id", "ch1-cities-for-people");
  await expect(section.getByRole("heading", { name: "Города для людей" })).toBeVisible();
  await expect(section).toContainText("пространство совместной жизни");
  await expect(section).toContainText("больше девяти миллионов поездок в день");
  const principlePair = section.locator('[data-block-kind="principle-pair"]');
  await expect(principlePair).toBeVisible();
  await expect(principlePair).toContainText("ПЛАВНОСТЬ");
  await expect(principlePair).toContainText("БЕЗОПАСНОСТЬ");
  await expect(section).not.toContainText("¿Qué es la movilidad sustentable?");
  await expect(section).not.toContainText("Prioridad peatonal");
  await expect(section.locator("iframe, object, embed")).toHaveCount(0);
  await expect(section.locator('[data-testid="manual-page-canvas"], [data-testid="manual-source-mask"]')).toHaveCount(0);

  const issues = await section.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }
    for (const element of Array.from(root.querySelectorAll('[data-testid="manual-guide-section-block"], .manual-principle-terms strong'))) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const id = element.getAttribute("data-block-id") ?? element.textContent?.trim() ?? "unknown";
      if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        problems.push(`${id} overflows viewport horizontally`);
      }
      if (style.pointerEvents === "none") problems.push(`${id} disables pointer interaction`);
      if (style.userSelect === "none") problems.push(`${id} disables text selection`);
      if (style.whiteSpace === "pre" || style.whiteSpace === "pre-line") problems.push(`${id} forces PDF-style line breaks`);
    }
    return problems;
  });
  expect(issues).toEqual([]);

  const selectedText = await section.evaluate((root) => {
    const selection = window.getSelection();
    const principle = root.querySelector('[data-block-kind="principle-pair"]');
    if (!selection || !principle) return "";
    const range = document.createRange();
    range.selectNodeContents(principle);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    selection.removeAllRanges();
    return text;
  });
  expect(selectedText).toContain("ПЛАВНОСТЬ");
  expect(selectedText).toContain("БЕЗОПАСНОСТЬ");

  await section.screenshot({
    path: testInfo.outputPath(`ch1-cities-for-people-${testInfo.project.name}.png`)
  });

  await page.goto("/#manual-section-ch1-cities-for-people");
  await expect(page).toHaveURL(/#manual-section-ch1-cities-for-people$/);
  await expect(page.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(page.getByTestId("manual-guide-section")).toHaveAttribute("data-manual-section-id", "ch1-cities-for-people");

  await sustainable.click();
  await expect(page).toHaveURL(/#manual-section-ch1-sustainable-mobility$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch1-sustainable-mobility");
  await expect(sustainable).toHaveAttribute("aria-current", "page");
  await expect(chapter1.locator(".manual-guide-children button.active")).toHaveCount(1);
  await expect(cities).not.toHaveClass(/active/);

  const sustainableSection = content.getByTestId("manual-guide-section");
  await expect(sustainableSection).toHaveAttribute("data-manual-section-id", "ch1-sustainable-mobility");
  await expect(sustainableSection.getByRole("heading", { name: "Что такое устойчивая мобильность?" })).toBeVisible();
  await expect(sustainableSection).toContainText("9 млн поездок в день");
  await expect(sustainableSection).toContainText("3,5 млн");
  await expect(sustainableSection).toContainText("межюрисдикционных поездок");
  await expect(sustainableSection).toContainText("5,5 млн");
  await expect(sustainableSection).toContainText("внутренних поездок");
  await expect(sustainableSection).toContainText("Сколько места нужно 50 людям");
  await expect(sustainableSection).toContainText("Мобильность - это право");
  await expect(sustainableSection).toContainText("Использование дороги с учетом уязвимости");
  await expect(sustainableSection).toContainText("Такси / автомобиль");
  await expect(sustainableSection.locator('[data-block-kind="mobility-context"]')).toBeVisible();
  await expect(sustainableSection.locator('[data-block-kind="vulnerability-ranking"]')).toBeVisible();
  await expect(sustainableSection.locator('img[data-visible-spanish="false"]')).toHaveCount(2);
  await expect(sustainableSection).not.toContainText("Contexto");
  await expect(sustainableSection).not.toContainText("Ciudad de Buenos Aires");
  await expect(sustainableSection).not.toContainText("Prioridad peatonal");
  await expect(sustainableSection.locator("iframe, object, embed")).toHaveCount(0);
  await expect(sustainableSection.locator('[data-testid="manual-page-canvas"], [data-testid="manual-source-mask"]')).toHaveCount(0);

  const sustainableIssues = await sustainableSection.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }
    for (const scroller of Array.from(root.querySelectorAll(".manual-source-row-scroll"))) {
      if (scroller.scrollWidth > scroller.clientWidth + tolerance) {
        const parentBlock = scroller.closest("[data-block-id]");
        problems.push(`${parentBlock?.getAttribute("data-block-id") ?? "source row"} requires horizontal scroll`);
      }
    }
    if (root.querySelector(".manual-space-labels")?.getAttribute("aria-hidden") === "true") {
      problems.push("space comparison labels are hidden from assistive technology");
    }
    for (const element of Array.from(root.querySelectorAll('[data-testid="manual-guide-section-block"], .manual-space-labels span, .manual-vulnerability-labels span, .manual-mobile-pair-label'))) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const id = element.getAttribute("data-block-id") ?? element.textContent?.trim() ?? "unknown";
      if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        const scrollParent = element.closest(".manual-source-row-scroll");
        if (!scrollParent) problems.push(`${id} overflows viewport horizontally`);
      }
      if (style.pointerEvents === "none") problems.push(`${id} disables pointer interaction`);
      if (style.userSelect === "none") problems.push(`${id} disables text selection`);
      if (style.whiteSpace === "pre" || style.whiteSpace === "pre-line") problems.push(`${id} forces PDF-style line breaks`);
    }
    for (const label of Array.from(root.querySelectorAll(".manual-vulnerability-labels span, .manual-mobile-pair-label"))) {
      for (const node of Array.from(label.childNodes)) {
        const word = node.textContent?.trim() ?? "";
        if (node.nodeType !== Node.TEXT_NODE || !word || /\s/.test(word)) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        const lineCount = Array.from(range.getClientRects()).filter((rect) => rect.width > 1 && rect.height > 1).length;
        if (lineCount > 1) problems.push(`${word} wraps inside a word`);
      }
    }
    if (window.matchMedia("(max-width: 760px)").matches) {
      const pairGroups = [
        { name: "space comparison", selector: ".manual-space-mobile-pair", expected: 4 },
        { name: "vulnerability ranking", selector: ".manual-vulnerability-mobile-pair", expected: 6 }
      ];
      for (const group of pairGroups) {
        const visiblePairs = Array.from(root.querySelectorAll(group.selector)).filter((pair) => window.getComputedStyle(pair).display !== "none");
        if (visiblePairs.length !== group.expected) {
          problems.push(`${group.name} has ${visiblePairs.length} visible mobile pairs, expected ${group.expected}`);
        }
        for (const pair of visiblePairs) {
          const label = pair.querySelector(".manual-mobile-pair-label");
          const icon = pair.querySelector(".manual-mobile-pair-icon");
          const pairRect = pair.getBoundingClientRect();
          const id = pair.getAttribute("data-mobile-pair-id") ?? pair.textContent?.trim() ?? group.name;
          if (!label || !icon) {
            problems.push(`${group.name} ${id} is missing a paired label or icon`);
            continue;
          }
          const labelRect = label.getBoundingClientRect();
          const iconRect = icon.getBoundingClientRect();
          if (iconRect.width <= 1 || iconRect.height <= 1) {
            problems.push(`${group.name} ${id} icon is not visible`);
          }
          const labelCenter = (labelRect.left + labelRect.right) / 2;
          const iconCenter = (iconRect.left + iconRect.right) / 2;
          if (Math.abs(labelCenter - iconCenter) > Math.max(12, pairRect.width * 0.12)) {
            problems.push(`${group.name} ${id} label is not centered with its icon`);
          }
          if (labelRect.left < pairRect.left - tolerance || labelRect.right > pairRect.right + tolerance || iconRect.left < pairRect.left - tolerance || iconRect.right > pairRect.right + tolerance) {
            problems.push(`${group.name} ${id} label/icon escapes its pair`);
          }
          if (iconRect.top < labelRect.bottom - tolerance) {
            problems.push(`${group.name} ${id} icon overlaps its label`);
          }
        }
      }
    }
    return problems;
  });
  expect(sustainableIssues).toEqual([]);

  const sustainableSelectedText = await sustainableSection.evaluate((root) => {
    const selection = window.getSelection();
    const infographic = root.querySelector('[data-block-kind="mobility-context"]');
    if (!selection || !infographic) return "";
    const range = document.createRange();
    range.selectNodeContents(infographic);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    selection.removeAllRanges();
    return text;
  });
  expect(sustainableSelectedText.toLocaleLowerCase("ru-RU")).toContain("9 млн поездок в день");
  expect(sustainableSelectedText.toLocaleLowerCase("ru-RU")).toContain("на автомобиле");

  await sustainableSection.screenshot({
    path: testInfo.outputPath(`ch1-sustainable-mobility-${testInfo.project.name}.png`)
  });

  await page.goto("/#manual-section-ch1-sustainable-mobility");
  await expect(page).toHaveURL(/#manual-section-ch1-sustainable-mobility$/);
  await expect(page.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(page.getByTestId("manual-guide-section")).toHaveAttribute("data-manual-section-id", "ch1-sustainable-mobility");

  await pedestrian.click();
  await expect(page).toHaveURL(/#manual-section-ch1-pedestrian-priority$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch1-pedestrian-priority");
  await expect(pedestrian).toHaveAttribute("aria-current", "page");
  await expect(chapter1.locator(".manual-guide-children button.active")).toHaveCount(1);
  await expect(sustainable).not.toHaveClass(/active/);

  const pedestrianSection = content.getByTestId("manual-guide-section");
  await expect(pedestrianSection).toHaveAttribute("data-manual-section-id", "ch1-pedestrian-priority");
  await expect(pedestrianSection.getByRole("heading", { name: "Пешеходный приоритет" })).toBeVisible();
  await expect(pedestrianSection).toContainText("каждый человек является пешеходом");
  await expect(pedestrianSection).toContainText("Av. Julio Argentino Roca");
  await expect(pedestrianSection).toContainText("Фазы удара при наезде");
  await expect(pedestrianSection).toContainText("40 км/ч");
  await expect(pedestrianSection).toContainText("мигает оранжевым");
  await expect(pedestrianSection).toContainText("электрических самокатов");
  await expect(pedestrianSection).toContainText("Максимальная скорость");
  await expect(pedestrianSection).toContainText("10 км/ч");
  await expect(pedestrianSection).toContainText("ближе 10 метров");
  await expect(pedestrianSection).toContainText("Tribunales, Retiro, Casco Histórico, Once, Microcentro и Corrientes");
  await expect(pedestrianSection).toContainText("11:00 до 16:00");
  await expect(pedestrianSection).toContainText("электронный контроль");
  await expect(pedestrianSection).toContainText("с 7 до 21 часов");
  await expect(pedestrianSection).toContainText("19:00 до 02:00");
  await expect(pedestrianSection).toContainText("телефон 147");
  await expect(pedestrianSection).toContainText("Общественный транспорт");
  await expect(pedestrianSection).toContainText("5% может уменьшить количество погибших");
  await expect(pedestrianSection).toContainText("30%");
  await expect(pedestrianSection.locator('[data-block-kind="pedestrian-photo-comparison"]')).toBeVisible();
  await expect(pedestrianSection.locator('[data-block-kind="impact-diagram"]')).toBeVisible();
  await expect(pedestrianSection.locator('[data-block-kind="pedestrian-infrastructure"]')).toHaveCount(5);
  await expect(pedestrianSection.locator('[data-card-id="area-infrastructure"] .manual-infrastructure-visual')).toHaveCount(0);
  await expect(pedestrianSection.locator('[data-block-kind="priority-area-map"]')).toBeVisible();
  await expect(pedestrianSection.locator('[data-block-kind="transport-mode-icons"]')).toBeVisible();
  const pedestrianImages = pedestrianSection.locator("img");
  const pedestrianImageCount = await pedestrianImages.count();
  for (let index = 0; index < pedestrianImageCount; index += 1) {
    const image = pedestrianImages.nth(index);
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0 && element.naturalHeight > 0))
      .toBe(true);
  }
  await expect(pedestrianSection.locator('img[data-visible-spanish="false"]')).toHaveCount(5);
  const pedestrianOriginalSourceImages = pedestrianSection.locator('img[data-source-image-exception="source-image-original-visible-text"]');
  await expect(pedestrianOriginalSourceImages).toHaveCount(8);
  await expect(
    pedestrianOriginalSourceImages.evaluateAll((images) =>
      images.every(
        (image) =>
          image.getAttribute("data-visible-spanish") === "true" &&
          image.getAttribute("data-visible-spanish-scope") === "source-image-only" &&
          image.getAttribute("data-source-as-is") === "true"
      )
    )
  ).resolves.toBe(true);
  const pedestrianRestrictionSigns = pedestrianSection.locator('img[data-official-sign-exception="official-traffic-sign-source-as-is"]');
  await expect(pedestrianRestrictionSigns).toHaveCount(1);
  await expect(pedestrianRestrictionSigns).toHaveAttribute("src", /restriction-signs-source-as-is\.png/);
  await expect(pedestrianRestrictionSigns).toHaveAttribute("data-visible-spanish", "true");
  await expect(pedestrianRestrictionSigns).toHaveAttribute("data-visible-spanish-scope", "official-sign-image-only");
  await expect(pedestrianRestrictionSigns).toHaveAttribute("data-source-as-is", "true");
  await expect(
    pedestrianSection.locator(".manual-restriction-signs, .manual-no-parking-sign, .manual-authorized-sign, .manual-control-sign")
  ).toHaveCount(0);
  await expect(pedestrianSection).not.toContainText("Prioridad peatonal");
  await expect(pedestrianSection).not.toContainText("ANTES");
  await expect(pedestrianSection).not.toContainText("DESPUÉS");
  await expect(pedestrianSection).not.toContainText("Cruce de peatones");
  await expect(pedestrianSection).not.toContainText("Restricción vehículos particulares");
  await expect(pedestrianSection.locator("iframe, object, embed")).toHaveCount(0);
  await expect(pedestrianSection.locator('[data-testid="manual-page-canvas"], [data-testid="manual-source-mask"]')).toHaveCount(0);

  const pedestrianIssues = await pedestrianSection.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }
    for (const element of Array.from(
      root.querySelectorAll(
        '[data-testid="manual-guide-section-block"], .manual-infrastructure-card, .manual-infrastructure-copy p, .manual-priority-map-layout, .manual-transport-icon-labels span, .manual-impact-phases li'
      )
    )) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const id = element.getAttribute("data-block-id") ?? element.getAttribute("data-card-id") ?? element.textContent?.trim() ?? "unknown";
      if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        problems.push(`${id} overflows viewport horizontally`);
      }
      if (style.pointerEvents === "none") problems.push(`${id} disables pointer interaction`);
      if (style.userSelect === "none") problems.push(`${id} disables text selection`);
      if (style.whiteSpace === "pre" || style.whiteSpace === "pre-line") problems.push(`${id} forces PDF-style line breaks`);
    }
    for (const image of Array.from(root.querySelectorAll("img"))) {
      const visibleSpanish = image.getAttribute("data-visible-spanish");
      const officialSignException = image.getAttribute("data-official-sign-exception");
      const sourceImageException = image.getAttribute("data-source-image-exception");
      const src = image.getAttribute("src") ?? "";
      if (
        visibleSpanish !== "false" &&
        officialSignException !== "official-traffic-sign-source-as-is" &&
        sourceImageException !== "source-image-original-visible-text"
      ) {
        problems.push(`${src} has visible Spanish without an allowed source-image exception`);
      }
      if (officialSignException === "official-traffic-sign-source-as-is") {
        if (visibleSpanish !== "true") problems.push(`${src} official sign exception must record visible-Spanish=true`);
        if (image.getAttribute("data-visible-spanish-scope") !== "official-sign-image-only") problems.push(`${src} has wrong sign exception scope`);
        if (image.getAttribute("data-source-as-is") !== "true") problems.push(`${src} must record source-as-is`);
        const rect = image.getBoundingClientRect();
        if (rect.width > image.naturalWidth + tolerance) problems.push(`${src} must not be upscaled beyond source crop width`);
      }
      if (sourceImageException === "source-image-original-visible-text") {
        if (visibleSpanish !== "true") problems.push(`${src} source image exception must record visible-Spanish=true`);
        if (image.getAttribute("data-visible-spanish-scope") !== "source-image-only") problems.push(`${src} has wrong source-image exception scope`);
        if (image.getAttribute("data-source-as-is") !== "true") problems.push(`${src} must record source-as-is`);
        const rect = image.getBoundingClientRect();
        if (rect.width > image.naturalWidth + tolerance) problems.push(`${src} must not be upscaled beyond source crop width`);
      }
      if (/pages\/page-02[4-9]\.jpg/u.test(src)) problems.push(`${src} renders a full source page raster`);
    }
    for (const visual of Array.from(root.querySelectorAll(".manual-infrastructure-visual"))) {
      if (!visual.firstElementChild) problems.push("empty pedestrian infrastructure visual slot");
    }
    return problems;
  });
  expect(pedestrianIssues).toEqual([]);

  const pedestrianSelectedText = await pedestrianSection.evaluate((root) => {
    const selection = window.getSelection();
    if (!selection) return "";
    const range = document.createRange();
    range.selectNodeContents(root);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    selection.removeAllRanges();
    return text;
  });
  const pedestrianSelectedTextLower = pedestrianSelectedText.toLocaleLowerCase("ru-RU");
  expect(pedestrianSelectedTextLower).toContain("до");
  expect(pedestrianSelectedTextLower).toContain("после");
  expect(pedestrianSelectedTextLower).toContain("контакт");
  expect(pedestrianSelectedTextLower).toContain("электронный контроль");
  expect(pedestrianSelectedTextLower).toContain("пешком");

  await pedestrianSection.screenshot({
    path: testInfo.outputPath(`ch1-pedestrian-priority-${testInfo.project.name}.png`)
  });

  await page.goto("/#manual-section-ch1-pedestrian-priority");
  await expect(page).toHaveURL(/#manual-section-ch1-pedestrian-priority$/);
  await expect(page.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(page.getByTestId("manual-guide-section")).toHaveAttribute("data-manual-section-id", "ch1-pedestrian-priority");

  await bicycle.click();
  await expect(page).toHaveURL(/#manual-section-ch1-bicycle$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch1-bicycle");
  await expect(bicycle).toHaveAttribute("aria-current", "page");
  await expect(chapter1.locator(".manual-guide-children button.active")).toHaveCount(1);
  await expect(pedestrian).not.toHaveClass(/active/);

  const bicycleSection = content.getByTestId("manual-guide-section");
  await expect(bicycleSection).toHaveAttribute("data-manual-section-id", "ch1-bicycle");
  await expect(bicycleSection.getByRole("heading", { name: "Велосипед", exact: true })).toBeVisible();
  await expect(bicycleSection).toContainText("Цепь должна быть натянута");
  await expect(bicycleSection).toContainText("дополнительного сиденья, подножек и ручки");
  await expect(bicycleSection).toContainText("4,20 м");
  await expect(bicycleSection).toContainText("старше 18 лет");
  await expect(bicycleSection).toContainText("1500 ватт");
  await expect(bicycleSection).toContainText("Знаки на изображении оставлены как в официальном источнике");
  await expect(bicycleSection).toContainText("Конец защищенной велодорожки");
  await expect(bicycleSection).toContainText("Сойти с велосипеда");
  await expect(bicycleSection).toContainText("На защищенных велодорожках запрещены остановка и стоянка каждый день 24 часа");
  await expect(bicycleSection).toContainText("эвакуация");
  await expect(bicycleSection).toContainText("Запрещено ехать на велосипеде, держась за другие транспортные средства");
  await expect(bicycleSection).toContainText("1,5 м");
  await expect(bicycleSection).toContainText("Поворот налево");
  await expect(bicycleSection).toContainText("BA Ecobici by Tembici");
  await expect(bicycleSection).toContainText("500 ватт");
  await expect(bicycleSection).toContainText("нельзя перевозить пассажира");
  await expect(bicycleSection.locator('[data-block-kind="bicycle-benefits"]')).toBeVisible();
  await expect(bicycleSection.locator('[data-block-kind="bicycle-helmet-fit"]')).toBeVisible();
  await expect(bicycleSection.locator('[data-block-kind="bicycle-gear"]')).toBeVisible();
  await expect(bicycleSection.locator('[data-block-kind="bicycle-signage"]')).toBeVisible();
  await expect(bicycleSection.locator('[data-block-kind="bicycle-posture"]')).toBeVisible();
  await expect(bicycleSection.locator('[data-block-kind="bicycle-distance"]')).toBeVisible();
  await expect(bicycleSection.locator('[data-block-kind="bicycle-hand-signals"]')).toBeVisible();
  await expect(bicycleSection.locator('[data-block-kind="pedestrian-infrastructure"]')).toHaveCount(2);
  await expect(bicycleSection.locator('[data-block-kind="source-artwork"]')).toHaveCount(2);
  await expect(bicycleSection.locator('img[data-visible-spanish="false"]')).toHaveCount(11);
  await expect(bicycleSection.locator('img[data-source-image-exception="source-image-original-visible-text"]')).toHaveCount(2);
  const bicycleSignSheet = bicycleSection.locator('img[data-official-sign-exception="official-traffic-sign-source-as-is"]');
  await expect(bicycleSignSheet).toHaveCount(1);
  await expect(bicycleSignSheet).toHaveAttribute("src", /bicycle-signs-source-as-is\.jpg/);
  await expect(bicycleSignSheet).toHaveAttribute("data-visible-spanish", "true");
  await expect(bicycleSignSheet).toHaveAttribute("data-visible-spanish-scope", "official-sign-image-only");
  await expect(bicycleSection.locator(".manual-bicycle-sign-grid, .manual-bicycle-sign-marker")).toHaveCount(0);
  await expect(bicycleSection).not.toContainText("Sistema de transporte público");
  await expect(bicycleSection).not.toContainText("Viaje compartido");
  await expect(bicycleSection).not.toContainText("Responsabilidades legales");
  await expect(bicycleSection).not.toContainText("Acompanante");
  await expect(bicycleSection).not.toContainText("Стоянка или станция велосипедов");
  await expect(bicycleSection.locator("iframe, object, embed")).toHaveCount(0);
  await expect(bicycleSection.locator('[data-testid="manual-page-canvas"], [data-testid="manual-source-mask"]')).toHaveCount(0);

  const bicycleIssues = await bicycleSection.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }
    for (const element of Array.from(
      root.querySelectorAll(
        '[data-testid="manual-guide-section-block"], .manual-bicycle-sign-sheet, .manual-bicycle-sign-sheet img, .manual-bicycle-sign-notes li, .manual-bicycle-helmet-labels span, .manual-bicycle-signal-labels article, .manual-bicycle-distance-grid article, .manual-infrastructure-card, .manual-infrastructure-copy p'
      )
    )) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const id = element.getAttribute("data-block-id") ?? element.getAttribute("data-card-id") ?? element.textContent?.trim() ?? "unknown";
      if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        problems.push(`${id} overflows viewport horizontally`);
      }
      if (style.pointerEvents === "none") problems.push(`${id} disables pointer interaction`);
      if (style.userSelect === "none") problems.push(`${id} disables text selection`);
      if (style.whiteSpace === "pre" || style.whiteSpace === "pre-line") problems.push(`${id} forces PDF-style line breaks`);
    }
    for (const image of Array.from(root.querySelectorAll("img"))) {
      const visibleSpanish = image.getAttribute("data-visible-spanish");
      const officialSignException = image.getAttribute("data-official-sign-exception");
      const sourceImageException = image.getAttribute("data-source-image-exception");
      const src = image.getAttribute("src") ?? "";
      if (
        visibleSpanish !== "false" &&
        officialSignException !== "official-traffic-sign-source-as-is" &&
        sourceImageException !== "source-image-original-visible-text"
      ) {
        problems.push(`${src} has visible Spanish without allowed source-image exception`);
      }
      if (officialSignException === "official-traffic-sign-source-as-is") {
        if (visibleSpanish !== "true") problems.push(`${src} official sign exception must record visible-Spanish=true`);
        if (image.getAttribute("data-visible-spanish-scope") !== "official-sign-image-only") problems.push(`${src} has wrong sign exception scope`);
        if (image.getAttribute("data-source-as-is") !== "true") problems.push(`${src} must record source-as-is`);
      }
      if (sourceImageException === "source-image-original-visible-text") {
        if (visibleSpanish !== "true") problems.push(`${src} source image exception must record visible-Spanish=true`);
        if (image.getAttribute("data-visible-spanish-scope") !== "source-image-only") problems.push(`${src} has wrong source-image exception scope`);
        if (image.getAttribute("data-source-as-is") !== "true") problems.push(`${src} must record source-as-is`);
      }
      if (/pages\/page-03[0-8]\.jpg/u.test(src)) problems.push(`${src} renders a full source page raster`);
    }
    for (const marker of Array.from(root.querySelectorAll(".manual-bicycle-helmet-labels span, .manual-bicycle-signal-labels article"))) {
      const markerRect = marker.getBoundingClientRect();
      const parentRect = marker.parentElement?.getBoundingClientRect();
      const text = marker.textContent?.trim() ?? "bicycle label";
      const style = window.getComputedStyle(marker);
      if (!parentRect) {
        problems.push(`${text} has no parent container`);
        continue;
      }
      if (markerRect.width > viewportWidth + tolerance || markerRect.left < -tolerance || markerRect.right > viewportWidth + tolerance) {
        problems.push(`${text} overflows its parent container`);
      }
      if (style.wordBreak === "break-all" || style.overflowWrap === "anywhere") {
        problems.push(`${text} may split at letter level`);
      }
    }
    return problems;
  });
  expect(bicycleIssues).toEqual([]);

  const bicycleSelectedText = await bicycleSection.evaluate((root) => {
    const selection = window.getSelection();
    if (!selection) return "";
    const range = document.createRange();
    range.selectNodeContents(root);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    selection.removeAllRanges();
    return text;
  });
  expect(bicycleSelectedText).toContain("Правильно");
  expect(bicycleSelectedText).toContain("Слишком низко");
  expect(bicycleSelectedText).toContain("Знаки на изображении оставлены как в официальном источнике");
  expect(bicycleSelectedText).toContain("Конец защищенной велодорожки");
  expect(bicycleSelectedText).toContain("Сойти с велосипеда");
  expect(bicycleSelectedText).toContain("Запрещено ехать на велосипеде");
  expect(bicycleSelectedText).toContain("Поворот налево");
  expect(bicycleSelectedText).toContain("1,5 м");
  expect(bicycleSelectedText).toContain("500 ватт");

  await bicycleSection.screenshot({
    path: testInfo.outputPath(`ch1-bicycle-${testInfo.project.name}.png`)
  });

  await publicTransport.click();
  await expect(page).toHaveURL(/#manual-section-ch1-public-transport-system$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch1-public-transport-system");
  await expect(publicTransport).toHaveAttribute("aria-current", "page");
  await expect(chapter1.locator(".manual-guide-children button.active")).toHaveCount(1);
  await expect(bicycle).not.toHaveClass(/active/);

  const publicTransportSection = content.getByTestId("manual-guide-section");
  await expect(publicTransportSection).toHaveAttribute("data-manual-section-id", "ch1-public-transport-system");
  await expect(publicTransportSection.getByRole("heading", { name: "Система общественного транспорта", exact: true })).toBeVisible();
  await expect(publicTransportSection).toContainText("уменьшить выбросы CO2");
  await expect(publicTransportSection).toContainText("40-50");
  await expect(publicTransportSection).toContainText("3-4");
  await expect(publicTransportSection).toContainText("Желтые боксы");
  await expect(publicTransportSection).toContainText("Выступы для ожидания автобусов");
  await expect(publicTransportSection).toContainText("Эксклюзивные полосы");
  await expect(publicTransportSection).toContainText("бесплатное разрешение");
  await expect(publicTransportSection).toContainText("Metrobus de Buenos Aires");
  await expect(publicTransportSection).toContainText("красная дорожка");
  await expect(publicTransportSection).toContainText("через соответствующий пандус");
  await expect(publicTransportSection).toContainText("удержания водительского удостоверения");
  await expect(publicTransportSection).toContainText("Пересадочные центры");
  await expect(publicTransportSection.locator('[data-block-kind="public-transport-comparison"]')).toBeVisible();
  await expect(publicTransportSection.locator('[data-block-kind="public-transport-infrastructure"]')).toBeVisible();
  await expect(publicTransportSection.locator('img[data-visible-spanish="false"]')).toHaveCount(4);
  const publicTransportSourceImages = publicTransportSection.locator('img[data-source-image-exception="source-image-original-visible-text"]');
  await expect(publicTransportSourceImages).toHaveCount(2);
  await expect(publicTransportSourceImages.nth(0)).toHaveAttribute("src", /exclusive-lane-source\.jpg/);
  await expect(publicTransportSourceImages.nth(1)).toHaveAttribute("src", /metrobus-source\.jpg/);
  await expect(publicTransportSourceImages.nth(0)).toHaveAttribute("data-visible-spanish", "true");
  await expect(publicTransportSourceImages.nth(0)).toHaveAttribute("data-visible-spanish-scope", "source-image-only");
  await expect(publicTransportSourceImages.nth(0)).toHaveAttribute("data-source-as-is", "true");
  await expect(publicTransportSection).not.toContainText("Viaje compartido");
  await expect(publicTransportSection).not.toContainText("Responsabilidades legales");
  await expect(publicTransportSection.locator("iframe, object, embed")).toHaveCount(0);
  await expect(publicTransportSection.locator('[data-testid="manual-page-canvas"], [data-testid="manual-source-mask"]')).toHaveCount(0);

  const publicTransportIssues = await publicTransportSection.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }
    for (const element of Array.from(
      root.querySelectorAll(
        '[data-testid="manual-guide-section-block"], .manual-public-transport-card, .manual-public-transport-copy p, .manual-public-transport-facts article, .manual-public-transport-comparison figcaption'
      )
    )) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const id = element.getAttribute("data-block-id") ?? element.getAttribute("data-card-id") ?? element.textContent?.trim() ?? "unknown";
      if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        problems.push(`${id} overflows viewport horizontally`);
      }
      if (style.pointerEvents === "none") problems.push(`${id} disables pointer interaction`);
      if (style.userSelect === "none") problems.push(`${id} disables text selection`);
      if (style.whiteSpace === "pre" || style.whiteSpace === "pre-line") problems.push(`${id} forces PDF-style line breaks`);
    }
    for (const image of Array.from(root.querySelectorAll("img"))) {
      const visibleSpanish = image.getAttribute("data-visible-spanish");
      const sourceImageException = image.getAttribute("data-source-image-exception");
      const src = image.getAttribute("src") ?? "";
      if (visibleSpanish !== "false" && sourceImageException !== "source-image-original-visible-text") {
        problems.push(`${src} has visible Spanish without allowed source-image exception`);
      }
      if (sourceImageException === "source-image-original-visible-text") {
        if (visibleSpanish !== "true") problems.push(`${src} source image exception must record visible-Spanish=true`);
        if (image.getAttribute("data-visible-spanish-scope") !== "source-image-only") problems.push(`${src} has wrong source-image exception scope`);
        if (image.getAttribute("data-source-as-is") !== "true") problems.push(`${src} must record source-as-is`);
      }
      if (/pages\/page-0(?:39|40)\.jpg/u.test(src)) problems.push(`${src} renders a full source page raster`);
    }
    return problems;
  });
  expect(publicTransportIssues).toEqual([]);

  if (testInfo.project.name === "chromium") {
    await expect(publicTransportSection.locator(".manual-public-transport-comparison-layout")).toHaveCSS("grid-template-columns", /px .*px/);
    await expect(publicTransportSection.locator(".manual-public-transport-card").first()).toHaveCSS("grid-template-columns", /px .*px/);
    for (const width of [761, 768, 785]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page).toHaveURL(/#manual-section-ch1-public-transport-system$/);
      await expect(publicTransportSection).toHaveAttribute("data-manual-section-id", "ch1-public-transport-system");
      await expect(publicTransportSection.locator(".manual-public-transport-comparison-layout")).toHaveCSS("grid-template-columns", /^[0-9.]+px$/);
      await expect(publicTransportSection.locator(".manual-public-transport-card").first()).toHaveCSS("grid-template-columns", /^[0-9.]+px$/);
      const narrowIssues = await publicTransportSection.evaluate((root) => {
        const tolerance = 2;
        const viewportWidth = document.documentElement.clientWidth;
        const problems: string[] = [];
        if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
          problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
        }
        for (const element of Array.from(root.querySelectorAll(".manual-public-transport-comparison, .manual-public-transport-comparison-layout, .manual-public-transport-facts article, .manual-public-transport-card-grid, .manual-public-transport-card, .manual-public-transport-copy"))) {
          const rect = element.getBoundingClientRect();
          const id = element.getAttribute("data-block-id") ?? element.textContent?.trim() ?? "unknown";
          if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
            problems.push(`${id} overflows viewport horizontally`);
          }
        }
        return problems;
      });
      expect(narrowIssues, `public transport comparison fits at ${width}px`).toEqual([]);
    }
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(publicTransportSection.locator(".manual-public-transport-comparison-layout")).toHaveCSS("grid-template-columns", /px .*px/);
    await expect(publicTransportSection.locator(".manual-public-transport-card").first()).toHaveCSS("grid-template-columns", /px .*px/);
  }

  const publicTransportSelectedText = await publicTransportSection.evaluate((root) => {
    const selection = window.getSelection();
    if (!selection) return "";
    const range = document.createRange();
    range.selectNodeContents(root);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    selection.removeAllRanges();
    return text;
  });
  expect(publicTransportSelectedText).toContain("40-50");
  expect(publicTransportSelectedText).toContain("Желтые боксы");
  expect(publicTransportSelectedText).toContain("Metrobus de Buenos Aires");
  expect(publicTransportSelectedText).toContain("Пересадочные центры");

  await publicTransportSection.screenshot({
    path: testInfo.outputPath(`ch1-public-transport-system-${testInfo.project.name}.png`)
  });

  await page.goto("/#manual-section-ch1-public-transport-system");
  await expect(page).toHaveURL(/#manual-section-ch1-public-transport-system$/);
  await expect(page.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(page.getByTestId("manual-guide-section")).toHaveAttribute("data-manual-section-id", "ch1-public-transport-system");

  await sharedTrip.click();
  await expect(page).toHaveURL(/#manual-section-ch1-shared-trip$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch1-shared-trip");
  await expect(sharedTrip).toHaveAttribute("aria-current", "page");
  await expect(chapter1.locator(".manual-guide-children button.active")).toHaveCount(1);
  await expect(publicTransport).not.toHaveClass(/active/);

  const sharedTripSection = content.getByTestId("manual-guide-section");
  await expect(sharedTripSection).toHaveAttribute("data-manual-section-id", "ch1-shared-trip");
  await expect(sharedTripSection.getByRole("heading", { name: "Совместная поездка", exact: true })).toBeVisible();
  await expect(sharedTripSection).toContainText("лучше использовать общественное пространство");
  await expect(sharedTripSection).toContainText("ходить пешком");
  await expect(sharedTripSection).toContainText("велосипедом или общественным транспортом");
  await expect(sharedTripSection).toContainText("регулярных поездок");
  await expect(sharedTripSection).toContainText("отдельных маршрутов");
  await expect(sharedTripSection).toContainText("эффект \"на четыре автомобиля меньше\" относится к поездке с другими водителями");
  await expect(sharedTripSection).toContainText("иначе поехали бы за рулем отдельных автомобилей");
  await expect(sharedTripSection).toContainText("Больше места для стоянки");
  await expect(sharedTripSection).toContainText("Бережет окружающую среду");
  await expect(sharedTripSection).toContainText("топливо, плату за проезд и стоянку");
  await expect(sharedTripSection).toContainText("Отдавать приоритет устойчивой мобильности");
  await expect(sharedTripSection.locator('[data-block-kind="shared-trip-benefits"]')).toBeVisible();
  await expect(sharedTripSection.locator('[data-block-kind="shared-trip-closing"]')).toBeVisible();
  await expect(sharedTripSection.locator('img[data-visible-spanish="false"]')).toHaveCount(1);
  const sharedTripSourceImage = sharedTripSection.locator('img[data-source-image-exception="source-image-original-visible-text"]');
  await expect(sharedTripSourceImage).toHaveCount(1);
  await expect(sharedTripSourceImage).toHaveAttribute("src", /mobility-priority-photo-source\.jpg/);
  await expect(sharedTripSourceImage).toHaveAttribute("data-visible-spanish", "true");
  await expect(sharedTripSourceImage).toHaveAttribute("data-visible-spanish-scope", "source-image-only");
  await expect(sharedTripSourceImage).toHaveAttribute("data-source-as-is", "true");
  await expect(sharedTripSection).not.toContainText("Responsabilidades legales");
  await expect(sharedTripSection).not.toContainText("Obligatoria");
  await expect(sharedTripSection.locator("iframe, object, embed")).toHaveCount(0);
  await expect(sharedTripSection.locator('[data-testid="manual-page-canvas"], [data-testid="manual-source-mask"]')).toHaveCount(0);

  const sharedTripIssues = await sharedTripSection.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }
    for (const element of Array.from(
      root.querySelectorAll(
        '[data-testid="manual-guide-section-block"], .manual-shared-trip-benefits-layout, .manual-shared-trip-benefit-grid article, .manual-shared-trip-closing, .manual-shared-trip-quote, .manual-shared-trip-quote blockquote'
      )
    )) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const id = element.getAttribute("data-block-id") ?? element.getAttribute("data-benefit-id") ?? element.textContent?.trim() ?? "unknown";
      if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        problems.push(`${id} overflows viewport horizontally`);
      }
      if (style.pointerEvents === "none") problems.push(`${id} disables pointer interaction`);
      if (style.userSelect === "none") problems.push(`${id} disables text selection`);
      if (style.whiteSpace === "pre" || style.whiteSpace === "pre-line") problems.push(`${id} forces PDF-style line breaks`);
    }
    for (const image of Array.from(root.querySelectorAll("img"))) {
      const visibleSpanish = image.getAttribute("data-visible-spanish");
      const sourceImageException = image.getAttribute("data-source-image-exception");
      const src = image.getAttribute("src") ?? "";
      if (visibleSpanish !== "false" && sourceImageException !== "source-image-original-visible-text") {
        problems.push(`${src} has visible Spanish without allowed source-image exception`);
      }
      if (sourceImageException === "source-image-original-visible-text") {
        if (visibleSpanish !== "true") problems.push(`${src} source image exception must record visible-Spanish=true`);
        if (image.getAttribute("data-visible-spanish-scope") !== "source-image-only") problems.push(`${src} has wrong source-image exception scope`);
        if (image.getAttribute("data-source-as-is") !== "true") problems.push(`${src} must record source-as-is`);
      }
      if (/pages\/page-0(?:41|42)\.jpg/u.test(src)) problems.push(`${src} renders a full source page raster`);
    }
    return problems;
  });
  expect(sharedTripIssues).toEqual([]);

  if (testInfo.project.name === "chromium") {
    await expect(sharedTripSection.locator(".manual-shared-trip-benefits-layout")).toHaveCSS("grid-template-columns", /px .*px/);
    await expect(sharedTripSection.locator(".manual-shared-trip-closing")).toHaveCSS("grid-template-columns", /px .*px/);
    for (const width of [761, 768, 785]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page).toHaveURL(/#manual-section-ch1-shared-trip$/);
      await expect(sharedTripSection).toHaveAttribute("data-manual-section-id", "ch1-shared-trip");
      const narrowIssues = await sharedTripSection.evaluate((root) => {
        const tolerance = 2;
        const viewportWidth = document.documentElement.clientWidth;
        const problems: string[] = [];
        if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
          problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
        }
        for (const element of Array.from(root.querySelectorAll(".manual-shared-trip-benefits, .manual-shared-trip-benefits-layout, .manual-shared-trip-benefit-grid, .manual-shared-trip-benefit-grid article, .manual-shared-trip-closing, .manual-shared-trip-quote"))) {
          const rect = element.getBoundingClientRect();
          const id = element.getAttribute("data-block-id") ?? element.textContent?.trim() ?? "unknown";
          if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
            problems.push(`${id} overflows viewport horizontally`);
          }
        }
        return problems;
      });
      expect(narrowIssues, `shared trip section fits at ${width}px`).toEqual([]);
    }
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(sharedTripSection.locator(".manual-shared-trip-benefits-layout")).toHaveCSS("grid-template-columns", /px .*px/);
    await expect(sharedTripSection.locator(".manual-shared-trip-closing")).toHaveCSS("grid-template-columns", /px .*px/);
  }

  const sharedTripSelectedText = await sharedTripSection.evaluate((root) => {
    const selection = window.getSelection();
    if (!selection) return "";
    const range = document.createRange();
    range.selectNodeContents(root);
    selection.removeAllRanges();
    selection.addRange(range);
    const text = selection.toString();
    selection.removeAllRanges();
    return text;
  });
  expect(sharedTripSelectedText).toContain("эффект \"на четыре автомобиля меньше\" относится к поездке с другими водителями");
  expect(sharedTripSelectedText).toContain("Отдавать приоритет устойчивой мобильности");
  expect(sharedTripSelectedText).toContain("русский смысл вынесен здесь как выбираемый текст");

  await sharedTripSection.screenshot({
    path: testInfo.outputPath(`ch1-shared-trip-${testInfo.project.name}.png`)
  });

  await requiredDocuments.click();
  await expect(page).toHaveURL(/#manual-section-ch2-required-documents$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-2-responsibility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch2-required-documents");
  await expect(requiredDocuments).toHaveAttribute("aria-current", "page");
  const chapter2Section = content.getByTestId("manual-guide-section");
  await expect(chapter2Section).toHaveAttribute("data-manual-section-id", "ch2-required-documents");
  await expect(chapter2Section.getByRole("heading", { name: "Обязательные документы" })).toBeVisible();
  await expect(chapter2Section).toContainText("0,0 г/л");
  await expect(chapter2Section).toContainText("60 000 км");
  await expect(chapter2Section).toContainText("8 лет");
  await expect(chapter2Section).toContainText("80 000 км");
  await expect(chapter2Section).toContainText("допуск 4 000 км");
  await expect(chapter2Section).not.toContainText("После первого прохождения срок становится ежегодным");
  await expect(chapter2Section.locator('[data-source-as-is="true"]')).toHaveCount(6);
  await expect(chapter2Section.locator('[data-source-image-exception="source-document-example-original-visible-text"]')).toHaveCount(6);
  await expect(chapter2Section.locator('[data-visible-spanish-scope="source-document-example-image-only"]')).toHaveCount(6);

  await page.goto("/#manual-section-ch2-scoring");
  await expect(page).toHaveURL(/#manual-section-ch2-scoring$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-2-responsibility");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch2-scoring");
  const scoringSection = content.getByTestId("manual-guide-section");
  await expect(scoringSection).toHaveAttribute("data-manual-section-id", "ch2-scoring");
  await expect(scoringSection).toContainText("20 баллов");
  await expect(scoringSection).not.toContainText("Соблюдать правила дорожного движения означает спасать жизни");
  await expect(scoringSection).not.toContainText("Страница 56 не добавляет правил Scoring");

  await page.goto("/#manual-section-ch3-speed");
  await expect(page).toHaveURL(/#manual-section-ch3-speed$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-3-driving-rules");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch3-speed");
  const speedSection = content.getByTestId("manual-guide-section");
  await expect(speedSection).toHaveAttribute("data-manual-section-id", "ch3-speed");
  await expect(speedSection.getByRole("heading", { name: "Скорость", exact: true })).toBeVisible();
  await expect(speedSection).toContainText("эффекта туннеля");
  await expect(speedSection).toContainText("минимум 2 секунды");
  await expect(speedSection).toContainText("100 км/ч");

  await page.goto("/#manual-section-ch3-stopping-parking");
  await expect(page).toHaveURL(/#manual-section-ch3-stopping-parking$/);
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-3-driving-rules");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch3-stopping-parking");
  const parkingSection = content.getByTestId("manual-guide-section");
  await expect(parkingSection).toHaveAttribute("data-manual-section-id", "ch3-stopping-parking");
  await expect(parkingSection.getByRole("heading", { name: "Остановка и стоянка" })).toBeVisible();
  await expect(parkingSection).toContainText("не более 2 минут");
  await expect(parkingSection).toContainText("4,5 м");
  await expect(parkingSection).toContainText("Cajones azules");

  await page.goto("/#manual-section-ch1-shared-trip");
  await expect(page).toHaveURL(/#manual-section-ch1-shared-trip$/);
  await expect(page.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(page.getByTestId("manual-guide-section")).toHaveAttribute("data-manual-section-id", "ch1-shared-trip");

  await page.goto("/#manual-section-ch1-bicycle");
  await expect(page).toHaveURL(/#manual-section-ch1-bicycle$/);
  await expect(page.getByTestId("manual-guide-nav")).toHaveAttribute("data-active-group-id", "chapter-1-sustainable-mobility");
  await expect(page.getByTestId("manual-guide-section")).toHaveAttribute("data-manual-section-id", "ch1-bicycle");
});

test("Introduction guide exits on hash Back and keeps route buttons native", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("introduction-reader")).toHaveCount(0);

  await page.getByTestId("pandemia-nav-entry").click();
  await expect(page).toHaveURL(/#pandemia-vial$/);

  const reader = page.getByTestId("introduction-reader");
  await expect(reader).toBeVisible();
  await expect(page.getByTestId("pandemia-nav-entry")).toHaveClass(/active/);

  const roadPandemicRoute = page.getByRole("button", { name: "Дорожная пандемия", exact: true });
  await expect(roadPandemicRoute).toBeVisible();
  await expect(roadPandemicRoute).toHaveAttribute("data-testid", "intro-route-intro-road-pandemic");
  await expect(roadPandemicRoute).toHaveAttribute("aria-current", "page");
  await expect(roadPandemicRoute).not.toHaveAttribute("role", "listitem");
  await expect(reader.getByTestId("manual-guide-route-item-intro-road-pandemic")).toHaveAttribute("role", "listitem");
  await expect(reader.locator('button[role="listitem"]')).toHaveCount(0);

  await page.goBack();
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("");
  await expect(reader).toHaveCount(0);
  await expect(page.getByTestId("pandemia-nav-entry")).not.toHaveClass(/active/);
  await expect(page.getByRole("button", { name: /^Учить$/ })).toHaveClass(/active/);

  await page.goto("/#intro-accidente-incidente");
  await expect(page.getByTestId("introduction-reader")).toBeVisible();
  await expect(page.getByTestId("intro-route-intro-incident")).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("heading", { name: "Авария или дорожный инцидент?" })).toBeVisible();
});

test("Introduction guide legacyManual URLs reload into the intended guide", async ({ page }) => {
  await page.goto("/?legacyManual=1");
  await expect(page.getByRole("heading", { name: manualManifest.titleRu })).toBeVisible();
  await expect(page.getByTestId("manual-navigation-panel")).toBeVisible();
  await expect(page.getByTestId("introduction-reader")).toHaveCount(0);

  await page.getByRole("button", { name: /^Учить$/ }).click();
  await expect.poll(() => page.evaluate(() => window.location.search)).toBe("");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("");
  expect(page.url()).not.toContain("legacyManual=1");
  await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Учить$/ })).toHaveClass(/active/);

  await page.reload();
  await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Учить$/ })).toHaveClass(/active/);

  await page.goto("/?legacyManual=1#pandemia-vial");
  await expect(page.getByTestId("introduction-reader")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Дорожная пандемия" })).toBeVisible();
  await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);

  await page.getByRole("button", { name: /^Учить$/ }).click();
  await expect.poll(() => page.evaluate(() => window.location.search)).toBe("");
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("");
  expect(page.url()).not.toContain("legacyManual=1");
  await expect(page.getByTestId("introduction-reader")).toHaveCount(0);
  await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);

  await page.reload();
  await expect(page.getByTestId("introduction-reader")).toHaveCount(0);
  await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^Учить$/ })).toHaveClass(/active/);

  await page.goto("/?legacyManual=1");
  await page.getByTestId("pandemia-nav-entry").click();
  await expect(page).toHaveURL(/\/#pandemia-vial$/);
  expect(page.url()).not.toContain("legacyManual=1");
  await expect(page.getByTestId("introduction-reader")).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/\/#pandemia-vial$/);
  await expect(page.getByTestId("introduction-reader")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Дорожная пандемия" })).toBeVisible();
  await expect(page.getByTestId("manual-navigation-panel")).toHaveCount(0);
});

test("intro-plan-seguridad-vial work-axis grid fits at 320px", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/#intro-plan-seguridad-vial");

  const reader = page.getByTestId("introduction-reader");
  await expect(reader).toBeVisible();
  const workAxes = reader.locator(".intro-work-axes");
  const axisGrid = workAxes.locator(".intro-axis-grid");
  await expect(workAxes).toBeVisible();
  await expect(axisGrid).toBeVisible();
  await expect(workAxes.locator(".intro-axis-card")).toHaveCount(4);

  const columnCount = await axisGrid.evaluate((element) =>
    window.getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length
  );
  expect(columnCount, "work-axis grid collapses to one column at 320px").toBe(1);

  const problems = await workAxes.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const issues: string[] = [];
    const withinViewport = (rect: DOMRect, label: string) => {
      if (rect.left < -tolerance || rect.right > viewportWidth + tolerance) {
        issues.push(`${label} overflows viewport horizontally: ${rect.left}..${rect.right} of ${viewportWidth}`);
      }
    };
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      issues.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }

    const grid = root.querySelector(".intro-axis-grid");
    if (!grid) return ["missing work-axis grid"];
    withinViewport(grid.getBoundingClientRect(), "work-axis grid");

    const cards = Array.from(root.querySelectorAll<HTMLElement>(".intro-axis-card"));
    const cardRects = cards.map((card) => card.getBoundingClientRect());
    for (let index = 0; index < cards.length; index += 1) {
      const card = cards[index];
      const cardRect = cardRects[index];
      const axisId = card.dataset.axisId ?? `axis-${index}`;
      withinViewport(cardRect, `${axisId} card`);
      if (index > 0 && Math.abs(cardRect.x - cardRects[0].x) > tolerance) {
        issues.push(`${axisId} card is not in the collapsed single column`);
      }
      if (index > 0 && cardRect.y <= cardRects[index - 1].y) {
        issues.push(`${axisId} card does not stack below the previous card`);
      }

      const circle = card.querySelector<HTMLElement>(".intro-axis-circle");
      const icon = card.querySelector<HTMLImageElement>(".intro-axis-symbol");
      const title = card.querySelector<HTMLElement>("h4");
      const body = card.querySelector<HTMLElement>("p");
      if (!circle || !icon || !title || !body) {
        issues.push(`${axisId} card is missing title, body, circle, or pictogram`);
        continue;
      }
      const circleRect = circle.getBoundingClientRect();
      const iconRect = icon.getBoundingClientRect();
      const titleRect = title.getBoundingClientRect();
      const bodyRect = body.getBoundingClientRect();
      withinViewport(titleRect, `${axisId} title`);
      withinViewport(bodyRect, `${axisId} body`);
      withinViewport(circleRect, `${axisId} circle`);
      withinViewport(iconRect, `${axisId} pictogram`);
      if (Math.abs(circleRect.width - circleRect.height) > tolerance) {
        issues.push(`${axisId} circle is not circular`);
      }
      if (Math.abs(circleRect.x + circleRect.width / 2 - (cardRect.x + cardRect.width / 2)) > tolerance) {
        issues.push(`${axisId} circle is not centered in its card`);
      }
      if (
        iconRect.left < circleRect.left + 4 ||
        iconRect.top < circleRect.top + 4 ||
        iconRect.right > circleRect.right - 4 ||
        iconRect.bottom > circleRect.bottom - 4
      ) {
        issues.push(`${axisId} pictogram is not complete inside the circle`);
      }
      for (const [label, element] of [
        [`${axisId} title`, title],
        [`${axisId} body`, body]
      ] as const) {
        const style = window.getComputedStyle(element);
        if (style.whiteSpace !== "normal") issues.push(`${label} does not use natural wrapping`);
        if (style.overflow === "hidden") issues.push(`${label} clips overflow`);
        if (element.scrollWidth > element.clientWidth + tolerance) {
          issues.push(`${label} text overflows its box: ${element.scrollWidth} > ${element.clientWidth}`);
        }
      }
    }
    return issues;
  });
  expect(problems).toEqual([]);

  await workAxes.screenshot({
    path: testInfo.outputPath("intro-plan-work-axis-320.png")
  });
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

test("primary source fragment navigation has stable desktop row geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1240, height: 900 });
  await openPrimarySources(page);
  await openSourceDocument(page, trafficLawSource);

  const tocButtons = page.locator(".source-toc-list button");
  await expect(tocButtons.first()).toBeVisible();
  await assertSourceTocGeometry(page);

  await tocButtons.nth(2).focus();
  await expect(tocButtons.nth(2)).toBeFocused();
  await assertSourceTocGeometry(page);

  await tocButtons.nth(3).click();
  await expect(page.getByTestId("source-chunk-reader")).toContainText(textSample(trafficLawSource.chunks[3].simpleRu));
  await assertSourceTocGeometry(page);
});

test("primary source fragment navigation has stable mobile row geometry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await openPrimarySources(page);
  await openSourceDocument(page, trafficLawSource);

  await expect(page.getByTestId("source-list-pane")).toBeHidden();
  await expect(page.getByTestId("source-detail-pane")).toBeVisible();
  const tocButtons = page.locator(".source-toc-list button");
  await expect(tocButtons.first()).toBeVisible();
  await assertSourceTocGeometry(page, { checkHorizontalOverflow: true });

  await tocButtons.nth(2).click();
  await expect(page.getByTestId("source-chunk-reader")).toContainText(textSample(trafficLawSource.chunks[2].simpleRu));
  await assertSourceTocGeometry(page, { checkHorizontalOverflow: true });
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

test("Manual guide opens Chapter 4 stress and distractions from direct routes", async ({ page }, testInfo) => {
  await page.goto("/#manual-section-ch4-stress");
  const reader = page.getByTestId("introduction-reader");
  const nav = reader.getByTestId("manual-guide-nav");
  const stressButton = reader.getByTestId("manual-guide-pending-section-ch4-stress");
  let section = reader.getByTestId("manual-guide-section");

  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-4-natural-capacity");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch4-stress");
  await expect(stressButton).toHaveAttribute("aria-current", "page");
  await expect(stressButton).toHaveAttribute("data-source-pages", "94-95");
  await expect(section).toHaveAttribute("data-manual-section-id", "ch4-stress");
  await expect(section.getByRole("heading", { name: "Стресс", exact: true })).toBeVisible();
  await expect(section).toContainText("ВОЗ (OMS) определяет");
  await expect(section).toContainText("двойная связь");
  await expect(section).toContainText("Планировать поездку");
  await expect(section).toContainText("терпеливое и терпимое отношение");
  await expect(section).not.toContainText("Сон и усталость");
  await section.screenshot({ path: testInfo.outputPath(`ch4-stress-direct-${testInfo.project.name}.png`) });

  await page.goto("/#manual-section-ch4-distractions");
  const distractionsButton = reader.getByTestId("manual-guide-pending-section-ch4-distractions");
  section = reader.getByTestId("manual-guide-section");
  await expect(nav).toHaveAttribute("data-active-group-id", "chapter-4-natural-capacity");
  await expect(nav).toHaveAttribute("data-active-child-id", "ch4-distractions");
  await expect(distractionsButton).toHaveAttribute("aria-current", "page");
  await expect(distractionsButton).toHaveAttribute("data-source-pages", "95-97");
  await expect(section).toHaveAttribute("data-manual-section-id", "ch4-distractions");
  await expect(section.getByRole("heading", { name: "Отвлечения" })).toBeVisible();
  await expect(section).toContainText("Еда, питье, мате");
  await expect(section).toContainText("Использование мобильного телефона запрещено");
  await expect(section).toContainText("GPS");
  await expect(section).toContainText("зеркало заднего вида");
  await expect(section).toContainText("100% внимания");
  await expect(section).not.toContainText("ВОЗ (OMS) определяет");

  const overflow = await section.evaluate((root) => {
    const tolerance = 2;
    const viewportWidth = document.documentElement.clientWidth;
    const problems: string[] = [];
    if (document.documentElement.scrollWidth > viewportWidth + tolerance) {
      problems.push(`document horizontal overflow ${document.documentElement.scrollWidth} > ${viewportWidth}`);
    }
    for (const element of Array.from(root.querySelectorAll('[data-testid="manual-guide-section-block"]'))) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      const id = element.getAttribute("data-block-id") ?? element.textContent?.trim() ?? "unknown";
      if (rect.width > 0 && (rect.left < -tolerance || rect.right > viewportWidth + tolerance)) {
        problems.push(`${id} overflows viewport horizontally`);
      }
      if (style.userSelect === "none") problems.push(`${id} disables text selection`);
    }
    return problems;
  });
  expect(overflow).toEqual([]);
  await section.screenshot({ path: testInfo.outputPath(`ch4-distractions-direct-${testInfo.project.name}.png`) });
});

test("Manual guide Chapter 4 alcohol overlay labels remain readable on phone width", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/#manual-section-ch4-alcohol-drugs");
  const section = page.getByTestId("manual-guide-section");
  await expect(section).toHaveAttribute("data-manual-section-id", "ch4-alcohol-drugs");
  const card = section.locator('[data-card-id="alcohol-limits-source-card"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  const figure = card.locator('[data-russian-overlay-strategy="selectable-dom"]');
  const image = figure.locator('img[data-visible-spanish="false"]');
  await image.evaluate((node) => (node as HTMLImageElement).decode?.().catch(() => undefined));
  await expect(figure).toBeVisible();
  await expect(image).toBeVisible();
  await expect(figure.locator('[data-overlay-label-id="acompanantes-label"]')).toContainText("Пасс. мото");

  const overlayProblems = await figure.evaluate((root) => {
    const tolerance = 1;
    const figureRect = root.getBoundingClientRect();
    const problems: string[] = [];
    for (const label of Array.from(root.querySelectorAll<HTMLElement>(".manual-source-image-overlay-label"))) {
      const id = label.getAttribute("data-overlay-label-id") ?? label.textContent?.trim() ?? "unknown";
      const rect = label.getBoundingClientRect();
      const style = window.getComputedStyle(label);
      if (rect.width <= 1 || rect.height <= 1 || style.visibility === "hidden" || style.display === "none") {
        problems.push(`${id} is not visible`);
      }
      if (label.scrollHeight > label.clientHeight + tolerance) {
        problems.push(`${id} clips vertically: ${label.scrollHeight} > ${label.clientHeight}`);
      }
      if (label.scrollWidth > label.clientWidth + tolerance) {
        problems.push(`${id} clips horizontally: ${label.scrollWidth} > ${label.clientWidth}`);
      }
      if (
        rect.left < figureRect.left - tolerance ||
        rect.right > figureRect.right + tolerance ||
        rect.top < figureRect.top - tolerance ||
        rect.bottom > figureRect.bottom + tolerance
      ) {
        problems.push(`${id} leaves transferred visual bounds`);
      }
    }
    return problems;
  });
  expect(overlayProblems).toEqual([]);
  await section.screenshot({ path: testInfo.outputPath(`ch4-alcohol-overlay-labels-phone-${testInfo.project.name}.png`) });
});
