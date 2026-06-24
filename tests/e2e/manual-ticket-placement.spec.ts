import { expect, test } from "@playwright/test";

test("manual route appends canonical tickets and mounts dense cards only after opening", async ({ page }, testInfo) => {
  test.setTimeout(60_000);
  await page.goto("/#manual-section-ch3-right-of-way");
  const manual = page.getByTestId("manual-guide-section");
  const appendix = page.getByTestId("manual-ticket-appendix");
  await expect(manual).toHaveAttribute("data-manual-section-id", "ch3-right-of-way");
  await expect(appendix).toHaveAttribute("data-page-id", "ch3-right-of-way");
  await expect(appendix).toHaveAttribute("data-ticket-count", "33");
  await expect(appendix.getByTestId("manual-ticket-disclosure")).toBeVisible();
  await expect(appendix.locator(".materials-ticket")).toHaveCount(0);
  await appendix.getByText("Показать билеты (33)").click();
  await expect(appendix.locator(".materials-ticket")).toHaveCount(33);

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

  await page.goto("/#manual-section-app1-safety-elements");
  const nextAppendix = page.getByTestId("manual-ticket-appendix");
  const nextDisclosure = nextAppendix.getByTestId("manual-ticket-disclosure");
  await expect(nextAppendix).toHaveAttribute("data-ticket-count", "47");
  await expect(nextDisclosure).not.toHaveAttribute("open", "");
  await expect(nextAppendix.locator(".materials-ticket")).toHaveCount(0);
  await nextDisclosure.getByText("Показать билеты (47)").click();
  await expect(nextAppendix.locator(".materials-ticket")).toHaveCount(47);
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

test("unused introduction, sign appendix, and materials adapter remain available", async ({ page }) => {
  await page.goto("/#intro-accidente-incidente");
  await expect(page.getByTestId("manual-ticket-appendix")).toHaveCount(0);

  await page.goto("/#manual-section-app4-signs-regulatory");
  await expect(page.getByTestId("manual-ticket-appendix")).toHaveAttribute("data-page-id", "app4-signs-regulatory");

  await page.getByRole("button", { name: /Материалы/ }).click();
  await expect(page.locator('[data-testid^="materials-ticket-"]').first()).toBeVisible();
});
