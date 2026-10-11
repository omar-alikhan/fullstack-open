import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";
import { expect } from "vitest";

describe("<Blog />", () => {
  describe("when not logged in...", () => {
    const blog = [
      {
        title: "A title",
        author: "An author",
        likes: 5,
        url: "http://example.com",
        user: {
          name: "Test user",
          username: "testuser123",
        },
      },
    ];
    const user = null;
    const mockLikeHandler = vi.fn();
    const mockRemoveHandler = vi.fn();
    beforeEach(() => {
      render(
        <Blog
          blogs={blog}
          user={user}
          handleLike={mockLikeHandler}
          handleRemove={mockRemoveHandler}
        ></Blog>,
      );
    });
    test("blog information and the number of likes are displayed, but buttons are not displayed", async () => {
      const title = await screen.findByText("A title", { exact: false });
      const author = await screen.findByText("Test user", { exact: false });
      const url = screen.queryByText("http://example.com", { exact: false });
      expect(url).toBeInTheDocument();
      expect(title).toBeVisible();
      expect(author).toBeVisible();

      const likeButton = screen.queryByRole("button", { name: "like" });
      expect(likeButton).not.toBeInTheDocument();

      const removeButton = screen.queryByRole("button", { name: "remove" });
      expect(removeButton).not.toBeInTheDocument();
    });
  });

  describe("when logged in...", () => {
    test("shows like but not remove for blogs created by someone else", async () => {
      const user = {
        name: "Test user",
        username: "testuser123",
      };

      const blog = [
        {
          title: "Another title",
          author: "Another author",
          likes: 9,
          url: "http://anotherexample.com",
          user: {
            name: "Another user",
            username: "anotheruser123",
          },
        },
      ];
      const mockLikeHandler = vi.fn();
      const mockRemoveHandler = vi.fn();

      render(
        <Blog
          blogs={blog}
          user={user}
          handleLike={mockLikeHandler}
          handleRemove={mockRemoveHandler}
        ></Blog>,
      );

      const likeButton = screen.queryByRole("button", { name: "like" });
      expect(likeButton).toBeInTheDocument();

      const removeButton = screen.queryByRole("button", { name: "remove" });
      expect(removeButton).not.toBeInTheDocument();
    });

    test("shows remove button for blogs created by logged-in user", async () => {
      const user = {
        name: "Test user",
        username: "testuser123",
      };

      const blog = [
        {
          title: "A title",
          author: "An author",
          likes: 9,
          url: "http://anotherexample.com",
          user: {
            name: "Test user",
            username: "testuser123",
          },
        },
      ];

      const mockLikeHandler = vi.fn();
      const mockRemoveHandler = vi.fn();

      render(
        <Blog
          blogs={blog}
          user={user}
          handleLike={mockLikeHandler}
          handleRemove={mockRemoveHandler}
        ></Blog>,
      );

      const likeButton = screen.queryByRole("button", { name: "like" });
      expect(likeButton).toBeInTheDocument();

      const removeButton = screen.queryByRole("button", { name: "remove" });
      expect(removeButton).toBeInTheDocument();
    });
  });
});
