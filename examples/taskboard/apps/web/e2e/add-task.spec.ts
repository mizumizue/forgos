import { expect, test } from "@playwright/test";

test("member can add a task", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("title").fill("Buy milk");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByRole("listitem")).toContainText("Buy milk");
});
