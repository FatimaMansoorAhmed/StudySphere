const mongoose = require("mongoose");

const CATEGORIES = ["Programming", "AI", "Mathematics", "Physics", "Others"];

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: CATEGORIES, // Mongoose will reject any value not in this list
      default: "Others",
    },
    // Reference to the User who created this note.
    // "ref" tells Mongoose this ObjectId points to a document in the "User" collection,
    // which lets us use .populate("owner") later to fetch the full user if needed.
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
module.exports.CATEGORIES = CATEGORIES;
