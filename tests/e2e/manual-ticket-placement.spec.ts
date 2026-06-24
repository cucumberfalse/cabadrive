import { expect, test } from "@playwright/test";

test("manual route appends canonical tickets and mounts dense cards only after opening", async ({ page }, testInfo) => {
  await page.goto("/#manual-section-ch1-bicycle");
  const manual = page.getByTestId("manual-guide-section");
  const appendix = page.getByTestId("manual-ticket-appendix");
  await expect(manual).toHaveAttribute("data-manual-section-id", "ch1-bicycle");
  await expect(appendix).toHaveAttribute("data-page-id", "ch1-bicycle");
  await expect(appendix).toHaveAttribute("data-ticket-count", "30");
  await expect(appendix.getByTestId("manual-ticket-disclosure")).toBeVisible();
  await expect(appendix.locator(".materials-ticket")).toHaveCount(0);
  await appendix.getByText("Показать билеты (30)").click();
  await expect(appendix.locator(".materials-ticket")).toHaveCount(30);

  const ordering = await page.getByTestId("manual-guide-content").evaluate((element) => {
    const article = element.querySelector('[data-testid="manual-guide-section"]');
    const appendixElement = element.querySelector('[data-testid="manual-ticket-appendix"]');
    const children = Array.from(element.children);
    return Boolean(article && appendixElement && children.indexOf(appendixElement) > children.indexOf(article));
  });
  expect(ordering).toBe(true);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await page.screenshot({ path: testInfo.outputPath(`manual-ticket-dense-${testInfo.project.name}.png`), fullPage: true });

  await page.goto("/#manual-section-app1-safety-elements");
  const nextAppendix = page.getByTestId("manual-ticket-appendix");
  await expect(nextAppendix).toHaveAttribute("data-ticket-count", "20");
  await expect(nextAppendix.locator(".materials-ticket")).toHaveCount(0);
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

test("introduction, sign appendix, low density, and materials adapter remain available", async ({ page }) => {
  await page.goto("/#pandemia-vial");
  await expect(page.getByTestId("manual-ticket-appendix")).toHaveAttribute("data-page-id", "intro-road-pandemic");
  await expect(page.getByTestId("manual-ticket-appendix").locator(".materials-ticket")).toHaveCount(1);

  await page.goto("/#manual-section-app4-signs-regulatory");
  await expect(page.getByTestId("manual-ticket-appendix")).toHaveAttribute("data-page-id", "app4-signs-regulatory");

  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.locator('[data-testid^="materials-ticket-"]').first()).toBeVisible();
});
