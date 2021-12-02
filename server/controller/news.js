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
        const news = {
            avatar: req.file.avatar,
            title: req.body.title,
            content: req.body.content,
            category: req.body.category 
        }
    
        await News.create(news)
        console.log('New news article created')
        res.status(201).json({ success: true, message: 'New news article created'})
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

module.exports = { getNews, createNews }