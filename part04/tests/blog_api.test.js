const {
  before,
  test,
  after,
  beforeEach,
  describe,
  beforeAll,
} = require("node:test");
const config = require("../utils/config");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

before(async () => {
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const initialBlogs = helper.initialBlogs;
  const initialUsers = await helper.initialUsers();

  // 1. Create users to generate IDs
  const savedUsers = await User.insertMany(initialUsers);

  const userIds = savedUsers.map(user => user.id);

  // 2. Save user IDs to blogs.user
  const blogsWithUsers = initialBlogs.map((blog, i) => ({
    ...blog,
    user: userIds[i % userIds.length],
  }));

  // 3. Create blogs and generate IDs
  const savedBlogs = await Blog.insertMany(blogsWithUsers);

  //console.log(savedBlogs);

  // 4. Update user.blogs with generate blog IDs
  for (const user of savedUsers) {
    const userBlogIds = savedBlogs
      .filter(blog => blog.user.toString() === user._id.toString())
      .map(blog => blog._id);

    user.blogs = userBlogIds;
    await user.save();
  }
});

after(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
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
  let loggedInUser;
  beforeEach(async () => {
    const testUser = {
      username: "first",
      password: "sekret",
    };

    loggedInUser = (await api.post("/api/login").send(testUser)).body;
  });

  test("succeeds with valid id", async () => {
    const newBlog = {
      title: "Javascript is so Fun!",
      author: "Omar M. Alikhan",
      url: "http://omar-alikhan.com/articles/i-love-javascript.html",
      likes: 420,
      __v: 0,
    };

    await api
      .post("/api/blogs")
      .auth(loggedInUser.token, { type: "bearer" })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(r => r.title);
    assert(titles.includes("Javascript is so Fun!"));
  });

  test("fails when no token is provided", async () => {
    const newBlog = {
      title: "Javascript is so Fun!",
      author: "Omar M. Alikhan",
      url: "http://omar-alikhan.com/articles/i-love-javascript.html",
      likes: 420,
      __v: 0,
    };

    await api.post("/api/blogs").send(newBlog).expect(401);
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
      .auth(loggedInUser.token, { type: "bearer" })
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

    await api
      .post("/api/blogs")
      .auth(loggedInUser.token, { type: "bearer" })
      .send(newBlogNoTitle)
      .expect(400);

    await api
      .post("/api/blogs")
      .auth(loggedInUser.token, { type: "bearer" })
      .send(newBlogNoUrl)
      .expect(400);
  });

  test("succeeds with logged in user as the blog's user", async () => {
    const newBlog = {
      title: "Javascript is so Fun! Hehe!",
      author: "Albert Einstein",
      url: "http://emc2.com/articles/i-love-javascript.html",
      likes: 420,
      __v: 0,
    };

    await api
      .post("/api/blogs")
      .auth(loggedInUser.token, { type: "bearer" })
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(blogsAtEnd.at(-1).user.username, loggedInUser.username);
  });
});

describe("when deleting blogs", () => {
  test("fails when no token is provided", async () => {
    const blogs = await helper.blogsInDb();
    const blogToDeleteId = blogs[0].id;

    await api.delete(`/api/blogs/${blogToDeleteId}`).expect(401);
  });

  test("succeeds when user deletes their own blog", async () => {
    // login as the blog owner (in test setup blog[0] is owned by "root")
    const ownerLogin = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });
    const ownerToken = ownerLogin.body.token;

    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs.find(b => b.user.username === "root");

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .auth(ownerToken, { type: "bearer" })
      .expect(204);

    await api.get(`/api/blogs/${blogToDelete.id}`).expect(404);

    const remaining = await api.get("/api/blogs");
    assert.strictEqual(remaining.body.length, helper.initialBlogs.length - 1);
  });

  test("fails when a different logged-in user deletes someone else's blog", async () => {
    // login as a different user (e.g. "first")
    const otherLogin = await api
      .post("/api/login")
      .send({ username: "first", password: "sekret" });
    const otherToken = otherLogin.body.token;

    const blogs = await helper.blogsInDb();
    const blogNotOwned = blogs.find(b => b.user.username !== "first");

    await api
      .delete(`/api/blogs/${blogNotOwned.id}`)
      .auth(otherToken, { type: "bearer" })
      .expect(401);

    // verify the blog still exists
    const stillThere = await api
      .get(`/api/blogs/${blogNotOwned.id}`)
      .expect(200);
    assert.strictEqual(stillThere.body.title, blogNotOwned.title);

    const allBlogs = await api.get("/api/blogs");
    assert.strictEqual(allBlogs.body.length, helper.initialBlogs.length);
  });
});

describe("when updating blogs", () => {
  test("without sending a body returns 404", async () => {
    const blogToUpdate = helper.initialBlogs[0];
    await api.put(`/api/blogs/${blogToUpdate._id}`).expect(404);
  });

  test("with a given number of likes it updates successfully", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdateId = blogs[0].id;
    const updatedLikes = 42;

    await api.put(`/api/blogs/${blogToUpdateId}`).expect(404);
    await api.put(`/api/blogs/${blogToUpdateId}`).send({ likes: updatedLikes });
    const updatedBlog = await api.get(`/api/blogs/${blogToUpdateId}`);

    const response = await api.get("/api/blogs");
    assert.strictEqual(updatedBlog.body.likes, updatedLikes);
  });
});
