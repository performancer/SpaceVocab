const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    next(error)
}

module.exports = {
    errorHandler
}
