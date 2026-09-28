import { useState } from "react";

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const removeButtonStyle = {
    background: "#3c82f6",
  };

  const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title}
          <button onClick={() => setShowDetails(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>{user.name}</div>
        <button style={removeButtonStyle} onClick={() => handleRemove(blog)}>
          remove
        </button>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setShowDetails(true)}>view</button>
    </div>
  );
};

export default Blog;
