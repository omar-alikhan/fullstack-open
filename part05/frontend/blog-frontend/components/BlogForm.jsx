const BlogForm = ({
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleCreateBlog,
}) => {
  return (
    <>
      <form onSubmit={handleCreateBlog}>
        <div>
          title:
          <input type="text" value={title} onChange={handleTitleChange} />
        </div>
        <div>
          author:
          <input type="text" value={author} onChange={handleAuthorChange} />
        </div>
        <div>
          url:
          <input type="text" value={url} onChange={handleUrlChange} />
        </div>
        <button>create</button>
      </form>
    </>
  );
};

export default BlogForm;
