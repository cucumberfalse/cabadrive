import { expect, test } from "@playwright/test";

test("learning flow renders category B image and records a mistake", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("unofficial category B practice set")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Тренажер теории/ })).toBeVisible();
  await expect(page.getByTestId("question-card").locator("img")).toBeVisible();
  await page.getByRole("button", { name: /Перевод/ }).click();
  await page.getByRole("button", { name: /Сложный/ }).click();
  await page.locator(".answer").nth(0).click();
  await expect(page.locator(".result")).toBeVisible();
  await page.getByRole("button", { name: /Ошибки/ }).click();
  await expect(page.getByRole("heading", { name: "Ошибки" })).toBeVisible();
});

test("exam mode hides translation until an answer and stores score", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Экзамен/ }).click();
  await expect(page.getByText(/45:00|44:59/)).toBeVisible();
  await expect(page.getByText(/Формат defined/)).toBeVisible();
  await expect(page.getByText(/Неофициальный перевод/)).toHaveCount(0);
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
  await page.getByRole("button", { name: /CABA\/RF/ }).click();
  await expect(page.getByText("Статус вопросов категории B")).toBeVisible();
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
