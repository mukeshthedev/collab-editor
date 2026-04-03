// index.js
// Main entry point for the collaborative editor backend server
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const documentRoutes = require("./routes/documents");
const { setupDocumentSocket } = require("./sockets/documentSocket");

// ─── App Setup ─────────────────────────────────────────────────────────────
const app = express();
const httpServer = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ─── Socket.io Setup ───────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,        // ← added
  },
  allowEIO3: true,            // ← added for compatibility
});

// Register all socket event handlers
setupDocumentSocket(io);

// ─── REST API Routes ───────────────────────────────────────────────────────
app.use("/api/documents", documentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// ─── MongoDB Connection ────────────────────────────────────────────────────
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/collab-editor";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 Client URL: ${CLIENT_URL}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  httpServer.close(() => {
    mongoose.connection.close();
    process.exit(0);
  });
});