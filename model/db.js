const mongoose = require('mongoose')
require('dotenv').config()
require('colors')

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONN_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }) 
        console.log('MongoDb Connected'.bgCyan)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = conn