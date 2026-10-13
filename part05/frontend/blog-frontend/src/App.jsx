import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import LoginForm from "../components/LoginForm";
import BlogForm from "../components/BlogForm";
import BlogList from "../components/BlogList";
import Blog from "../components/Blog";
import Notification from "../components/Notification";
import loginService from "../services/login";
import blogService from "../services/blog";
import styled from "styled-components";

export const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-base);
  background-color: var(--color-secondary-background);

  font-family: var(--font-heading);
  color: var(--color-foreground);

  /* Hover effect for any child link/button */
  a,
  button {
    border-radius: var(--radius-base);
    padding: 0.5rem 0.75rem;
    border: 2px solid transparent;
    text-decoration: none;
    color: inherit;
    background: var(--color-main);
    color: var(--color-main-foreground);
    font-family: var(--font-heading);

    &:hover {
      border-color: var(--color-border);
      filter: brightness(0.95);
    }
  }
`;

const Menubar = styled.nav`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  background-color: #dbeafe;
  border: 2px solid #000;
  border-radius: 8px;
  box-shadow: 3px 3px 0 #000;
  font-family: "Inter", system-ui, sans-serif;
`;

const MenubarItem = styled.button`
  padding: 0.375em 0.875em;
  font-size: 0.95rem;
  font-weight: 700;
  color: #000;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
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

function App() {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });
  const navigate = useNavigate();
  const padding = {
    padding: 5,
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
      setBlogs(sortedBlogs);
    };

    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }

    fetchBlogs();
  }, []);

  const handleLogin = async ({ username, password }) => {
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

    navigate("/");
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogAppUser");
    setUser(null);
    navigate("/");
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

    navigate("/");
  };

  const handleLike = async blog => {
    const blogPayload = { ...blog, likes: blog.likes + 1 };
    const updatedBlog = await blogService.update(blogPayload);

    const sortedAndUpdatedBlogs = [...blogs]
      .map(b => (b.id === blog.id ? updatedBlog : b))
      .sort((a, b) => b.likes - a.likes);

    setBlogs(sortedAndUpdatedBlogs);
  };

  const handleRemove = async blog => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService.remove(blog);
      setBlogs(blogs.filter(b => b.id !== blog.id));
    }

    navigate("/");
  };

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
      ></Notification>
      <Menubar>
        <MenubarItem>
          <Link style={padding} to="/">
            blogs
          </Link>
        </MenubarItem>
        {user && (
          <MenubarItem>
            <Link style={padding} to="/create">
              new blog
            </Link>
          </MenubarItem>
        )}
        {user ? (
          <Button style={padding} onClick={handleLogout}>
            logout
          </Button>
        ) : (
          <MenubarItem>
            <Link style={padding} to="/login">
              login
            </Link>
          </MenubarItem>
        )}
      </Menubar>

      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              user={user}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={blogs}
              user={user}
              handleLike={handleLike}
              handleRemove={handleRemove}
            />
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : <LoginForm handleLogin={handleLogin} />
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <BlogForm handleCreateBlog={handleCreateBlog} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
