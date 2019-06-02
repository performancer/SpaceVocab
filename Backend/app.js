const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const { errorHandler } = require('./utils/middleware')

const userRouter = require('./controllers/users')
const packageRouter = require('./controllers/packages')

app.use(bodyParser.json())

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

app.use('/api/users', userRouter)
app.use('/api/packages', packageRouter)

app.use(errorHandler)

module.exports = app
