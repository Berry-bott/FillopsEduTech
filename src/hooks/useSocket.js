// src/hooks/useSocket.js
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/lib/communitySocketService";
import useAuthStore from "@/store/authStore"; 

const useSocket = () => {
  const token = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    connectSocket(token);

    return () => {

    };
  }, [token]);

};

export default useSocket;