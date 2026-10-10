import Blog from "./Blog";

const BlogList = ({ blogs, user, handleLike, handleRemove }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  return (
    <div className="blogs">
      {blogs &&
        sortedBlogs.map(blog => (
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
};

export default BlogList;

// const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

// return (
//   <div>
//     <h2>blogs</h2>
//     {user.name && (
//       <p>
//         {user.name} logged in <button onClick={handleLogout}> logout</button>
//       </p>
//     )}
//     {console.log("render time!")}
//     <h2>create new</h2>
//     <Togglable buttonLabel="create new blog">
//       <BlogForm handleCreateBlog={handleCreateBlog}></BlogForm>
//     </Togglable>
//     <div className="blogs">
//       {blogs &&
//         sortedBlogs.map(blog => (
//           <Blog
//             key={blog.id}
//             blog={blog}
//             user={user}
//             handleLike={handleLike}
//             handleRemove={handleRemove}
//           />
//         ))}
//     </div>
//   </div>
// );
