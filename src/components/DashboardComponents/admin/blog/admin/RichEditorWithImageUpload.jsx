/**
 * RichEditorWithImageUpload
 * ─────────────────────────
 * Drop-in wrapper around your existing <RichEditor> that adds an "Insert Image"
 * toolbar button. When clicked it:
 *   1. Opens the native file picker
 *   2. POSTs the file to /api/admin/blogs/upload-image
 *   3. Receives the URL from the server
 *   4. Inserts <img src="..." /> at the current cursor position via execCommand
 *
 * Usage (in BlogWriteTab):
 *   import RichEditorWithImageUpload from "./RichEditorWithImageUpload";
 *   <RichEditorWithImageUpload
 *     value={form.content}
 *     onChange={v => field("content", v)}
 *     placeholder="Start writing…"
 *     uploadUrl="https://fillops-server-5fuf.onrender.com/api/admin/blogs/upload-image"
 *     getToken={() => useAdminAuthStore.getState().token}
 *   />
 *
 * If your RichEditor already exposes an `onImageUpload` / `uploadImage` prop
 * (e.g. TipTap, Quill Image Drop, etc.), use that path instead and skip this
 * wrapper — but this file shows the universal fallback approach.
 */

import { useRef, useState } from "react";
import RichEditor from "@/components/ui/richeditor";

const UPLOAD_URL = "https://fillops-server-5fuf.onrender.com/api/admin/blogs/upload-image";

// ─── Core upload helper ───────────────────────────────────────────────────────
async function uploadImageFile(file, uploadUrl, getToken) {
  const formData = new FormData();
  formData.append("image", file);

  const token = getToken?.();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const res = await fetch(uploadUrl ?? UPLOAD_URL, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const data = await res.json();

  // Normalise response shape
  return (
    data?.url ??
    data?.data?.url ??
    data?.imageUrl ??
    data?.data?.imageUrl ??
    data?.image?.url ??
    (() => { throw new Error("Server did not return an image URL"); })()
  );
}

// ─── ImageUploadButton ────────────────────────────────────────────────────────
// Sits alongside the editor. On click → pick file → upload → insert HTML.
function ImageUploadButton({ editorRef, uploadUrl, getToken, onStatusChange }) {
  const fileInputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset so same file can be picked again

    if (!file.type.startsWith("image/")) {
      onStatusChange?.({ type: "error", msg: "Please select an image file." });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onStatusChange?.({ type: "error", msg: "Image must be under 5 MB." });
      return;
    }

    onStatusChange?.({ type: "uploading", msg: "Uploading image…" });

    try {
      const url = await uploadImageFile(file, uploadUrl, getToken);

      // ── Strategy A: execCommand (works when editor is a contenteditable div) ──
      if (editorRef?.current) {
        editorRef.current.focus();
        document.execCommand("insertHTML", false, `<img src="${url}" alt="" style="max-width:100%;border-radius:8px;margin:8px 0;" />`);
      }

      // ── Strategy B: TipTap / Quill / ProseMirror APIs ──────────────────────
      // If you have access to the editor's instance, prefer its own image
      // insertion API instead. Example for TipTap:
      //   editorInstance.chain().focus().setImage({ src: url }).run();

      onStatusChange?.({ type: "success", msg: "Image inserted!", url });
    } catch (err) {
      onStatusChange?.({ type: "error", msg: err.message || "Upload failed." });
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        title="Insert image"
        onClick={() => fileInputRef.current?.click()}
        className="
          inline-flex items-center gap-1.5 px-3 py-1.5
          rounded-lg border border-primary-hover bg-primary-hover          text-primary-hover text-xs font-semibold
          hover:bg-primary-hover hover:border-primary-hover
          active:scale-95
          transition-all duration-150
        "
      >
        {/* Image icon */}
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Insert Image
      </button>
    </>
  );
}

// ─── Status Banner ────────────────────────────────────────────────────────────
function StatusBanner({ status, onDismiss }) {
  if (!status) return null;

  const styles = {
    uploading: "bg-primary-hoverborder-primary-hover text-primary-hover",
    success:   "bg-emerald-50 border-emerald-200 text-emerald-700",
    error:     "bg-red-50 border-red-200 text-red-600",
  };

  const icons = {
    uploading: (
      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-hover border-t-primary-hover animate-spin shrink-0" />
    ),
    success: (
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  return (
    <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium mt-2 ${styles[status.type]}`}>
      {icons[status.type]}
      <span className="flex-1">{status.msg}</span>
      {status.type !== "uploading" && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto opacity-60 hover:opacity-100 transition-opacity"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function RichEditorWithImageUpload({
  value,
  onChange,
  placeholder,
  uploadUrl,
  getToken,
}) {
  const editorRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  // Auto-clear success after 3 s
  const handleStatusChange = (status) => {
    setUploadStatus(status);
    if (status?.type === "success") {
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-2">
      {/* Extra toolbar row above the editor */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-auto">
          Rich Text
        </span>
        <ImageUploadButton
          editorRef={editorRef}
          uploadUrl={uploadUrl ?? UPLOAD_URL}
          getToken={getToken}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* The actual editor — pass editorRef so we can insert HTML at cursor */}
      <div ref={editorRef}>
        <RichEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>

      {/* Upload feedback */}
      <StatusBanner
        status={uploadStatus}
        onDismiss={() => setUploadStatus(null)}
      />
    </div>
  );
}