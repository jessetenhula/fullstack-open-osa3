require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('req-body', (req, res) => { return JSON.stringify(req.body) })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

const persons = []

app.get('/info', (req, res) => {
  const timeNow = new Date();
  Person.find({}).then(persons => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <time>${timeNow}</time>
    `)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)

  if (!person) {
    res.status(404).end()
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if(!body.name) {
    return res.status(400).json({
      error: "missing name"
    })
  }

  if(!body.number) {
    return res.status(400).json({
      error: "missing number"
    })
  }

  if(persons.find(person => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique"
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: String(Math.floor(Math.random() * 99999))
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`process running on port ${PORT}`)
})