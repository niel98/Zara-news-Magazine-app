const News = require("../model/News");
const escapeString = require("escape-string-regexp");
const User = require("../model/User");
const ReadList = require('../model/ReadList')

const getNews = async (req, res) => {
  try {
    let query = {};
    if (Object.keys(req.query).length) {
      for (let value in req.query) {
        const $regex = "^" + escapeString(req.query[value]) + "$";
        const $options = "i";
        query[value] = { $regex, $options };
      }
    }

    const news = await News.find(query);
    console.log("Query: ", req.query.category);
    console.log("News: ", news);
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// const findNewsById = async (req, res) => {
//   try {
//     const id = req.params.id;

//     //Fetching the news Article
//     let newsArticle = await News.findOne({ _id: id });
//     console.log("Visitors: ", JSON.stringify(newsArticle));

//     if (!newsArticle) {
//       return res
//         .status(404)
//         .send({ success: false, message: "News with ID not found" });
//     }

//     //Increment the news count
//     newsArticle.count += 1;

//     await newsArticle.save();

//     console.log(`News read ${newsArticle.count} times`);
//     res
//       .status(200)
//       .json({ success: true, message: `News read ${newsArticle.count} times` });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

const increaseUserNewsCount = async(req, res) => {
  try {
    const news = await News.findById(req.params.newsId)
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found'})
    }

    news.count +=1

    await news.save()

    const readNewsId = await ReadList.findOne({ userId: req.user._id, newsId: req.params.newsId })
    if(!readNewsId) {
      await ReadList.create({
        userId: req.user._id,
        newsId: req.params.newsId,
        count: 1
      })
    } else {
      readNewsId.count += 1

      await readNewsId.save()
    }

    const user = await User.findById(req.user._id)

    //increment the news count
    user.newsCount +=1

    await user.save()

    console.log('News count Increased')
    return res.status(200).json({ success: true, message: `News count increased to ${user.newsCount}`})

  } catch (err) {
    console.log(err.message)
    res.status(500).send('Internal server error')
  }
}

const createNews = async (req, res) => {
  try {
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getNews, createNews, increaseUserNewsCount };
