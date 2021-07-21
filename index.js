const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', (req,res)=> JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = 
[
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
]

const generateId =() =>{
    const maxId = persons.length >0
        ? Math.max(...persons.map(n => n.id)) : 0
    return maxId + 1
}

app.get('/info', (request, response) => {
    const num = persons.length
    const time = new Date();
    const text = `Phonebook has info for ${num} people <br> ${time}`
    response.send(text)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response)=>{
    const body = request.body
    if(!body.name){
        return response.status(400).json({error : "name missing"})
    }
    if(!body.number){
        return response.status(400).json({error : "number missing"})
    }

    if(persons.filter(person=> person.name === body.name).length > 0){
        return response.status(400).json({error : "name must be unique"})
    }
    const person = {
        id : Math.random()*(5000-1)+1,
        name : body.name,
        number: body.number
    }
    persons = persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(person)
        response.json(person)
    else
        response.status(404).end()
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})