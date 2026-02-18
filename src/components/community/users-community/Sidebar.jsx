// src/components/community/Sidebar.jsx
import { useState, useEffect } from "react";
import useCommunityStore from "@/store/userCommunityStore";
import { Avatar, Spinner, OnlineBadge } from "./ChatAtoms";

export default function Sidebar() {
  const {
    groups,
    activeGroupId,
    loadingGroups,
    sidebarOpen,
    currentUser,
    fetchGroups,
    openGroup,
  } = useCommunityStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const filtered = groups.filter(
    (g) =>
      !search ||
      g.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.subject?.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      style={{
        width: sidebarOpen ? 280 : 0,
        background: "#0f172a",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        transition: "width 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ width: 280, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "16px" }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#c084fc" }}>Community</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups..."
            style={{
              width: "100%",
              marginTop: 12,
              padding: "10px 12px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "white",
              outline: "none",
            }}
          />
        </div>

        {/* Groups list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {loadingGroups ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <Spinner size={32} />
            </div>
          ) : (
            filtered.map((group) => (
              <div
                key={group.id}
                onClick={() => openGroup(group.id)}
                style={{
                  padding: "12px",
                  margin: "4px 0",
                  borderRadius: 10,
                  background: activeGroupId === group.id ? "rgba(99,102,241,0.15)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: group.subject?.color || "#6366f1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      color: "white",
                    }}
                  >
                    {group.iconUrl ? <img src={group.iconUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: 12 }} /> : "G"}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{group.name}</div>
                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                      {group.lastMessage
                        ? group.lastMessage.content.slice(0, 30) + (group.lastMessage.content.length > 30 ? "..." : "")
                        : "No messages yet"}
                    </div>
                  </div>

                  <OnlineBadge count={group.onlineCount || 0} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* User footer */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar name={currentUser?.name || "You"} size={36} type={currentUser?.type} />
          <div>
            <div style={{ fontWeight: 600 }}>{currentUser?.name || "You"}</div>
            <div style={{ fontSize: 12, color: "#10b981" }}>● Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}