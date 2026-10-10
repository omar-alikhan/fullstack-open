import { useParams } from "react-router-dom";

const Blog = ({ blogs, user, handleLike, handleRemove }) => {
  if (blogs.length === 0) return <div>Loading blog...</div>;

  const id = useParams().id;
  const blog = blogs?.find(b => b.id === id);
  const canRemove = user && user.username === blog.user.username;
  const canLike = !!user;

  if (blog) {
    return (
      <div className="blog">
        <h1>{blog.title}</h1>
        <a href={`${blog.url}`}>{blog.url}</a>
        <div>
          likes {blog.likes}
          {canLike && <button onClick={() => handleLike(blog)}>like</button>}
        </div>
        <div>Added by {blog.user.name}</div>
        {canRemove && (
          <button onClick={() => handleRemove(blog)}>remove</button>
        )}
      </div>
    );
  }
};

export default Blog;
