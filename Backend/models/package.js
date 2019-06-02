const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const packageSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3,
        required: true
    },
    language: {
        type: String,
        required: true,
        uppercase: true,
        maxlength: 2,
        minlength: 2,
    },
    words: [{
        word: String,
        details: String,
        translations: [{
            language: String,
            translation: String,
            synonyms: [ String ]
        }]
    }]
})

packageSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Package', packageSchema)
