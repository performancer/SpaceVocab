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

const getLessons = (words) => {
    return words.filter(word => !word.stage || word.stage === 0)
}

const getReviewable = (words) => {
    const reviewables = words.filter(word => {

        //if this word has not been reviewed before, it's a lesson
        //if this word is in 'perfect' stage it will never be reviewed again
        if (!word.stage || word.stage === 0 || word.stage === 4)
            return false

        //calculate the current stage of this word based on successes
        var stage = 0
        for(var i = 0; i <word.reviews.length; i++)
            stage += (!word.reviews[i].success && stage > 0) ? -1 : 1

        //get milliseconds from the time of last review
        const latestReview = word.reviews[word.reviews.length - 1]
        const milliseconds = (new Date()).getTime() - latestReview.datetime
        //calculate the wait untill this word can be reviewed again
        const duration = stage * 360000

        //if the duration has passed the word can be reviewed again
        return milliseconds > duration
    })

    return reviewables
}

module.exports = { getUser, getToken, getLessons, getReviewable }
