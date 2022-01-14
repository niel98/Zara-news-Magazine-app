const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    newsCount: {
        type: Number,
        default: 0
    },
    subscription: {
        isSubscribed: {
            type: Boolean,
            default: false
        },
        expiresIn: {
            type: Date
        }
    }
})

const User = mongoose.model('User', UserSchema)

module.exports = User