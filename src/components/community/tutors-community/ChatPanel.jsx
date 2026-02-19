// src/components/tutor-community/ChatPanel.jsx
import { useRef, useEffect, useState, useCallback } from "react";
import useTutorCommunityStore from "@/store/tutorCommunityStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { TypingDots, Spinner, OnlineBadge } from "./atoms/ChatAtoms";

export default function ChatPanel() {
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
  } = useTutorCommunityStore();

  const [autoScroll, setAutoScroll]   = useState(true);
  const messagesEndRef                = useRef(null);
  const scrollContainerRef            = useRef(null);

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
    setTimeout(() => scrollToBottom("instant"), 50);
  }, [activeGroupId]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollTop < 80) loadOlderMessages();
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 150);
  }, [loadOlderMessages]);

  // ── Empty state ────────────────────────────────────────────────────
  if (!activeGroupId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-amber-50/40 dark:bg-slate-950">
        <div className="text-center select-none px-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl mx-auto mb-5 shadow-xl shadow-amber-500/25">
            👨‍🏫
          </div>
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
            Tutor Community
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Select a group from the sidebar to start chatting with tutors and students
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3
        bg-white/95 dark:bg-slate-950/95 backdrop-blur
        border-b border-slate-200 dark:border-slate-800 z-10">

        <div className="flex items-center gap-3">
          {/* Group icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white flex-shrink-0 shadow"
            style={{ background: activeGroup?.subject?.color || "#f59e0b" }}
          >
            {activeGroup?.iconUrl
              ? <img src={activeGroup.iconUrl} alt="" className="w-full h-full rounded-xl object-cover" />
              : "📖"
            }
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {activeGroup?.name || "Loading…"}
              </h2>
              {/* Subject chip */}
              {activeGroup?.subject?.subjectName && (
                <span className="hidden sm:inline text-[10px] font-semibold px-2 py-0.5 rounded-full
                  bg-amber-100 dark:bg-amber-900/30
                  text-amber-700 dark:text-amber-400
                  border border-amber-200 dark:border-amber-700/40">
                  {activeGroup.subject.subjectName}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-tight mt-0.5">
              {activeGroup?.description || "Tutor community group"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <OnlineBadge count={online} />
        </div>
      </div>

      {/* ── Load older indicator ─────────────────────────────────── */}
      {loadingOlder && (
        <div className="flex-shrink-0 flex justify-center py-2 bg-amber-50/50 dark:bg-slate-950/50">
          <Spinner size="sm" />
        </div>
      )}

      {/* ── Messages scroll container ────────────────────────────── */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 flex flex-col
          bg-white dark:bg-slate-900/50"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(245,158,11,0.2) transparent" }}
      >
        {loadingMessages && msgs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <Spinner size="lg" />
            <p className="text-slate-400 text-sm">Loading messages…</p>
          </div>
        ) : msgs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div className="text-5xl opacity-20">✉️</div>
            <p className="text-slate-400 text-sm">No messages yet — start the conversation!</p>
          </div>
        ) : (
          <>
            {/* Spacer: pushes messages toward the bottom on short lists */}
            <div className="flex-1" />

            {/* Date separator helper */}
            {msgs.map((msg, i) => {
              const prevMsg    = msgs[i - 1];
              const showAvatar = !prevMsg || prevMsg.sender?.id !== msg.sender?.id;

              // Show date separator when day changes
              const msgDate  = new Date(msg.createdAt).toDateString();
              const prevDate = prevMsg ? new Date(prevMsg.createdAt).toDateString() : null;
              const showDate = !prevDate || msgDate !== prevDate;

              return (
                <div key={msg.id || i}>
                  {showDate && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString([], {
                          weekday: "short", month: "short", day: "numeric",
                        })}
                      </span>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isOwn={msg.sender?.id === currentUser?.id}
                    showAvatar={showAvatar}
                  />
                </div>
              );
            })}
          </>
        )}

        {/* Typing indicator */}
        {typerNames.length > 0 && (
          <div className="flex items-center gap-2.5 py-2 pl-10">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2 shadow-sm">
              <TypingDots />
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                {typerNames.length === 1
                  ? `${typerNames[0]} is typing`
                  : `${typerNames.slice(0, 2).join(", ")} are typing`}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-px shrink-0" />
      </div>

      {/* ── Jump to latest ───────────────────────────────────────── */}
      {!autoScroll && (
        <div className="flex-shrink-0 flex justify-center -mt-10 mb-1.5 relative z-10 pointer-events-none">
          <button
            onClick={() => { setAutoScroll(true); scrollToBottom("smooth"); }}
            className="pointer-events-auto bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Jump to latest
          </button>
        </div>
      )}

      {/* ── Input ────────────────────────────────────────────────── */}
      <ChatInput />
    </div>
  );
}