const config = require("./utils/config");
const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

const app = express();

mongoose
  .connect(config.MONGODB_URI, { family: 4 })

  .then(() => {
    console.log(`connected to MongoDB on URI ${config.MONGODB_URI}`);
  })
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.use(express.json());

app.get("/api/blogs", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

app.get("/api/blogs/:id", async (request, response) => {
  const result = await Blog.findById(request.params.id);
  if (!result) response.status(404).end();
  response.json(result);
});

app.post("/api/blogs", async (request, response) => {
  if (!request.body.title) response.status(400).end();
  if (!request.body.url) response.status(400).end();

  const blog = new Blog(request.body);

  const result = await blog.save();

  response.status(201).json(result);
});

app.delete("/api/blogs/:id", async (request, response, next) => {
  const result = await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

app.post("/api/blogs", async (request, response) => {
  if (!request.body.title) response.status(400).end();
  if (!request.body.url) response.status(400).end();

  const blog = new Blog(request.body);

  const result = await blog.save();

  response.status(201).json(result);
});

app.put("/api/blogs/:id", async (request, response) => {
  if (!request.body) return response.status(404).end();

  const blog = await Blog.findById(request.params.id);

  if (!blog) return response.status(404).end();

  blog.likes = request.body?.likes;

  const updatedBlog = await blog.save();

  response.json(updatedBlog);
});

module.exports = app;
