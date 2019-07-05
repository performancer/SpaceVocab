const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const { tokenExtractor, errorHandler } = require('./utils/middleware')

const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
const subscriptionsRouter = require('./controllers/subscriptions')
const reviewRouter = require('./controllers/reviews')
const packageRouter = require('./controllers/packages')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

console.log('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connection to MongoDB:', error.message)
    })

app.use(tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/subscriptions', subscriptionsRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/packages', packageRouter)

app.use(errorHandler)

module.exports = app
