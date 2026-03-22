import { useState } from "react";
import BlogPreviewFeed from "./BlogPreviewFeed";

// ─── BlogPreviewTab ───────────────────────────────────────────────────────────
export default function BlogPreviewTab({ blogList, isLoading, allCategories, onRefresh }) {
  const [previewCategory, setPreviewCategory] = useState("all");

  const published = (blogList || []).filter(b => b.isPublished);
  const feed = previewCategory === "all"
    ? published
    : published.filter(b => b.category === previewCategory);

  return (
    <div className="flex-1 bg-white">

      {/* ── Sub-filter bar ────────────────────────────────────────────────── */}
      <div className="border-b border-slate-100 bg-white sticky top-[calc(4rem+3rem)] z-30">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-0.5 flex-wrap">

            {/* All button */}
            <button
              onClick={() => setPreviewCategory("all")}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                previewCategory === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              All
              <span className={`ml-1.5 text-[10px] font-bold tabular-nums ${previewCategory === "all" ? "text-white/70" : "text-slate-400"}`}>
                {published.length}
              </span>
            </button>

            {/* Per-category buttons — built from live data */}
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setPreviewCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                  previewCategory === cat
                    ? "bg-slate-900 text-white"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[10px] font-bold tabular-nums ${previewCategory === cat ? "text-white/70" : "text-slate-400"}`}>
                  {published.filter(b => b.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* ── Feed ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-violet-500 animate-spin" />
            <p className="text-sm">Loading…</p>
          </div>
        ) : (
          <BlogPreviewFeed blogs={feed} />
        )}
      </div>
    </div>
  );
}