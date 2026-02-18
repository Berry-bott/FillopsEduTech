// // src/components/community/CommunityChat.jsx
// import { useEffect } from "react";
// import useCommunityStore from "@/store/userCommunityStore";
// import useSocket from "@/hooks/useSocket";

// import Sidebar from "./Sidebar";
// import ChatPanel from "./ChatPanel";
// // import ErrorToast from "./atoms/ErrorToast"; // ← assuming you have this now

// export default function CommunityChat() {
//   const { error, clearError, sidebarOpen, setSidebarOpen } = useCommunityStore();

//   // Connect socket automatically when token is available
//   useSocket();

//   return (
//     <div className="community-layout">
//       {/* Global error toast */}
//       {/* {error && <ErrorToast message={error} onClose={clearError} />} */}

//       {/* Sidebar */}
//       <Sidebar />

//       {/* Main chat area */}
//       <main
//         className="chat-area"
//         style={{
//           marginLeft: sidebarOpen ? "300px" : "0",
//           transition: "margin-left 0.3s ease",
//         }}
//       >
//         <ChatPanel />
//       </main>

//       {/* Mobile toggle button */}
//       <button
//         className="sidebar-toggle"
//         onClick={() => setSidebarOpen(!sidebarOpen)}
//         aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
//       >
//         {sidebarOpen ? "✕" : "☰"}
//       </button>
//     </div>
//   );
// }



// src/components/community/CommunityChat.jsx
import { useEffect, useState } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import useSocket from "@/hooks/useSocket";

import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";
import { Avatar, Spinner } from "./ChatAtoms";

export default function CommunityChat() {
  const {
    error,
    clearError,
    sidebarOpen,
    setSidebarOpen,
    currentUser,
    loadingGroups,
  } = useCommunityStore();

  useSocket();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile]);

  return (
    <div style={{ height: "100vh", display: "flex", background: "#0f172a", color: "#e2e8f0", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: sidebarOpen && !isMobile ? 300 : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        <ChatPanel />
      </div>

      {/* Mobile toggle */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 100,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(99,102,241,0.2)",
            border: "none",
            color: "white",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Error toast */}
      {error && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#ef4444",
            color: "white",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>{error}</span>
          <button onClick={clearError} style={{ background: "none", border: "none", color: "white", fontSize: 18, cursor: "pointer" }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}