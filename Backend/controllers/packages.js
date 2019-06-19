const router = require('express').Router()
const helper = require('../utils/helper')
const Package = require('../models/package')
const User = require('../models/user')

router.get('/', async (request, response, next) => {
    try {
        const packages = await Package
            .find({})
            .populate('author', { username: 1 })
            .populate('likes.user', { username: 1 })

        response.json(packages)
    } catch ( exception ) {
        next(exception)
    }
})

router.get('/:id', async (request, response, next) => {
    try {
        const user = await helper.getUser(request.token)
        const package = await Package.findById(request.params.id)
            .populate('author', { username: 1 })
            .populate('opinions.user', { username: 1 })

        const subscribed = user
          && user.packages.find(p => p.source.equals(package.id)) ?
            true : false

        response.json({ ...package.toJSON(), subscribed: subscribed })
    } catch ( exception ) {
        next(exception)
    }
})

router.put('/:id', async (request, response, next) => {
    try {
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401)
                .json({ error: 'token missing or invalid' })

        const package = await Package.findById(request.params.id)
        const opinion = request.body.opinion

        //if there is an opinion, value can only be 1, 0 or -1
        if(opinion === 1 || opinion === 0 || opinion === -1) {
            const body = { user: user.id, value: opinion }

            //remove earlier opinion(s) by this user
            package.opinions = package.opinions
                .filter(l => !l.user.equals(user.id))

            //if the opinion is not neutral, push it
            if(opinion !== 0)
                package.opinions.push(body)

        } else if (package.author && package.author.equals(user.id)) {
            const { name, details, language } = request.body
            const words = handleWords(request.body.words)
            package.name = name
            package.details = details
            package.language = language
            package.words = words
        }

        package.save()
        response.json(package)
    } catch ( exception ) {
        next(exception)
    }
})

router.get('/:package/:word', async (request, response, next) => {
    try {
        const package = await Package.findById(request.params.package)
        const word = package.words.find(w => w.id === request.params.word)
        response.status(200).json(word)
    } catch ( exception ) {
        next(exception)
    }
})

router.post('/', async (request, response, next) => {
    try {
        const author = await helper.getUser(request.token)

        if (!author)
            return response.status(401).json({ error: 'token missing or invalid' })

        const { name, language, details } = request.body
        const words = handleWords(request.body.words)

        const package = new Package({
            name,
            language,
            details,
            author,
            words
        })

        await package.save()
        response.json(package)

    } catch ( exception ) {
        next(exception)
    }
})

router.delete('/:id', async (request, response, next) => {
    try {
        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const package = await Package.findById(request.params.id)

        if(package.author.equals(user.id)) {
            package.remove()

            const users = await User.find({})
            users.map(u => {
                u.packages = u.packages.filter(p => !p.source.equals(package.id))
                u.save()
            })

            return response.status(200).json('package removed')
        }

        response.status(401)
    } catch (exception) {
        next(exception)
    }
})


const handleWords = (words) => {
    return words.map(w => {
        return { ...w, spelling: w.spelling.toLowerCase() }
    })
}

module.exports = router
