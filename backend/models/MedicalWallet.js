const mongoose = require("mongoose");

const MedicalWalletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  documentName: String,
  documentType: String,
  fileUrl: String,

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MedicalWallet", MedicalWalletSchema);