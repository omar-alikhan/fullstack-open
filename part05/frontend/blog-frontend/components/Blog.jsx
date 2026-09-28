import { useState } from "react";

const Blog = ({ blog, user, handleLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const [showDetails, setShowDetails] = useState(false);

  if (showDetails) {
    return (
      <div style={blogStyle}>
        <div>
          {blog.title}
          <button onClick={e => setShowDetails(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>{user.name}</div>
      </div>
    );
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={e => setShowDetails(true)}>view</button>
    </div>
  );
};

export default Blog;
