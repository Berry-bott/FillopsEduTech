// src/components/community/CommunityChat.jsx
import { useEffect, useState } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import useSocket from "@/hooks/useSocket";
import Sidebar from "./Sidebar";
import ChatPanel from "./ChatPanel";

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

  // Apply / remove "dark" class on <html> for Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    /**
     * LAYOUT CONTRACT (must not break):
     *  ┌─ CommunityChat  h-screen flex overflow-hidden ─────────────┐
     *  │  ┌─ Sidebar  h-full flex-shrink-0 ──┐ ┌─ Main  flex-1 ──┐ │
     *  │  │   inner: flex flex-col h-full    │ │  flex flex-col  │ │
     *  │  │   groups: flex-1 overflow-y-auto │ │  overflow-hidden │ │
     *  │  └──────────────────────────────────┘ └─────────────────┘ │
     *  └────────────────────────────────────────────────────────────┘
     */
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
          <button
            onClick={() => setIsDark((d) => !d)}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold
              bg-slate-100 dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-600 dark:text-slate-300
              hover:bg-slate-200 dark:hover:bg-slate-700
              transition-all cursor-pointer select-none"
          >
            {isDark ? (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                Light mode
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                Dark mode
              </>
            )}
          </button>
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