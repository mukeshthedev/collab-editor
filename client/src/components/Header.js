import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const IconBack = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconShare = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconUsers = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default function Header({
  title, onTitleChange, userName, theme, onToggleTheme,
  savedAt, connected, activeUsers = [], onToggleSidebar, showSidebar
}) {
  const navigate = useNavigate();
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const [copied, setCopied] = useState(false);

  const submitTitle = () => {
    setEditingTitle(false);
    if (draftTitle.trim() && draftTitle !== title) onTitleChange(draftTitle.trim());
  };
  const handleTitleKey = (e) => {
    if (e.key === "Enter") submitTitle();
    if (e.key === "Escape") { setEditingTitle(false); setDraftTitle(title); }
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { window.prompt("Copy this link:", window.location.href); }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="back-btn" onClick={() => navigate("/")} title="Home">
          <IconBack />
          <span className="back-label">Home</span>
        </button>
        <div className="header-sep" />
        {/* Logo — hidden on very small screens */}
        <div className="header-logo">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill="url(#lg2)"/>
            <defs>
              <linearGradient id="lg2" x1="0" y1="0" x2="28" y2="28">
                <stop offset="0%" stopColor="#7c3aed"/>
                <stop offset="100%" stopColor="#4f46e5"/>
              </linearGradient>
            </defs>
            <path d="M7 8h14M7 12h10M7 16h12M7 20h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="logo-name">CollabDoc</span>
        </div>
        <div className="header-sep logo-sep" />

        {/* Title */}
        {editingTitle ? (
          <input
            className="title-input"
            value={draftTitle}
            onChange={e => setDraftTitle(e.target.value)}
            onBlur={submitTitle}
            onKeyDown={handleTitleKey}
            autoFocus
          />
        ) : (
          <button className="title-btn" onClick={() => { setDraftTitle(title); setEditingTitle(true); }}>
            <span className="title-text">{title || "Untitled Document"}</span>
            <span className="title-edit-hint">edit</span>
          </button>
        )}
      </div>

      {/* Center status — hidden on mobile */}
      <div className="header-center">
        <div className={`status-pill ${connected ? "connected" : "disconnected"}`}>
          <span className="status-dot" />
          <span className="status-text">
            {connected ? (savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : "Unsaved") : "Reconnecting…"}
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Users button — mobile shows count, desktop hidden (sidebar handles it) */}
        <button
          className={`users-btn ${showSidebar ? "active" : ""}`}
          onClick={onToggleSidebar}
          title="Show collaborators"
        >
          <IconUsers />
          <span className="users-count">{activeUsers.length}</span>
        </button>

        <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme">
          {theme === "light" ? <IconMoon /> : <IconSun />}
        </button>

        <button className={`share-btn ${copied ? "copied" : ""}`} onClick={handleShare}>
          {copied ? <><IconCheck /><span className="share-label">Copied!</span></> : <><IconShare /><span className="share-label">Share</span></>}
        </button>
      </div>
    </header>
  );
}