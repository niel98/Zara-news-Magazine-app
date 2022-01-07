const mongoose = require('mongoose')

const TokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'user'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

const Token = mongoose.model('Token', TokenSchema)

module.exports = Token