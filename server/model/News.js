const mongoose = require('mongoose')

const Schema = mongoose.Schema

const NewsSchema = new Schema({
    avatar: {
        type: String
    },
    cloudinary_id: {
        type: String
    },
    title: {
        type: String
    },
    content: {
        type: String
    },
    category: {
        type: String
    },
    Date: {
        type: Date,
        default: Date.now()
    }
})

const News = mongoose.model('News', NewsSchema)

module.exports = News