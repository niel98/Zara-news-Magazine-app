const express = require('express')

const { createNews, getNews } = require('../controller/news')

const router = express.Router()

//All routes begin from /news
router.get('/getNews', getNews)

router.post('/post', createNews)

module.exports = router