const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  theme: {
    type: String,
    default: "light",
  },
 notifications: {
  medicine: Boolean,
  tips: Boolean,
  checkup: Boolean,
},
  language: {
    type: String,
    default: "English",
  },
  privacyMode: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model(
  "UserSettings",
  userSettingsSchema
);