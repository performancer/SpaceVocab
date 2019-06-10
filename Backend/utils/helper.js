const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getUser = async (token) => {
    if (!token)
        return null

    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id)
        return null

    return await User.findById(decodedToken.id).populate('packages.source', { name: 1 })
}

const getToken = (user) => {
    const userForToken = {
        username: user.username,
        id: user.id,
    }

    return jwt.sign(userForToken, process.env.SECRET)
}

module.exports = { getUser, getToken }
