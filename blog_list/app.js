const path = require('path')
const express = require('express')
require('express-async-errors')

const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const app = express()

const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

mongoose
  .connect(config.URL)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use(express.static('build'))

app.use(middleware.errorHandler)

module.exports = app
