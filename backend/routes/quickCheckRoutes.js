const express = require("express");
const router = express.Router();
const QuickCheck = require("../models/QuickCheck");


// ➤ CREATE CHECK
router.post("/", async (req, res) => {
  try {
    const check = new QuickCheck(req.body);
    const saved = await check.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ➤ GET ALL CHECKS
router.get("/", async (req, res) => {
  try {
    const checks = await QuickCheck.find();
    res.json(checks);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ➤ DELETE CHECK
// ➤ DELETE ALL CHECKS
router.delete("/", async (req, res) => {
  try {
    await QuickCheck.deleteMany({});
    res.json({ message: "All quick checks cleared" });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;