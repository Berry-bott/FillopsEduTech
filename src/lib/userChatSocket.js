// src/lib/userChatSocket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;

let socket = null;

export const connectUserSocket = (token = null) => {
  if (socket?.connected) {
    console.log("[UserSocket] Already connected →", socket.id);
    return socket;
  }

  if (!token) {
    console.warn("[UserSocket] No token — will fail auth");
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 8000,
    timeout: 60000,
    autoConnect: false,
    transports: ["websocket"],
    forceNew: false,
  });

  socket.connect();
  return socket;
};

export const getUserSocket = () => socket;

export const disconnectUserSocket = () => {
  if (socket?.connected) socket.disconnect();
  socket = null;
};