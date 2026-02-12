


// src/lib/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

let socket = null;

export const connectSocket = (token = null) => {   // ← token should be JWT from login
  if (socket) {
    console.log("[Socket] Already connected");
    return socket;
  }

  if (!token) {
    console.warn("[connectSocket] No token provided — will likely fail auth");
    // Optionally throw or return null here
  }

  const options = {
    auth: { token },          // always send { token: "eyJhb..." }
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: false,
    transports: ["websocket", "polling"],
  };

  socket = io(SOCKET_URL, options);

  // your existing listeners...
  socket.on("connect", () => console.log("[Socket] Connected:", socket.id));
  socket.on("connect_error", (err) => console.error("[Socket] Connection error:", err.message));
  socket.on("disconnect", (reason) => console.log("[Socket] Disconnected:", reason));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket] Disconnected manually");
  }
};