
import { useState, useRef } from "react";
import RichEditor from "@/components/ui/richeditor";
import { CATEGORY_BADGE, CATEGORY_DOT, wc, rt } from "./BlogUtils";

const UPLOAD_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin/blogs/upload-image`;

// ─── Core upload helper ───────────────────────────────────────────────────────
async function uploadImage(file, getToken) {
  if (!file.type.startsWith("image/")) throw new Error("Please select an image file.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB.");

  const token = typeof getToken === "function" ? getToken() : null;

  if (!token) {
    // ── Debug helper: open console to see the exact key name in your store ──
    console.error(
      "[BlogWriteTab] getToken() returned:", token,
      "\nIf this is null, check adminAuthStore.js — your token may be stored under" +
      " a different key (e.g. accessToken, adminToken, auth.token, etc.)"
    );
    throw new Error("Not authenticated — please log in again.");
  }

  const formData = new FormData();
  formData.append("image", file);

  // ⚠️ Do NOT set Content-Type header — browser sets multipart boundary automatically
  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.status === 401) throw new Error("Session expired — please log in again.");
  if (res.status === 403) throw new Error("Not authorised to upload images.");
  if (res.status === 404) throw new Error("Upload route not found — check server URL.");
  if (res.status === 413) throw new Error("File too large — try a smaller image.");
  if (!res.ok) {
    let msg = `Upload failed (${res.status})`;
    try { const err = await res.json(); msg = err?.message ?? err?.error ?? msg; } catch {}
    throw new Error(msg);
  }

  const data = await res.json();
  const url =
    data?.url ??
    data?.data?.url ??
    data?.imageUrl ??
    data?.data?.imageUrl ??
    data?.image?.url ??
    data?.filePath ??
    data?.path ??
    data?.data?.filePath ??
    data?.data?.path ??
    null;

  if (!url) {
    console.error("[Image upload] Unexpected response shape:", data);
    throw new Error("Upload succeeded but no URL returned — check server response.");
  }

  return url;
}

// ─── Cover Image Uploader ──────────────────────────────────────────────────────
function CoverImageUploader({ value, onChange, getToken }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const url = await uploadImage(file, getToken);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const onInput = (e) => { handleFile(e.target.files?.[0]); e.target.value = ""; };
  const onDrop  = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInput} />

      {value ? (
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
            <img src={value} alt="cover" className="w-full h-full object-cover"
              onError={(e) => { e.target.parentElement.style.opacity = "0.4"; }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cover image ready
            </p>
            <p className="text-[10px] text-slate-400 truncate mt-0.5 max-w-xs">{value}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all">
              Replace
            </button>
            <button type="button" onClick={() => onChange("")}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Remove">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={`group flex flex-col items-center justify-center gap-3 py-8 rounded-xl border-2 border-dashed transition-all ${
            uploading
              ? "border-primary bg-primary40 cursor-wait"
              : "border-slate-200 hover:border-primary hover:bg-primary20 bg-slate-50/50 cursor-pointer"
          }`}
        >
          {uploading ? (
            <>
              <div className="w-7 h-7 rounded-full border-2 border-primary border-t-primary animate-spin" />
              <p className="text-xs font-semibold text-primary">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary transition-all">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600 group-hover:text-primary transition-colors">
                  Click to upload or drag &amp; drop
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP, GIF — max 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}



// ─── SEO Panel ────────────────────────────────────────────────────────────────
function SeoPanel({ form, field }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <button onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primaryborder border-primary flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">SEO &amp; Meta</p>
            <p className="text-xs text-slate-400 mt-0.5">Meta title, description, keywords</p>
          </div>
        </div>
        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-5">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta Title</label>
              <span className={`text-[10px] font-mono tabular-nums ${form.metaTitle.length > 60 ? "text-red-400" : "text-slate-400"}`}>
                {form.metaTitle.length}/60
              </span>
            </div>
            <input type="text" value={form.metaTitle} maxLength={80} onChange={(e) => field("metaTitle", e.target.value)}
              placeholder="Leave blank to use post title"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50/50" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Meta Description</label>
              <span className={`text-[10px] font-mono tabular-nums ${form.metaDescription.length > 160 ? "text-red-400" : "text-slate-400"}`}>
                {form.metaDescription.length}/160
              </span>
            </div>
            <textarea value={form.metaDescription} maxLength={200} rows={3} onChange={(e) => field("metaDescription", e.target.value)}
              placeholder="Short description shown in search results…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50/50 resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Keywords</label>
            <input type="text" value={form.keywords} onChange={(e) => field("keywords", e.target.value)}
              placeholder="waec 2025, study guide, exam prep…"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-slate-50/50" />
            <p className="text-[10px] text-slate-400">Separate keywords with commas</p>
          </div>
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
export default function BlogWriteTab({ form, field, editingId, isSubmitting, onReset, onSubmit, getToken }) {
  const wordsTyped = wc(form.content);
  const readMins   = rt(form.content);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 w-full flex-1">
      <div className="space-y-6">

        {editingId && (
          <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2.5 text-amber-700 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Editing existing post
            </div>
            <button onClick={onReset} className="text-xs text-amber-600 hover:text-amber-800 font-semibold transition-colors underline underline-offset-2">
              Discard
            </button>
          </div>
        )}

        {/* Title */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Title <span className="text-primary">*</span>
            </label>
            <span className="text-[10px] text-slate-400 font-mono tabular-nums">{form.title.length}/200</span>
          </div>
          <input type="text" value={form.title} maxLength={200} onChange={(e) => field("title", e.target.value)}
            placeholder="Write a compelling post title…"
            className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 focus:border-primary text-xl font-serif text-slate-900 placeholder-slate-300 focus:outline-none transition-colors bg-transparent" />
        </div>

        {/* Category */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
          <div className="flex flex-wrap gap-2">
            {["WAEC", "JAMB", "NECO", "GCE", "Study Tips", "News"].map((cat) => {
              const badge  = CATEGORY_BADGE[cat] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
              const dot    = CATEGORY_DOT[cat]   ?? "bg-slate-400";
              const active = form.category === cat;
              return (
                <button key={cat} onClick={() => field("category", active ? "" : cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active ? `${badge} scale-105 shadow-sm` : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}>
                  {active && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
                  {cat}
                </button>
              );
            })}
            <input type="text"
              value={!["WAEC", "JAMB", "NECO", "GCE", "Study Tips", "News", ""].includes(form.category) ? form.category : ""}
              onChange={(e) => field("category", e.target.value)}
              placeholder="Or type custom…"
              className="px-3 py-1.5 rounded-full border border-dashed border-slate-300 bg-transparent text-xs text-slate-600 placeholder-slate-300 focus:outline-none focus:border-primary w-32 transition-colors" />
          </div>
          {form.category && (
            <p className="text-[11px] text-slate-400">
              Category: <span className="font-semibold text-slate-600">{form.category}</span>
              <button onClick={() => field("category", "")} className="ml-2 text-red-400 hover:text-red-600 transition-colors">✕ clear</button>
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cover Image</label>
          <CoverImageUploader
            value={form.coverImage}
            onChange={(url) => field("coverImage", url)}
            getToken={getToken}
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Content <span className="text-primary">*</span>
            </label>
            <span className="text-[10px] text-slate-400">{wordsTyped} words · {readMins} min read</span>
          </div>


          <RichEditor
            value={form.content}
            onChange={(v) => field("content", v)}
            placeholder="Start writing your blog post… Use the toolbar to format text, add headings, lists, images, and links."
          />
        </div>

        <SeoPanel form={form} field={field} />

        {/* Publish toggle */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              form.publishNow ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
            }`}>
              {form.publishNow ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {form.publishNow ? "Publish immediately" : "Save as draft or toggle to publish now"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {form.publishNow ? "Goes live the moment you submit" : "Only visible to admins until published"}
              </p>
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
            <button onClick={onReset}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-sm font-semibold transition-all bg-white">
              Cancel
            </button>
          )}
          <button onClick={onSubmit} disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary active:scale-[0.99] text-white text-sm font-bold transition-all shadow-lg shadow-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting
              ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>
              : editingId       ? "Save Changes"
              : form.publishNow ? "Publish Post"
              :                   "Save as Draft"
            }
          </button>
        </div>

      </div>
    </div>
  );
}