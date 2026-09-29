import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { expect } from "vitest";
import { createNodeImportMeta } from "vite/module-runner";

describe("<BlogForm />", () => {
  const blog = {
    title: "A title",
    author: "An author",
    likes: 5,
    url: "https://example.com",
  };

  const user = {
    name: "Omar",
  };

  const mockCreateBlog = vi.fn();

  beforeEach(() => {
    render(<BlogForm handleCreateBlog={mockCreateBlog}></BlogForm>);
  });

  test("check that title, url, and author are submitted correctly", async () => {
    const user = userEvent.setup();

    const inputTitle = screen.getByPlaceholderText("write blog title here");

    const inputName = screen.getByPlaceholderText("your name e.g. John Smith");

    const inputUrl = screen.getByPlaceholderText(
      "your url e.g. https://myblog.com",
    );

    const createButton = screen.getByText("create");

    await user.type(inputTitle, "testing a form...");
    await user.type(inputName, "john smith");
    await user.type(inputUrl, "https://examples.com");

    await user.click(createButton);

    expect(mockCreateBlog.mock.calls[0][0]).toBe("testing a form...");
    expect(mockCreateBlog.mock.calls[0][1]).toBe("john smith");
    expect(mockCreateBlog.mock.calls[0][2]).toBe("https://examples.com");
  });
});
