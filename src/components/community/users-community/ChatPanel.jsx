// src/components/community/ChatPanel.jsx
import { useRef, useEffect, useState } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import MessageBubble from "./MessageBubble";
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
  } = useCommunityStore();

  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const msgs = messages[activeGroupId] || [];
  const typerNames = typingUsers[activeGroupId] ? Array.from(typingUsers[activeGroupId].values()) : [];
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
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 80, opacity: 0.3 }}>💬</div>
          <h2 style={{ margin: "16px 0 8px" }}>Select a group</h2>
          <p>Start chatting in a community</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: activeGroup?.subject?.color || "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "white",
            }}
          >
            {activeGroup?.iconUrl ? <img src={activeGroup.iconUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: 12 }} /> : "G"}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{activeGroup?.name}</h2>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>
              {activeGroup?.subject?.subjectName || "Community"}
            </p>
          </div>
        </div>

        <OnlineBadge count={online} />
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column" }}
      >
        {loadingMessages && msgs.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Spinner size={48} />
          </div>
        ) : msgs.length === 0 ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 60, opacity: 0.3 }}>No messages yet</div>
              <p>Be the first to write something</p>
            </div>
          </div>
        ) : (
          msgs.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender?.id === currentUser?.id}
              showAvatar={true} // you can optimize later
            />
          ))
        )}

        {/* Typing */}
        {typerNames.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <TypingDots />
            <span style={{ color: "#94a3b8", fontSize: 13 }}>
              {typerNames.length === 1 ? `${typerNames[0]} is typing...` : "People are typing..."}
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