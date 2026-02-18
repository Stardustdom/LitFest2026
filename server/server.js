const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const addToSheet = require("./sheets");

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 CONNECT TO MONGODB ATLAS
mongoose.connect(process.env.MONGO_URI);

  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model("Counter", CounterSchema);

// 🔹 SCHEMA
// 🔹 SCHEMA (UPDATED – matches join.html form)
const RegistrationSchema = new mongoose.Schema({
  agent: String,
  eventName: String,
  name: String,
  email: String,
  phone: String,
  institutionId: String,
  college: String,
  createdAt: { type: Date, default: Date.now }
});

const Registration = mongoose.model("Registration", RegistrationSchema);

// 🔹 API ROUTE
app.post("/register", async (req, res) => {
  try {
    const data = new Registration(req.body);
    const savedDoc = await data.save();

    // 🔥 PUSH FULL DOCUMENT TO GOOGLE SHEET
    await addToSheet(savedDoc);

    res.status(201).json({ message: "Saved to DB & Sheet" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save" });
  }
});

// 🔹 CHECK IF INSTITUTION EXISTS (case-insensitive)
app.get("/check-institution", async (req, res) => {
  const { college } = req.query;

  if (!college) return res.json({ exists: false });

  // Case-insensitive search
  const existing = await Registration.findOne({
    college: { $regex: new RegExp('^${college}$', "i") }
  });

  // ✅ If institution already exists
  if (existing) {
    return res.json({
      exists: true,
      institutionId: existing.institutionId
    });
  }

  // 🆕 Generate next sequential ID
  const counter = await Counter.findOneAndUpdate(
    { name: "institution" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

const institutionId = `INST-${String(counter.seq).padStart(4, "0")}`;

  return res.json({ exists: false, institutionId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

