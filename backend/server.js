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

// --- MongoDB connection, made safe for serverless ---
// In serverless, each request can hit a fresh function instance, so we cache
// the connection promise and reuse it instead of reconnecting every time.
// This middleware makes every request WAIT for a real connection before
// continuing, instead of racing ahead while mongoose is still connecting.
// It MUST come before the routes, so auth/notes routes never run queries
// against a database that isn't connected yet.
let mongoConnection = null;
function getMongoConnection() {
  if (!mongoConnection) {
    mongoConnection = mongoose.connect(process.env.MONGO_URI);
  }
  return mongoConnection;
}

app.use(async (req, res, next) => {
  try {
    await getMongoConnection();
    next();
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

// Simple health check
app.get("/", (req, res) => {
  res.json({ status: "StudySphere API issss running" });
});

// Locally: run a normal server with app.listen()
// On Vercel: there is no persistent server - Vercel imports this file and
// calls the exported "app" directly as a serverless function per request,
// so app.listen() must be skipped in that environment.
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;