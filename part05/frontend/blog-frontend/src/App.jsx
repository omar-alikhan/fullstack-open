import { useState, useEffect } from "react";
import "./App.css";
import LoginForm from "../components/LoginForm";
import BlogForm from "../components/BlogForm";
import Togglable from "../components/Togglable";
import Notification from "../components/Notification";
import Blog from "../components/Blog";
import loginService from "../services/login";
import userService from "../services/user";
import blogService from "../services/blog";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);

      (async () => {
        const data = await blogService.getAll();
        console.log("initial data", data);
        setBlogs(data);
      })();
    }
  }, []);

  const handleLogin = async event => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      const blogs = await blogService.getAll();

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setBlogs(blogs);
      setUser(user);
    } catch (error) {
      setNotification({ message: error, type: "error" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 3000);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
  };

  const handleCreateBlog = async (title, author, url) => {
    const blogPayload = { title, author, url };

    try {
      const newBlog = await blogService.create(blogPayload);
      setBlogs(existingBlogs => [...existingBlogs, newBlog]);
      setNotification({
        message: `a new blog ${title} by ${author} added`,
        type: "success",
      });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 3000);
    } catch (error) {
      console.log("blog failed to add");
      setBlogs(existingBlogs => [...existingBlogs]);
      setNotification({ message: error, type: "error" });
      setTimeout(() => {
        setNotification({ message: null, type: null });
      }, 3000);
    }
  };

  const handleLike = async blog => {
    const blogPayload = { ...blog, likes: blog.likes + 1 };
    const updatedBlog = await blogService.update(blogPayload);

    setBlogs(blogs.map(b => (b.id === blog.id ? updatedBlog : b)));
  };

  const handleRemove = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService.remove(blog);
      setBlogs(blogs.filter(b => b.id !== blog.id));
    }
  };

  if (user === null) {
    return (
      <div>
        <Notification
          message={notification.message}
          type={notification.type}
        ></Notification>
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
      <Notification
        message={notification.message}
        type={notification.type}
      ></Notification>
      {user.name && (
        <p>
          {user.name} logged in <button onClick={handleLogout}> logout</button>
        </p>
      )}

      <h2>create new</h2>
      <Togglable buttonLabel="create new blog">
        <BlogForm handleCreateBlog={handleCreateBlog}></BlogForm>
      </Togglable>

      {blogs &&
        blogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLike={handleLike}
            handleRemove={handleRemove}
          />
        ))}
    </div>
  );
}

export default App;
