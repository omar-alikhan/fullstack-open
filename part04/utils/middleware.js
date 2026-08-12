const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  request.token =
    authorization && authorization.startsWith("Bearer ")
      ? authorization.replace("Bearer ", "")
      : null;
  next();
};

const userExtractor = async (request, response, next) => {
  const decoded = jwt.verify(request.token, process.env.SECRET);

  if (!decoded.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return response.status(400).json({ error: "UserId missing or not valid" });
  }

  request.user = user;
  next();
};

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongooseError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    const field = Object.keys(error.keyValue)[0];
    return response.status(400).json({
      error: `expected \`${field}\` to be unique`,
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

module.exports = {
  tokenExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
  userExtractor,
};
