import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  const blog = {
    title: "A title",
    author: "An author",
    likes: 5,
    url: "https://example.com",
  };

  const user = {
    name: "Omar",
  };

  beforeEach(() => {
    render(<Blog blog={blog} user={user}></Blog>);
  });

  test("at start the title and author is rendered while URL and likes are not", async () => {
    const title = await screen.findByText("A title", { exact: false });

    const author = await screen.findByText("An author", { exact: false });
    expect(title).toBeVisible();
    expect(author).toBeVisible();

    const url = screen.queryByText("http://example.com", { exact: false });
    expect(url).not.toBeInTheDocument();
    const likes = await screen.queryByText("5", { exact: false });

    expect(url).not.toBeInTheDocument();
    expect(likes).not.toBeInTheDocument();
  });

  test("after clicking view button, url and likes are rendered", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const url = screen.getByText("https://example.com", { exact: false });
    expect(url).toBeVisible();

    const likes = screen.getByText("5", { exact: false });
    expect(likes).toBeVisible();
  });
});
