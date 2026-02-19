



// // src/lib/userChatSocket.js
// import { io } from "socket.io-client";

// const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

// let socket       = null;
// let currentToken = null;
// let cleanupListeners = null;

// export const connectUserSocket = (token) => {
//   if (socket?.connected && token === currentToken) return socket;

//   // Tear down old socket if token changed
//   if (socket) {
//     socket.removeAllListeners();
//     socket.disconnect();
//     socket = null;
//     cleanupListeners = null;
//   }

//   currentToken = token;

//   socket = io(SOCKET_URL, {
//     auth:                 { token },
//     transports:           ["websocket", "polling"],
//     reconnection:         true,
//     reconnectionAttempts: 8,
//     reconnectionDelay:    1500,
//     reconnectionDelayMax: 8000,
//     timeout:              20000,
//     autoConnect:          false,
//   });

//   socket.on("connect", () => {
//     console.log("%c[UserSocket] CONNECTED", "background:#28a745;color:white;padding:4px;", socket.id);

//     // Lazy-import to avoid circular dependency
//     import("@/store/userChatStore").then(({ useUserChatStore }) => {
//       useUserChatStore.setState({ socketConnected: true });

//       // Attach store listeners — clean up previous ones first
//       if (cleanupListeners) { cleanupListeners(); cleanupListeners = null; }
//       cleanupListeners = useUserChatStore.getState().initializeListeners?.() ?? null;

//       // Rejoin active booking room after reconnect
//       const bookingId = useUserChatStore.getState().selectedBooking?.id;
//       if (bookingId) {
//         socket.emit("join:booking", bookingId, (ack) => {
//           if (ack?.success) useUserChatStore.getState().markMessagesAsRead(bookingId);
//         });
//       }
//     });
//   });

//   socket.on("connect_error", (err) => {
//     console.error("[UserSocket] connect_error:", err.message);
//     import("@/store/userChatStore").then(({ useUserChatStore }) => {
//       useUserChatStore.setState({ socketConnected: false });
//     });
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("[UserSocket] disconnected:", reason);
//     import("@/store/userChatStore").then(({ useUserChatStore }) => {
//       useUserChatStore.setState({ socketConnected: false, isParticipantOnline: false });
//     });
//   });

//   socket.on("reconnect", (n) => {
//     console.log("[UserSocket] reconnected after", n, "attempt(s)");
//   });

//   socket.connect();
//   return socket;
// };

// export const getUserSocket    = () => socket;
// export const isUserConnected  = () => socket?.connected ?? false;

// export const disconnectUserSocket = () => {
//   if (cleanupListeners) { cleanupListeners(); cleanupListeners = null; }
//   if (socket) {
//     socket.removeAllListeners();
//     socket.disconnect();
//     socket       = null;
//     currentToken = null;
//   }
// };







// src/lib/userChatSocket.js
import { io } from "socket.io-client";

const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

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