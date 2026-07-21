require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token("reqBody", req => JSON.stringify(req.body));

const app = express();
app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(":method :url :status :reqBody :response-time ms"));

app.get("/info", (request, response) => {
  Person.countDocuments().then(count => {
    response.send(
      `Phonebook has info for ${count} people
${new Date()}`,
    );
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then(result => response.status(204).end())
    .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  const update = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then(updatedPerson => {
      if (!updatedPerson) {
        return response.status(404).end();
      }

      return response.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  Person.create({ name, number }).then(result => response.json(result));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
