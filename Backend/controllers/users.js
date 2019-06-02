const bcrypt = require('bcrypt')
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Package = require('../models/package')

router.get('/', async (request, response, next) => {
    try {
        //TODO: Administrator only

        const users = await User.find({})
        response.json(users)
    } catch (exception) {
        next(exception)
    }
})

router.post('/', async (request, response, next) => {
    try {
        //TODO: email

        const { username, password } = request.body

        if (!password || password.length < 3 ) {
            return response.status(400).send({
                error: 'pasword minimum length 3'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            passwordHash,
        })

        const savedUser = await user.save()
        response.json(savedUser)

    } catch (exception) {
        next(exception)
    }
})

router.get('/:id', async (request, response, next) => {
    try {
        //TODO: should be visible only to administrator and to user themselves

        const user = await User.findById(request.params.id)
        response.json(user)
    } catch (exception) {
        next(exception)
    }
})

router.get('/:id/packages', async (request, response, next) => {
    try {
        //TODO: tokens

        const user = await User.findById(request.params.id)
        response.json(user.packages)
    } catch (exception) {
        next(exception)
    }
})

router.post('/:id/packages', async (request, response, next) => {
    try {
        //TODO: tokens

        const user = await User.findById(request.params.id)
        const source = await Package.findById(request.body.package)

        const words = source.words.map(word =>  {
            return {
                word: word.id,
                synonyms: [], //user customized synonyms
                reviews: []   //user's reviews of this word
            }
        })

        //user version of package that is used to store reviews and custom synonyms
        //the word attribute for each word is only a reference
        const package = {
            source: source.id,
            words: words
        }

        user.packages = user.packages.concat(package)
        await user.save()
        response.json(user)

    } catch (exception) {
        next(exception)
    }
})

router.get('/:id/packages/:package', async (request, response, next) => {
    try {
        //TODO: tokens

        const user = await User.findById(request.params.id)
        const package = user.packages.find(p => p.id === request.params.package)
        response.json(package)
    } catch (exception) {
        next(exception)
    }
})

module.exports = router
