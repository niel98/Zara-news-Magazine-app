const mongoose = require('mongoose')
// const User = require('../model/User')

const TransactionSchema = new mongoose.Schema({
    device_id: {
        type: String,
        required: true,
        unique: true
        // ref: 'Device'
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