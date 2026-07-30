import { useEffect, useState } from "react";
import api from "../api";

const CATEGORIES = ["Programming", "AI", " ML", "DSA", "OOP", "JAVA", "WEBDEV", "Python", "Others"];

const CATEGORY_COLORS = {
  Programming: "bg-blue-100 text-blue-700 border-blue-200",
  AI: "bg-purple-100 text-purple-700 border-purple-200",
  ML: "bg-emerald-100 text-emerald-700 border-emerald-200",
  DSA: "bg-amber-100 text-amber-700 border-amber-200",
  OOP: "bg-amber-100 text-amber-700 border-amber-200",
  JAVA: "bg-amber-100 text-amber-700 border-amber-200",
  WEBDEV: "bg-amber-100 text-amber-700 border-amber-200",
  Python: "bg-amber-100 text-amber-700 border-amber-200",
  Others: "bg-gray-100 text-gray-700 border-gray-200",
};

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "", category: "Others" });
  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  async function fetchNotes() {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    }
  }

  // 🔒 CRITICAL FIX: Direct fetch ki jagah Login status checking
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotes();
    } else {
      setNotes([]); // Logged out mode mein list bilkul empty rahegi
    }
  }, [isLoggedIn]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, form);
        setEditingId(null);
      } else {
        await api.post("/notes", form);
      }

      setForm({ title: "", content: "", category: "Others" });
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete note");
    }
  }

  function handleEdit(note) {
    setEditingId(note._id);
    setForm({ title: note.title, content: note.content, category: note.category });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm({ title: "", content: "", category: "Others" });
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10 relative">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage, update and organize your notes</p>
        </div>
        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-100">
          Total Notes: {notes.length}
        </span>
      </div>

      {/* Note Creation / Edit Form Card */}
      {isLoggedIn ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? "✏️ Edit Note" : "➕ Create New Note"}
            </h2>
            {editingId && (
              <button
                onClick={handleCancelEdit}
                className="text-xs text-red-600 hover:underline font-medium"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Note Title"
                value={form.title}
                onChange={handleChange}
                required
                className="md:col-span-2 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white transition cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              name="content"
              rows={3}
              placeholder="Write your study notes here..."
              value={form.content}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
            />

            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2.5 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl shadow-sm transition disabled:opacity-50 text-sm"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Note"
                  : "+ Add Note"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-center text-sm">
          💡 Please <strong>Log in</strong> to view, add, edit or delete your notes.
        </div>
      )}

      {/* Notes Grid Display (Sirf Tab Dikhega Jab Logged In Honge Aur Notes Exists Karenge) */}
      {isLoggedIn && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your Notes</h2>

          {notes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-400 text-base">No notes found yet. Create one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between h-[280px]"
                >
                  <div>
                    {/* Category Pill & Action Buttons */}
                    <div className="flex justify-between items-center mb-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                          CATEGORY_COLORS[note.category] || CATEGORY_COLORS.Others
                        }`}
                      >
                        {note.category}
                      </span>

                      {/* Action Icons Capsule */}
                      <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-lg border border-gray-100">
                        <button
                          onClick={() => handleEdit(note)}
                          className="text-gray-500 hover:text-indigo-600 hover:bg-white p-1.5 rounded-md transition text-xs"
                          title="Edit Note"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="text-gray-500 hover:text-red-600 hover:bg-white p-1.5 rounded-md transition text-xs"
                          title="Delete Note"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                      {note.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 overflow-hidden text-ellipsis mb-2">
                      {note.content}
                    </p>
                  </div>

                  {/* Footer with Author & View More */}
                  <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                    <span className="text-gray-400">
                      Author: <strong className="text-gray-600">{note.owner?.name || "Unknown"}</strong>
                    </span>

                    {/* Read More Trigger Button */}
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold transition"
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal logic */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      CATEGORY_COLORS[selectedNote.category] || CATEGORY_COLORS.Others
                    }`}
                  >
                    {selectedNote.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2">{selectedNote.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-400 hover:text-gray-700 text-xl font-bold px-2"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 overflow-y-auto max-h-[50vh] pr-2">
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
              <span>Author: <strong className="text-gray-600">{selectedNote.owner?.name || "Unknown"}</strong></span>
              <button
                onClick={() => setSelectedNote(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-xl transition"
              >
                Close Note
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}