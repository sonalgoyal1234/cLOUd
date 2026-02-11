const mongoose = require("mongoose");

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  name: String,
  gender: String,
  avatar: String,

  theme: String,      // maps dark/light
  accent: String,

  notifications: {
    medicine: Boolean,
    tips: Boolean,
    checkup: Boolean,
  },

  language: String,
  aiConsent: Boolean,
  privacyMode: Boolean,
});

module.exports = mongoose.model("UserSettings", userSettingsSchema);
