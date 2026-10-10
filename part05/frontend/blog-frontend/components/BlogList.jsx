import { Link } from "react-router-dom";

const BlogList = ({ blogs }) => {
  return (
    <div className="blogs">
      <h1>blogs</h1>
      <ul>
        {blogs &&
          blogs.map(blog => (
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {blog.title} {blog.author}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default BlogList;
