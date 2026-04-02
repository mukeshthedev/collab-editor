// hooks/useSocket.js
// Custom hook to manage the Socket.io connection lifecycle

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SERVER_URL =
  process.env.REACT_APP_SERVER_URL || "http://localhost:3001";

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create a single socket connection
    socketRef.current = io(SERVER_URL, {
      // Reconnect automatically if connection drops
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Socket connected:", socketRef.current.id);
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setConnected(false);
    });

    socketRef.current.on("error", ({ message }) => {
      console.error("Socket error:", message);
    });

    // Cleanup: disconnect when component unmounts
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket: socketRef.current, connected };
}
