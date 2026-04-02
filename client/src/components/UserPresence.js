// components/UserPresence.js
// Sidebar showing active users — current user's name is editable

import React, { useState } from "react";
import "./UserPresence.css";

export default function UserPresence({ users, currentUserId, onRenameUser }) {
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");

  const startEdit = (user) => {
    setEditingId(user.id);
    setDraftName(user.name);
  };

  const submitEdit = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed.length >= 2) {
      onRenameUser?.(trimmed);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitEdit();
    if (e.key === "Escape") setEditingId(null);
  };

  return (
    <aside className="user-presence">
      <div className="presence-header">
        <span className="presence-count">{users.length}</span>
        <span className="presence-label">
          {users.length === 1 ? "person" : "people"} editing
        </span>
      </div>

      <ul className="user-list">
        {users.map((user) => {
          const isMe = user.id === currentUserId;
          const isEditing = editingId === user.id;

          return (
            <li key={user.id} className={`user-item ${isMe ? "is-me" : ""}`}>
              {/* Avatar */}
              <div
                className="user-avatar"
                style={{ backgroundColor: user.color }}
                title={user.name}
              >
                {(draftName || user.name).charAt(0).toUpperCase()}
              </div>

              <div className="user-info">
                {isEditing ? (
                  <input
                    className="name-input"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onBlur={submitEdit}
                    onKeyDown={handleKeyDown}
                    maxLength={20}
                    autoFocus
                  />
                ) : (
                  <div className="user-name-row">
                    <span className="user-name">{user.name}</span>
                    {isMe && (
                      <button
                        className="edit-name-btn"
                        onClick={() => startEdit(user)}
                        title="Edit your name"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                )}

                <span className="user-status">
                  <span className="online-dot" style={{ backgroundColor: user.color }} />
                  {isMe ? "you" : "Online"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="name-hint">Click ✏️ to change your name</p>
    </aside>
  );
}