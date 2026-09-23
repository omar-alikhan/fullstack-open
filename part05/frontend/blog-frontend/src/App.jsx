import { useState, useEffect } from "react";
import "./App.css";
import LoginForm from "../components/LoginForm";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import Blog from "../components/Blog";
import loginService from "../services/login";
import userService from "../services/user";
import blogService from "../services/blog";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleChange =
    setter =>
    ({ target }) =>
      setter(target.value);

  const handleLogin = async event => {
    event.preventDefault();
    const user = await loginService.login({ username, password });
    const blogs = await userService.getBlogs(username);

    user.blogs = blogs;

    window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const handleCreateBlog = async event => {
    event.preventDefault();
    console.log(title, author, url);
  };

  if (user === null) {
    return (
      <div>
        <LoginForm
          handleLogin={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        ></LoginForm>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      {user.name && (
        <p>
          {user.name} logged in <button onClick={handleLogout}> logout</button>
        </p>
      )}

      <h2>create new</h2>
      <BlogForm
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
        handleCreateBlog={handleCreateBlog}
        title={title}
        author={author}
        url={url}
      ></BlogForm>

      {user.blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
}

export default App;
