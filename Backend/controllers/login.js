const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')
const helper = require('../utils/helper')

router.post('/', async (request, response, next) => {
    try {
        const body = request.body

        const user = await User.findOne({ username: body.username })
        const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(body.password, user.passwordHash)

        console.log(user)

        if (!user || !passwordCorrect) {
            return response.status(401).json({
                error: 'invalid username or password'
            })
        }

        const token = helper.getToken(user)
        response.status(200).send({ token, username: user.username })
    } catch (exception) {
        next(exception)
    }
})

module.exports = router
