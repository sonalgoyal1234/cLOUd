const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: String,
  date: Date,
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Reminder", reminderSchema);
