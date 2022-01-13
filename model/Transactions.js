const mongoose = require('mongoose')
const User = require('../model/User')

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    trans_ref: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        default: 'initiated'
    }
})

const Transactions = mongoose.model('Transactions', TransactionSchema)

module.exports = Transactions