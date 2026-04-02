// App.js
// Root component — sets up React Router for navigation

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import DocumentPage from "./components/DocumentPage";
import "./styles/global.css";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Document editor — :id is the document's unique ID */}
        <Route path="/documents/:id" element={<DocumentPage />} />

        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
