const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const communityRoutes = require("./routes/communityRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const medicalWalletRoutes = require("./routes/medicalWalletRoutes");
const quickCheckRoutes = require("./routes/quickCheckRoutes");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/medical-wallet", medicalWalletRoutes);
app.use("/api/quick-check", quickCheckRoutes);

/* ================= DB CONNECT ================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/lifeguard", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected to lifeguard DB"))
  .catch((err) => console.log("❌ DB Connection Error:", err));

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("🚀 Lifeguard Backend Running Successfully");
});

/* ================= PORT ================= */
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);