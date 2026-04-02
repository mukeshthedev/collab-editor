import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Suppress known Quill ScrollBlot observer warning in React 18
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('this.emitter')) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return true;
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <App />
);