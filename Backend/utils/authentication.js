const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getUser = async (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        return await User.findById(decodedToken.id)
            .populate('packages.source', { name: 1 })
    } catch (exception){
        return null
    }
}

const createToken = (user) => {
    const data = { username: user.username, id: user.id }
    return jwt.sign(data, process.env.SECRET)
}

module.exports = {
    getUser,
    createToken,
}
