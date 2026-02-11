const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");


// ➤ CREATE Reminder
router.post("/", async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ➤ GET All Reminders
router.get("/", async (req, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ➤ UPDATE Reminder
router.put("/:id", async (req, res) => {
  try {
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ➤ DELETE Reminder
router.delete("/:id", async (req, res) => {
  try {
    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;