import { expect, test } from "@playwright/test";

const practiceStatusLabel = "Текущие билеты: неофициальная B-практика, не полная официальная база GCBA";
const conflictNoteFixtures = [
  ["b-fallback-024", "cédula azul no es exigible"],
  ["b-fallback-135", "36 месяцев/60.000 km"],
  ["b-fallback-309", "количество cédula azul"],
  ["b-fallback-456", "изображением cédula"]
] as const;

test("manual route appends canonical tickets and mounts dense cards only after opening", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  await page.goto("/#manual-section-ch3-right-of-way");
  const manual = page.getByTestId("manual-guide-section");
  const appendix = page.getByTestId("manual-ticket-appendix");
  await expect(manual).toHaveAttribute("data-manual-section-id", "ch3-right-of-way");
  await expect(appendix).toHaveAttribute("data-page-id", "ch3-right-of-way");
  await expect(appendix).toHaveAttribute("data-ticket-count", "35");
  await expect(appendix.getByTestId("manual-ticket-disclosure")).toBeVisible();
  await expect(appendix.getByText(practiceStatusLabel)).toBeVisible();
  await expect(appendix.locator(".materials-ticket")).toHaveCount(0);
  await appendix.getByText("Показать билеты (35)").click();
  await expect(appendix.locator(".materials-ticket")).toHaveCount(35);

  const ordering = await page.getByTestId("manual-guide-content").evaluate((element) => {
    const article = element.querySelector('[data-testid="manual-guide-section"]');
    const appendixElement = element.querySelector('[data-testid="manual-ticket-appendix"]');
    const children = Array.from(element.children);
    return Boolean(article && appendixElement && children.indexOf(appendixElement) > children.indexOf(article));
  });
  expect(ordering).toBe(true);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await appendix.screenshot({ path: testInfo.outputPath(`manual-ticket-dense-${testInfo.project.name}.png`) });

  await page.evaluate(() => {
    const win = window as typeof window & {
      __manualTicketTransientMounts?: string[];
      __manualTicketStopObserver?: () => void;
    };
    win.__manualTicketTransientMounts = [];
    const observer = new MutationObserver(() => {
      for (const pageId of ["app1-safety-elements", "ch3-right-of-way"]) {
        const destinationAppendix = document.querySelector(
          `[data-testid="manual-ticket-appendix"][data-page-id="${pageId}"]`
        );
        const destinationDisclosure = destinationAppendix?.querySelector('[data-testid="manual-ticket-disclosure"]');
        const isDestinationClosed = destinationDisclosure && !destinationDisclosure.hasAttribute("open");
        const destinationMountedCards = destinationAppendix?.querySelectorAll(".materials-ticket").length ?? 0;
        if (isDestinationClosed && destinationMountedCards > 0) {
          win.__manualTicketTransientMounts?.push(`${pageId} closed disclosure mounted ${destinationMountedCards} rich cards`);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    win.__manualTicketStopObserver = () => observer.disconnect();
  });

  await page.evaluate(() => {
    window.location.hash = "#manual-section-app1-safety-elements";
  });
  const nextAppendix = page.getByTestId("manual-ticket-appendix");
  const nextDisclosure = nextAppendix.getByTestId("manual-ticket-disclosure");
  await expect(nextAppendix).toHaveAttribute("data-page-id", "app1-safety-elements");
  await expect(nextAppendix).toHaveAttribute("data-ticket-count", "45");
  await expect(nextDisclosure).not.toHaveAttribute("open", "");
  await expect(nextAppendix.getByText(practiceStatusLabel)).toBeVisible();
  await expect(nextAppendix.locator(".materials-ticket")).toHaveCount(0);
  let transientMounts = await page.evaluate(() => {
    const win = window as typeof window & {
      __manualTicketTransientMounts?: string[];
    };
    return win.__manualTicketTransientMounts ?? [];
  });
  expect(transientMounts).toEqual([]);
  await nextDisclosure.getByText("Показать билеты (45)").click();
  await expect(nextAppendix.locator(".materials-ticket")).toHaveCount(45);

  await page.evaluate(() => {
    window.location.hash = "#manual-section-ch3-right-of-way";
  });
  const returnAppendix = page.getByTestId("manual-ticket-appendix");
  const returnDisclosure = returnAppendix.getByTestId("manual-ticket-disclosure");
  await expect(returnAppendix).toHaveAttribute("data-page-id", "ch3-right-of-way");
  await expect(returnAppendix).toHaveAttribute("data-ticket-count", "35");
  await expect(returnDisclosure).not.toHaveAttribute("open", "");
  await expect(returnAppendix.locator(".materials-ticket")).toHaveCount(0);
  transientMounts = await page.evaluate(() => {
    const win = window as typeof window & {
      __manualTicketTransientMounts?: string[];
      __manualTicketStopObserver?: () => void;
    };
    win.__manualTicketStopObserver?.();
    return win.__manualTicketTransientMounts ?? [];
  });
  expect(transientMounts).toEqual([]);
});

test("fallback and image-backed tickets preserve canonical content", async ({ page }) => {
  await page.goto("/#manual-section-app1-safety-elements");
  const appendix = page.getByTestId("manual-ticket-appendix");
  await appendix.getByText(/Показать билеты/).click();
  const fallback = page.getByTestId("manual-ticket-b-fallback-126");
  await expect(fallback).toContainText("¿Con qué se lubrica un motor?");
  await expect(fallback).toContainText("Правильный ответ");
  await expect(fallback.locator("img")).toHaveAttribute("loading", "lazy");
  await expect(fallback.locator("img")).toHaveAttribute("src", /^\/content\/assets\/questions\//u);
});

test("manual required-documents tickets surface topic-guide conflict notes", async ({ page }) => {
  await page.goto("/#manual-section-ch2-required-documents");
  const appendix = page.getByTestId("manual-ticket-appendix");
  await expect(appendix).toHaveAttribute("data-page-id", "ch2-required-documents");
  await expect(appendix.getByTestId("manual-ticket-disclosure")).toBeVisible();
  await expect(appendix.locator(".materials-ticket")).toHaveCount(0);

  await appendix.getByText(/Показать билеты/).click();
  for (const [questionId, distinctiveText] of conflictNoteFixtures) {
    const ticket = page.getByTestId(`manual-ticket-${questionId}`);
    await expect(ticket.getByText("Заметка о старой формулировке")).toBeVisible();
    await expect(ticket.getByText(distinctiveText)).toBeVisible();
  }

  const noNoteTicket = page.getByTestId("manual-ticket-b-fallback-027");
  await expect(noNoteTicket).toBeVisible();
  await expect(noNoteTicket.getByText("Заметка о старой формулировке")).toHaveCount(0);
  await expect(noNoteTicket.locator(".support-block.explanation").filter({ hasText: "Заметка о старой формулировке" })).toHaveCount(0);

  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.locator('[data-testid^="materials-ticket-"]').first()).toBeVisible();
});

test("unused introduction, sign appendix, and materials adapter remain available", async ({ page }) => {
  await page.goto("/#intro-accidente-incidente");
  await expect(page.getByTestId("manual-ticket-appendix")).toHaveCount(0);

  await page.goto("/#manual-section-app4-signs-regulatory");
  await expect(page.getByTestId("manual-ticket-appendix")).toHaveAttribute("data-page-id", "app4-signs-regulatory");

  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.locator('[data-testid^="materials-ticket-"]').first()).toBeVisible();
});
