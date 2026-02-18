// src/components/community/ChatPanel.jsx
import { useRef, useEffect, useState } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { Avatar, TypingDots, Spinner, OnlineBadge } from "./ChatAtoms";

export default function ChatPanel() {
  const {
    activeGroupId,
    activeGroup,
    messages,
    typingUsers,
    onlineCounts,
    currentUser,
    loadingMessages,
    loadOlderMessages,
    loadingOlder,
  } = useCommunityStore();

  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const msgs = messages[activeGroupId] || [];
  const typerNames = typingUsers[activeGroupId]
    ? Array.from(typingUsers[activeGroupId].values())
    : [];
  const online = onlineCounts[activeGroupId] ?? activeGroup?.onlineCount ?? 0;

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [msgs.length, autoScroll]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop === 0) loadOlderMessages();
    setAutoScroll(scrollHeight - scrollTop - clientHeight < 120);
  };

  if (!activeGroupId) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        justifyContent: "center", color: "#64748b",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 80, opacity: 0.2, marginBottom: 16 }}>💬</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 22, color: "#cbd5e1" }}>Select a group</h2>
          <p style={{ margin: 0, fontSize: 14 }}>Choose a community to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{
        padding: "12px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(15,23,42,0.95)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: activeGroup?.subject?.color || "#6366f1",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "white", flexShrink: 0,
            boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
          }}>
            {activeGroup?.iconUrl
              ? <img src={activeGroup.iconUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: 12 }} />
              : "💬"
            }
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>
              {activeGroup?.name || "Loading..."}
            </h2>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
              {activeGroup?.subject?.subjectName || "Community Group"}
            </p>
          </div>
        </div>

        <OnlineBadge count={online} />
      </div>

      {/* Load older indicator */}
      {loadingOlder && (
        <div style={{ textAlign: "center", padding: "8px", background: "rgba(99,102,241,0.05)" }}>
          <Spinner size={20} />
        </div>
      )}

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          flex: 1, overflowY: "auto", padding: "16px 20px",
          display: "flex", flexDirection: "column",
          background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
        }}
      >
        {loadingMessages && msgs.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <Spinner size={48} />
              <p style={{ color: "#64748b", marginTop: 16 }}>Loading messages...</p>
            </div>
          </div>
        ) : msgs.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <div style={{ fontSize: 48, opacity: 0.3, marginBottom: 16 }}>✉️</div>
              <p style={{ margin: 0 }}>No messages yet — be the first!</p>
            </div>
          </div>
        ) : (
          msgs.map((msg, i) => {
            const prevMsg = msgs[i - 1];
            const showAvatar = !prevMsg || prevMsg.sender?.id !== msg.sender?.id;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.sender?.id === currentUser?.id}
                showAvatar={showAvatar}
              />
            );
          })
        )}

        {/* Typing indicator */}
        {typerNames.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0 8px" }}>
            <TypingDots />
            <span style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>
              {typerNames.length === 1
                ? `${typerNames[0]} is typing...`
                : `${typerNames.join(", ")} are typing...`}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput groupId={activeGroupId} />
    </div>
  );
}