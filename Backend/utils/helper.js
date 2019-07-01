
const getLessons = (words) => words.filter(word => word.stage === 0)
const getReviews = (words) => words.filter(word => isReviewable(word))

const isReviewable = (word) => {
    //if this word has not been reviewed before, it's a lesson
    if (word.stage === 0)
        return false
    //if this word is in 'perfect' stage it will never be reviewed again
    if (word.stage === 4)
        return false

    //if the current time has passed the next review time
    return new Date().getTime() > getReviewTime(word)
}

const getReviewTime = (word) => {
    //get the date of the last review (milliseconds)
    const last = word.reviews[word.reviews.length - 1]
    const date = last ? last.date.getTime() : 0
    //calculate the space untill this word can be reviewed again (milliseconds)
    const space = Math.pow(word.stage, 3) * 24 * 60 * 60 * 1000

    return date + space
}

const getNextReview = (words) => {
    const now = new Date().getTime()
    const array = words.map(word => getReviewTime(word) - now)
    return Math.min(...array)
}

module.exports = {
    getLessons,
    getReviews,
    isReviewable,
    getNextReview
}
