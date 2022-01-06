const express = require('express')
const cors = require('cors')
const conn = require('./model/db')

const newsRoute = require('./routes/news')
const authRoute = require('./routes/auth')

require('dotenv').config()
require('colors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

conn()

const PORT = process.env.PORT || 5000

app.use('/news', newsRoute)
app.use('/auth', authRoute)

app.get('/', (_, res) => {
    res.send('Hello World from Zarah Magazine!')
})

app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`.blue)
})
