const mongoose = require("mongoose");

const quickCheckSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  mood: String,
  notes: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuickCheck", quickCheckSchema);
