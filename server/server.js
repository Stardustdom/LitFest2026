require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const addToSheet = require("./sheets");

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// Serve frontend files from project root
app.use(express.static(path.join(__dirname, "..")));

// Root route → index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// =======================
// MONGODB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1); // Stop app if DB fails in production
  });

// =======================
// COUNTER SCHEMA
// =======================
const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

// =======================
// REGISTRATION SCHEMA
// =======================
const RegistrationSchema = new mongoose.Schema({
  agent: String,
  eventName: String,
  name: String,
  email: String,
  phone: String,
  institutionId: String,
  college: String,
  createdAt: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", RegistrationSchema);

// =======================
// REGISTER ROUTE
// =======================
app.post("/register", async (req, res) => {
  try {
    const data = new Registration(req.body);
    const savedDoc = await data.save();

    // Push to Google Sheets
    await addToSheet(savedDoc);

    res.status(201).json({ message: "Saved to DB & Sheet" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Failed to save" });
  }
});

// =======================
// CHECK INSTITUTION ROUTE
// =======================
app.get("/check-institution", async (req, res) => {
  try {
    const { college } = req.query;

    if (!college) return res.json({ exists: false });

    const existing = await Registration.findOne({
      college: { $regex: new RegExp(`^${college}$`, "i") },
    });

    if (existing) {
      return res.json({
        exists: true,
        institutionId: existing.institutionId,
      });
    }

    // Updated syntax (fixes mongoose warning)
    const counter = await Counter.findOneAndUpdate(
      { name: "institution" },
      { $inc: { seq: 1 } },
      { returnDocument: "after", upsert: true }
    );

    const institutionId = `INST-${String(counter.seq).padStart(4, "0")}`;

    res.json({ exists: false, institutionId });
  } catch (err) {
    console.error("❌ Institution check error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
