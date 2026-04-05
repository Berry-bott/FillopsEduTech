// import { useEffect, useState, useRef } from "react";

// // ─── Inline helpers (no external dependency) ─────────────────────────────────
// function stripHtml(h) {
//   return (h || "")
//     .replace(/(&amp;)+nbsp;/g, " ")
//     .replace(/&nbsp;/g, " ")
//     .replace(/<[^>]*>/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
// }
// function wc(h) {
//   return stripHtml(h).trim().split(/\s+/).filter(Boolean).length;
// }
// function rt(h) {
//   return Math.max(1, Math.ceil(wc(h) / 200));
// }

// // ─── Toolbar Button ───────────────────────────────────────────────────────────
// function ToolBtn({ onClick, active, title, children }) {
//   return (
//     <button
//       type="button"
//       onMouseDown={e => { e.preventDefault(); onClick(); }}
//       title={title}
//       className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
//         active
//           ? "bg-blue-600 text-white shadow-sm"
//           : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// // ─── RichEditor ───────────────────────────────────────────────────────────────
// export default function RichEditor({ value, onChange, placeholder }) {
//   const ref = useRef(null);
//   const [activeFmt, setActiveFmt] = useState({});

//   useEffect(() => {
//     if (ref.current && document.activeElement !== ref.current)
//       ref.current.innerHTML = value || "";
//   }, [value]);

//   const sync = () => setActiveFmt({
//     bold:                document.queryCommandState("bold"),
//     italic:              document.queryCommandState("italic"),
//     underline:           document.queryCommandState("underline"),
//     strikeThrough:       document.queryCommandState("strikeThrough"),
//     insertUnorderedList: document.queryCommandState("insertUnorderedList"),
//     insertOrderedList:   document.queryCommandState("insertOrderedList"),
//   });

//   const exec = (cmd, val = null) => {
//     ref.current?.focus();
//     document.execCommand(cmd, false, val);
//     sync();
//     if (ref.current) onChange(ref.current.innerHTML);
//   };

//   const GROUPS = [
//     [
//       { cmd: "bold",          title: "Bold",          icon: <b className="text-[11px]">B</b> },
//       { cmd: "italic",        title: "Italic",        icon: <i className="text-[11px]">I</i> },
//       { cmd: "underline",     title: "Underline",     icon: <u className="text-[11px]">U</u> },
//       { cmd: "strikeThrough", title: "Strikethrough", icon: <s className="text-[11px]">S</s> },
//     ],
//     [
//       { act: () => exec("formatBlock", "h2"), title: "Heading 2", icon: <span className="text-[10px] font-black">H2</span> },
//       { act: () => exec("formatBlock", "h3"), title: "Heading 3", icon: <span className="text-[10px] font-black">H3</span> },
//       { act: () => exec("formatBlock", "p"),  title: "Paragraph", icon: <span className="text-[11px]">¶</span> },
//     ],
//     [
//       { cmd: "insertUnorderedList", title: "Bullet list",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg> },
//       { cmd: "insertOrderedList",   title: "Numbered list", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> },
//       { act: () => exec("indent"),  title: "Indent",        icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg> },
//       { act: () => exec("outdent"), title: "Outdent",       icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg> },
//     ],
//     [
//       { act: () => exec("justifyLeft"),   title: "Align left",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8M4 18h12"/></svg> },
//       { act: () => exec("justifyCenter"), title: "Align center", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M6 18h12"/></svg> },
//       { act: () => exec("justifyRight"),  title: "Align right",  icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M12 12h8M8 18h12"/></svg> },
//     ],
//     [
//       { act: () => { const u = prompt("URL:"); if (u) exec("createLink", u); }, title: "Link", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> },
//       { act: () => exec("removeFormat"), title: "Clear format", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> },
//     ],
//   ];

//   const empty = !value || value === "<br>" || value === "<div><br></div>";

//   return (
//     <div className="rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm">
//       {/* Toolbar */}
//       <div className="flex items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200 flex-wrap">
//         {GROUPS.map((g, gi) => (
//           <div key={gi} className="flex items-center gap-0.5">
//             {gi > 0 && <span className="w-px h-4 bg-slate-200 mx-1.5" />}
//             {g.map((btn, bi) => (
//               <ToolBtn
//                 key={bi}
//                 title={btn.title}
//                 active={btn.cmd ? !!activeFmt[btn.cmd] : false}
//                 onClick={btn.act ?? (() => exec(btn.cmd))}
//               >
//                 {btn.icon}
//               </ToolBtn>
//             ))}
//           </div>
//         ))}
//         <span className="ml-auto text-[10px] text-slate-400 font-mono tabular-nums">
//           {wc(value)} words · {rt(value)} min
//         </span>
//       </div>

//       {/* Content area */}
//       <div className="relative">
//         {empty && (
//           <p className="absolute top-4 left-5 right-5 text-slate-400 text-sm pointer-events-none select-none leading-relaxed">
//             {placeholder}
//           </p>
//         )}
//         <div
//           ref={ref}
//           contentEditable
//           suppressContentEditableWarning
//           onInput={() => { if (ref.current) onChange(ref.current.innerHTML); sync(); }}
//           onKeyUp={sync}
//           onMouseUp={sync}
//           onKeyDown={e => { if (e.key === "Tab") { e.preventDefault(); exec("indent"); } }}
//           className="min-h-[280px] max-h-[500px] overflow-y-auto px-5 py-4 text-slate-800 text-sm leading-7 outline-none
//             [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-2
//             [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-2
//             [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-slate-700
//             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
//             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
//             [&_li]:leading-relaxed [&_li]:text-slate-700
//             [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2
//             [&_strong]:text-slate-900 [&_strong]:font-bold
//             [&_em]:text-slate-600 [&_em]:italic
//             [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-5 [&_blockquote]:text-slate-500 [&_blockquote]:italic [&_blockquote]:my-4
//             [&_hr]:border-slate-200 [&_hr]:my-5
//           "
//           style={{ caretColor: "#2563eb" }}
//         />
//       </div>
//     </div>
//   );
// }





import { useEffect, useState, useRef } from "react";
import useAdminAuthStore from "@/store/adminAuthStore";

const UPLOAD_URL = "https://fillops-server-5fuf.onrender.com/api/admin/blogs/upload-image";

// ─── Inline helpers ───────────────────────────────────────────────────────────
function stripHtml(h) {
  return (h || "")
    .replace(/(&amp;)+nbsp;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function wc(h) {
  return stripHtml(h).trim().split(/\s+/).filter(Boolean).length;
}
function rt(h) {
  return Math.max(1, Math.ceil(wc(h) / 200));
}

// ─── Core image upload ────────────────────────────────────────────────────────
async function uploadImageToServer(file) {
  const state = useAdminAuthStore.getState();
  const token =
    state.token ??
    state.accessToken ??
    state.adminToken ??
    state.admin?.token ??
    state.auth?.token ??
    state.user?.token ??
    null;

  if (!token) throw new Error("Not authenticated — please log in again.");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    // Do NOT set Content-Type — browser adds multipart boundary automatically
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (res.status === 401) throw new Error("Session expired — please log in again.");
  if (res.status === 403) throw new Error("Not authorised to upload images.");
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
    console.error("[RichEditor] Upload response:", data);
    throw new Error("Upload succeeded but no URL returned — check console.");
  }
  return url;
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolBtn({ onClick, active, title, children, className = "" }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// ─── RichEditor ───────────────────────────────────────────────────────────────
export default function RichEditor({ value, onChange, placeholder }) {
  const ref         = useRef(null);
  const imgInputRef = useRef(null);
  const [activeFmt,    setActiveFmt]    = useState({});
  const [imgUploading, setImgUploading] = useState(false);
  const [imgStatus,    setImgStatus]    = useState(null); // { type: "success"|"error", msg }

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current)
      ref.current.innerHTML = value || "";
  }, [value]);

  const sync = () => setActiveFmt({
    bold:                document.queryCommandState("bold"),
    italic:              document.queryCommandState("italic"),
    underline:           document.queryCommandState("underline"),
    strikeThrough:       document.queryCommandState("strikeThrough"),
    insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    insertOrderedList:   document.queryCommandState("insertOrderedList"),
  });

  const exec = (cmd, val = null) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    sync();
    if (ref.current) onChange(ref.current.innerHTML);
  };

  // ── Image upload handler ────────────────────────────────────────────────────
  // const handleImageFile = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   e.target.value = ""; // allow re-selecting the same file

  //   if (!file.type.startsWith("image/")) {
  //     setImgStatus({ type: "error", msg: "Please select an image file." });
  //     setTimeout(() => setImgStatus(null), 4000);
  //     return;
  //   }
  //   if (file.size > 5 * 1024 * 1024) {
  //     setImgStatus({ type: "error", msg: "Image must be under 5 MB." });
  //     setTimeout(() => setImgStatus(null), 4000);
  //     return;
  //   }

  //   setImgUploading(true);
  //   setImgStatus(null);

  //   try {
  //     const url = await uploadImageToServer(file);

  //     // Insert <img> at the current cursor position inside the contenteditable
  //     ref.current?.focus();
  //     document.execCommand(
  //       "insertHTML",
  //       false,
  //       `<img src="${url}" alt="" style="max-width:100%;height:auto;border-radius:8px;margin:12px 0;display:block;" />`
  //     );
  //     if (ref.current) onChange(ref.current.innerHTML);

  //     setImgStatus({ type: "success", msg: "Image inserted!" });
  //     setTimeout(() => setImgStatus(null), 3000);
  //   } catch (err) {
  //     setImgStatus({ type: "error", msg: err.message });
  //     setTimeout(() => setImgStatus(null), 5000);
  //   } finally {
  //     setImgUploading(false);
  //   }
  // };
  // ── Image upload handler ────────────────────────────────────────────────────
  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // allow re-selecting the same file

    if (!file.type.startsWith("image/")) {
      setImgStatus({ type: "error", msg: "Please select an image file." });
      setTimeout(() => setImgStatus(null), 4000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImgStatus({ type: "error", msg: "Image must be under 5 MB." });
      setTimeout(() => setImgStatus(null), 4000);
      return;
    }

    setImgUploading(true);
    setImgStatus(null);

    try {
      const url = await uploadImageToServer(file);

      // ────────────────────────────────────────────────────────────────
      // CHANGED: Insert ONLY the URL as plain text (no image preview)
      // ────────────────────────────────────────────────────────────────
      ref.current?.focus();
      document.execCommand("insertText", false, url);

      // Optional: Add two new lines after the URL for better readability
      // document.execCommand("insertText", false, "\n\n");

      if (ref.current) onChange(ref.current.innerHTML);

      setImgStatus({ type: "success", msg: `Image URL inserted: ${url}` });
      setTimeout(() => setImgStatus(null), 4000);
    } catch (err) {
      setImgStatus({ type: "error", msg: err.message });
      setTimeout(() => setImgStatus(null), 5000);
    } finally {
      setImgUploading(false);
    }
  };
  const GROUPS = [
    [
      { cmd: "bold",          title: "Bold",          icon: <b className="text-[11px]">B</b> },
      { cmd: "italic",        title: "Italic",        icon: <i className="text-[11px]">I</i> },
      { cmd: "underline",     title: "Underline",     icon: <u className="text-[11px]">U</u> },
      { cmd: "strikeThrough", title: "Strikethrough", icon: <s className="text-[11px]">S</s> },
    ],
    [
      { act: () => exec("formatBlock", "h2"), title: "Heading 2", icon: <span className="text-[10px] font-black">H2</span> },
      { act: () => exec("formatBlock", "h3"), title: "Heading 3", icon: <span className="text-[10px] font-black">H3</span> },
      { act: () => exec("formatBlock", "p"),  title: "Paragraph", icon: <span className="text-[11px]">¶</span> },
    ],
    [
      { cmd: "insertUnorderedList", title: "Bullet list",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg> },
      { cmd: "insertOrderedList",   title: "Numbered list", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> },
      { act: () => exec("indent"),  title: "Indent",        icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg> },
      { act: () => exec("outdent"), title: "Outdent",       icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg> },
    ],
    [
      { act: () => exec("justifyLeft"),   title: "Align left",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8M4 18h12"/></svg> },
      { act: () => exec("justifyCenter"), title: "Align center", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M6 18h12"/></svg> },
      { act: () => exec("justifyRight"),  title: "Align right",  icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M12 12h8M8 18h12"/></svg> },
    ],
    [
      { act: () => { const u = prompt("URL:"); if (u) exec("createLink", u); }, title: "Link", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> },
      { act: () => exec("removeFormat"), title: "Clear format", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> },
    ],
  ];

  const empty = !value || value === "<br>" || value === "<div><br></div>";

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm">

      {/* Hidden file input for image upload */}
      <input
        ref={imgInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200 flex-wrap">

        {/* Existing format groups */}
        {GROUPS.map((g, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="w-px h-4 bg-slate-200 mx-1.5" />}
            {g.map((btn, bi) => (
              <ToolBtn
                key={bi}
                title={btn.title}
                active={btn.cmd ? !!activeFmt[btn.cmd] : false}
                onClick={btn.act ?? (() => exec(btn.cmd))}
              >
                {btn.icon}
              </ToolBtn>
            ))}
          </div>
        ))}

        {/* ── Image upload button — appended after the last group ── */}
        <span className="w-px h-4 bg-slate-200 mx-1.5" />
        <button
          type="button"
          onMouseDown={e => {
            e.preventDefault(); // preserve editor focus & cursor position
            if (!imgUploading) imgInputRef.current?.click();
          }}
          disabled={imgUploading}
          title="Upload image and insert at cursor"
          className={`flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[11px] font-semibold transition-all ${
            imgUploading
              ? "bg-violet-50 text-violet-400 cursor-wait"
              : "bg-violet-50 text-violet-700 hover:bg-violet-100 hover:text-violet-800 active:scale-95"
          }`}
        >
          {imgUploading ? (
            <>
              <div className="w-3 h-3 rounded-full border-2 border-violet-300 border-t-violet-700 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              {/* Image icon */}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image
            </>
          )}
        </button>

        {/* Word count */}
        <span className="ml-auto text-[10px] text-slate-400 font-mono tabular-nums">
          {wc(value)} words · {rt(value)} min
        </span>
      </div>

      {/* ── Status bar (upload feedback) ─────────────────────────────────── */}
      {imgStatus && (
        <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-b ${
          imgStatus.type === "success"
            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
            : "bg-red-50 border-red-100 text-red-600"
        }`}>
          {imgStatus.type === "success" ? (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {imgStatus.msg}
          <button
            type="button"
            onClick={() => setImgStatus(null)}
            className="ml-auto opacity-60 hover:opacity-100"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Content area ─────────────────────────────────────────────────── */}
      <div className="relative">
        {empty && (
          <p className="absolute top-4 left-5 right-5 text-slate-400 text-sm pointer-events-none select-none leading-relaxed">
            {placeholder}
          </p>
        )}
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          onInput={() => { if (ref.current) onChange(ref.current.innerHTML); sync(); }}
          onKeyUp={sync}
          onMouseUp={sync}
          onKeyDown={e => { if (e.key === "Tab") { e.preventDefault(); exec("indent"); } }}
          className="min-h-[280px] max-h-[500px] overflow-y-auto px-5 py-4 text-slate-800 text-sm leading-7 outline-none
            [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-2
            [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-4 [&_h3]:mb-2
            [&_p]:mb-4 [&_p]:leading-7 [&_p]:text-slate-700
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
            [&_li]:leading-relaxed [&_li]:text-slate-700
            [&_a]:text-blue-600 [&_a]:underline [&_a]:underline-offset-2
            [&_strong]:text-slate-900 [&_strong]:font-bold
            [&_em]:text-slate-600 [&_em]:italic
            [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:pl-5 [&_blockquote]:text-slate-500 [&_blockquote]:italic [&_blockquote]:my-4
            [&_hr]:border-slate-200 [&_hr]:my-5
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-3
          "
          style={{ caretColor: "#2563eb" }}
        />
      </div>
    </div>
  );
}