const router = require('express').Router()
const helper = require('../utils/helper')
const Package = require('../models/package')

router.get('/packages', async (request, response, next) => {
    try {
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const packages = user.packages.map(package => {
            return { ...package.toObject(),
                reviews: helper.getReviewable(package.words).length }
        })

        console.log(packages)
        response.json(packages)

    } catch (exception) {
        next(exception)
    }
})

router.post('/packages', async (request, response, next) => {
    try {
        const id = request.body.id
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const source = await Package.findById(id)

        if(!source)
            return response.status(401).json({ error: 'invalid reference' })

        let package = await user.packages.find(p => p.source.equals(id))

        if(package)
            return response.status(401).json({ error: 'already have this package' })

        const data = {
            source: source.id,
            words: source.words.map(w => {
                return {
                    word: w.id,
                    synonyms: [],
                    reviews: []
                }
            })
        }

        user.packages.push(data)
        user.save()

        package = user.packages.find(p => p.source.equals(id))
        response.status(200).json(package)

    } catch ( exception ) {
        next(exception)
    }
})

router.get('/packages/:id', async (request, response, next) => {
    try {
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const package = user.packages.find(p => p.id === request.params.id)
        response.json(package)

    } catch (exception) {
        next(exception)
    }
})

router.delete('/packages/:id', async (request, response, next) => {
    try {
        const id = request.params.id
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        user.packages = user.packages.filter(p => !p.source.equals(id) && !p.id.equals(id))
        user.save()
        response.status(200).json()
    } catch (exception) {
        next(exception)
    }
})

module.exports = router
