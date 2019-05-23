require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

app.use(express.static('build'))
app.use(bodyParser.json())

const packages = [
    {
        package: 'GER',
        words: [
            {
                word: 'wasser',
                languages: [
                    { language: 'FI', translation: 'vesi',synonyms: ['aqua', 'H20'] },
                    { language: 'EN', translation: 'water', synonyms: ['aqua', 'H20'] }
                ]
            },
            {
                word: 'feuer',
                languages: [
                    { language: 'FI', translation: 'tuli',synonyms: ['liekki', 'lieska'] },
                    { language: 'EN', translation: 'fire', synonyms: ['flame', 'scorch'] }
                ]
            }
        ]
    },
    {
        package: 'JAP',
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
    },
]

const kayttajanOmaKanta = {
    language: 'FI',
    words:[
        {
            word: 'vatten',
            package: 'GER',
            synonyms: [],
            review:[
                { date: '02.02.02', answer: 'vaten' },
                { date: '02.02.02', answer: 'vat' }
            ]
        }
    ] }

app.get('/api/packages/', (request, response) => {
    response.json(packages)
} )

app.get('/api/packages/:package', (request, response) => {
    const package = packages.find(k => k.package === request.params.package)

    if(package)
        response.json(package)
    else
        response.status(404).end()
})

app.get('/api/packages/:package/:word', (request, response) => {
    const package = packages.find(k => k.package === request.params.package)

    if(package){
        const word = package.words.find(w => w.word === request.params.word)

        if(word)
            return response.json(word)
    }

    response.status(404).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
