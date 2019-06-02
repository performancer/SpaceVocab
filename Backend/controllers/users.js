const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')
const Package = require('../models/package')

router.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

router.post('/', async (request, response, next) => {
    try {
        const { username, password } = request.body

        if (!password || password.length < 3 ) {
            return response.status(400).send({
                error: 'pasword minimum length 3'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const user = new User({
            username,
            passwordHash,
        })

        const savedUser = await user.save()
        response.json(savedUser)

    } catch (exception) {
        next(exception)
    }
})

router.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id)
    response.json(user)
})

router.get('/:id/packages', async (request, response) => {
    const user = await User.findById(request.params.id)
    response.json(user.packages)
})

router.post('/:id/packages', async (request, response, next) => {
    try {
        const user = await User.findById(request.params.id)
        const source = await Package.findById(request.body.package)

        const words = source.words.map(word =>  {
            return {
                word: word.id,
                synonyms: [], //user customized synonyms
                reviews: []   //user's reviews of this word
            }
        })

        //user version of package that is used to store reviews and custom synonyms
        //the word attribute for each word is only a reference
        const package = {
            source: source.id,
            words: words
        }

        user.packages = user.packages.concat(package)
        await user.save()
        response.json(user)

    } catch (exception) {
        next(exception)
    }
})

router.get('/:id/packages/:package', async (request, response) => {
    const user = await User.findById(request.params.id)
    const package = user.packages.find(p => p.id === request.params.package)
    response.json(package)
})

router.get('/:id/packages/:package/reviews', async (request, response) => {
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
})

router.put('/:id/packages/:package/:word', async (request, response, next) => {
    try {
        const user = await User.findById(request.params.id)
        const package = user.packages.find(p => p.id === request.params.package)
        const word = package.words.find(w => w.word === request.params.word)
        const answer = request.body.answer     //answer submitted by the user
        const synonym = request.body.synonym   //custom synonym submitte by the user

        //handle a review
        if(answer){
            console.log(`REVIEW word:${word} package:${package} userlang:${user.language} answer:${answer}`)

            //get the translations and synonyms in user's language from package data
            const translation = await Package.findById(package.source).words
                .find(w => w.id === word).translations
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

        //TODO

        response.json(word)
    } catch (exception) {
        next(exception)
    }
})

module.exports = router
