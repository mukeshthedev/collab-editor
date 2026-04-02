// components/TextEditor.js
// Uses quill-cursors module for proper multi-user cursor display

import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./TextEditor.css";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link"],
  ["clean"],
];

const SAVE_INTERVAL_MS = 3000;

export default function TextEditor({
  socket,
  documentId,
  userName,
  onSaveStatusChange,
  onVersionsUpdate,
}) {
  const wrapperRef = useRef(null);
  const quillRef = useRef(null);
  const cursorsModuleRef = useRef(null);
  const isApplyingRef = useRef(false);

  // ── Initialize Quill once ────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || quillRef.current) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.appendChild(editor);

    // Dynamically load quill-cursors so we don't crash if it's not installed
    let cursorsModule = null;
    try {
      const QuillCursors = require("quill-cursors").default || require("quill-cursors");
      Quill.register("modules/cursors", QuillCursors);
      cursorsModule = true;
    } catch (e) {
      console.warn("quill-cursors not installed, using fallback cursor rendering");
    }

    const quill = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
        ...(cursorsModule ? { cursors: { hideDelayMs: 5000, transformOnTextChange: true } } : {}),
      },
      placeholder: "Start typing...",
    });

    quill.disable();
    quillRef.current = quill;

    if (cursorsModule) {
      cursorsModuleRef.current = quill.getModule("cursors");
    }

    return () => {
      quillRef.current = null;
      cursorsModuleRef.current = null;
      wrapper.innerHTML = "";
    };
  }, []);

  // ── Load document ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !quillRef.current) return;
    const handler = ({ content, versions }) => {
      if (!quillRef.current) return;
      quillRef.current.setContents(content);
      quillRef.current.enable();
      onVersionsUpdate?.(versions);
    };
    socket.once("load-document", handler);
    return () => socket.off("load-document", handler);
  }, [socket, onVersionsUpdate]);

  // ── Receive text changes ─────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !quillRef.current) return;
    const handler = (delta) => {
      if (!quillRef.current) return;
      isApplyingRef.current = true;
      quillRef.current.updateContents(delta);
      isApplyingRef.current = false;
    };
    socket.on("receive-changes", handler);
    return () => socket.off("receive-changes", handler);
  }, [socket]);

  // ── Send text changes ────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !quillRef.current) return;
    const handler = (delta, _old, source) => {
      if (source !== "user" || isApplyingRef.current) return;
      socket.emit("send-changes", { documentId, delta });
    };
    quillRef.current.on("text-change", handler);
    return () => quillRef.current?.off("text-change", handler);
  }, [socket, documentId]);

  // ── Send cursor position ─────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !quillRef.current) return;
    const handler = (range, _old, source) => {
      if (source !== "user") return;
      socket.emit("cursor-move", { documentId, range });
    };
    quillRef.current.on("selection-change", handler);
    return () => quillRef.current?.off("selection-change", handler);
  }, [socket, documentId]);

  // ── Receive remote cursors ───────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const onCursorUpdated = ({ userId, userName: name, color, range }) => {
      if (!quillRef.current) return;

      if (cursorsModuleRef.current) {
        // ── Use quill-cursors module (preferred) ──
        try {
          // Create cursor if it doesn't exist yet
          const existing = cursorsModuleRef.current.cursors().find(c => c.id === userId);
          if (!existing) {
            cursorsModuleRef.current.createCursor(userId, name, color);
          }
          if (range) {
            cursorsModuleRef.current.moveCursor(userId, range);
          }
        } catch (e) {
          console.warn("Cursor module error:", e);
        }
      } else {
        // ── Fallback: manual DOM cursor rendering ──
        renderFallbackCursor(userId, name, color, range);
      }
    };

    const onCursorRemoved = ({ userId }) => {
      if (cursorsModuleRef.current) {
        try {
          cursorsModuleRef.current.removeCursor(userId);
        } catch (e) {}
      } else {
        // Remove fallback cursor
        document.querySelectorAll(`[data-cursor-id="${userId}"]`).forEach(el => el.remove());
      }
    };

    socket.on("cursor-updated", onCursorUpdated);
    socket.on("cursor-removed", onCursorRemoved);
    return () => {
      socket.off("cursor-updated", onCursorUpdated);
      socket.off("cursor-removed", onCursorRemoved);
    };
  }, [socket]);

  // ── Fallback cursor renderer (no quill-cursors module) ──────────────────
  const renderFallbackCursor = (userId, name, color, range) => {
    if (!quillRef.current || !wrapperRef.current || !range) return;
    try {
      // Remove old cursor for this user
      wrapperRef.current.querySelectorAll(`[data-cursor-id="${userId}"]`).forEach(el => el.remove());

      const bounds = quillRef.current.getBounds(range.index);
      if (!bounds) return;

      const qlEditor = wrapperRef.current.querySelector(".ql-editor");
      if (!qlEditor) return;
      qlEditor.style.position = "relative";

      const cursorEl = document.createElement("div");
      cursorEl.setAttribute("data-cursor-id", userId);
      cursorEl.style.cssText = `
        position: absolute;
        left: ${bounds.left}px;
        top: ${bounds.top}px;
        height: ${bounds.height || 18}px;
        width: 2px;
        background: ${color};
        pointer-events: none;
        z-index: 100;
      `;

      const labelEl = document.createElement("div");
      labelEl.style.cssText = `
        position: absolute;
        top: -22px;
        left: 0px;
        background: ${color};
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 4px 4px 4px 0;
        white-space: nowrap;
        font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        box-shadow: 0 2px 6px rgba(0,0,0,0.25);
        letter-spacing: 0.2px;
      `;
      labelEl.textContent = name;

      cursorEl.appendChild(labelEl);
      qlEditor.appendChild(cursorEl);
    } catch (e) {
      // Safe to ignore
    }
  };

  // ── Auto-save ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !quillRef.current) return;
    const interval = setInterval(() => {
      if (!quillRef.current) return;
      socket.emit("save-document", { documentId, content: quillRef.current.getContents() });
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [socket, documentId]);

  // ── Save confirmation ────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handler = ({ savedAt }) => onSaveStatusChange?.(new Date(savedAt));
    socket.on("document-saved", handler);
    return () => socket.off("document-saved", handler);
  }, [socket, onSaveStatusChange]);

  return (
    <div className="editor-wrapper">
      <div ref={wrapperRef} className="quill-container" />
    </div>
  );
}