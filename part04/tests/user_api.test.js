const { before, test, after, beforeEach, describe } = require("node:test");
const config = require("../utils/config");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");
const bcrypt = require("bcrypt");

const api = supertest(app);

before(async () => {
  await mongoose.connect(config.MONGODB_URI, { family: 4 });
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash1 = await bcrypt.hash("sekret", 10);
    const user1 = new User({ username: "root", passwordHash: passwordHash1 });

    const passwordHash2 = await bcrypt.hash("sekret", 10);
    const user2 = new User({
      username: "firstUser",
      name: "Satoko Sato",
      passwordHash: passwordHash2,
    });

    await User.insertMany([user1, user2]);
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username is already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const duplicateUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(duplicateUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes("expected `username` to be unique"));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with an empty username", async () => {
    const usersAtStart = await helper.usersInDb();

    const emptyUsername = {
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(emptyUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("`username` is required"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with an empty password", async () => {
    const usersAtStart = await helper.usersInDb();

    const emptyPassword = {
      username: "emptyPassword",
      name: "Matti Luukkainen",
    };

    const result = await api
      .post("/api/users")
      .send(emptyPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(result.body.error.includes("`password` is required"));

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails when username is less than 3 chars", async () => {
    const usersAtStart = await helper.usersInDb();

    const shortUsername = {
      username: "ro",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(shortUsername)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes(
        "is shorter than the minimum allowed length (3)",
      ),
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails when password is less than 3 chars", async () => {
    const usersAtStart = await helper.usersInDb();

    const shortPassword = {
      username: "macaroni",
      name: "Matti Luukkainen",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(shortPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes(
        "is shorter than the minimum allowed length (3)",
      ),
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
