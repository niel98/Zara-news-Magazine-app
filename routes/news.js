const express = require("express");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const News = require("../model/News");

const { getNews, findNewsById } = require("../controller/news");

const router = express.Router();

//All routes begin from /news
router.get("/getNews", getNews);
router.post("/newsCount/:id", findNewsById);

//creating a new News article
router.post("/post", upload.single("image"), async (req, res) => {
  try {
    //Upload the image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log("result details: ", result);
    //Create new news article
    let news = new News({
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
    });

    await news.save();
    console.log("New news article created");
    res
      .status(201)
      .json({ success: true, message: "New news article created" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
