// src/components/community/ChatPanel.jsx
import { useRef, useEffect, useState, useCallback } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./Chatinput";
import { TypingDots, Spinner, OnlineBadge } from "./ChatAtoms";

export default function ChatPanel({ isDark }) {
  const {
    activeGroupId,
    activeGroup,
    messages,
    typingUsers,
    onlineCounts,
    currentUser,
    loadingMessages,
    loadingOlder,
    loadOlderMessages,
  } = useCommunityStore();

  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef    = useRef(null);
  const scrollContainerRef = useRef(null);

  const msgs       = messages[activeGroupId] || [];
  const typerNames = typingUsers[activeGroupId]
    ? Array.from(typingUsers[activeGroupId].values()) : [];
  const online     = onlineCounts[activeGroupId] ?? activeGroup?.onlineCount ?? 0;

  const scrollToBottom = useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  useEffect(() => {
    if (autoScroll) scrollToBottom("smooth");
  }, [msgs.length, autoScroll, scrollToBottom]);

  useEffect(() => {
    setAutoScroll(true);
    // tiny delay so DOM updates before scroll
    setTimeout(() => scrollToBottom("instant"), 50);
  }, [activeGroupId]);


  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop < 80) loadOlderMessages();
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 150);
  }, [loadOlderMessages]);

  if (!activeGroupId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center select-none">
          <div className="text-7xl opacity-20 mb-5">💬</div>
          <h2 className="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">Select a group</h2>
          <p className="text-slate-400 text-sm">Choose a community to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white flex-shrink-0 shadow"
            style={{ background: activeGroup?.subject?.color || "#6366f1" }}
          >
            {activeGroup?.iconUrl
              ? <img src={activeGroup.iconUrl} alt="" className="w-full h-full rounded-xl object-cover" />
              : "💬"
            }
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {activeGroup?.name || "Loading…"}
            </h2>
            <p className="text-xs text-slate-400 leading-tight mt-0.5">
              {activeGroup?.subject?.subjectName || "Community Group"}
            </p>
          </div>
        </div>
        <OnlineBadge count={online} />
      </div>

      {/* ── Load older indicator ───────────────────────────────── */}
      {loadingOlder && (
        <div className="flex-shrink-0 flex justify-center py-2 bg-slate-50/80 dark:bg-slate-950/50">
          <Spinner size="sm" />
        </div>
      )}

      {/* ── Message scroll container ───────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col bg-white dark:bg-slate-900/50"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(148,163,184,0.25) transparent" }}
      >
        {loadingMessages && msgs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-slate-400 text-sm">Loading messages…</p>
          </div>
        ) : msgs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="text-5xl opacity-20">✉️</div>
            <p className="text-slate-400 text-sm">No messages yet — be the first!</p>
          </div>
        ) : (
          <>
            {/* Pushes messages to the bottom when list is short */}
            <div className="flex-1" />

            {msgs.map((msg, i) => {
              const prevMsg    = msgs[i - 1];
              const showAvatar = !prevMsg || prevMsg.sender?.id !== msg.sender?.id;
              return (
                <MessageBubble
                  key={msg.id || i}
                  message={msg}
                  isOwn={msg.sender?.id === currentUser?.id}
                  showAvatar={showAvatar}
                />
              );
            })}
          </>
        )}

        {/* Typing indicator */}
        {typerNames.length > 0 && (
          <div className="flex items-center gap-2.5 py-2 pl-10">
            <div className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2 shadow-sm">
              <TypingDots />
              <span className="text-xs text-slate-400 italic">
                {typerNames.length === 1
                  ? `${typerNames[0]} is typing`
                  : `${typerNames.slice(0, 2).join(", ")} are typing`}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-px shrink-0" />
      </div>

      {/* ── Jump to latest button ──────────────────────────────── */}
      {!autoScroll && (
        <div className="flex-shrink-0 flex justify-center -mt-10 mb-1.5 relative z-10 pointer-events-none">
          <button
            onClick={() => { setAutoScroll(true); scrollToBottom("smooth"); }}
            className="pointer-events-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-indigo-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Jump to latest
          </button>
        </div>
      )}

      {/* ── Input ─────────────────────────────────────────────── */}
      <ChatInput />
    </div>
  );
}