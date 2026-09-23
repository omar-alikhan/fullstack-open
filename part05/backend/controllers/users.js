const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const logger = require("../utils/logger");
const { nonExistingId } = require("../tests/test_helper");

usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password) {
    return response.status(400).json({ error: "`password` is required" });
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: "`password` is shorter than the minimum allowed length (3).",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    return response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs");
  response.json(users);
});

usersRouter.get("/:username", async (request, response) => {
  const user = await User.find({ username: request.params.username }).populate(
    "blogs",
  );
  response.json(user);
});

module.exports = usersRouter;
