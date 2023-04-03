const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

morgan.token("body", function (req, res) {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log("id: ", id);
  const person = persons.find((person) => person.id === id);
  console.log("person: ", person);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
};

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return getRandomInt(maxId + 1, 1000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Name or number is missing!",
    });
  } else if (persons.find((person) => person.name === body.name)) {
    return response.status(403).json({
      error: "Name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/info", (request, response) => {
  const numPeople = persons.length;
  const date = new Date();
  const info = `<div>Phonebook has info for ${numPeople} people</div>
                    </br>
                  <div>${date}</div>`;
  response.send(info);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
