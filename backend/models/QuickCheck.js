const mongoose = require("mongoose");

const QuickCheckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  symptoms: [String],
  result: String,
  checkedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuickCheck", QuickCheckSchema);