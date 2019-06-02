const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getUser = async (token) => {
    if (!token)
        return null

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id)
        return null

    return await User.findById(decodedToken.id)
}

module.exports = { getUser }
