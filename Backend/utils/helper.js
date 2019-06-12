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

const getReviewable = (words) => {
    const reviewables = words.filter(word => {

        //if this word has not been reviewed before, it can be reviewed
        if(!word.reviews || word.reviews.length === 0)
            return true

        //calculate the current stage of this word based on successes
        var stage = 0
        for(var i = 0; i <word.reviews.length; i++)
            stage += (!word.reviews[i].success && stage > 0) ? -1 : 1

        //get milliseconds from the time of last review
        const latestReview = word.reviews[word.reviews.length - 1]
        const milliseconds = (new Date()).getTime() - latestReview.datetime
        //calculate the wait untill this word can be reviewed again
        const duration = stage * 360000

        console.log(`word:${word.word} stage:${stage} in:${(duration - milliseconds) / (1000 * 60)}min`)

        //if the duration has passed the word can be reviewed again
        return milliseconds > duration
    })

    return reviewables
}

module.exports = { getUser, getToken, getReviewable }
