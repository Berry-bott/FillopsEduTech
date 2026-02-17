// // src/lib/userSocket.js
// import { io } from "socket.io-client";
// import { useUserChatStore } from "@/store/userChatStore";

// const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

// let socket = null;
// let listenersInitialized = false;

// export const connectUserSocket = (token = null) => {
//   if (socket?.connected) {
//     console.log("[UserSocket] Already connected →", socket.id);
//     return socket;
//   }

//   if (!token) {
//     console.warn("[connectUserSocket] No token — will fail auth");
//   }

//   const options = {
//     auth: { token },
//     reconnection: true,
//     reconnectionAttempts: 8,
//     reconnectionDelay: 1500,
//     reconnectionDelayMax: 8000,
//     timeout: 60000,
//     autoConnect: false,
//     transports: ["websocket"],
//     forceNew: false,
//   };

//   socket = io(SOCKET_URL, options);

//   // Basic lifecycle
//   socket.on("connect", () => {
//     console.log("%c[UserSocket] CONNECTED", "background:#28a745;color:white;padding:4px;", socket.id);
//     useUserChatStore.setState({ socketConnected: true });

//     // Auto-rejoin room on reconnect
//     const currentBookingId = useUserChatStore.getState().selectedBooking?.id;
//     if (currentBookingId) {
//       console.log("🔄 User reconnected - rejoining room:", currentBookingId);
//       socket.emit("join:booking", currentBookingId, (ack) => {
//         if (ack?.success) {
//           console.log("✅ User rejoined room after reconnect");
//           useUserChatStore.getState().fetchMessages(currentBookingId);
//         }
//       });
//     }
//   });

//   socket.on("connect_error", (err) => {
//     console.error("[UserSocket] connect_error:", err.message);
//     useUserChatStore.setState({ socketConnected: false });
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("[UserSocket] disconnected:", reason);
//     useUserChatStore.setState({ socketConnected: false });
//   });

//   // ─── Global listeners — registered ONLY ONCE ──────────────────────────────
//   if (!listenersInitialized) {
//     console.log("[UserSocket] Registering global socket listeners (once)");

//     // Core chat - message received
//     socket.on("message:new", (message) => {
//       console.log("%c[UserSocket] message:new", "background:#673ab7;color:white;padding:4px;", message);
//       useUserChatStore.getState().handleNewMessage(message);
//     });

//     // Typing indicators - tutor typing
//     socket.on("typing:start", ({ userType, userName }) => {
//       if (userType === "tutor" && useUserChatStore.getState().selectedBooking) {
//         useUserChatStore.setState({ isSomeoneTyping: true, typingUserName: userName });
//       }
//     });

//     socket.on("typing:stop", ({ userType }) => {
//       if (userType === "tutor") {
//         useUserChatStore.setState({ isSomeoneTyping: false, typingUserName: null });
//       }
//     });

//     // Read receipts - tutor read user's messages
//     socket.on("messages:read", ({ readBy, timestamp }) => {
//       if (readBy === "tutor") {
//         useUserChatStore.getState().handleMessagesReadByTutor(timestamp);
//       }
//     });

//     // Session lifecycle events
//     socket.on("session:ended", (data) => {
//       useUserChatStore.getState().handleSessionEnded(data);
//     });

//     socket.on("session:kick", (data) => {
//       useUserChatStore.getState().handleSessionKick(data);
//     });

//     socket.on("session:warning", (data) => {
//       console.log("[UserSocket] session:warning", data);
//     });

//     socket.on("session:timeExpired", (data) => {
//       useUserChatStore.getState().handleSessionExpired(data);
//     });

//     // Online status
// // In userSocket.js, update the online users listener:

//     socket.on("onlineUsers", (users) => {
//     console.log("👥 [UserSocket] onlineUsers", users);
    
//     const currentBooking = useUserChatStore.getState().selectedBooking;
    
//     if (currentBooking?.tutorId) {
//         // Check if the current tutor is online
//         const isOnline = users?.some((u) => 
//         u.id === currentBooking.tutorId && u.userType === "tutor"
//         );
        
//         console.log(`🟢 Tutor ${currentBooking.tutorId} is ${isOnline ? 'online' : 'offline'}`);
        
//         useUserChatStore.setState({ isParticipantOnline: !!isOnline });
//     }
//     });

//     // Booking status updates
//     socket.on("booking:confirmed", (data) => {
//       useUserChatStore.getState().handleBookingConfirmed(data);
//     });

//     socket.on("booking:cancelled", (data) => {
//       useUserChatStore.getState().handleBookingCancelled(data);
//     });

//     socket.on("booking:rescheduled", (data) => {
//       useUserChatStore.getState().handleBookingRescheduled(data);
//     });

//     socket.on("booking:updated", (data) => {
//       useUserChatStore.getState().handleBookingUpdated(data);
//     });

//     // Reschedule proposals from tutor
//     socket.on("reschedule:proposed", (data) => {
//       useUserChatStore.getState().handleRescheduleProposed(data);
//     });

//     listenersInitialized = true;
//   }

//   socket.connect();
//   return socket;
// };

// export const getUserSocket = () => socket;

// export const disconnectUserSocket = () => {
//   if (socket?.connected) {
//     socket.disconnect();
//   }
//   socket = null;
//   listenersInitialized = false;
// };






// src/lib/userSocket.js
import { io } from "socket.io-client";
import { useUserChatStore } from "@/store/userChatStore";

const SOCKET_URL = "https://fillops-server-5fuf.onrender.com";

let socket = null;
let listenersInitialized = false;

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
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1500,
    reconnectionDelayMax: 8000,
    timeout: 60000,
    autoConnect: false,
  });

  // ─── Lifecycle ─────────────────────────────
  socket.on("connect", () => {
    console.log("%c[UserSocket] CONNECTED", "background:#28a745;color:white;", socket.id);
    useUserChatStore.setState({ socketConnected: true });

    // Rejoin current booking if reconnect
    const bookingId = useUserChatStore.getState().selectedBooking?.id;
    if (bookingId) {
      console.log("🔄 Rejoining booking room:", bookingId);
      socket.emit("join:booking", bookingId, (ack) => {
        if (ack?.success) {
          console.log("✅ Rejoined room");
          useUserChatStore.getState().fetchMessages(bookingId);
        }
      });
    }
  });

  socket.on("connect_error", (err) => {
    console.error("[UserSocket] connect_error:", err.message);
    useUserChatStore.setState({ socketConnected: false });
  });

  socket.on("disconnect", (reason) => {
    console.log("[UserSocket] disconnected:", reason);
    useUserChatStore.setState({ socketConnected: false });
  });

  // ─── Global Listeners ──────────────────────
  if (!listenersInitialized) {
    console.log("[UserSocket] Registering global listeners");

    // New messages
    socket.on("message:new", (msg) => {
      useUserChatStore.getState().handleNewMessage(msg);
    });

    // Typing indicators (tutor)
    socket.on("typing:start", ({ userType, userName }) => {
      if (userType === "tutor") {
        useUserChatStore.setState({ isSomeoneTyping: true, typingUserName: userName });
      }
    });

    socket.on("typing:stop", ({ userType }) => {
      if (userType === "tutor") {
        useUserChatStore.setState({ isSomeoneTyping: false, typingUserName: null });
      }
    });

    // Online users
    socket.on("onlineUsers", (users) => {
      const booking = useUserChatStore.getState().selectedBooking;
      if (booking?.tutorId) {
        const isOnline = users.some(u => u.id === booking.tutorId && u.userType === "tutor");
        useUserChatStore.setState({ isParticipantOnline: isOnline });
      }
    });

    // Session events
    socket.on("session:ended", (data) => useUserChatStore.getState().handleSessionEnded(data));
    socket.on("session:kick", (data) => useUserChatStore.getState().handleSessionKick(data));
    socket.on("session:warning", (data) => console.log("[UserSocket] warning", data));
    socket.on("session:timeExpired", (data) => useUserChatStore.getState().handleSessionExpired(data));

    listenersInitialized = true;
  }

  socket.connect();
  return socket;
};

// ─── Emit helpers ─────────────────────────
export const joinBooking = (bookingId) => {
  if (!socket) return;
  socket.emit("join:booking", bookingId, (ack) => {
    console.log("Joined booking room:", bookingId, ack);
  });
};

export const sendMessage = ({ bookingId, content, messageType = "text" }) => {
  if (!socket) return;
  socket.emit("message:send", { bookingId, content, messageType }, (ack) => {
    if (!ack?.success) console.error("Failed to send message:", ack?.message);
  });
};

export const startTyping = (bookingId) => {
  if (!socket) return;
  socket.emit("typing:start", { bookingId });
};

export const stopTyping = (bookingId) => {
  if (!socket) return;
  socket.emit("typing:stop", { bookingId });
};

export const markMessagesRead = (bookingId) => {
  if (!socket) return;
  socket.emit("messages:read", bookingId);
};

export const endSession = ({ bookingId, notes }) => {
  if (!socket) return;
  socket.emit("session:end", { bookingId, notes }, (ack) => {
    if (!ack?.success) console.error("Failed to end session:", ack?.message);
  });
};

export const getUserSocket = () => socket;

export const disconnectUserSocket = () => {
  if (socket?.connected) socket.disconnect();
  socket = null;
  listenersInitialized = false;
};
