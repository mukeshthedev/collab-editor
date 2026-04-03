import React, { useState } from "react";
import "./UserPresence.css";

const IconEdit = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function UserPresence({ users, currentUserId, onRenameUser }) {
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState("");

  const startEdit = (user) => { setEditingId(user.id); setDraftName(user.name); };
  const submitEdit = () => {
    const trimmed = draftName.trim();
    if (trimmed && trimmed.length >= 2) onRenameUser?.(trimmed);
    setEditingId(null);
  };
  const handleKey = (e) => {
    if (e.key === "Enter") submitEdit();
    if (e.key === "Escape") setEditingId(null);
  };

  return (
    <aside className="presence-sidebar">
      <div className="presence-header">
        <div className="presence-title">
          <span className="presence-title-text">Collaborators</span>
          <span className="presence-badge">{users.length}</span>
        </div>
      </div>

      <ul className="user-list">
        {users.map((user) => {
          const isMe = user.id === currentUserId;
          const isEditing = editingId === user.id;

          return (
            <li key={user.id} className={`user-item ${isMe ? "is-me" : ""}`}>
              <div className="user-avatar" style={{ background: user.color }}>
                {(isEditing ? draftName : user.name).charAt(0).toUpperCase()}
                <span className="avatar-ring" style={{ borderColor: user.color }} />
              </div>

              <div className="user-details">
                {isEditing ? (
                  <div className="name-edit-row">
                    <input
                      className="name-input"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onBlur={submitEdit}
                      onKeyDown={handleKey}
                      maxLength={20}
                      autoFocus
                    />
                    <button className="name-confirm-btn" onClick={submitEdit}>
                      <IconCheck />
                    </button>
                  </div>
                ) : (
                  <div className="user-name-row">
                    <span className="user-name">{user.name}</span>
                    {isMe && (
                      <button className="edit-btn" onClick={() => startEdit(user)} title="Edit name">
                        <IconEdit />
                      </button>
                    )}
                  </div>
                )}
                <div className="user-meta">
                  <span className="online-indicator" style={{ background: user.color }} />
                  <span className="user-role">{isMe ? "You" : "Editing"}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {users.some(u => u.id === currentUserId) && (
        <div className="rename-hint">
          <IconEdit />
          <span>Click the pencil icon to rename yourself</span>
        </div>
      )}
    </aside>
  );
}