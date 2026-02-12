const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");
const auth = require("../middleware/auth");

router.use(auth);

// CREATE
router.post("/", async (req, res) => {
  try {
    const reminder = new Reminder({
      owner: req.user._id,
      ...req.body,
    });

    const saved = await reminder.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET USER REMINDERS
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find({ owner: req.user._id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Reminder.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.deleteOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
