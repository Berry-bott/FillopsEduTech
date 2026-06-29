// src/components/tutor-community/Sidebar.jsx
import { useState, useEffect } from "react";
import useTutorCommunityStore from "@/store/tutorCommunityStore";
import { Avatar, Spinner, OnlineBadge } from "./atoms/ChatAtoms";

export default function Sidebar() {
  const {
    groups,
    activeGroupId,
    loadingGroups,
    sidebarOpen,
    currentUser,
    fetchGroups,
    openGroup,
  } = useTutorCommunityStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active"

  useEffect(() => { fetchGroups(); }, []);

  const filtered = groups.filter((g) => {
    const matchSearch = !search
      || g.name?.toLowerCase().includes(search.toLowerCase())
      || g.subject?.subjectName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" && (g.onlineCount || 0) > 0);
    return matchSearch && matchFilter;
  });

  return (
    <aside
      className="flex-shrink-0 h-full overflow-hidden transition-all duration-300
        bg-white dark:bg-slate-950
        border-r border-slate-200 dark:border-slate-800"
      style={{ width: sidebarOpen ? 280 : 0 }}
    >
      {/* Inner fixed-width wrapper — content clips when sidebar collapses */}
      <div className="w-[280px] h-full flex flex-col min-h-0">

        {/* ── Header (fixed, no scroll) ────────────────────────── */}
        <div className="flex-shrink-0 px-4 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800/70">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-lg shadow-lg shadow-amber-500/25">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                Tutor Community
              </h1>
              <p className="text-[11px] text-slate-400 leading-tight">Subject groups & discussions</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups or subjects…"
              className="w-full pl-9 pr-3 py-2
                bg-slate-100 dark:bg-slate-800/60
                border border-slate-200 dark:border-slate-700/60
                rounded-xl text-sm
                text-slate-700 dark:text-slate-200
                placeholder-slate-400 dark:placeholder-slate-500
                outline-none
                focus:border-amber-400 dark:focus:border-amber-500/60
                focus:bg-white dark:focus:bg-slate-800
                transition-all"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-1.5">
            {[["all", "All Groups"], ["active", "Active Now"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === val
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                    : "bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Section label (fixed) ────────────────────────────── */}
        <div className="flex-shrink-0 px-4 pt-3 pb-1.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Groups
          </span>
          {filtered.length > 0 && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-full px-2 py-0.5">
              {filtered.length}
            </span>
          )}
        </div>

        {/* ── Groups list — SCROLLABLE ─────────────────────────── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-2 pb-2"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(245,158,11,0.2) transparent" }}
        >
          {loadingGroups ? (
            <div className="flex flex-col items-center justify-center pt-12 gap-3">
              <Spinner size="md" />
              <p className="text-sm text-slate-400">Loading groups…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center pt-10 px-4">
              <div className="text-3xl opacity-30 mb-2">🔍</div>
              <p className="text-slate-400 dark:text-slate-600 text-sm">
                {search ? "No groups match your search" : "No groups available"}
              </p>
            </div>
          ) : (
            filtered.map((group) => {
              const isActive     = activeGroupId === group.id;
              const hasActivity  = (group.onlineCount || 0) > 0;

              return (
                <button
                  key={group.id}
                  onClick={() => openGroup(group.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
                    transition-all duration-150 cursor-pointer border group ${
                    isActive
                      ? "bg-amber-50 dark:bg-amber-500/10 border-amber-300 dark:border-amber-500/30 shadow-sm shadow-amber-500/10"
                      : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700/50"
                  }`}
                >
                  {/* Group icon */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg text-white flex-shrink-0 transition-all ${isActive ? "shadow-md" : "shadow-sm"}`}
                    style={{
                      background: group.subject?.color || "#f59e0b",
                      boxShadow: isActive ? `0 4px 12px ${group.subject?.color || "#f59e0b"}40` : undefined,
                    }}
                  >
                    {group.iconUrl
                      ? <img src={group.iconUrl} alt="" className="w-full h-full rounded-xl object-cover" />
                      : "📚"
                    }
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-sm font-semibold truncate leading-tight ${
                        isActive
                          ? "text-amber-700 dark:text-amber-300"
                          : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}>
                        {group.name}
                      </span>
                    </div>

                    {/* Subject badge */}
                    {group.subject?.subjectName && (
                      <span className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md
                        bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-0.5">
                        {group.subject.subjectName}
                      </span>
                    )}

                    {/* Last message */}
                    <div className="text-xs truncate leading-tight text-slate-400 dark:text-slate-500">
                      {group.lastMessage
                        ? group.lastMessage.content.slice(0, 32) + (group.lastMessage.content.length > 32 ? "…" : "")
                        : "No messages yet"
                      }
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    {hasActivity && <OnlineBadge count={group.onlineCount} />}
                    {group.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {group.unreadCount > 9 ? "9+" : group.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* ── Current user footer (fixed) ──────────────────────── */}
        {currentUser && (
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3
            border-t border-slate-200 dark:border-slate-800
            bg-amber-50/60 dark:bg-slate-950/80 backdrop-blur-sm">
            <Avatar name={currentUser.name || "Tutor"} size={36} type={currentUser.type || "TUTOR"} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate leading-tight text-slate-800 dark:text-slate-200">
                {currentUser.name || "Tutor"}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                {currentUser.type === "TUTOR" && (
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 ml-1">· Tutor</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}