const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(blogs);
});

after(async () => {
  await mongoose.connection.close();
});

const api = supertest(app);

describe("when retrieving blogs", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, 6);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs");

    const contents = response.body.map(e => e.title);
    assert(contents.includes("React patterns"));
  });

  test("_id is transformed to id", async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body;

    assert.ok(blogs[0].id);
    assert.strictEqual(blogs[0]._id, undefined);
  });
});

describe("when creating new blog", () => {
  test("succeeds with valid id", async () => {
    const newBlog = {
      _id: "5a422bc61b59a676234d17fc",
      title: "Javascript is so Fun!",
      author: "Omar M. Alikhan",
      url: "http://omar-alikhan.com/articles/i-love-javascript.html",
      likes: 420,
      __v: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const contents = response.body.map(r => r.title);

    assert.strictEqual(response.body.length, blogs.length + 1);

    assert(contents.includes("Javascript is so Fun!"));
  });

  test("defaults to 0 likes", async () => {
    const newBlog = {
      _id: "5a422bc61b59a676234d17fc",
      title: "Javascript is so Fun!",
      author: "Omar M. Alikhan",
      url: "http://omar-alikhan.com/articles/i-love-javascript.html",
      __v: 0,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get(`/api/blogs/${newBlog._id}`);

    assert.strictEqual(response.body.likes, 0);
  });

  test("without title or url returns bad request", async () => {
    const newBlogNoTitle = {
      _id: "5a422bc61b59b676234d17fc",
      author: "Omar M. Alikhan",
      url: "http://omar-alikhan.com/articles/i-love-javascript.html",
      __v: 0,
    };

    const newBlogNoUrl = {
      _id: "5a422bc61b59a676234d17xc",
      title: "Javascript is so Fun!",
      author: "Omar M. Alikhan",
      __v: 0,
    };

    await api.post("/api/blogs").send(newBlogNoTitle).expect(400);

    await api.post("/api/blogs").send(newBlogNoUrl).expect(400);
  });
});

describe("when deleting blogs", () => {
  test("removes it successfully from DB", async () => {
    const blogToDelete = blogs[1];

    await api.delete(`/api/blogs/${blogToDelete._id}`).expect(204);
    await api.get(`/api/blogs/${blogToDelete._id}`).expect(404);

    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, blogs.length - 1);
  });
});

describe("when updating blogs", () => {
  test("without sending a body returns 404", async () => {
    const blogToUpdate = blogs[0];
    await api.put(`/api/blogs/${blogToUpdate._id}`).expect(404);
  });

  test("with a given number of likes it updates successfully", async () => {
    const blogToUpdate = blogs[0];
    const updatedLikes = 42;

    await api.put(`/api/blogs/${blogToUpdate._id}`).expect(404);
    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send({ likes: updatedLikes });
    const updatedBlog = await api.get(`/api/blogs/${blogToUpdate._id}`);

    const response = await api.get("/api/blogs");
    assert.strictEqual(updatedBlog.body.likes, updatedLikes);
  });
});
