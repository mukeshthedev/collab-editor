// components/Header.js
// Top navigation bar: document title, user info, theme toggle, share button

import React, { useState } from "react";
import "./Header.css";

export default function Header({
  title,
  onTitleChange,
  userName,
  theme,
  onToggleTheme,
  savedAt,
  connected,
}) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [copied, setCopied] = useState(false);

  // When user clicks the title, enable inline editing
  const handleTitleClick = () => {
    setDraftTitle(title);
    setEditing(true);
  };

  // Save title on blur or Enter key
  const handleTitleSubmit = () => {
    setEditing(false);
    if (draftTitle.trim() && draftTitle !== title) {
      onTitleChange(draftTitle.trim());
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") handleTitleSubmit();
    if (e.key === "Escape") setEditing(false);
  };

  // Copy document URL to clipboard
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      window.prompt("Copy this link:", window.location.href);
    }
  };

  return (
    <header className="header">
      {/* Left: Logo + Title */}
      <div className="header-left">
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="var(--accent)" />
            <path
              d="M7 8h14M7 12h10M7 16h12M7 20h8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="logo-text">CollabDoc</span>
        </div>

        <div className="divider" />

        {editing ? (
          <input
            className="title-input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleTitleKeyDown}
            autoFocus
          />
        ) : (
          <h1 className="doc-title" onClick={handleTitleClick} title="Click to rename">
            {title || "Untitled Document"}
          </h1>
        )}
      </div>

      {/* Center: Save status */}
      <div className="header-center">
        <span className={`save-status ${connected ? "connected" : "disconnected"}`}>
          <span className="status-dot" />
          {!connected
            ? "Reconnecting..."
            : savedAt
            ? `Saved at ${savedAt.toLocaleTimeString()}`
            : "Unsaved changes"}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="header-right">
        <span className="username-badge">{userName}</span>

        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            // Moon icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            // Sun icon
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        <button className="share-btn" onClick={handleShare}>
          {copied ? (
            <>✓ Copied!</>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </>
          )}
        </button>
      </div>
    </header>
  );
}
