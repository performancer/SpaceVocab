const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')
const helper = require('../utils/helper')

router.get('/', async (request, response, next) => {
    try {
        //TODO: Administrator only

        const users = await User.find({})
        response.json(users.map(user => user.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

router.post('/', async (request, response, next) => {
    try {
        //TODO: email

        const { username, password, language } = request.body

        if (!password || password.length < 3 ) {
            return response.status(400).send({
                error: 'pasword minimum length 3'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const userData = new User({
            username,
            passwordHash,
            language
        })

        const user = await userData.save()
        const token = helper.getToken(user)

        response.status(200).send({ token, username: user.username })
    } catch (exception) {
        next(exception)
    }
})

router.get('/:id', async (request, response, next) => {
    try {
        //TODO: should be visible only to administrator and to user themselves

        const user = await User.findById(request.params.id)
        response.json(user.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = router
