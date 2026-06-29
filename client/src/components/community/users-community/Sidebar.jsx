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
    /**
     * SIDEBAR SCROLL FIX:
     * The aside clips to 0 width when closed. The inner div is always 272px wide.
     * The inner div is flex-col h-full — header and footer are flex-shrink-0,
     * and the groups list is flex-1 overflow-y-auto min-h-0, making it the
     * only section that scrolls.
     */
    <aside
      className="flex-shrink-0 h-full overflow-hidden transition-all duration-300
        bg-white dark:bg-slate-950
        border-r border-slate-200 dark:border-slate-800"
      style={{ width: sidebarOpen ? 272 : 0 }}
    >
      {/* Fixed-width inner — always 272px so content clips cleanly on collapse */}
      <div className="w-[272px] h-full flex flex-col min-h-0">

        {/* ── Brand + Search (fixed, never scrolls) ─────────────── */}
        <div className="flex-shrink-0 px-4 pt-5 pb-3 border-b border-slate-200 dark:border-slate-800/70">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-base shadow-lg shadow-indigo-500/20">
              🌐
            </div>
            <h1 className="text-lg font-extrabold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
              Community
            </h1>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups…"
              className="w-full pl-9 pr-3 py-2
                bg-slate-100 dark:bg-slate-800/60
                border border-slate-200 dark:border-slate-700/60
                rounded-xl text-sm
                text-slate-700 dark:text-slate-200
                placeholder-slate-400 dark:placeholder-slate-500
                outline-none focus:border-indigo-400 dark:focus:border-indigo-500/60
                focus:bg-white dark:focus:bg-slate-800
                transition-all"
            />
          </div>
        </div>

        {/* ── Section label (fixed) ─────────────────────────────── */}
        <div className="flex-shrink-0 px-4 pt-3 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
            Groups {filtered.length > 0 && `· ${filtered.length}`}
          </span>
        </div>

        {/* ── Groups list — THIS IS THE SCROLLABLE SECTION ──────── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-2 pb-2"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(148,163,184,0.25) transparent" }}
        >
          {loadingGroups ? (
            <div className="flex justify-center pt-12">
              <Spinner size="md" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center pt-10 text-slate-400 dark:text-slate-600 text-sm">
              {search ? "No groups found" : "No groups available"}
            </div>
          ) : (
            filtered.map((group) => {
              const isActive = activeGroupId === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => openGroup(group.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
                    transition-all duration-150 cursor-pointer border group
                    ${isActive
                      ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-200 dark:hover:border-slate-700/50"
                    }`}
                >
                  {/* Group icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg text-white flex-shrink-0 transition-all ${isActive ? "shadow-md" : "shadow-sm"}`}
                    style={{
                      background: group.subject?.color || "#6366f1",
                      boxShadow: isActive ? `0 4px 12px ${group.subject?.color || "#6366f1"}40` : undefined,
                    }}
                  >
                    {group.iconUrl
                      ? <img src={group.iconUrl} alt="" className="w-full h-full rounded-xl object-cover" />
                      : "📚"
                    }
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate leading-tight
                      ${isActive
                        ? "text-indigo-600 dark:text-indigo-300"
                        : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
                      }`}
                    >
                      {group.name}
                    </div>
                    <div className="text-xs truncate mt-0.5 leading-tight text-slate-400 dark:text-slate-500">
                      {group.lastMessage
                        ? group.lastMessage.content.slice(0, 34) + (group.lastMessage.content.length > 34 ? "…" : "")
                        : group.subject?.subjectName || "No messages yet"
                      }
                    </div>
                  </div>

                  {/* Online badge */}
                  {group.onlineCount > 0 && (
                    <OnlineBadge count={group.onlineCount} />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* ── User footer (fixed, never scrolls) ───────────────── */}
        {currentUser && (
          <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3
            border-t border-slate-200 dark:border-slate-800
            bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
            <Avatar name={currentUser.name || "You"} size={34} type={currentUser.type} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate leading-tight text-slate-800 dark:text-slate-200">
                {currentUser.name || "You"}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </aside>
  );
}