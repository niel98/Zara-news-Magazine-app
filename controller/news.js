const News = require("../model/News");
const escapeString = require("escape-string-regexp");
const { machineId, machineIdSync } = require('node-machine-id')
const User = require("../model/User");
const ReadList = require('../model/ReadList')
const Device = require('../model/Device')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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

    //Get the device id

    const news = await News.find(query);
    console.log("Query: ", req.query.category);
    console.log("News: ", news);
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const increaseUserNewsCount = async(req, res) => {
  try {

  //Get the Device and increase the count
  let id = machineIdSync({ original: true })
  console.log('Device Id: ', id)

  let device_id = await Device.findOne({ device_id: id })
  if (!device_id) {
    device_id = await Device.create({
      device_id: id,
      count: 1
    })

    await device_id.save()
  }

  //Increment the Device count
  device_id.count += 1

  await device_id.save()

  //Check the device count
  if (device_id.count >= 5 && !device_id.isSignedIn) {
    return res.send('Sign up and subscribe to continue reading the news articles')
  }

  const news = await News.findById(req.params.newsId)
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found'})
    }

    news.count +=1

    await news.save()

    // const readNewsId = await ReadList.findOne({ userId: req.user._id, newsId: req.params.newsId })
    // if(!readNewsId) {
    //   await ReadList.create({
    //     userId: req.user._id,
    //     newsId: req.params.newsId,
    //     count: 1
    //   })
    // } else {
    //   readNewsId.count += 1

    //   await readNewsId.save()
    // }

    // const user = await User.findById(req.user._id)

    // //increment the news count
    // user.newsCount +=1

    // await user.save()

    console.log('News count Increased')
    return res.status(200).json({ 
      success: true, 
      message: `News count increased to ${news.count}`
    })

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
