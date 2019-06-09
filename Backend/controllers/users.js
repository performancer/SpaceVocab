const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

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

module.exports = router
