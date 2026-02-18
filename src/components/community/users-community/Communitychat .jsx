// src/components/community/CommunityChat.jsx
import { useEffect, useState } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import useSocket from "@/hooks/useSocket";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";

// Global styles injected once
const injectStyles = () => {
  if (document.getElementById("community-chat-styles")) return;
  const style = document.createElement("style");
  style.id = "community-chat-styles";
  style.textContent = `
    @keyframes spin    { to { transform: rotate(360deg); } }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
    @keyframes bounce  { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
    @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }

    input::placeholder { color: #475569 !important; }
    textarea::placeholder { color: #475569 !important; }
  `;
  document.head.appendChild(style);
};

export default function CommunityChat() {
  const {
    error,
    clearError,
    sidebarOpen,
    setSidebarOpen,
  } = useCommunityStore();

  // Initialize socket connection + listeners
  useSocket();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    injectStyles();
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      background: "#0f172a",
      color: "#e2e8f0",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Sidebar — absolute on mobile, relative on desktop */}
      <div style={isMobile ? {
        position: "fixed", top: 0, left: 0, height: "100%",
        zIndex: 50, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      } : {}}>
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
      }}>
        <ChatPanel />
      </div>

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: "fixed", top: 14, left: 14, zIndex: 60,
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(99,102,241,0.25)",
            border: "1px solid rgba(99,102,241,0.4)",
            color: "white", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>
      )}

      {/* Error toast */}
      {error && (
        <div style={{
          position: "fixed", top: 20, right: 20,
          background: "linear-gradient(135deg, #dc2626, #b91c1c)",
          color: "white", padding: "12px 16px",
          borderRadius: 12, zIndex: 1000,
          display: "flex", alignItems: "center", gap: 12,
          boxShadow: "0 8px 24px rgba(220,38,38,0.35)",
          maxWidth: 320, animation: "fadeIn 0.2s ease",
        }}>
          <span style={{ fontSize: 14, flex: 1 }}>{error}</span>
          <button
            onClick={clearError}
            style={{
              background: "rgba(255,255,255,0.15)", border: "none",
              color: "white", width: 24, height: 24,
              borderRadius: "50%", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, flexShrink: 0,
            }}
          >✕</button>
        </div>
      )}
    </div>
  );
}