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
    console.warn("[connectUserSocket] No token — will fail auth");
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
    console.log("%c[UserSocket] CONNECTED", "background:#28a745;color:white;padding:4px;", socket.id);
    useUserChatStore.setState({ socketConnected: true });

    // Auto-rejoin room on reconnect
    const currentBookingId = useUserChatStore.getState().selectedBooking?.id;
    if (currentBookingId) {
      console.log("🔄 User reconnected - rejoining room:", currentBookingId);
      socket.emit("join:booking", currentBookingId, (ack) => {
        if (ack?.success) {
          console.log("✅ User rejoined room after reconnect");
          useUserChatStore.getState().fetchMessages(currentBookingId);
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

  // ─── Global listeners — registered ONLY ONCE ──────────────────────────────
  if (!listenersInitialized) {
    console.log("[UserSocket] Registering global socket listeners (once)");

    // Core chat - message received
    socket.on("message:new", (message) => {
      console.log("%c[UserSocket] message:new", "background:#673ab7;color:white;padding:4px;", message);
      useUserChatStore.getState().handleNewMessage(message);
    });

    // Typing indicators - tutor typing
    socket.on("typing:start", ({ userType, userName }) => {
      if (userType === "tutor" && useUserChatStore.getState().selectedBooking) {
        useUserChatStore.setState({ isSomeoneTyping: true, typingUserName: userName });
      }
    });

    socket.on("typing:stop", ({ userType }) => {
      if (userType === "tutor") {
        useUserChatStore.setState({ isSomeoneTyping: false, typingUserName: null });
      }
    });

    // Read receipts - tutor read user's messages
    socket.on("messages:read", ({ readBy, timestamp }) => {
      if (readBy === "tutor") {
        useUserChatStore.getState().handleMessagesReadByTutor(timestamp);
      }
    });

    // Session lifecycle events
    socket.on("session:ended", (data) => {
      useUserChatStore.getState().handleSessionEnded(data);
    });

    socket.on("session:kick", (data) => {
      useUserChatStore.getState().handleSessionKick(data);
    });

    socket.on("session:warning", (data) => {
      console.log("[UserSocket] session:warning", data);
    });

    socket.on("session:timeExpired", (data) => {
      useUserChatStore.getState().handleSessionExpired(data);
    });

    // Online status
// In userSocket.js, update the online users listener:

    socket.on("onlineUsers", (users) => {
    console.log("👥 [UserSocket] onlineUsers", users);
    
    const currentBooking = useUserChatStore.getState().selectedBooking;
    
    if (currentBooking?.tutorId) {
        // Check if the current tutor is online
        const isOnline = users?.some((u) => 
        u.id === currentBooking.tutorId && u.userType === "tutor"
        );
        
        console.log(`🟢 Tutor ${currentBooking.tutorId} is ${isOnline ? 'online' : 'offline'}`);
        
        useUserChatStore.setState({ isParticipantOnline: !!isOnline });
    }
    });

    // Booking status updates
    socket.on("booking:confirmed", (data) => {
      useUserChatStore.getState().handleBookingConfirmed(data);
    });

    socket.on("booking:cancelled", (data) => {
      useUserChatStore.getState().handleBookingCancelled(data);
    });

    socket.on("booking:rescheduled", (data) => {
      useUserChatStore.getState().handleBookingRescheduled(data);
    });

    socket.on("booking:updated", (data) => {
      useUserChatStore.getState().handleBookingUpdated(data);
    });

    // Reschedule proposals from tutor
    socket.on("reschedule:proposed", (data) => {
      useUserChatStore.getState().handleRescheduleProposed(data);
    });

    listenersInitialized = true;
  }

  socket.connect();
  return socket;
};

export const getUserSocket = () => socket;

export const disconnectUserSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
  listenersInitialized = false;
};