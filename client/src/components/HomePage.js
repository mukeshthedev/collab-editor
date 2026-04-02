// components/HomePage.js
// Landing page shown at "/" — lets users create or open a document

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState("");
  const [error, setError] = useState("");

  const SERVER_URL =
    process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

  // Create a new document via the REST API, then navigate to it
  const handleNewDocument = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SERVER_URL}/api/documents/new`);
      const data = await res.json();
      navigate(`/documents/${data.id}`);
    } catch (err) {
      setError("Could not connect to server. Is the backend running?");
      setLoading(false);
    }
  };

  // Open an existing document by ID
  const handleOpenDocument = (e) => {
    e.preventDefault();
    const trimmed = docId.trim();
    if (!trimmed) return;
    // Support full URLs or just IDs
    const id = trimmed.includes("/") ? trimmed.split("/").pop() : trimmed;
    navigate(`/documents/${id}`);
  };

  return (
    <div className="home-page" data-theme={theme}>
      {/* Theme toggle in corner */}
      <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
        {theme === "light" ? "🌙" : "☀️"}
      </button>

      <div className="home-content">
        {/* Hero */}
        <div className="hero">
          <div className="hero-icon">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect width="56" height="56" rx="14" fill="var(--accent)" />
              <path
                d="M14 16h28M14 24h20M14 32h24M14 40h16"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="hero-title">CollabDoc</h1>
          <p className="hero-subtitle">
            Real-time collaborative editing. Multiple people, one document, zero lag.
          </p>
        </div>

        {/* Actions */}
        <div className="actions-card">
          {/* New document */}
          <button
            className="primary-btn"
            onClick={handleNewDocument}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            {loading ? "Creating..." : "New Document"}
          </button>

          <div className="divider-text">
            <span>or open existing</span>
          </div>

          {/* Open by ID */}
          <form className="open-form" onSubmit={handleOpenDocument}>
            <input
              type="text"
              className="doc-id-input"
              placeholder="Paste document ID or link..."
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
            />
            <button type="submit" className="secondary-btn" disabled={!docId.trim()}>
              Open
            </button>
          </form>

          {error && <p className="error-msg">{error}</p>}
        </div>

        {/* Feature list */}
        <div className="features">
          {[
            { icon: "👥", text: "Real-time multi-user editing" },
            { icon: "🖱️", text: "Live cursor tracking" },
            { icon: "💾", text: "Auto-save every 3 seconds" },
            { icon: "📜", text: "Version history" },
            { icon: "🔗", text: "Share by link" },
            { icon: "🌙", text: "Dark mode" },
          ].map(({ icon, text }) => (
            <div key={text} className="feature-pill">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
