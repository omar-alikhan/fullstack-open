const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Login form is shown by default", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });
});
