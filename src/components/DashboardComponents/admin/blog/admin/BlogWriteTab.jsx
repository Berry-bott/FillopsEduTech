import { useState } from "react";
import RichEditor from "@/components/ui/richeditor";
import { CATEGORY_BADGE, CATEGORY_DOT, wc, rt } from "./BlogUtils";

// ─── SEO Panel ────────────────────────────────────────────────────────────────
function SeoPanel({ form, field }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">SEO &amp; Meta</p>
            <p className="text-xs text-slate-400 mt-0.5">Meta title, description, keywords</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-5">
          {/* Meta Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta Title</label>
              <span className={`text-[10px] font-mono tabular-nums ${form.metaTitle.length > 60 ? "text-red-400" : "text-slate-400"}`}>
                {form.metaTitle.length}/60
              </span>
            </div>
            <input
              type="text"
              value={form.metaTitle}
              maxLength={80}
              onChange={e => field("metaTitle", e.target.value)}
              placeholder="Leave blank to use post title"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50/50"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta Description</label>
              <span className={`text-[10px] font-mono tabular-nums ${form.metaDescription.length > 160 ? "text-red-400" : "text-slate-400"}`}>
                {form.metaDescription.length}/160
              </span>
            </div>
            <textarea
              value={form.metaDescription}
              maxLength={200}
              rows={3}
              onChange={e => field("metaDescription", e.target.value)}
              placeholder="Short description shown in search results…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50/50 resize-none"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Keywords</label>
            <input
              type="text"
              value={form.keywords}
              onChange={e => field("keywords", e.target.value)}
              placeholder="waec 2025, study guide, exam prep…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50/50"
            />
            <p className="text-[10px] text-slate-400">Separate keywords with commas</p>
          </div>

          {/* Google Preview */}
          {(form.title || form.metaTitle || form.metaDescription) && (
            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Search Preview</p>
              <p className="text-[13px] text-blue-700 font-medium leading-snug truncate">
                {form.metaTitle || form.title || "Post Title"}
              </p>
              <p className="text-[11px] text-emerald-700 mt-0.5">fillops.com/blog/…</p>
              <p className="text-[12px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                {form.metaDescription || "No description set — add one above for better SEO."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── BlogWriteTab ─────────────────────────────────────────────────────────────
export default function BlogWriteTab({ form, field, editingId, isSubmitting, onReset, onSubmit }) {
  const wordsTyped = wc(form.content);
  const readMins   = rt(form.content);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
      <div className="space-y-6">

        {/* Editing banner */}
        {editingId && (
          <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2.5 text-amber-700 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editing existing post
            </div>
            <button
              onClick={onReset}
              className="text-xs text-amber-600 hover:text-amber-800 font-semibold transition-colors underline underline-offset-2"
            >
              Discard
            </button>
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Title <span className="text-violet-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono tabular-nums">{form.title.length}/200</span>
          </div>
          <input
            type="text"
            value={form.title}
            maxLength={200}
            onChange={e => field("title", e.target.value)}
            placeholder="Write a compelling post title…"
            className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 focus:border-violet-500 text-xl font-serif text-slate-900 placeholder-slate-300 focus:outline-none transition-colors bg-transparent"
          />
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
          <div className="flex flex-wrap gap-2">
            {["WAEC", "JAMB", "NECO", "GCE", "Study Tips", "News"].map(cat => {
              const badge  = CATEGORY_BADGE[cat] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
              const dot    = CATEGORY_DOT[cat]   ?? "bg-slate-400";
              const active = form.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => field("category", active ? "" : cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active ? `${badge} scale-105 shadow-sm` : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {active && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                  {cat}
                </button>
              );
            })}

            {/* Custom category input */}
            <input
              type="text"
              value={!["WAEC", "JAMB", "NECO", "GCE", "Study Tips", "News", ""].includes(form.category) ? form.category : ""}
              onChange={e => field("category", e.target.value)}
              placeholder="Or type custom…"
              className="px-3 py-1.5 rounded-full border border-dashed border-slate-300 bg-transparent text-xs text-slate-600 placeholder-slate-300 focus:outline-none focus:border-violet-400 w-32 transition-colors"
            />
          </div>
          {form.category && (
            <p className="text-[11px] text-slate-400">
              Category: <span className="font-semibold text-slate-600">{form.category}</span>
              <button
                onClick={() => field("category", "")}
                className="ml-2 text-red-400 hover:text-red-600 transition-colors"
              >
                ✕ clear
              </button>
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cover Image URL</label>
          <div className="flex gap-3 items-start">
            <input
              type="url"
              value={form.coverImage}
              onChange={e => field("coverImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-slate-50/50"
            />
            {form.coverImage && (
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                <img
                  src={form.coverImage}
                  alt="cover preview"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.parentElement.style.opacity = "0.3"; }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Content <span className="text-violet-500">*</span>
            </label>
            <span className="text-[10px] text-slate-400">{wordsTyped} words · {readMins} min read</span>
          </div>
          <RichEditor
            value={form.content}
            onChange={v => field("content", v)}
            placeholder="Start writing your blog post… Use the toolbar to format text, add headings, lists, and links."
          />
        </div>

        {/* SEO Panel */}
        <SeoPanel form={form} field={field} />

        {/* Publish toggle */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              form.publishNow
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {form.publishNow
                ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /></svg>
                : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {form.publishNow ? "Publish immediately" : "Save as draft"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {form.publishNow
                  ? "Goes live the moment you submit"
                  : "Only visible to admins until published"}
              </p>
            </div>
          </div>
          <button
            onClick={() => field("publishNow", !form.publishNow)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.publishNow ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${form.publishNow ? "translate-x-6" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          {editingId && (
            <button
              onClick={onReset}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-sm font-semibold transition-all bg-white"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white text-sm font-bold transition-all shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>
              : editingId       ? "Save Changes"
              : form.publishNow ? "Publish Post"
              : "Save as Draft"
            }
          </button>
        </div>

      </div>
    </div>
  );
}