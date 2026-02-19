// import { io } from "socket.io-client";

// const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

// let socket = null;
// let currentToken = null;

// export const connectSocket = (token) => {
//   if (socket?.connected && token === currentToken) return socket;
//   if (socket) { socket.removeAllListeners(); socket.disconnect(); socket = null; }

//   currentToken = token;
//   socket = io(SOCKET_URL, {
//     auth: { token },
//     transports: ["websocket", "polling"],
//     reconnection: true,
//     reconnectionAttempts: 6,
//     reconnectionDelay: 1500,
//     reconnectionDelayMax: 5000,
//     timeout: 20000,
//     autoConnect: false,
//   });

//   socket.on("connect",       () => console.log("[socket] connected →", socket.id));
//   socket.on("connect_error", (e) => console.error("[socket] error:", e.message));
//   socket.on("disconnect",    (r) => console.log("[socket] disconnected →", r));

//   socket.connect();
//   return socket;
// };

// export const getSocket       = () => socket;
// export const disconnectSocket = () => {
//   if (socket) { socket.removeAllListeners(); socket.disconnect(); socket = null; currentToken = null; }
// };

// const emit = (event, payload, ack) => {
//   if (!socket?.connected) { console.warn(`[socket] "${event}" skipped — not connected`); return false; }
//   ack ? socket.emit(event, payload, ack) : socket.emit(event, payload);
//   return true;
// };

// export const joinGroup        = (groupId, ack) => emit("join:group", groupId, ack);
// export const leaveGroup       = (groupId)      => emit("leave:group", groupId);
// export const sendGroupMessage = (payload, ack) => emit("group:send_message", payload, ack);
// export const startGroupTyping = (groupId)      => emit("group:typing_start", groupId);
// export const stopGroupTyping  = (groupId)      => emit("group:typing_stop", groupId);



// src/lib/communitySocketService.js
/**
 * ONE shared Socket.IO service for ALL roles: user, tutor, admin.
 * The server determines role permissions from the Bearer token.
 * The client just connects, emits, and listens — role-agnostic.
 */
import { io } from "socket.io-client";

const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

let socket       = null;
let currentToken = null;

// ── Connect ───────────────────────────────────────────────────────────
export const connectSocket = (token) => {
  if (socket?.connected && token === currentToken) return socket;

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  currentToken = token;

  socket = io(SOCKET_URL, {
    auth:                 { token },
    transports:           ["websocket", "polling"],
    reconnection:         true,
    reconnectionAttempts: 6,
    reconnectionDelay:    1500,
    reconnectionDelayMax: 5000,
    timeout:              20000,
    autoConnect:          false,
  });

  socket.on("connect",       () => console.log("[socket] connected →", socket.id));
  socket.on("connect_error", (e) => console.error("[socket] error:", e.message));
  socket.on("disconnect",    (r) => console.log("[socket] disconnected →", r));
  socket.on("reconnect",     (n) => console.log("[socket] reconnected after", n, "attempt(s)"));

  socket.connect();
  return socket;
};

export const getSocket        = () => socket;
export const isConnected      = () => socket?.connected ?? false;
export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket       = null;
    currentToken = null;
  }
};

// ── Internal emit helper ──────────────────────────────────────────────
const emit = (event, payload, ack) => {
  if (!socket?.connected) {
    console.warn(`[socket] "${event}" skipped — not connected`); // ← fixed syntax
    return false;
  }
  ack ? socket.emit(event, payload, ack) : socket.emit(event, payload);
  return true;
};

// ── Group events (user + tutor + admin all use these) ─────────────────
export const joinGroup        = (groupId, ack) => emit("join:group",         groupId, ack);
export const leaveGroup       = (groupId)      => emit("leave:group",        groupId);
export const sendGroupMessage = (payload, ack) => emit("group:send_message", payload, ack);
export const startGroupTyping = (groupId)      => emit("group:typing_start", groupId);
export const stopGroupTyping  = (groupId)      => emit("group:typing_stop",  groupId);