import { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import "./App.css";
import LoginForm from "../components/LoginForm";
import BlogForm from "../components/BlogForm";
import Notification from "../components/Notification";
import loginService from "../services/login";
import blogService from "../services/blog";
import BlogList from "../components/BlogList";

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
  };

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
      ></Notification>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {user ? (
          <button style={padding} onClick={handleLogout}>
            logout
          </button>
        ) : (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
        {user && (
          <Link style={padding} to="/create">
            new blog
          </Link>
        )}
      </div>

      <Routes>
        {/* <Route path="/blogs" element={<BlogList blogs={blogs}></BlogList>} />
        <Route path="/create" element={<BlogForm createBlog={addBlog} />} /> */}
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
