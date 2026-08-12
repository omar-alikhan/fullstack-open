const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userExtractor } = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
  const result = await Blog.findById(request.params.id);
  if (!result) return response.status(404).end();
  response.json(result);
});

blogsRouter.post("/", userExtractor, async (request, response) => {
  if (!request.body.title) return response.status(400).end();
  if (!request.body.url) return response.status(400).end();
  const user = request.user;

  const blog = new Blog({ ...request.body, user: user._id });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) return response.status(404).end();

  if (blog.user.toString() !== user._id.toString())
    return response.status(401).json({ error: "unauthorized" });

  await Blog.findByIdAndDelete(request.params.id);

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  if (!request.body) return response.status(404).end();

  const blog = await Blog.findById(request.params.id);

  if (!blog) return response.status(404).end();

  blog.likes = request.body?.likes;

  const updatedBlog = await blog.save();

  response.json(updatedBlog);
});

module.exports = blogsRouter;
