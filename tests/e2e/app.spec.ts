import { expect, test, type Locator, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

const questions = JSON.parse(readFileSync("content/questions/caba-b.unofficial-fallback.questions.json", "utf8"));
const topicGuide = JSON.parse(readFileSync("content/guide/topic-study-guide.ru.json", "utf8"));
const firstQuestionWrongAnswerIndex = questions[0].answers.findIndex((answer: { id: string }) => answer.id !== questions[0].correctAnswerId);
const canonicalQuestionById = new Map(questions.map((question: { id: string }) => [question.id, question]));

async function storedAnswerCount(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("cabadrive.progress.v1") || "{\"answers\":[]}").answers.length);
}

test("learning flow renders category B image and records a mistake", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("unofficial category B practice set")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Тренажер теории/ })).toBeVisible();
  const card = page.getByTestId("question-card");
  const questionToggle = card.getByRole("button", { name: /¿Qué indica esta seña/ });
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

test("exam mode hides translation and explanation during active attempt and stores score", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Экзамен/ }).click();
  await expect(page.getByText(/45:00|44:59/)).toBeVisible();
  await expect(page.getByText(/Формат defined/)).toBeVisible();
  await expect(page.locator(".official-block[role='button']")).toHaveCount(0);
  await expect(page.locator(".support-block.translation")).toHaveCount(0);
  await expect(page.locator(".support-block.explanation")).toHaveCount(0);
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
  await page.getByRole("button", { name: /CABA\/RF/ }).click();
  await expect(page.getByText("Статус вопросов категории B")).toBeVisible();
});

test("materials view renders topic guide status, list, details, canonical ticket data, and local images", async ({ page }) => {
  const firstTopic = topicGuide.topics[0];
  const firstTicket = firstTopic.tickets[0];
  const canonicalQuestion = canonicalQuestionById.get(firstTicket.questionId) as {
    officialTextEs: string;
    answers: { id: string; officialTextEs: string }[];
    correctAnswerId: string;
    image: { localPath: string };
  };
  const correctAnswer = canonicalQuestion.answers.find((answer) => answer.id === canonicalQuestion.correctAnswerId)!;
  const correctExplanation = firstTicket.answerExplanations.find((item: { answerId: string }) => item.answerId === correctAnswer.id)!;
  const incorrectExplanation = firstTicket.answerExplanations.find((item: { answerId: string }) => item.answerId !== correctAnswer.id)!;

  await page.goto("/");
  await page.getByRole("button", { name: /Материалы/ }).click();

  await expect(page.getByRole("heading", { name: topicGuide.titleRu })).toBeVisible();
  await expect(page.getByText("Черновик: материал неполный").first()).toBeVisible();
  await expect(page.getByText("Неофициальная учебная поддержка")).toBeVisible();
  await expect(page.getByText("Текущие билеты: неофициальная B-практика, не полная официальная база GCBA")).toBeVisible();
  await expect(page.getByRole("button", { name: new RegExp(firstTopic.titleRu) })).toBeVisible();
  await expect(page.getByRole("heading", { name: firstTopic.titleRu })).toBeVisible();
  await expect(page.getByText(firstTopic.summaryRu)).toBeVisible();
  await expect(page.getByText(firstTopic.learningMaterialRu[0])).toBeVisible();
  await expect(page.getByText(firstTopic.practicalReasoningRu[0])).toBeVisible();
  const firstTerm = page.locator(".materials-term").filter({ hasText: firstTopic.spanishTerms[0].translationRu });
  await expect(firstTerm.getByText(firstTopic.spanishTerms[0].termEs, { exact: true })).toBeVisible();
  await expect(firstTerm.getByText(firstTopic.spanishTerms[0].translationRu)).toBeVisible();
  await expect(page.getByText(firstTopic.trapNotes[0].textRu)).toBeVisible();

  const ticketBlock = page.getByTestId(`materials-ticket-${firstTicket.questionId}`);
  await expect(ticketBlock).toBeVisible();
  await expect(ticketBlock.getByText(canonicalQuestion.officialTextEs)).toBeVisible();
  const ticketAnswers = ticketBlock.locator(".materials-answers");
  for (const answer of canonicalQuestion.answers) {
    await expect(ticketAnswers.getByText(answer.officialTextEs, { exact: true })).toBeVisible();
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
    answers: { id: string; officialTextEs: string }[];
    correctAnswerId: string;
  };

  async function expectFullDualTopicTicket(ticketBlock: Locator, guideTicket: {
    answerExplanations: { explanationRu: string }[];
  }) {
    await expect(ticketBlock).toBeVisible();
    await expect(ticketBlock.getByText(canonicalQuestion.officialTextEs)).toBeVisible();
    const ticketAnswers = ticketBlock.locator(".materials-answers");
    for (const answer of canonicalQuestion.answers) {
      await expect(ticketAnswers.getByText(answer.officialTextEs, { exact: true })).toBeVisible();
    }
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
