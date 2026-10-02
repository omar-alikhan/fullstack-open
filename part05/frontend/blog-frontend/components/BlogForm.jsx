import { useState } from "react";

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setNewTitle] = useState("");
  const [author, setNewAuthor] = useState("");
  const [url, setNewUrl] = useState("");

  const createBlog = event => {
    event.preventDefault();
    handleCreateBlog(title, author, url);

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <>
      <form onSubmit={createBlog}>
        <div>
          <label htmlFor="title-input">
            title:
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={event => setNewTitle(event.target.value)}
              placeholder="write blog title here"
            />
          </label>
        </div>
        <div>
          <label htmlFor="author-input">
            author:
            <input
              id="author-input"
              type="text"
              value={author}
              onChange={event => setNewAuthor(event.target.value)}
              placeholder="your name e.g. John Smith"
            />
          </label>
        </div>
        <div>
          <label htmlFor="url-input">
            url:
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={event => setNewUrl(event.target.value)}
              placeholder="your url e.g. https://myblog.com"
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
