// // src/hooks/useSocket.js
// import { useEffect } from "react";
// import { connectSocket, disconnectSocket } from "@/lib/communitySocketService";
// import useAuthStore from "@/store/authStore"; 

// const useSocket = () => {
//   const token = useAuthStore((s) => s.accessToken);

//   useEffect(() => {
//     if (!token) {
//       disconnectSocket();
//       return;
//     }

//     connectSocket(token);

//     return () => {

//     };
//   }, [token]);

// };

// export default useSocket;




// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { connectSocket, disconnectSocket } from "@/lib/communitySocketService";
import useAuthStore from "@/store/authStore";
import useCommunityStore from "@/store/userCommunityStore";

const useSocket = () => {
  const token = useAuthStore((s) => s.accessToken);
  const initializeListeners = useCommunityStore((s) => s.initializeListeners);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      return;
    }

    // Connect socket
    connectSocket(token);

    // Small delay to ensure socket is connected before registering listeners
    const timer = setTimeout(() => {
      if (cleanupRef.current) cleanupRef.current();
      cleanupRef.current = initializeListeners();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [token]);
};

export default useSocket;