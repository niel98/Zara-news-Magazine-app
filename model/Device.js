const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
    device_id: {
        type: String,
        unique: true,
    },
    count: {
        type: Number,
        default: 0
    },
    isSignedIn: {
        type: Boolean,
        default: false
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

const Device = mongoose.model('Device', DeviceSchema)

module.exports = Device