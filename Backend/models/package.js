const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const packageSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3,
        required: true
    },
    details: String,
    language: {
        type: String,
        required: true,
        uppercase: true,
        maxlength: 2,
        minlength: 2,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    words: [{
        spelling: String,
        details: String,
        translation: String,
        synonyms: [ String ]
    }],
    opinions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        value: Number
    }]
})

packageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v

        if(returnedObject.words) {
            returnedObject.words = returnedObject.words.map(w => {
                w.id = w._id.toString()
                delete w._id
                return w
            })
        }
    }
})

packageSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Package', packageSchema)
