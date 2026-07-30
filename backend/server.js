require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // lets us read req.body as JSON

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.json({ status: "StudySphere API running" });
});

// Connect to MongoDB once (Vercel reuses this connection across function calls
// when the serverless instance stays warm)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));


if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;