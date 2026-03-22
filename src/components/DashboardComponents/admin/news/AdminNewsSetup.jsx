import { useEffect, useState, useCallback } from "react";
import useNewsStore from "@/store/adminNewsStore";
import RichEditor from "@/components/ui/richeditor";
import ArticleTableRow from "./ArticleTablerow";
import PreviewFeed from "./PreviewFeed";
import Logo from "@/assets/images/fillopsLogo.png";
import {
  AUDIENCE_OPTIONS, AUDIENCE_LABEL,
  EMPTY_FORM, stripHtml, wc, rt, cleanContent,
} from "./NewsUtils";



// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${
      toast.type === "error"
        ? "bg-white border-red-200 text-red-700 shadow-red-100"
        : "bg-white border-emerald-200 text-emerald-700 shadow-emerald-100"
    }`} style={{ animation: "slideUp .3s ease" }}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
        toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
      }`}>
        {toast.type === "error" ? "✕" : "✓"}
      </div>
      {toast.msg}
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ open, onConfirm, onCancel, isSubmitting }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[998] bg-black/20 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl border border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1.5">Delete this article?</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          This action is permanent and cannot be undone. The article will be removed immediately.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50">
            {isSubmitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminNewsPage() {
  const {
    newsList, isLoading, isSubmitting,
    filters, fetchNews, createNews, updateNews, deleteNews,
  } = useNewsStore();

  const [tab,             setTab]             = useState("write");
  const [form,            setForm]            = useState(EMPTY_FORM);
  const [editingId,       setEditingId]       = useState(null);
  const [search,          setSearch]          = useState("");
  const [toast,           setToast]           = useState(null);
  const [confirmId,       setConfirmId]       = useState(null);
  const [statusFilter,    setStatusFilter]    = useState("all");
  const [audienceFilter,  setAudienceFilter]  = useState("all");
  const [previewAudience, setPreviewAudience] = useState("all");

  useEffect(() => { fetchNews(); }, [filters]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const field = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const reset = () => { setForm(EMPTY_FORM); setEditingId(null); };

  const doEdit = n => {
    setForm({
      title:          n.title          || "",
      content:        n.content        || "",
      targetAudience: n.targetAudience || "ALL",
      coverImage:     n.coverImage     || "",
      publishNow:     n.isPublished    || false,
    });
    setEditingId(n.id);
    setTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doSubmit = async () => {
    if (!form.title.trim())              { showToast("Title is required.", "error"); return; }
    if (!stripHtml(form.content).trim()) { showToast("Content cannot be empty.", "error"); return; }
    const content = cleanContent(form.content);
    let result;
    if (editingId) {
      result = await updateNews(editingId, {
        title: form.title, content, targetAudience: form.targetAudience,
        coverImage: form.coverImage || undefined, isPublished: form.publishNow,
      });
      if (result) { showToast("Article updated!"); reset(); }
      else showToast("Failed to update.", "error");
    } else {
      result = await createNews({
        title: form.title, content, targetAudience: form.targetAudience,
        coverImage: form.coverImage || undefined, publishNow: form.publishNow,
      });
      if (result) { showToast(form.publishNow ? "Article published!" : "Draft saved!"); reset(); }
      else showToast("Failed to create article.", "error");
    }
  };

  const doToggle = async n => {
    const r = await updateNews(n.id, { isPublished: !n.isPublished });
    if (r) showToast(r.isPublished ? "Article is now live!" : "Moved to drafts.");
    else   showToast("Failed.", "error");
  };

  const doDelete = async () => {
    const ok = await deleteNews(confirmId);
    setConfirmId(null);
    if (ok) showToast("Article deleted.");
    else    showToast("Delete failed.", "error");
  };

  const filtered = (newsList || []).filter(n => {
    if (statusFilter   === "live"  && !n.isPublished) return false;
    if (statusFilter   === "draft" &&  n.isPublished) return false;
    if (audienceFilter !== "all"   && n.targetAudience !== audienceFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) &&
        !stripHtml(n.content).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:  (newsList || []).length,
    live:   (newsList || []).filter(n => n.isPublished).length,
    drafts: (newsList || []).filter(n => !n.isPublished).length,
  };

  const wordsTyped = wc(form.content);
  const readMins   = rt(form.content);

  const TABS = [
    { key: "write",   label: "Write",   badge: editingId ? "Editing" : "New" },
    { key: "manage",  label: "Manage",  badge: String(filtered.length) },
    { key: "preview", label: "Preview", badge: `${stats.live} live` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <Toast toast={toast} />
      <ConfirmModal open={!!confirmId} onConfirm={doDelete} onCancel={() => setConfirmId(null)} isSubmitting={isSubmitting} />

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 mr-auto">
            <div>
              <img src={Logo} alt="FillOps Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900 leading-none">FillOps News</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Editorial Dashboard</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Total",  val: stats.total,  color: "text-slate-700",   bg: "bg-slate-100"  },
              { label: "Live",   val: stats.live,   color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Drafts", val: stats.drafts, color: "text-amber-700",   bg: "bg-amber-50"   },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${s.bg}`}>
                <span className={`text-sm font-bold tabular-nums ${s.color}`}>{s.val}</span>
                <span className="text-[11px] text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ══ TAB BAR ════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-0">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-150 ${
                tab === t.key ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}>
              {t.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                tab === t.key ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"
              }`}>
                {t.badge}
              </span>
              {tab === t.key && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />}
              {t.key === "write" && editingId && <span className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* ══ WRITE TAB ══════════════════════════════════════════════════════════ */}
      {tab === "write" && (
        <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
          <div className="space-y-6">

            {editingId && (
              <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2.5 text-amber-700 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Editing existing article
                </div>
                <button onClick={reset} className="text-xs text-amber-600 hover:text-amber-800 font-semibold transition-colors underline underline-offset-2">Discard</button>
              </div>
            )}

            {/* Audience */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Audience</label>
              <div className="grid grid-cols-3 gap-3">
                {AUDIENCE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => field("targetAudience", opt.value)}
                    className={`relative flex flex-col items-center gap-2.5 px-3 py-5 rounded-xl border text-xs font-semibold transition-all ${
                      form.targetAudience === opt.value
                        ? "bg-blue-50 border-blue-300 text-blue-700 shadow-sm shadow-blue-100"
                        : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                    }`}>
                    {form.targetAudience === opt.value && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500" />}
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="text-center leading-tight">
                      <p className="font-bold">{opt.label}</p>
                      <p className={`text-[10px] mt-0.5 ${form.targetAudience === opt.value ? "text-blue-500" : "text-slate-400"}`}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Headline <span className="text-blue-500">*</span></label>
                <span className="text-[10px] text-slate-400 font-mono tabular-nums">{form.title.length}/200</span>
              </div>
              <input type="text" value={form.title} maxLength={200} onChange={e => field("title", e.target.value)}
                placeholder="Write a compelling headline…"
                className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 focus:border-blue-500 text-xl font-serif text-slate-900 placeholder-slate-300 focus:outline-none transition-colors bg-transparent" />
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Content <span className="text-blue-500">*</span></label>
                <span className="text-[10px] text-slate-400">{wordsTyped} words · {readMins} min read</span>
              </div>
              <RichEditor value={form.content} onChange={v => field("content", v)}
                placeholder="Start writing your article… Use the toolbar above to format text, add headings, lists, and links." />
            </div>

            {/* Publish toggle */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  form.publishNow ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
                }`}>
                  {form.publishNow
                    ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /></svg>
                    : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{form.publishNow ? "Publish immediately" : "Save as draft"}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{form.publishNow ? "Goes live the moment you submit" : "Only visible to admins until published"}</p>
                </div>
              </div>
              <button onClick={() => field("publishNow", !form.publishNow)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.publishNow ? "bg-emerald-500" : "bg-slate-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${form.publishNow ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              {editingId && (
                <button onClick={reset}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-sm font-semibold transition-all bg-white">
                  Cancel
                </button>
              )}
              <button onClick={doSubmit} disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>
                  : editingId       ? "Save Changes"
                  : form.publishNow ? "Publish Article"
                  : "Save as Draft"
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MANAGE TAB ════════════════════════════════════════════════════════ */}
      {tab === "manage" && (
        <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">✕</button>}
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {[{ label: "All", val: "all" }, { label: "Live", val: "live" }, { label: "Drafts", val: "draft" }].map(opt => (
                <button key={opt.val} onClick={() => setStatusFilter(opt.val)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === opt.val ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {[{ label: "All", val: "all" }, { label: "🎓", val: "USERS_ONLY" }, { label: "👨‍🏫", val: "TUTORS_ONLY" }, { label: "🌍", val: "ALL" }].map(opt => (
                <button key={opt.val} onClick={() => setAudienceFilter(opt.val)}
                  title={opt.val === "all" ? "All audiences" : AUDIENCE_LABEL[opt.val]}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${audienceFilter === opt.val ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
                  {opt.label}
                </button>
              ))}
            </div>

            <button onClick={fetchNews}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 text-xs font-semibold shadow-sm transition-all ml-auto">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                <span className="text-sm">Loading articles…</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p className="text-sm font-medium">No articles found</p>
                <button onClick={() => { setSearch(""); setStatusFilter("all"); setAudienceFilter("all"); }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">Clear filters</button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pl-6 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider w-10">#</th>
                    <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Article</th>
                    <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audience</th>
                    <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="py-3.5 pr-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Read</th>
                    <th className="py-3.5 pr-6 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((n, i) => (
                    <ArticleTableRow key={n.id} news={n} index={i}
                      onEdit={doEdit}
                      onDelete={id => setConfirmId(id)}
                      onTogglePublish={doToggle}
                      isSubmitting={isSubmitting}
                    />
                  ))}
                </tbody>
              </table>
            )}
            {!isLoading && filtered.length > 0 && (
              <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of{" "}
                  <span className="font-semibold text-slate-600">{stats.total}</span> articles
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />{stats.live} live</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" />{stats.drafts} drafts</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ PREVIEW TAB ════════════════════════════════════════════════════════ */}
      {tab === "preview" && (
        <div className="flex-1 bg-white">
          <div className="border-b border-slate-100 bg-white sticky top-[calc(4rem+3rem)] z-30">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-0.5">
                {[
                  { label: "All",      val: "all"         },
                  { label: "Everyone", val: "ALL"         },
                  { label: "Students", val: "USERS_ONLY"  },
                  { label: "Tutors",   val: "TUTORS_ONLY" },
                ].map(opt => (
                  <button key={opt.val} onClick={() => setPreviewAudience(opt.val)}
                    className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                      previewAudience === opt.val
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                    {opt.label}
                    <span className={`ml-1.5 text-[10px] font-bold tabular-nums ${previewAudience === opt.val ? "text-white/70" : "text-slate-400"}`}>
                      {opt.val === "all"
                        ? (newsList || []).filter(n => n.isPublished).length
                        : (newsList || []).filter(n => n.isPublished && n.targetAudience === opt.val).length}
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={fetchNews} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-10">
            {isLoading ? (
              <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
                <p className="text-sm">Loading…</p>
              </div>
            ) : (() => {
              const published = (newsList || []).filter(n => n.isPublished);
              const feed = previewAudience === "all"
                ? published
                : published.filter(n => n.targetAudience === previewAudience);
              return <PreviewFeed articles={feed} />;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}