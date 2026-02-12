const express = require("express");
const router = express.Router();
const QuickCheck = require("../models/QuickCheck");
const auth = require("../middleware/auth");

router.use(auth);

// CREATE
router.post("/", async (req, res) => {
  try {
    const check = new QuickCheck({
      owner: req.user._id,
      ...req.body,
    });

    const saved = await check.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER CHECKS
router.get("/", async (req, res) => {
  try {
    const checks = await QuickCheck.find({ owner: req.user._id });
    res.json(checks);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE USER CHECKS
router.delete("/", async (req, res) => {
  try {
    await QuickCheck.deleteMany({ owner: req.user._id });
    res.json({ message: "Cleared" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
