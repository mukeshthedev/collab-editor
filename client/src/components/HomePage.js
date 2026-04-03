import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "./HomePage.css";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

// SVG icon components
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconCursor = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z"/>
  </svg>
);
const IconSave = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.95"/>
    <line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="14"/>
  </svg>
);
const IconLink = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconZap = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const FEATURES = [
  { icon: <IconUsers/>, label: "Multi-user editing", desc: "Collaborate with your whole team simultaneously" },
  { icon: <IconCursor/>, label: "Live cursors", desc: "See where everyone is typing in real time" },
  { icon: <IconSave/>, label: "Auto-save", desc: "Your work is saved automatically every 3 seconds" },
  { icon: <IconHistory/>, label: "Version history", desc: "Browse and restore any previous version" },
  { icon: <IconLink/>, label: "Share by link", desc: "One click to copy and share your document" },
  { icon: <IconZap/>, label: "Zero lag sync", desc: "WebSocket-powered instant synchronization" },
];

// Floating document cards shown in hero background
const FLOATING_DOCS = [
  { title: "Project Proposal", users: 3, top: "12%", left: "6%", delay: "0s",  rotate: "-4deg" },
  { title: "Meeting Notes",    users: 2, top: "20%", right: "5%", delay: "0.4s", rotate: "3deg"  },
  { title: "Design Brief",     users: 5, top: "62%", left: "3%", delay: "0.8s", rotate: "-2deg" },
  { title: "Sprint Backlog",   users: 4, top: "68%", right: "4%", delay: "1.2s", rotate: "5deg"  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Stagger entrance animation
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleNewDocument = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SERVER_URL}/api/documents/new`);
      const data = await res.json();
      navigate(`/documents/${data.id}`);
    } catch {
      setError("Cannot connect to server. Is the backend running?");
      setLoading(false);
    }
  };

  const handleOpenDocument = (e) => {
    e.preventDefault();
    const trimmed = docId.trim();
    if (!trimmed) return;
    const id = trimmed.includes("/") ? trimmed.split("/").pop() : trimmed;
    navigate(`/documents/${id}`);
  };

  return (
    <div className="home-page" data-theme={theme}>
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Floating doc cards in background */}
      {FLOATING_DOCS.map((d) => (
        <div
          key={d.title}
          className="floating-card"
          style={{ top: d.top, left: d.left, right: d.right, animationDelay: d.delay, transform: `rotate(${d.rotate})` }}
        >
          <div className="fc-header">
            <IconDoc />
            <span>{d.title}</span>
          </div>
          <div className="fc-lines">
            <div className="fc-line" style={{width:"85%"}}/>
            <div className="fc-line" style={{width:"60%"}}/>
            <div className="fc-line" style={{width:"75%"}}/>
          </div>
          <div className="fc-avatars">
            {Array.from({length: d.users}).map((_, i) => (
              <div key={i} className="fc-avatar" style={{background: `hsl(${i*60+200},70%,55%)`, marginLeft: i ? "-6px" : 0}} />
            ))}
            <span className="fc-user-count">{d.users} editing</span>
          </div>
        </div>
      ))}

      {/* Theme toggle */}
      <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
        {theme === "light" ? <IconMoon /> : <IconSun />}
      </button>

      {/* Main content */}
      <div className={`home-content ${mounted ? "mounted" : ""}`}>

        {/* Badge */}
        <div className="hero-badge">
          <span className="badge-dot" />
          Real-time collaboration
        </div>

        {/* Title */}
        <div className="hero-title-wrap">
          <h1 className="hero-title">
            Write together,
            <br />
            <span className="gradient-text">instantly.</span>
          </h1>
        </div>

        <p className="hero-subtitle">
          A blazing-fast collaborative editor. Multiple cursors, live sync,
          auto-save — everything your team needs.
        </p>

        {/* CTA Card */}
        <div className="cta-card">
          <button
            className="create-btn"
            onClick={handleNewDocument}
            disabled={loading}
          >
            <span className="create-btn-bg" />
            <span className="create-btn-content">
              {loading ? (
                <span className="spinner" />
              ) : (
                <span className="btn-icon"><IconPlus /></span>
              )}
              <span>{loading ? "Creating document…" : "Create new document"}</span>
              {!loading && <span className="btn-arrow"><IconArrow /></span>}
            </span>
          </button>

          <div className="divider-row">
            <div className="divider-line" /><span>or open existing</span><div className="divider-line" />
          </div>

          <form className="open-form" onSubmit={handleOpenDocument}>
            <div className="input-wrap">
              <span className="input-icon"><IconDoc /></span>
              <input
                type="text"
                className="doc-id-input"
                placeholder="Paste document ID or link…"
                value={docId}
                onChange={(e) => { setDocId(e.target.value); setError(""); }}
              />
            </div>
            <button type="submit" className="open-btn" disabled={!docId.trim()}>
              Open <IconArrow />
            </button>
          </form>

          {error && (
            <div className="error-banner">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
        </div>

        {/* Features grid */}
        <div className="features-grid">
          {FEATURES.map(({ icon, label, desc }, i) => (
            <div
              className="feature-card"
              key={label}
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div className="feature-icon">{icon}</div>
              <div className="feature-text">
                <span className="feature-label">{label}</span>
                <span className="feature-desc">{desc}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}