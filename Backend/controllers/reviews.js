const router = require('express').Router()
const helper = require('../utils/helper')
const Package = require('../models/package')

router.get('/:package', async (request, response, next) => {
    try {
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const package = user.packages.find(p => p.id === request.params.package)

        if(!package)
            response.status(404).json({ error: 'no such package' })

        const source = await Package.findById(package.source)
        const reviews = helper.getReviewable(package.words).map(w => {
            const sourceWord = source.words.find(s => w.word.equals(s.id))
            return { ...w.toObject(), spelling: sourceWord.spelling, translations: sourceWord.translations }
        })

        console.log(reviews)
        response.json({ words: [ ...reviews ], name: source.name })

    } catch (exception) {
        next(exception)
    }
})

router.put('/:package/:word', async (request, response, next) => {
    try {
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

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
            word.stage += success ? (word.stage < 4 ? 1 : 0) : (word.stage < 2 ? 0 : -1)
            word.reviews.push(review)

            response.status(200).json(review)
        }

        if(synonym){
            console.log(`SYNONYM word:${word} package:${package} synonym:${synonym}`)
            word.synonyms.push(synonym)
            response.status(200)
        }

        package.words = package.words.map(w => w.id === request.params.word ? word : w)
        user.packages = user.packages.map(p => p.id === request.params.package ? package : p)
        await user.save()

    } catch (exception) {
        next(exception)
    }
})

module.exports = router
