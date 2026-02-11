const express = require("express");
const router = express.Router();
const MedicalWallet = require("../models/MedicalWallet");


// ➤ CREATE
router.post("/", async (req, res) => {
  try {
    const doc = new MedicalWallet(req.body);
    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ➤ GET ALL
router.get("/", async (req, res) => {
  try {
    const docs = await MedicalWallet.find();
    res.json(docs);
  } catch (err) {
    res.status(500).json(err);
  }
});


// ➤ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await MedicalWallet.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;