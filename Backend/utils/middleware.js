const getTokenFrom = request => {
    const authorization = request.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }

    return null
}

const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request)
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    next(error)
}

module.exports = {
    tokenExtractor,
    errorHandler
}
