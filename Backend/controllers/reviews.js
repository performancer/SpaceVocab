const router = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Package = require('../models/package')

router.get('/:id/:package/', async (request, response, next) => {
    try {
        //TODO: tokens

        const user = await User.findById(request.params.id)
        const package = user.packages.find(p => p.id === request.params.package)

        const review = package.words.filter(word => {
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

        response.json(review)

    } catch (exception) {
        next(exception)
    }
})

router.put('/:id/:package/:word', async (request, response, next) => {
    try {
        //TODO: tokens

        const user = await User.findById(request.params.id)
        const package = user.packages.find(p => p.id === request.params.package)
        const word = package.words.find(w => w.id === request.params.word)
        const answer = request.body.answer     //answer submitted by the user
        const synonym = request.body.synonym   //custom synonym submitte by the user

        //handle a review
        if(answer){
            //console.log(`REVIEW word:${word} package:${package} userlang:${user.language} answer:${answer}`)

            //get the translations and synonyms in user's language from package data
            const source = await Package.findById(package.source)

            const translation = source.words
                .find(w => w.id === word.word.toString()).translations
                .find(t => t.language === user.language)

            //check if the user's answer equals the correct translation or synonyms
            const trials = [translation.translation, ...translation.synonyms, ...word.synonyms]
            const success = trials.find(trial => trial === answer)

            const review = {
                date: (new Date()).getTime(),
                success: success ? true : false
            }

            //push the new review data to user version of word data
            word.reviews.push(review)
        }

        if(synonym){
            console.log(`SYNONYM word:${word} package:${package} synonym:${synonym}`)
            word.synonyms.push(synonym)
        }

        package.words = package.words.map(w => w.id === request.params.word ? word : w)
        user.packages = user.packages.map(p => p.id === request.params.package ? package : p)

        const saved = await user.save()
        response.json(saved)

    } catch (exception) {
        next(exception)
    }
})

module.exports = router
