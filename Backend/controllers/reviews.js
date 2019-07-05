const router = require('express').Router()
const similarity = require('string-similarity')
const authentication = require('../utils/authentication')
const helper = require('../utils/helper')
const Package = require('../models/package')

router.get('/:package', async (request, response, next) => {
    try {
        const user = await authentication.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const package = user.packages.find(p => p.id === request.params.package)

        if(!package)
            response.status(404).json({ error: 'no such package' })

        const source = await Package.findById(package.source)

        let reviews = request.query.lesson === 'true' ?
            helper.getLessons(package.words) : helper.getReviews(package.words)

        reviews = reviews.map(w => {
            const sourceWord = source.words.find(s => w.word.equals(s.id))
            return {
                ...w.toObject(),
                spelling: sourceWord.spelling,
                translation: sourceWord.translation,
                alternatives: sourceWord.synonyms
            }
        })

        response.json({ words: [ ...reviews ], name: source.name })

    } catch (exception) {
        next(exception)
    }
})

router.put('/:package/:word', async (request, response, next) => {
    try {
        const user = await authentication.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const subscription = user.packages.find(p => p.id === request.params.package)
        const word = subscription.words.find(w => w.id === request.params.word)
        const answer = request.body.answer     //answer submitted by the user
        const synonym = request.body.synonym   //custom synonym submitte by the user

        //handle a review
        if( answer && (word.stage === 0 || helper.isReviewable(word))){
            //console.log(`REVIEW word:${word} package:${package} userlang:${user.language} answer:${answer}`)

            //get the translations and synonyms in user's language from package data
            const source = await Package.findById(subscription.source)

            const original = source.words.find(w => w.id === word.word.toString())

            //check if the answer is similar to the translation or a synonym
            const correct = [original.translation, ...original.synonyms, ...word.synonyms]
            const success = correct.find(c => similarity.compareTwoStrings(c.toLowerCase(), answer.toLowerCase()) >= 0.6)

            const review = {
                date: (new Date()).getTime(),
                success: success ? true : false
            }

            //push the new review data to user version of word data
            if(!word.stage)
                word.stage = 0

            word.stage += success ? (word.stage < 4 ? 1 : 0) : (word.stage < 2 ? 0 : -1)
            word.reviews.push(review)

            response.status(200).json(review)
        }

        if(synonym){
            console.log(`SYNONYM word:${word} package:${subscription} synonym:${synonym}`)

            if(word.synonyms.includes(synonym)) {
                word.synonyms = word.synonyms.filter(s => s !== synonym)
                response.status(200).json('synonym removed')
            } else {
                word.synonyms.push(synonym)
                response.status(200).json('synonym added')
            }
        }

        subscription.words = subscription.words.map(w => w.id === request.params.word ? word : w)
        user.packages = user.packages.map(p => p.id === request.params.package ? subscription : p)
        await user.save()

    } catch (exception) {
        next(exception)
    }
})

module.exports = router
