const News = require('../model/News')
const escapeString = require('escape-string-regexp')

const getNews = async (req, res) => {
    try {
        let query = {}
        if (Object.keys(req.query).length) {
            for (let value in req.query) {
                const $regex = '^'+ escapeString(req.query[value])+'$'
                const $options = 'i'
                query[value] = {$regex, $options}
            }
        }
        
        const news = await News.find(query)
        console.log('Query: ', req.query.category)
        console.log('News: ', news)
        res.status(200).json({ success: true, data: news })
    } catch (error) {   
        console.log(error.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const findNewsById = async (req, res) => {
    try {
        const id = req.params.id

        //Fetching the news Article
        let newsArticle = await News.findOne({ newsId: id})
        console.log('Visitors: ', JSON.stringify(newsArticle))

          //Increment the news count
            newsArticle.count += 1

            newsArticle.save()

            console.log(`News read ${newsArticle.count} times`)
            res.status(200).json({ success: true, message: `News read ${newsArticle.count} times`})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const createNews = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(err.message)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports = { getNews, createNews, findNewsById }