import { useEffect, useRef } from 'react';
import  useTutorAuthStore  from '@/store/tutorAuthStore';
import  useAuthStore  from '@/store/authStore';
import { useTutorChatStore } from '@/store/tutorChatStore';
import { useUserChatStore } from '@/store/userChatStore';
import { getUserSocket } from '@/lib/userChatSocket';

function SocketInitializer() {
  const isTutorAuthenticated = useTutorAuthStore((s) => s.isAuthenticated ?? false);
  const isUserAuthenticated  = useAuthStore((s) => s.isAuthenticated ?? false);
  const accessToken          = useAuthStore((s) => s.accessToken);

  // Tutor actions – use fallback if store not ready
  const tutorActions = useTutorChatStore();
  const tutorInitSocket    = tutorActions?.initializeSocket;
  const tutorInitListeners = tutorActions?.initializeListeners;
  const tutorDisconnect    = tutorActions?.disconnectSocket;

  // User actions
  const userActions = useUserChatStore();
  const userInitSocket     = userActions?.initializeSocket;
  const userInitListeners  = userActions?.initializeListeners;
  const userDisconnect     = userActions?.disconnectSocket;

  // ── Tutor socket ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isTutorAuthenticated || !tutorInitSocket) return;

    console.log("🔌 [Socket] Initializing TUTOR socket");

    try {
      tutorInitSocket();
      const cleanup = tutorInitListeners?.();
      return () => {
        cleanup?.();
        tutorDisconnect?.();
      };
    } catch (err) {
      console.error("TUTOR socket error:", err);
    }
  }, [isTutorAuthenticated, tutorInitSocket, tutorInitListeners, tutorDisconnect]);

  // ── User socket on login ──────────────────────────────────────────
  useEffect(() => {
    if (!isUserAuthenticated || !userInitSocket) return;

    console.log("🔌 [Socket] Initializing USER socket (login)");

    try {
      userInitSocket();
      const cleanup = userInitListeners?.();
      return () => {
        cleanup?.();
        userDisconnect?.();
      };
    } catch (err) {
      console.error("USER socket error:", err);
    }
  }, [isUserAuthenticated, userInitSocket, userInitListeners, userDisconnect]);

  // ── Reconnect on token refresh ────────────────────────────────────
  const prevTokenRef = useRef(accessToken);

  useEffect(() => {
    if (!isUserAuthenticated || !accessToken || !userInitSocket) {
      prevTokenRef.current = accessToken;
      return;
    }

    if (prevTokenRef.current !== accessToken) {
      console.log("🔄 Token refreshed → checking socket");

      const socket = getUserSocket();
      if (socket?.connected) {
        console.log("   → Socket still connected");
      } else {
        console.log("   → Socket gone → reconnecting...");
        try {
          userInitSocket();
          userInitListeners?.();
        } catch (err) {
          console.error("Reconnect failed:", err);
        }
      }

      prevTokenRef.current = accessToken;
    }
  }, [accessToken, isUserAuthenticated, userInitSocket, userInitListeners]);

  return null;
}

export default SocketInitializer;