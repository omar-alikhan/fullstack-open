const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0].likes;

  return blogs.reduce((totalLikes, blog) => totalLikes + blog.likes, 0);
};

const favoriteBlog = blogs => {
  if (blogs.length === 0) return 0;
  if (blogs.length === 1) return blogs[0];

  return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max));
};

const mostBlogs = blogs => {
  if (blogs.length === 0) return null;
  if (blogs.length === 1)
    return { author: blogs[0].author, blogs: blogs[0].length };

  const groupByAuthor = Object.groupBy(blogs, blog => blog.author);

  return Object.entries(groupByAuthor)
    .map(([author, posts]) => ({ author, blogs: posts.length }))
    .reduce((max, curr) => (curr.blogs > max.blogs ? curr : max));
};

const mostLikes = blogs => {
  if (blogs.length === 0) return null;
  if (blogs.length === 1)
    return { author: blogs[0].author, likes: blogs[0].likes };

  const authorWithMostLikes = favoriteBlog(blogs).author;
  const groupByAuthor = Object.groupBy(blogs, blog => blog.author);

  return {
    author: authorWithMostLikes,
    likes: groupByAuthor[authorWithMostLikes].reduce(
      (sum, post) => sum + post.likes,
      0,
    ),
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
