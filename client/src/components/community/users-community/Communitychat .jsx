// src/components/community/CommunityChat.jsx
import { useEffect, useState } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import useSocket from "@/hooks/useSocket";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";
import { ThemeToggle } from "../../DashboardComponents/theme-toggle";

export default function CommunityChat() {
  const { error, clearError, sidebarOpen, setSidebarOpen } = useCommunityStore();

  const [isDark, setIsDark] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true
  );
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useSocket();



  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (

    <div className="flex h-screen overflow-hidden font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* Mobile backdrop overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <div
        className={isMobile
          ? "fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out"
          : "flex-shrink-0 h-full"}
        style={isMobile ? { transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" } : {}}
      >
        <Sidebar />
      </div>

      {/* Main area — flex-1 min-w-0 so it shrinks, overflow-hidden to contain ChatPanel */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar with theme toggle + mobile menu button */}
        <div className="flex-shrink-0 flex items-center justify-end gap-2 px-4 py-2
          bg-white dark:bg-slate-950
          border-b border-slate-200 dark:border-slate-800">

          {/* Mobile menu toggle */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center
                bg-slate-100 dark:bg-slate-800
                border border-slate-200 dark:border-slate-700
                text-slate-600 dark:text-slate-300
                hover:bg-slate-200 dark:hover:bg-slate-700
                transition-colors cursor-pointer text-base mr-auto"
            >
              ☰
            </button>
          )}

          {/* Dark / Light toggle */}
            <ThemeToggle />
        </div>

        {/* Chat panel — takes all remaining vertical space */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <ChatPanel />
        </div>
      </div>

      {/* Error toast */}
      {error && (
        <div className="fixed top-5 right-5 z-[100] flex items-center gap-3
          bg-red-600 dark:bg-red-700 text-white text-sm px-4 py-3 rounded-xl
          shadow-2xl shadow-red-500/30 max-w-xs">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="flex-1">{error}</span>
          <button
            onClick={clearError}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}