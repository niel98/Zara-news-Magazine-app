const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
    device_id: {
        type: String,
        unique: true,
    },
    count: {
        type: Number,
        default: 0
    }
})

const Device = mongoose.model('Device', DeviceSchema)

module.exports = Device