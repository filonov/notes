const { response, request } = require('express');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('combined'));

app.use(express.json());

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend.</h1>');
});

app.get('/info', (request, response) => {
    let date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`);
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
});

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => p.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number are missing'
        });
    }

    const isExist = persons.find(p => p.name === body.name);

    if (isExist) {
        return response.status(400).json({
            error: `${isExist.name} allready exists`
        });
    }

    const newPreson = {
        id: generateId(),
        name: body.name,
        number: body.number
    };

    persons = persons.concat(newPreson);

    response.json(newPreson);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});