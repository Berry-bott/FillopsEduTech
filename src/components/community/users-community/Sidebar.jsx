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

  const filtered = groups.filter((g) =>
    !search ||
    g.name?.toLowerCase().includes(search.toLowerCase()) ||
    g.subject?.subjectName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside style={{
      width: sidebarOpen ? 280 : 0,
      background: "#0a0f1e",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      transition: "width 0.3s ease",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      <div style={{ width: 280, height: "100%", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🌐</div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#c084fc" }}>
              Community
            </h1>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search groups..."
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "9px 12px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, color: "white",
              fontSize: 13, outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "rgba(99,102,241,0.6)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
        </div>

        {/* Groups */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
          {loadingGroups ? (
            <div style={{ textAlign: "center", padding: 48 }}>
              <Spinner size={32} />
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "#475569", fontSize: 13 }}>
              {search ? "No groups found" : "No groups available"}
            </div>
          ) : (
            filtered.map((group) => {
              const isActive = activeGroupId === group.id;
              return (
                <div
                  key={group.id}
                  onClick={() => openGroup(group.id)}
                  style={{
                    padding: "10px 12px", margin: "3px 0",
                    borderRadius: 12,
                    background: isActive
                      ? "rgba(99,102,241,0.18)"
                      : "transparent",
                    borderLeft: isActive
                      ? "3px solid #6366f1"
                      : "3px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: group.subject?.color || "#6366f1",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, color: "white",
                      boxShadow: isActive ? "0 4px 12px rgba(99,102,241,0.35)" : "none",
                    }}>
                      {group.iconUrl
                        ? <img src={group.iconUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: 12 }} />
                        : "📚"
                      }
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, fontSize: 14,
                        color: isActive ? "#c4b5fd" : "#e2e8f0",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {group.name}
                      </div>
                      <div style={{
                        fontSize: 12, color: "#64748b", marginTop: 2,
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {group.lastMessage
                          ? group.lastMessage.content.slice(0, 35) +
                            (group.lastMessage.content.length > 35 ? "…" : "")
                          : group.subject?.subjectName || "No messages yet"}
                      </div>
                    </div>

                    {(group.onlineCount > 0) && (
                      <OnlineBadge count={group.onlineCount} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* User footer */}
        {currentUser && (
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(0,0,0,0.2)",
          }}>
            <Avatar name={currentUser.name || "You"} size={36} type={currentUser.type} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: 600, fontSize: 13, color: "#e2e8f0",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                {currentUser.name || "You"}
              </div>
              <div style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                Online
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}