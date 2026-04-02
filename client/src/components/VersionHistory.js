// components/VersionHistory.js
// Slide-in panel showing document version history

import React from "react";
import { formatDate } from "../utils/userUtils";
import "./VersionHistory.css";

export default function VersionHistory({ versions, onRestore, onClose }) {
  if (!versions || versions.length === 0) {
    return (
      <div className="version-panel">
        <div className="version-panel-header">
          <h3>Version History</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <p className="no-versions">No versions saved yet. Versions are created automatically as you edit.</p>
      </div>
    );
  }

  return (
    <div className="version-panel">
      <div className="version-panel-header">
        <h3>Version History</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <p className="version-hint">Click "Restore" to revert to that version.</p>

      <ul className="version-list">
        {versions.map((version, index) => (
          <li key={index} className="version-item">
            <div className="version-meta">
              <span className="version-date">
                {formatDate(version.savedAt)}
              </span>
              <span className="version-author">by {version.savedBy}</span>
            </div>
            <button
              className="restore-btn"
              onClick={() => onRestore(version.content)}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
