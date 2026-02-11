const express = require("express");
const router = express.Router();
const UserSettings = require("../models/UserSettings");

/* ===== SAVE / UPDATE SETTINGS ===== */
router.post("/save", async (req, res) => {
  try {
    const { userId, theme, notifications, language, privacyMode } =
      req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { userId },
      {
        theme,
        notifications,
        language,
        privacyMode,
      },
      { new: true, upsert: true }
    );

    res.json({
      message: "Settings saved",
      settings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ===== GET SETTINGS ===== */
router.get("/:userId", async (req, res) => {
  try {
    const settings = await UserSettings.findOne({
      userId: req.params.userId,
    });

    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;