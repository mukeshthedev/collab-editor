// routes/documents.js
// REST API endpoints for documents (non-realtime operations)

const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const { v4: uuidv4 } = require("uuid");

// ─── GET /api/documents/new ────────────────────────────────────────────────
// Create a new blank document and return its ID
// The client redirects to /documents/:id after this
router.get("/new", async (req, res) => {
  try {
    const id = uuidv4(); // Generate a unique document ID
    const document = await Document.create({
      _id: id,
      title: "Untitled Document",
      content: { ops: [{ insert: "\n" }] },
    });
    res.json({ id: document._id });
  } catch (err) {
    console.error("Error creating document:", err);
    res.status(500).json({ error: "Failed to create document" });
  }
});

// ─── GET /api/documents/:id ────────────────────────────────────────────────
// Fetch a document by ID (used for initial load / SEO)
router.get("/:id", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(document);
  } catch (err) {
    console.error("Error fetching document:", err);
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

// ─── GET /api/documents/:id/versions ──────────────────────────────────────
// Fetch version history for a document
router.get("/:id/versions", async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).select("versions title");
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }
    // Return versions in reverse chronological order
    res.json({ versions: document.versions.slice().reverse() });
  } catch (err) {
    console.error("Error fetching versions:", err);
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

module.exports = router;
