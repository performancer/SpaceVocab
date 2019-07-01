const router = require('express').Router()
const authentication = require('../utils/authentication')
const helper = require('../utils/helper')
const Package = require('../models/package')

router.get('/', async (request, response, next) => {
    try {
        const user = await authentication.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const packages = user.packages.map(package => {
            return {
                id: package.id,
                source: package.source,
                lessons: helper.getLessons(package.words).length,
                reviews: helper.getReviews(package.words).length,
                next: helper.getNextReview(package.words)
            }
        })

        response.json(packages)

    } catch (exception) {
        next(exception)
    }
})

router.post('/', async (request, response, next) => {
    try {
        const id = request.body.id
        const user = await authentication.getUser(request.token)

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
                return { word: w.id, stage: 0 }
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

router.get('/:id', async (request, response, next) => {
    try {
        const user = await authentication.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const package = user.packages.find(p => p.id === request.params.id)
        const source = await Package.findById(package.source)

        const words = package.words.map(w => {
            return {
                ...w.toObject(),
                spelling: source.words.find(sw => w.word.equals(sw.id)).spelling
            }
        })

        response.json({ ...package.toObject(), words: words })

    } catch (exception) {
        next(exception)
    }
})

router.delete('/:id', async (request, response, next) => {
    try {
        const id = request.params.id
        const user = await authentication.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        user.packages = user.packages.filter(p => !p.source.equals(id) && !p._id.equals(id))
        user.save()
        response.status(200).json()
    } catch (exception) {
        next(exception)
    }
})

module.exports = router
