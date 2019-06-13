const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minlength: 3,
        required: true
    },
    passwordHash: String,
    language: {
        type: String,
        required: true,
        uppercase: true,
        maxlength: 2,
        minlength: 2
    },
    packages: [{
        source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Package',
        },
        words: [{
            word: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Package',
            },
            synonyms: [String],
            stage: Number,
            reviews: [{
                date: Date,
                success: Boolean
            }]
        }]
    }]
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)
