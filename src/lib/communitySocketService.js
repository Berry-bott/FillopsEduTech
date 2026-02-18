// src/lib/socketService.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

let socket = null;
let currentToken = null;

export const connectSocket = (token, options = {}) => {
  if (socket?.connected && token === currentToken) {
    return socket;
  }

  // Clean up old connection
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  currentToken = token;

  socket = io(SOCKET_URL, {
    auth: { token: token || null },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 6,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: false,
    ...options,
  });

  socket.on("connect", () => {
    console.log(`[socket] connected → ${socket.id}`);
  });

  socket.on("connect_error", (err) => {
    console.error("[socket] connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[socket] disconnected → ${reason}`);
  });

  socket.connect();
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
  }
};

// ── Generic emit helper (optional — nicer API) ────────────────────────
export const emit = (event, payload, ack) => {
  if (!socket?.connected) {
    console.warn(`emit ${event} failed — socket not connected`);
    return false;
  }
  if (ack) {
    socket.emit(event, payload, ack);
  } else {
    socket.emit(event, payload);
  }
  return true;
};

// ── Feature-specific helpers (optional convenience) ───────────────────
export const joinGroup = (groupId, ack) => emit("join:group", groupId, ack);
export const leaveGroup = (groupId) => emit("leave:group", groupId);
export const sendGroupMessage = (payload, ack) => emit("group:send_message", payload, ack);
export const startGroupTyping = (groupId) => emit("group:typing_start", groupId);
export const stopGroupTyping = (groupId) => emit("group:typing_stop", groupId);

export const joinBooking = (bookingId, ack) => emit("join:booking", bookingId, ack);
export const sendChatMessage = (payload, ack) => emit("message:send", payload, ack);
export const startChatTyping = (bookingId) => emit("typing:start", { bookingId });
export const stopChatTyping = (bookingId) => emit("typing:stop", { bookingId });