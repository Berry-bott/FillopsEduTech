import { useState } from "react";
import BlogTableRow from "./BlogTableRow";

// ─── BlogManageTab ────────────────────────────────────────────────────────────
export default function BlogManageTab({
  blogList,
  isLoading,
  isSubmitting,
  stats,
  allCategories,
  onEdit,
  onDelete,
  onTogglePublish,
  onRefresh,
}) {
  const [search,         setSearch]         = useState("");
  const [statusFilter,   setStatusFilter]   = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const stripHtml = h =>
    (h || "")
      .replace(/(&amp;)+nbsp;/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const filtered = (blogList || []).filter(b => {
    if (statusFilter   === "live"  && !b.isPublished) return false;
    if (statusFilter   === "draft" &&  b.isPublished) return false;
    if (categoryFilter !== "all"   && b.category !== categoryFilter) return false;
    if (search &&
      !b.title.toLowerCase().includes(search.toLowerCase()) &&
      !stripHtml(b.content).toLowerCase().includes(search.toLowerCase())
    ) return false;
    return true;
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">

      {/* ── Filters row ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          {[{ label: "All", val: "all" }, { label: "Live", val: "live" }, { label: "Drafts", val: "draft" }].map(opt => (
            <button
              key={opt.val}
              onClick={() => setStatusFilter(opt.val)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === opt.val ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Category filter — built from live data */}
        {allCategories.length > 0 && (
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex-wrap">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                categoryFilter === "all" ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  categoryFilter === cat ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 text-xs font-semibold shadow-sm transition-all ml-auto"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
            <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
            <span className="text-sm">Loading posts…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
            <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm font-medium">No posts found</p>
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:text-primary font-semibold underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pl-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider w-10">#</th>
                <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Post</th>
                <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Read</th>
                <th className="py-3.5 pr-6 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <BlogTableRow
                  key={b.id}
                  blog={b}
                  index={i}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onTogglePublish={onTogglePublish}
                  isSubmitting={isSubmitting}
                />
              ))}
            </tbody>
          </table>
        )}

        {/* Footer row */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
              <span className="font-semibold text-slate-600">{stats.total}</span> posts
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />{stats.live} live
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300" />{stats.drafts} drafts
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}