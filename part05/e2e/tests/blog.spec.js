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

    test("blog can be liked", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title").fill("test title");
      await page.getByLabel("author").fill("test author");
      await page.getByLabel("url").fill("http://examples.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("button", { name: "view" }).first().click();

      await page.getByRole("button", { name: "like" }).click();
      await page.pause();

      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("logged in user's blog can be removed", async ({ page }) => {
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title").fill("test title");
      await page.getByLabel("author").fill("test author");
      await page.getByLabel("url").fill("http://examples.com");
      await page.getByRole("button", { name: "create" }).click();

      await page.getByRole("button", { name: "view" }).first().click();

      page.on("dialog", dialog => console.log(dialog.accept()));
      await page.getByRole("button", { name: "remove" }).click();
      await expect(page.locator(".blog")).not.toBeVisible();
    });

    test("remove button is visible for my blogs only", async ({
      page,
      request,
    }) => {
      test.setTimeout(4000);
      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title").fill("test title");
      await page.getByLabel("author").fill("test author");
      await page.getByLabel("url").fill("http://examples.com");
      await page.getByRole("button", { name: "create" }).click();
      await page.getByText("logout").click();

      await request.post("/api/users", {
        data: {
          name: "John Smith",
          username: "johnsmith",
          password: "password",
        },
      });
      await page.goto("/");

      await page.getByLabel("username").fill("johnsmith");
      await page.getByLabel("password").fill("password");
      await page.getByText("login").click();
      await page.getByRole("button", { name: "view" }).click();

      // Only Matti's blog post is visible currently, which should not be removable
      await expect(
        page.getByRole("button", { name: "remove" }),
      ).not.toBeVisible();

      await page.getByRole("button", { name: "create new blog" }).click();
      await page.getByLabel("title").fill("john's title");
      await page.getByLabel("author").fill("John Smith");
      await page.getByLabel("url").fill("http://johnsmithexamples.com");
      await page.getByRole("button", { name: "create" }).click();
      await page.getByRole("button", { name: "view" }).last().click();

      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();
    });

    test.only("blogs are arranged from most to least likes", async ({
      page,
      request,
    }) => {
      test.setTimeout(100000);
      await page.getByRole("button", { name: "create new blog" }).click();

      await page.getByLabel("title").fill("first title");
      await page.getByLabel("author").fill("test author");
      await page.getByLabel("url").fill("http://examples.com");
      await page.getByRole("button", { name: "create" }).click();

      await page
        .locator(".blog", { has: page.getByText("first title") })
        .waitFor();

      await page.getByLabel("title").fill("second title");
      await page.getByLabel("author").fill("test author");
      await page.getByLabel("url").fill("http://examples.com");
      await page.getByRole("button", { name: "create" }).click();

      await page
        .locator(".blog", { has: page.getByText("second title") })
        .waitFor();

      await page.getByLabel("title").fill("third title");
      await page.getByLabel("author").fill("test author");
      await page.getByLabel("url").fill("http://examples.com");
      await page.getByRole("button", { name: "create" }).click();

      await page
        .locator(".blog", { has: page.getByText("third title") })
        .waitFor();

      const viewButtons = page.getByRole("button", { name: "view" });

      while ((await viewButtons.count()) > 0) {
        await viewButtons.first().click();
      }

      const firstBlog = page
        .locator(".blog")
        .filter({ hasText: "first title" });
      const secondBlog = page
        .locator(".blog")
        .filter({ hasText: "second title" });
      const thirdBlog = page
        .locator(".blog")
        .filter({ hasText: "third title" });

      for (let i = 0; i < 1; i++) {
        firstBlog.getByRole("button", { name: "like" }).click();
        await page.waitForTimeout(500);
      }

      for (let i = 0; i < 5; i++) {
        secondBlog.getByRole("button", { name: "like" }).click();
        await page.waitForTimeout(500);
      }

      for (let i = 0; i < 3; i++) {
        thirdBlog.getByRole("button", { name: "like" }).click();
        await page.waitForTimeout(500);
      }

      // The final order should be the 2nd post (with 5 votes), 3rd post (with 3 votes), 1st post(with 1 vote)
      await expect(page.locator(".blog").nth(0)).toContainText("second title");
      await expect(page.locator(".blog").nth(1)).toContainText("third title");
      await expect(page.locator(".blog").nth(2)).toContainText("first title");
    });
  });
});
