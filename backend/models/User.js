const mongoose = require("mongoose");

// Mongoose schema = the shape of a document in the "users" collection
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // stored as a bcrypt hash, never plain text
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);
