const { test, expect, beforeEach, describe } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("/");
  });

  test("Login form is shown by default", async ({ page }) => {
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("salainen");
      await page.getByText("login").click();

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
      await expect(page.getByText("logout")).toBeVisible();
      await expect(page.getByText("login")).not.toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("wrongPassword");
      await page.getByText("login").click();

      const errorDiv = page.locator(".error");
      await expect(errorDiv).toContainText("invalid username and/or password");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(
        page.getByText("Matti Luukkainen logged in"),
      ).not.toBeVisible();
      await expect(page.getByText("logout")).not.toBeVisible();
      await expect(page.getByText("login")).toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page, request }) => {
      await request.post("/api/testing/reset");
      await request.post("/api/users", {
        data: {
          name: "Matti Luukkainen",
          username: "mluukkai",
          password: "salainen",
        },
      });
      await page.goto("/");

      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("salainen");
      await page.getByText("login").click();
    });

    test("a new blog can be created", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title").fill("test title");
      await page.getByLabel("author").fill("test author");
      await page.getByLabel("url").fill("http://examples.com");
      await page.getByRole("button", { name: "create" }).click();

      const notificationDiv = page.getByText(
        "a new blog test title by test author added",
      );
      await expect(notificationDiv).toBeVisible();
      await expect(page.getByText("test title test author")).toBeVisible();
    });
  });
});
