const express = require("express");
const router = express.Router();
const UserSettings = require("../models/UserSettings");

router.post("/save", async (req, res) => {
  const { userId, ...data } = req.body;

  try {
    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      { $set: data },
      { upsert: true, new: true }
    );

    res.json(settings);
  } catch (err) {
    console.error("SETTINGS ERROR:", err);
    res.status(500).json({ message: "Save failed" });
  }
});

module.exports = router;
