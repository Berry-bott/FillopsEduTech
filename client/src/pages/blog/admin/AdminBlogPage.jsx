
// ── 1. Add this import at the top ────────────────────────────────────────────
import useAdminAuthStore from "@/store/adminAuthStore";

// ── Full updated AdminBlogPage for reference ─────────────────────────────────
import { useEffect, useState, useCallback } from "react";
import useBlogStore from "@/store/adminBlogStore";
import { EMPTY_BLOG_FORM, stripHtml, cleanContent } from "@/components/DashboardComponents/admin/blog/admin/BlogUtils";
import BlogWriteTab   from "@/components/DashboardComponents/admin/blog/admin/BlogWriteTab";
import BlogManageTab  from "@/components/DashboardComponents/admin/blog/admin/BlogManageTab";
import BlogPreviewTab from "@/components/DashboardComponents/admin/blog/admin/BlogPreviewTab";
import Logo from "@/assets/images/fillopsLogo.png";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${
        toast.type === "error"
          ? "bg-white border-red-200 text-red-700 shadow-red-100"
          : "bg-white border-emerald-200 text-emerald-700 shadow-emerald-100"
      }`}
      style={{ animation: "slideUp .3s ease" }}
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
        toast.type === "error" ? "bg-red-500" : "bg-emerald-500"
      }`}>
        {toast.type === "error" ? "✕" : "✓"}
      </div>
      {toast.msg}
    </div>
  );
}

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
        <h3 className="text-base font-bold text-slate-900 mb-1.5">Delete this post?</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          This action is permanent and cannot be undone. The post will be removed immediately.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={onConfirm} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-all disabled:opacity-50">
            {isSubmitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminBlogPage() {
  const {
    blogList, isLoading, isSubmitting,
    fetchAdminBlogs, createBlog, updateBlog, deleteBlog,
  } = useBlogStore();

  // ── NEW: token getter for image uploads ──────────────────────────────────
  const getToken = () => useAdminAuthStore.getState().accessToken;

  const [tab,       setTab]       = useState("write");
  const [form,      setForm]      = useState(EMPTY_BLOG_FORM);
  const [editingId, setEditingId] = useState(null);
  const [toast,     setToast]     = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => { fetchAdminBlogs(); }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const field = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const reset = () => { setForm(EMPTY_BLOG_FORM); setEditingId(null); };

  const stats = {
    total:  (blogList || []).length,
    live:   (blogList || []).filter(b => b.isPublished).length,
    drafts: (blogList || []).filter(b => !b.isPublished).length,
  };

  const allCategories = [...new Set((blogList || []).map(b => b.category).filter(Boolean))];

  const TABS = [
    { key: "write",   label: "Write",   badge: editingId ? "Editing" : "New" },
    { key: "manage",  label: "Manage",  badge: String(stats.total)            },
    { key: "preview", label: "Preview", badge: `${stats.live} live`           },
  ];

  const doEdit = b => {
    setForm({
      title:           b.title           || "",
      content:         b.content         || "",
      category:        b.category        || "",
      coverImage:      b.coverImage      || "",
      metaTitle:       b.metaTitle       || "",
      metaDescription: b.metaDescription || "",
      keywords:        b.keywords        || "",
      publishNow:      b.isPublished     || false,
    });
    setEditingId(b.id);
    setTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doSubmit = async () => {
    if (!form.title.trim())              { showToast("Title is required.", "error"); return; }
    if (!stripHtml(form.content).trim()) { showToast("Content cannot be empty.", "error"); return; }

    const payload = {
      title:           form.title,
      content:         cleanContent(form.content),
      category:        form.category        || undefined,
      coverImage:      form.coverImage      || undefined,
      metaTitle:       form.metaTitle       || undefined,
      metaDescription: form.metaDescription || undefined,
      keywords:        form.keywords        || undefined,
    };

    let result;
    if (editingId) {
      result = await updateBlog(editingId, { ...payload, isPublished: form.publishNow });
      if (result) { showToast("Post updated!"); reset(); }
      else showToast("Failed to update.", "error");
    } else {
      result = await createBlog({ ...payload, publishNow: form.publishNow });
      if (result) { showToast(form.publishNow ? "Post published!" : "Draft saved!"); reset(); }
      else showToast("Failed to create post.", "error");
    }
  };

  const doToggle = async b => {
    const r = await updateBlog(b.id, { isPublished: !b.isPublished });
    if (r) showToast(r.isPublished ? "Post is now live!" : "Moved to drafts.");
    else   showToast("Failed.", "error");
  };

  const doDelete = async () => {
    const ok = await deleteBlog(confirmId);
    setConfirmId(null);
    if (ok) showToast("Post deleted.");
    else    showToast("Delete failed.", "error");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <Toast toast={toast} />
      <ConfirmModal open={!!confirmId} onConfirm={doDelete} onCancel={() => setConfirmId(null)} isSubmitting={isSubmitting} />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <div className="flex items-center gap-3 mr-auto">
            <img src={Logo} alt="FillOps Logo" className="w-10 h-10 object-contain" />
            <div>
              <p className="text-[15px] font-bold text-slate-900 leading-none">Fillop</p>
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

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-0">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-150 ${
                tab === t.key ? "text-primary-hover" : "text-slate-500 hover:text-slate-800"
              }`}>
              {t.label}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                tab === t.key ? "bg-violet-100 text-primary-hover" : "bg-slate-100 text-slate-400"
              }`}>{t.badge}</span>
              {tab === t.key && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-hover rounded-full" />}
              {t.key === "write" && editingId && <span className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-amber-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "write" && (
        <BlogWriteTab
          form={form}
          field={field}
          editingId={editingId}
          isSubmitting={isSubmitting}
          onReset={reset}
          onSubmit={doSubmit}
          getToken={getToken}  
        />
      )}

      {tab === "manage" && (
        <BlogManageTab
          blogList={blogList}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          stats={stats}
          allCategories={allCategories}
          onEdit={doEdit}
          onDelete={id => setConfirmId(id)}
          onTogglePublish={doToggle}
          onRefresh={fetchAdminBlogs}
        />
      )}

      {tab === "preview" && (
        <BlogPreviewTab
          blogList={blogList}
          isLoading={isLoading}
          allCategories={allCategories}
          onRefresh={fetchAdminBlogs}
        />
      )}
    </div>
  );
}