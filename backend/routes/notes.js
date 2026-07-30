const express = require("express");
const Note = require("../models/Note");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// GET /api/notes - view all notes (public, so anyone can browse)
router.get("/", async (req, res) => {
  try {
    // populate("owner", "name") replaces the owner ObjectId with { _id, name }
    const notes = await Note.find().populate("owner", "name").sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/notes - create a note (protected: must be logged in)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      title,
      content,
      category,
      owner: req.user.id, // comes from the JWT via requireAuth middleware
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 1. DELETE NOTE ROUTE
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Check karein ke delete karne wala user note ka owner hai ya nahi
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this note" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 2. UPDATE (EDIT) NOTE ROUTE
router.put("/:id", requireAuth, async (req, res) => {
  const { title, content, category } = req.body;

  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Security Check: Owner verification
    if (note.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this note" });
    }

    // Note fields update karein
    note.title = title || note.title;
    note.content = content || note.content;
    note.category = category || note.category;

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
