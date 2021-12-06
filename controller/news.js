const News = require('../model/News')

const getNews = async (_, res) => {
    try {
        const news = await News.find()
        console.log('News: ', news)
        res.status(200).json({ success: true, data: news })
    } catch (error) {   
        console.log(error.message)
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

module.exports = { getNews, createNews }