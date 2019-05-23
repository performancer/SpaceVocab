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

const userdata = {
    language: 'FI',
    packages: []
}

app.get('/api/packages/', (request, response) => {
    response.json(packages)
} )

app.get('/api/packages/:package', (request, response) => {
    const package = packages.find(p => p.package === request.params.package)
    response.json(package)
})

app.get('/api/packages/:package/:word', (request, response) => {
    const word = packages
        .find(p => p.package === request.params.package).words
        .find(w => w.word === request.params.word)

    response.json(word)
})

app.get('/api/user/packages', (request, response) => {
    response.json(userdata.packages)
})

app.post('/api/user/packages', (request, response) => {
    const name = request.body.package
    const words = packages
        .find(p => p.package === name).words
        .map(w =>  {
            return {
                word: w['word'],
                synonyms: [],
                reviews: []
            }
        })

    //user version of package that is used to store reviews and custom synonyms
    //the word attribute for each word is only a reference
    const package = {
        package: name,
        words: words
    }

    userdata.packages.push(package)
    response.json(package)
})

app.get('/api/user/packages/:package/reviews', (request, response) => {
    const package = request.params.package
    const review = userdata.packages.find(p => p.package === package).words
        .filter(w => {
            //if this word has not been reviewed before, it can be reviewed
            if(!w.reviews)
                return true

            //calculate the current stage of this word based on successes
            var stage = 0
            for(var i = 0; i <w.reviews.length; i++)
                stage += (!w.reviews[i].success && stage > 0) ? -1 : 1

            //get milliseconds from the time of last review
            const latestReview = w.reviews[w.reviews.length - 1]
            const milliseconds = (new Date()).getTime() - latestReview.datetime
            //calculate the wait untill this word can be reviewed again
            const duration = stage * 360000

            console.log(`word:${w.word} stage:${stage} in:${(duration - milliseconds) / (1000 * 60)}min`)

            //if the duration has passed the word can be reviewed again
            return milliseconds > duration
        })

    response.json(review)
})

app.put('/api/user/packages/:package/:word', (request, response) => {
    const package = request.params.package //package which the word is held in
    const word = request.params.word       //word that is being reviewed
    const answer = request.body.answer     //answer submitted by the user
    const synonym = request.body.synonym   //custom synonym submitte by the user

    //get the word data that is to be put information in
    const data = userdata.packages
        .find(p => p.package === package).words
        .find(w => w.word === word)

    //handle a review
    if(answer){
        const userlang = userdata.language //user language
        console.log(`REVIEW word:${word} package:${package} userlang:${userlang} answer:${answer}`)

        //get the translations and synonyms in user's language from package data
        const translation = packages
            .find(p => p.package === package).words
            .find(w => w.word === word).translations
            .find(t => t.language === userlang)

        //check if the user's answer equals the correct translation or synonyms
        const trials = [translation.translation, ...translation.synonyms, ...data.synonyms]
        const success = trials.find(trial => trial === answer)

        const review = {
            date: (new Date()).getTime(),
            success: success ? true : false
        }

        //push the new review data to user version of word data
        data.reviews.push(review)
    }

    if(synonym){
        console.log(`SYNONYM word:${word} package:${package} synonym:${synonym}`)
        data.synonyms.push(synonym)
    }

    response.json(data)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
