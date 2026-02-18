// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket } from "@/lib/communitySocketService";
import useAuthStore from "@/store/authStore";
import useCommunityStore from "@/store/userCommunityStore";

const useSocket = () => {
  const token             = useAuthStore((s) => s.accessToken);
  const initializeListeners = useCommunityStore((s) => s.initializeListeners);
  const cleanupRef        = useRef(null);

  useEffect(() => {
    if (!token) { disconnectSocket(); return; }

    connectSocket(token);

    // Small delay so socket finishes connecting before listeners attach
    const timer = setTimeout(() => {
      if (cleanupRef.current) cleanupRef.current();
      cleanupRef.current = initializeListeners();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
    };
  }, [token]);
};

export default useSocket;