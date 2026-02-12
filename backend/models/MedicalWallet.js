const mongoose = require("mongoose");

const medicalWalletSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  bloodGroup: String,
  allergies: String,
  medications: String,
  emergencyContact: String,
  notes: String,

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MedicalWallet", medicalWalletSchema);
