// sockets/documentSocket.js
// Handles all Socket.io events for collaborative editing

const Document = require("../models/Document");

// In-memory store of active users per document
// Format: { documentId: { socketId: { id, name, color, cursor } } }
const activeUsers = {};

// Color palette for user cursors — each user gets a unique color
const USER_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9", "#82E0AA", "#F0B27A",
];

// Assign a color based on how many users are already in the room
function assignColor(documentId) {
  const users = activeUsers[documentId] || {};
  const usedColors = Object.values(users).map((u) => u.color);
  // Find first unused color, or cycle back
  return (
    USER_COLORS.find((c) => !usedColors.includes(c)) ||
    USER_COLORS[Object.keys(users).length % USER_COLORS.length]
  );
}

// Find or create a document in MongoDB
async function findOrCreateDocument(documentId) {
  if (!documentId) return null;

  // Try to find existing document
  const existing = await Document.findById(documentId);
  if (existing) return existing;

  // Create new blank document
  return await Document.create({
    _id: documentId,
    title: "Untitled Document",
    content: { ops: [{ insert: "\n" }] },
    versions: [],
  });
}

// Main socket handler — called once per connected client
function setupDocumentSocket(io) {
  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // ─── Event: join-document ───────────────────────────────────────────────
    // Fired when a user opens a document URL
    socket.on("join-document", async ({ documentId, userName }) => {
      try {
        // Join the Socket.io room for this document
        socket.join(documentId);
        socket.documentId = documentId;
        socket.userName = userName || "Anonymous";

        // Load or create the document
        const document = await findOrCreateDocument(documentId);

        // Register this user in the active users map
        if (!activeUsers[documentId]) activeUsers[documentId] = {};
        activeUsers[documentId][socket.id] = {
          id: socket.id,
          name: socket.userName,
          color: assignColor(documentId),
          cursor: null, // Will be updated as user types
        };

        // Send the current document state back to the joining user
        socket.emit("load-document", {
          content: document.content,
          title: document.title,
          versions: document.versions.slice(-10), // Last 10 versions
        });

        // Broadcast updated user list to everyone in the room
        io.to(documentId).emit(
          "users-changed",
          Object.values(activeUsers[documentId])
        );

        console.log(
          `📄 ${socket.userName} joined document: ${documentId} (${
            Object.keys(activeUsers[documentId]).length
          } users)`
        );
      } catch (err) {
        console.error("Error joining document:", err);
        socket.emit("error", { message: "Failed to load document" });
      }
    });

    // ─── Event: send-changes ───────────────────────────────────────────────
    // Fired when a user makes an edit — delta is a Quill Delta object
    socket.on("send-changes", ({ documentId, delta }) => {
      // Broadcast the change to all OTHER users in the room
      // We use `socket.to()` (not `io.to()`) so the sender doesn't get it back
      socket.to(documentId).emit("receive-changes", delta);
    });

    // ─── Event: title-change ───────────────────────────────────────────────
    socket.on("title-change", ({ documentId, title }) => {
      socket.to(documentId).emit("title-updated", title);
    });

    // ─── Event: cursor-move ────────────────────────────────────────────────
    // Fired when a user's cursor/selection changes
    socket.on("cursor-move", ({ documentId, range }) => {
      if (!activeUsers[documentId]?.[socket.id]) return;

      // Update stored cursor position
      activeUsers[documentId][socket.id].cursor = range;

      // Broadcast cursor position to other users
      socket.to(documentId).emit("cursor-updated", {
        userId: socket.id,
        userName: socket.userName,
        color: activeUsers[documentId][socket.id].color,
        range,
      });
    });

    // ─── Event: save-document ──────────────────────────────────────────────
    // Auto-save: called every few seconds from the client
    socket.on("save-document", async ({ documentId, content, title }) => {
      try {
        const document = await Document.findById(documentId);
        if (!document) return;

        // Push current state as a new version before saving
        // Keep only the last 50 versions to avoid unbounded growth
        const newVersion = {
          content: document.content,
          savedAt: new Date(),
          savedBy: socket.userName,
        };

        const versions = [...document.versions, newVersion].slice(-50);

        // Update the document
        await Document.findByIdAndUpdate(documentId, {
          content,
          title: title || document.title,
          versions,
        });

        // Confirm save to the requesting user
        socket.emit("document-saved", { savedAt: new Date() });
      } catch (err) {
        console.error("Error saving document:", err);
      }
    });

    // ─── Event: disconnect ─────────────────────────────────────────────────
    socket.on("disconnect", () => {
      const { documentId, userName } = socket;
      if (documentId && activeUsers[documentId]) {
        // Remove user from active users
        delete activeUsers[documentId][socket.id];

        // Clean up empty rooms
        if (Object.keys(activeUsers[documentId]).length === 0) {
          delete activeUsers[documentId];
        } else {
          // Notify remaining users
          io.to(documentId).emit(
            "users-changed",
            Object.values(activeUsers[documentId])
          );
        }

        // Notify others that this user's cursor should be removed
        socket.to(documentId).emit("cursor-removed", { userId: socket.id });

        console.log(`👋 ${userName} left document: ${documentId}`);
      }
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupDocumentSocket };
