const router = require('express').Router()
const helper = require('../utils/helper')
const Package = require('../models/package')

/*
const packages2 =
    {
        name: 'German 1',
        package: 'DE',
        words: [
            {
                word: 'wasser',
                translations: [
                    { language: 'FI', translation: 'vesi',synonyms: ['aqua', 'H20'] },
                    { language: 'EN', translation: 'water', synonyms: ['aqua', 'H20'] }
                ]
            },
            {
                word: 'feuer',
                translations: [
                    { language: 'FI', translation: 'tuli',synonyms: ['liekki', 'lieska'] },
                    { language: 'EN', translation: 'fire', synonyms: ['flame', 'scorch'] }
                ]
            }
        ]
    }

const package3 =
    {
        name: 'Japanese 1',
        package: 'JA',
        words: [
            {
                word: 'みず',
                languages: [
                    { language: 'FI', translation: 'vesi',synonyms: ['aqua', 'H20'] },
                    { language: 'EN', translation: 'water', synonyms: ['aqua', 'H20'] }
                ]
            },
            {
                word: 'ひ',
                languages: [
                    { language: 'FI', translation: 'tuli',synonyms: ['liekki', 'lieska'] },
                    { language: 'EN', translation: 'fire', synonyms: ['flame', 'scorch'] }
                ]
            }
        ]
    }
*/

router.get('/', async (request, response, next) => {
    try {
        const packages = await Package.find({}).populate('likes.user', { name: 1 })
        response.json(packages)
    } catch ( exception ) {
        next(exception)
    }
} )

router.get('/:id', async (request, response, next) => {
    try {
        const package = await Package.findById(request.params.id)
        response.json(package)
    } catch ( exception ) {
        next(exception)
    }
})

router.put('/:id', async (request, response, next) => {
    try {

        const user = await helper.getUser(request.token)

        if (!user)
            return response.status(401).json({ error: 'token missing or invalid' })

        const package = await Package.findById(request.params.id)
        const value = request.body.value

        if(value > 1 || value < -1)
            return response.status(401)

        const body = {
            user: user.id,
            value: value
        }

        if(!package.likes) {
            package.likes = []
        } else {
            package.likes = package.likes.filter(l => !l.user.equals(user.id))
        }

        if(value !== 0) {
            package.likes.push(body)
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
    // administrator only

    try {
        const { name, language, words } = request.body

        const package = new Package({
            name,
            language,
            words
        })

        await package.save()
        response.json(package)

    } catch ( exception ) {
        next(exception)
    }
})

module.exports = router
