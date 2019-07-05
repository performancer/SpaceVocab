const bcrypt = require('bcrypt')
const router = require('express').Router()
const authentication = require('../utils/authentication')
const User = require('../models/user')

router.post('/', async (request, response, next) => {
    try {
        const body = request.body

        const user = await User.findOne({
            username: { $regex : new RegExp(body.username, 'i') }
        })
        const passwordCorrect = user === null ? false
            : await bcrypt.compare(body.password, user.passwordHash)

        if (!user || !passwordCorrect) {
            return response.status(401)
                .json({ error: 'invalid username or password' })
        }

        const token = authentication.createToken(user)
        response.status(200)
            .send({ token, username: user.username, id: user.id })
    } catch (exception) {
        next(exception)
    }
})

module.exports = router
