const mongoose = require('mongoose')

const ReadListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    newsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'News'
    },
    count: {
        type: Number,
        default: 0
    }
})

const ReadList = mongoose.model('ReadList', ReadListSchema)

module.exports = ReadList