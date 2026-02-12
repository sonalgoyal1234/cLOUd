const express = require("express");
const router = express.Router();
const MedicalWallet = require("../models/MedicalWallet");
const auth = require("../middleware/auth");

router.use(auth);

// CREATE
router.post("/", async (req, res) => {
  try {
    const doc = new MedicalWallet({
      owner: req.user._id,
      ...req.body,
    });

    const saved = await doc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER WALLET
router.get("/", async (req, res) => {
  try {
    const docs = await MedicalWallet.find({ owner: req.user._id });
    res.json(docs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE USER WALLET
router.delete("/:id", async (req, res) => {
  try {
    await MedicalWallet.deleteOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
