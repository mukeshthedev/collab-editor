// utils/userUtils.js
// Utilities for generating and persisting guest usernames

const ADJECTIVES = [
  "Swift", "Brave", "Calm", "Clever", "Bright",
  "Gentle", "Happy", "Kind", "Lively", "Noble",
  "Quiet", "Sharp", "Witty", "Zesty", "Daring",
];

const NOUNS = [
  "Falcon", "Panda", "Otter", "Lynx", "Fox",
  "Crane", "Wolf", "Hawk", "Bear", "Deer",
  "Seal", "Crow", "Owl", "Hare", "Toad",
];

// Generate a random fun username like "SwiftFalcon42"
export function generateUsername() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

// Get or create a persistent username for this browser session
export function getOrCreateUsername() {
  const stored = sessionStorage.getItem("collab-editor-username");
  if (stored) return stored;
  const username = generateUsername();
  sessionStorage.setItem("collab-editor-username", username);
  return username;
}

// Format a date for display in version history
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
