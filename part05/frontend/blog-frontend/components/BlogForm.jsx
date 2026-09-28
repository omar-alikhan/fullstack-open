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
          title:
          <input
            type="text"
            value={title}
            onChange={event => setNewTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={author}
            onChange={event => setNewAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={url}
            onChange={event => setNewUrl(event.target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
