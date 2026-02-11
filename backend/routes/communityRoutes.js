const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/CommunityPost");

/* ===== CREATE POST ===== */
router.post("/add", async (req, res) => {
  try {
    const { userId, username, postText } = req.body;

    const newPost = new CommunityPost({
      userId,
      username,
      postText,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post added successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===== GET ALL POSTS ===== */
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({
      createdAt: -1,
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;