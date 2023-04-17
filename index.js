// Initial setting
const express = require('express')
const app = express()

// database
const mongoose = require('mongoose')

const Person = require('./models/Person')

app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())

// routes
//create person of database
app.post('/person', async (req, res) => {
  const { name, salary, approved } = req.body

  const person = {
    name,
    salary,
    approved,
  }

  try {
    await Person.create(person)

    res.status(201).json({ message: ' person successfully entered into the system!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.get('/person', async (req, res) => {
  try {
    const people = await Person.find()

    res.status(200).json(people)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

app.get('/person/:id', async (req, res) => {
  const id = req.params.id

  try {
    const person = await Person.findOne({ _id: id })

    if (!person) {
      res.status(422).json({ message: 'User not found!' })
      return
    }

    res.status(200).json(person)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})
//update person of database
app.patch('/person/:id', async (req, res) => {
  const id = req.params.id

  const { name, salary, approved } = req.body

  const person = {
    name,
    salary,
    approved,
  }

  try {
    const updatedPerson = await Person.updateOne({ _id: id }, person)

    if (updatedPerson.matchedCount === 0) {
      res.status(422).json({ message: 'User not found!' })
      return
    }

    res.status(200).json(person)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})
//delete the user
app.delete('/person/:id', async (req, res) => {
  const id = req.params.id

  const person = await Person.findOne({ _id: id })

  if (!person) {
    res.status(422).json({ message: 'User not found!' })
    return
  }

  try {
    await Person.deleteOne({ _id: id })

    res.status(200).json({ message: 'user removed successfully!' })
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})
//
app.get('/', (req, res) => {
  res.json({ message: 'Hello Express!' })
})
// conexao com banco de dados 
//link==//https://www.mongodb.com/cloud/atlas/register
const DB_USER='agamenon'//database username
const DB_Passoword=encodeURIComponent('LULH6ey1B5ZNyTBs')//database password
mongoose
  .connect(
    `mongodb+srv://${DB_USER}:${DB_Passoword}@cluster0.4rmdqft.mongodb.net/?retryWrites=true&w=majority`,
  )
  .then(() => {
    console.log('connected to database!')
    app.listen(5000)
  })
  .catch((err) => console.log(err))