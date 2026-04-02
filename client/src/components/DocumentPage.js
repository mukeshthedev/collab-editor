// components/DocumentPage.js
// Main document page — wires editor, users, header together

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { useTheme } from "../hooks/useTheme";
import { getOrCreateUsername } from "../utils/userUtils";
import Header from "./Header";
import TextEditor from "./TextEditor";
import UserPresence from "./UserPresence";
import VersionHistory from "./VersionHistory";
import "./DocumentPage.css";

export default function DocumentPage() {
  const { id: documentId } = useParams();
  const { socket, connected } = useSocket();
  const { theme, toggleTheme } = useTheme();

  const [userName, setUserName] = useState(() => getOrCreateUsername());
  const [currentUserId, setCurrentUserId] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [title, setTitle] = useState("Untitled Document");
  const [savedAt, setSavedAt] = useState(null);
  const [versions, setVersions] = useState([]);
  const [showVersions, setShowVersions] = useState(false);

  // Join document room
  useEffect(() => {
    if (!socket || !documentId) return;
    socket.emit("join-document", { documentId, userName });
    setCurrentUserId(socket.id);
  }, [socket, documentId, userName]);

  // Listen for user list updates
  useEffect(() => {
    if (!socket) return;
    socket.on("users-changed", setActiveUsers);
    return () => socket.off("users-changed", setActiveUsers);
  }, [socket]);

  // Listen for title updates from others
  useEffect(() => {
    if (!socket) return;
    socket.on("title-updated", (newTitle) => {
      setTitle(newTitle);
      document.title = `${newTitle} — CollabDoc`;
    });
    return () => socket.off("title-updated");
  }, [socket]);

  // Handle local title change
  const handleTitleChange = useCallback((newTitle) => {
    setTitle(newTitle);
    document.title = `${newTitle} — CollabDoc`;
    socket?.emit("title-change", { documentId, title: newTitle });
  }, [socket, documentId]);

  // ── Handle username rename ────────────────────────────────────────────
  const handleRenameUser = useCallback((newName) => {
    setUserName(newName);
    sessionStorage.setItem("collab-editor-username", newName);

    // Rejoin the document room with the new name so server updates the user list
    if (socket && documentId) {
      socket.emit("join-document", { documentId, userName: newName });
      setCurrentUserId(socket.id);
    }
  }, [socket, documentId]);

  // Handle version restore
  const handleRestoreVersion = useCallback((content) => {
    if (!socket) return;
    socket.emit("save-document", { documentId, content, title });
    window.location.reload();
  }, [socket, documentId, title]);

  return (
    <div className="document-page" data-theme={theme}>
      <Header
        title={title}
        onTitleChange={handleTitleChange}
        userName={userName}
        theme={theme}
        onToggleTheme={toggleTheme}
        savedAt={savedAt}
        connected={connected}
      />

      <div className="editor-layout">
        <main className="editor-main">
          <div className="editor-actions">
            <button
              className={`action-btn ${showVersions ? "active" : ""}`}
              onClick={() => setShowVersions((v) => !v)}
              title="View version history"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
                <line x1="12" y1="7" x2="12" y2="12" />
                <line x1="12" y1="12" x2="16" y2="14" />
              </svg>
              History
            </button>
          </div>

          <TextEditor
            socket={socket}
            documentId={documentId}
            userName={userName}
            onSaveStatusChange={setSavedAt}
            onVersionsUpdate={setVersions}
          />
        </main>

        {/* Sidebar with editable username */}
        <UserPresence
          users={activeUsers}
          currentUserId={currentUserId}
          onRenameUser={handleRenameUser}
        />
      </div>

      {showVersions && (
        <VersionHistory
          versions={versions}
          onRestore={handleRestoreVersion}
          onClose={() => setShowVersions(false)}
        />
      )}
    </div>
  );
}