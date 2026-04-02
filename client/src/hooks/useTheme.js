// hooks/useTheme.js
// Custom hook for dark/light mode toggle with localStorage persistence

import { useState, useEffect } from "react";

export function useTheme() {
  // Initialize from localStorage, default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("collab-editor-theme") || "light";
  });

  useEffect(() => {
    // Apply theme class to the root HTML element
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("collab-editor-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
