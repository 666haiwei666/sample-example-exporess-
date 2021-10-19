const express = require('express')
const { readFile, writeFile } = require('./db')
const { errorHandler } = require('./errorHandler')
const app = express()
app.get('/todos', async (req, res, next) => {
  let db = await readFile()
  try {
    res.status(200).json(db.todos)
  } catch (err) {
    next(err)
  }
})

app.get('/todos/:id', async (req, res, next) => {
  let db = await readFile()
  try {
    let todo = db.find((item) => item.id == Number.parseInt(req.params.id))
    if (!todo) {
      return res.status(404).end()
    }
    res.status(200).json(todo)
  } catch (err) {
    next(err)
  }
})

app.post('/todos', async (req, res, next) => {
  let { title } = req.query
  if (!title) {
    return res.status(422).json({
      error: 'The field title is required.',
    })
  }
  let db = await readFile()
  let todoLength = db.todos.length
  db.todos[db.todos.length] = {
    id: db.todos[todoLength - 1].id + 1,
    title: title,
  }
  try {
    await writeFile(db)
    res.status(200).json(db.todos)
  } catch (err) {
    next(err)
  }
})

app.put('/todos/:id', async (req, res, next) => {
  let todo = req.query
  let db = await readFile()
  let ret = db.todos.find((todo) => todo.id == Number.parseInt(req.params.id))
  if (!ret) {
    return res.status(404).end()
  }
  Object.assign(ret, todo)
  try {
    await writeFile(db)
    res.status(200).json(ret)
  } catch (err) {
    next(err)
  }
})

app.delete('/todos/:id', async (req, res, next) => {
  const todoId = Number.parseInt(req.params.id)
  const db = await readFile()
  const index = db.todos.findIndex((todo) => todo.id === todoId)
  if (index === -1) {
    return res.status(404).end()
  }
  db.todos.splice(index, 1)
  try {
    await writeFile(db)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})
app.use(errorHandler())
app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`)
})
