


// // src/lib/socket.js
// import { io } from "socket.io-client";

// const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

// let socket = null;

// export const connectSocket = (token = null) => {   // ← token should be JWT from login
//   if (socket) {
//     console.log("[Socket] Already connected");
//     return socket;
//   }

//   if (!token) {
//     console.warn("[connectSocket] No token provided — will likely fail auth");
//     // Optionally throw or return null here
//   }

//   const options = {
//     auth: { token },          // always send { token: "eyJhb..." }
//     reconnection: true,
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000,
//     autoConnect: false,
//     transports: ["websocket", "polling"],
//   };

//   socket = io(SOCKET_URL, options);

//   // your existing listeners...
//   socket.on("connect", () => console.log("[Socket] Connected:", socket.id));
//   socket.on("connect_error", (err) => console.error("[Socket] Connection error:", err.message));
//   socket.on("disconnect", (reason) => console.log("[Socket] Disconnected:", reason));

//   return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//     console.log("[Socket] Disconnected manually");
//   }
// };











// src/lib/socket.js
import { io } from "socket.io-client";
import { useTutorChatStore } from "@/store/tutorChatStore";

const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

let socket = null;
let listenersInitialized = false;

export const connectSocket = (token = null) => {
  if (socket?.connected) {
    console.log("[Socket] Already connected →", socket.id);
    return socket;
  }

  if (!token) {
    console.warn("[connectSocket] No token — will fail auth");
  }

  const options = {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 8000,
    timeout: 60000,
    autoConnect: false,
    transports: ["websocket"],
    forceNew: false,
  };

  socket = io(SOCKET_URL, options);

  // Basic lifecycle
  socket.on("connect", () => {
    console.log("%c[Socket] CONNECTED", "background:#28a745;color:white;padding:4px;", socket.id);
    useTutorChatStore.setState({ socketConnected: true });
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] connect_error:", err.message);
    useTutorChatStore.setState({ socketConnected: false });
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] disconnected:", reason);
    useTutorChatStore.setState({ socketConnected: false });
  });

  // ─── Global listeners — registered ONLY ONCE ──────────────────────────────
  if (!listenersInitialized) {
    console.log("[Socket] Registering global socket listeners (once)");

    socket.on("message:new", (message) => {
      console.log("%c[Socket] message:new", "background:#673ab7;color:white;padding:4px;", message);
      useTutorChatStore.getState().handleNewMessage(message);
    });

    socket.on("typing:start", ({ userType, userName }) => {
      if (userType === "student" && useTutorChatStore.getState().selectedBooking) {
        useTutorChatStore.setState({ isSomeoneTyping: true, typingUserName: userName });
      }
    });

    socket.on("typing:stop", ({ userType }) => {
      if (userType === "student") {
        useTutorChatStore.setState({ isSomeoneTyping: false, typingUserName: null });
      }
    });

    socket.on("messages:read", ({ readBy, timestamp }) => {
      if (readBy === "student") {
        useTutorChatStore.getState().handleMessagesReadByStudent(timestamp);
      }
    });

    socket.on("session:ended", (data) => {
      useTutorChatStore.getState().handleSessionEnded(data);
    });

    socket.on("session:kick", (data) => {
      useTutorChatStore.getState().handleSessionKick(data);
    });

    socket.on("session:warning", (data) => {
      console.log("[Socket] session:warning", data);
    });

    socket.on("session:timeExpired", (data) => {
      useTutorChatStore.getState().handleSessionExpired(data);
    });

    socket.on("onlineUsers", (users) => {
      useTutorChatStore.getState().handleOnlineUsers(users);
    });

    socket.on("booking:new", (data) => {
      useTutorChatStore.getState().handleNewBookingNotification(data);
    });

    socket.on("booking:cancelled", (data) => {
      useTutorChatStore.getState().handleBookingCancelled(data);
    });

    socket.on("booking:rescheduled", (data) => {
      useTutorChatStore.getState().handleBookingRescheduled(data);
    });

    listenersInitialized = true;
  }

  socket.connect();
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
  listenersInitialized = false;
};