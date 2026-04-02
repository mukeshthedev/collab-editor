// models/Document.js
// Defines the MongoDB schema for our collaborative documents

const mongoose = require("mongoose");

// Schema for a single version snapshot (for version history)
const VersionSchema = new mongoose.Schema({
  content: { type: Object, required: true }, // Quill Delta object
  savedAt: { type: Date, default: Date.now },
  savedBy: { type: String, default: "anonymous" }, // username who triggered save
});

// Main document schema
const DocumentSchema = new mongoose.Schema(
  {
    // Unique human-readable ID used in the URL (e.g. /documents/abc123)
    _id: { type: String, required: true },

    // Document title (editable by users)
    title: { type: String, default: "Untitled Document" },

    // The actual document content stored as a Quill Delta
    // Delta is a JSON format that represents the document state
    content: { type: Object, default: { ops: [{ insert: "\n" }] } },

    // Version history — stores up to 50 recent versions
    versions: {
      type: [VersionSchema],
      default: [],
    },

    // Timestamps for created/updated
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
