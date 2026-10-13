import { useState } from "react";
import styled from "styled-components";

const Input = styled.input`
  margin: 0.25em;
  width: 300px;
  padding: 0.5em 0.75em;
  font-size: 1rem;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 0 #000;
  outline: none;

  &:focus {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }
`;

const Button = styled.button`
  margin: 0.25em;
  padding: 0.5em 1em;
  font-size: 1rem;
  font-weight: 700;
  color: #000;
  background-color: #ffd60a;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 4px 4px 0 #000;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 #000;
  }

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #000;
  }
`;

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
      <h1>create new blog</h1>
      <form onSubmit={createBlog}>
        <div>
          <label htmlFor="title-input">
            title:
            <Input
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
            <Input
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
            <Input
              id="url-input"
              type="text"
              value={url}
              onChange={event => setNewUrl(event.target.value)}
              placeholder="your url e.g. https://myblog.com"
            />
          </label>
        </div>
        <Button type="submit">create</Button>
      </form>
    </>
  );
};

export default BlogForm;
