require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Phone = require('./models/phone')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())


morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response) => {
  Phone.find({}).then(phones => {
    const num = phones.length
    const time = new Date()
    const text = `Phonebook has info for ${num} people <br> ${time}`
    response.send(text)
  })
})

app.get('/api/persons', (request, response) => {
  Phone.find({}).then(phones => {
    response.json(phones)
  })
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if(body.name === undefined){
    return response.status(400).json({ error : 'name missing' })
  }
  if(body.number === undefined){
    return response.status(400).json({ error : 'number missing' })
  }

  const person = new Phone({
    name : body.name,
    number: body.number
  })

  person.save()
    .then(result => result.toJSON())
    .then(resPerson => {
      response.json(resPerson)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Phone.findById(request.params.id)
    .then(phone => {
      if (phone)
        response.json(phone)
      else
        response.status(404).end()
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Phone.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const phone = {
    name : body.name,
    number: body.number
  }

  Phone.findByIdAndUpdate(request.params.id, phone, { new: true, runValidators:true, context: 'query' })
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})