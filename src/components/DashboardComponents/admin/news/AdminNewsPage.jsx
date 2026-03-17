// // import { useEffect, useState, useCallback, useRef } from "react";
// // import { Link } from "react-router-dom";
// // import useNewsStore from "@/store/newsStore";

// // // ─── Audience Config ──────────────────────────────────────────────────────────
// // const AUDIENCE_OPTIONS = [
// //   { value: "ALL",         label: "Everyone",      icon: "🌍", desc: "Visible to all users" },
// //   { value: "USERS_ONLY",  label: "Students",      icon: "🎓", desc: "Students only" },
// //   { value: "TUTORS_ONLY", label: "Tutors",        icon: "👨‍🏫", desc: "Tutors only" },
// // ];

// // const AUDIENCE_BADGE = {
// //   ALL:         "bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30",
// //   USERS_ONLY:  "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30",
// //   TUTORS_ONLY: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30",
// // };
// // const AUDIENCE_BADGE_LIGHT = {
// //   ALL:         "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
// //   USERS_ONLY:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
// //   TUTORS_ONLY: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
// // };
// // const AUDIENCE_DOT = {
// //   ALL: "bg-sky-400", USERS_ONLY: "bg-emerald-400", TUTORS_ONLY: "bg-amber-400",
// // };
// // const AUDIENCE_LABEL = {
// //   ALL: "Everyone", USERS_ONLY: "Students", TUTORS_ONLY: "Tutors",
// // };

// // const EMPTY_FORM = {
// //   title: "", content: "", targetAudience: "ALL", coverImage: "", publishNow: false,
// // };

// // function fmt(d) {
// //   if (!d) return "—";
// //   return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
// // }

// // // ─── Rich Text Toolbar Button ─────────────────────────────────────────────────
// // function ToolBtn({ onClick, active, title, children }) {
// //   return (
// //     <button
// //       type="button"
// //       onMouseDown={(e) => { e.preventDefault(); onClick(); }}
// //       title={title}
// //       className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
// //         active
// //           ? "bg-orange-500 text-white shadow-md shadow-orange-900/30"
// //           : "text-zinc-400 hover:text-white hover:bg-zinc-700"
// //       }`}
// //     >
// //       {children}
// //     </button>
// //   );
// // }

// // // ─── Rich Text Editor ─────────────────────────────────────────────────────────
// // function RichEditor({ value, onChange, placeholder }) {
// //   const editorRef = useRef(null);
// //   const [activeFormats, setActiveFormats] = useState({});

// //   // Sync external value → editor (only on mount or when editor is empty)
// //   useEffect(() => {
// //     if (editorRef.current && editorRef.current.innerHTML !== value && document.activeElement !== editorRef.current) {
// //       editorRef.current.innerHTML = value || "";
// //     }
// //   }, [value]);

// //   const updateFormats = () => {
// //     setActiveFormats({
// //       bold:          document.queryCommandState("bold"),
// //       italic:        document.queryCommandState("italic"),
// //       underline:     document.queryCommandState("underline"),
// //       strikeThrough: document.queryCommandState("strikeThrough"),
// //       insertUnorderedList: document.queryCommandState("insertUnorderedList"),
// //       insertOrderedList:   document.queryCommandState("insertOrderedList"),
// //     });
// //   };

// //   const exec = (cmd, value = null) => {
// //     editorRef.current?.focus();
// //     document.execCommand(cmd, false, value);
// //     updateFormats();
// //     if (editorRef.current) onChange(editorRef.current.innerHTML);
// //   };

// //   const handleInput = () => {
// //     if (editorRef.current) onChange(editorRef.current.innerHTML);
// //     updateFormats();
// //   };

// //   const handleKeyDown = (e) => {
// //     if (e.key === "Tab") { e.preventDefault(); exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;"); }
// //   };

// //   const insertLink = () => {
// //     const url = prompt("Enter URL:");
// //     if (url) exec("createLink", url);
// //   };

// //   const insertHeading = (tag) => {
// //     exec("formatBlock", tag);
// //   };

// //   const TOOLBAR = [
// //     {
// //       group: "format",
// //       buttons: [
// //         { cmd: "bold",          title: "Bold (Ctrl+B)",        icon: <span className="font-black text-xs">B</span> },
// //         { cmd: "italic",        title: "Italic (Ctrl+I)",      icon: <span className="italic text-xs font-serif">I</span> },
// //         { cmd: "underline",     title: "Underline (Ctrl+U)",   icon: <span className="underline text-xs">U</span> },
// //         { cmd: "strikeThrough", title: "Strikethrough",        icon: <span className="line-through text-xs">S</span> },
// //       ],
// //     },
// //     {
// //       group: "block",
// //       buttons: [
// //         { action: () => insertHeading("h2"), title: "Heading 2", icon: <span className="text-[10px] font-bold">H2</span> },
// //         { action: () => insertHeading("h3"), title: "Heading 3", icon: <span className="text-[10px] font-bold">H3</span> },
// //         { action: () => insertHeading("p"),  title: "Paragraph", icon: <span className="text-[10px]">¶</span> },
// //         { action: () => exec("insertHorizontalRule"), title: "Divider", icon: <span className="text-xs">—</span> },
// //       ],
// //     },
// //     {
// //       group: "list",
// //       buttons: [
// //         { cmd: "insertUnorderedList", title: "Bullet List", icon: (
// //           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
// //           </svg>
// //         )},
// //         { cmd: "insertOrderedList", title: "Numbered List", icon: (
// //           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
// //           </svg>
// //         )},
// //         { action: () => exec("indent"),  title: "Indent",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg> },
// //         { action: () => exec("outdent"), title: "Outdent",  icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg> },
// //       ],
// //     },
// //     {
// //       group: "align",
// //       buttons: [
// //         { action: () => exec("justifyLeft"),   title: "Align Left",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8M4 18h12"/></svg> },
// //         { action: () => exec("justifyCenter"), title: "Align Center", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M6 18h12"/></svg> },
// //         { action: () => exec("justifyRight"),  title: "Align Right",  icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M12 12h8M8 18h12"/></svg> },
// //       ],
// //     },
// //     {
// //       group: "extras",
// //       buttons: [
// //         { action: insertLink, title: "Insert Link", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> },
// //         { action: () => exec("removeFormat"), title: "Clear Formatting", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> },
// //       ],
// //     },
// //   ];

// //   const isEmpty = !value || value === "<br>" || value === "<div><br></div>";

// //   return (
// //     <div className="rounded-xl border border-zinc-700 overflow-hidden bg-zinc-900 focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent transition-all">
// //       {/* Toolbar */}
// //       <div className="flex items-center gap-1 px-3 py-2 bg-zinc-800/80 border-b border-zinc-700 flex-wrap">
// //         {TOOLBAR.map((group, gi) => (
// //           <div key={gi} className="flex items-center gap-0.5">
// //             {gi > 0 && <span className="w-px h-5 bg-zinc-700 mx-1" />}
// //             {group.buttons.map((btn, bi) => (
// //               <ToolBtn
// //                 key={bi}
// //                 title={btn.title}
// //                 active={btn.cmd ? !!activeFormats[btn.cmd] : false}
// //                 onClick={btn.action ?? (() => exec(btn.cmd))}
// //               >
// //                 {btn.icon}
// //               </ToolBtn>
// //             ))}
// //           </div>
// //         ))}
// //         {/* Word count */}
// //         <span className="ml-auto text-[10px] text-zinc-600 font-mono">
// //           {(value?.replace(/<[^>]*>/g, "") || "").trim().split(/\s+/).filter(Boolean).length} words
// //         </span>
// //       </div>

// //       {/* Editable area */}
// //       <div className="relative">
// //         {isEmpty && (
// //           <span className="absolute top-4 left-5 text-zinc-600 text-sm pointer-events-none select-none">
// //             {placeholder}
// //           </span>
// //         )}
// //         <div
// //           ref={editorRef}
// //           contentEditable
// //           suppressContentEditableWarning
// //           onInput={handleInput}
// //           onKeyUp={updateFormats}
// //           onMouseUp={updateFormats}
// //           onKeyDown={handleKeyDown}
// //           className="min-h-[280px] max-h-[520px] overflow-y-auto px-5 py-4 text-zinc-200 text-sm leading-relaxed outline-none
// //             [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-4 [&_h2]:mb-2
// //             [&_h3]:font-serif [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-zinc-100 [&_h3]:mt-3 [&_h3]:mb-1.5
// //             [&_p]:mb-3 [&_p]:leading-relaxed
// //             [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ul]:space-y-1
// //             [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_ol]:space-y-1
// //             [&_li]:leading-relaxed
// //             [&_a]:text-orange-400 [&_a]:underline [&_a]:underline-offset-2
// //             [&_strong]:text-white [&_strong]:font-bold
// //             [&_em]:text-zinc-300 [&_em]:italic
// //             [&_hr]:border-zinc-700 [&_hr]:my-4
// //             [&_blockquote]:border-l-2 [&_blockquote]:border-orange-500 [&_blockquote]:pl-4 [&_blockquote]:text-zinc-400 [&_blockquote]:italic [&_blockquote]:my-3
// //           "
// //           style={{ caretColor: "#f97316" }}
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Toast ────────────────────────────────────────────────────────────────────
// // function Toast({ toast }) {
// //   if (!toast) return null;
// //   return (
// //     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold backdrop-blur-md border transition-all animate-[slideIn_0.3s_ease] ${
// //       toast.type === "error"
// //         ? "bg-red-950/90 border-red-800 text-red-200"
// //         : "bg-emerald-950/90 border-emerald-800 text-emerald-200"
// //     }`}>
// //       <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${toast.type === "error" ? "bg-red-700 text-red-100" : "bg-emerald-700 text-emerald-100"}`}>
// //         {toast.type === "error" ? "✕" : "✓"}
// //       </span>
// //       {toast.msg}
// //     </div>
// //   );
// // }

// // // ─── Confirm Modal ────────────────────────────────────────────────────────────
// // function ConfirmModal({ open, onConfirm, onCancel, isSubmitting }) {
// //   if (!open) return null;
// //   return (
// //     <div className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
// //       <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-7 max-w-sm w-full shadow-2xl">
// //         <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
// //           <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //           </svg>
// //         </div>
// //         <h3 className="font-serif text-xl font-bold text-white mb-2">Delete this article?</h3>
// //         <p className="text-sm text-zinc-500 mb-6 leading-relaxed">This is permanent. The article will be removed from the platform and cannot be recovered.</p>
// //         <div className="flex gap-3">
// //           <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all">
// //             Cancel
// //           </button>
// //           <button onClick={onConfirm} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-50 shadow-lg shadow-red-900/30">
// //             {isSubmitting ? "Deleting…" : "Delete Article"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Article Row ──────────────────────────────────────────────────────────────
// // function ArticleRow({ news, onEdit, onDelete, onTogglePublish, isSubmitting }) {
// //   const badge = AUDIENCE_BADGE[news.targetAudience] ?? AUDIENCE_BADGE.ALL;
// //   const dot   = AUDIENCE_DOT[news.targetAudience]   ?? AUDIENCE_DOT.ALL;
// //   const plainText = news.content?.replace(/<[^>]*>/g, "") || "";

// //   return (
// //     <div className="group flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-200">
// //       {/* Cover thumb */}
// //       <div className="hidden sm:block w-12 h-12 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700">
// //         {news.coverImage ? (
// //           <img src={news.coverImage} alt="" className="w-full h-full object-cover" onError={(e) => e.target.style.display = "none"} />
// //         ) : (
// //           <div className="w-full h-full bg-gradient-to-br from-orange-900/40 to-zinc-800 flex items-center justify-center">
// //             <span className="text-lg">📰</span>
// //           </div>
// //         )}
// //       </div>

// //       {/* Info */}
// //       <div className="flex-1 min-w-0">
// //         <div className="flex items-center gap-2 mb-1.5 flex-wrap">
// //           <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge}`}>
// //             <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
// //             {AUDIENCE_LABEL[news.targetAudience]}
// //           </span>
// //           <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
// //             news.isPublished
// //               ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
// //               : "bg-zinc-800 text-zinc-500 ring-1 ring-zinc-700"
// //           }`}>
// //             {news.isPublished ? "● Live" : "○ Draft"}
// //           </span>
// //           <span className="text-[11px] text-zinc-600">{fmt(news.publishedAt || news.createdAt)}</span>
// //         </div>
// //         <p className="text-sm font-semibold text-zinc-100 truncate pr-2 group-hover:text-white transition-colors">
// //           {news.title}
// //         </p>
// //         <p className="text-xs text-zinc-600 truncate mt-0.5">
// //           {plainText.slice(0, 90)}{plainText.length > 90 ? "…" : ""}
// //         </p>
// //       </div>

// //       {/* Actions */}
// //       <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
// //         <button onClick={() => onEdit(news)} title="Edit article"
// //           className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-orange-400 hover:bg-orange-500/10 transition-all">
// //           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //           </svg>
// //           Edit
// //         </button>

// //         <button onClick={() => onTogglePublish(news)} disabled={isSubmitting} title={news.isPublished ? "Unpublish" : "Publish"}
// //           className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 ${
// //             news.isPublished
// //               ? "text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10"
// //               : "text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10"
// //           }`}>
// //           {news.isPublished ? (
// //             <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>Unpublish</>
// //           ) : (
// //             <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Publish</>
// //           )}
// //         </button>

// //         <button onClick={() => onDelete(news.id)} disabled={isSubmitting} title="Delete article"
// //           className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40">
// //           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //             <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
// //           </svg>
// //           Delete
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─── Public Preview ───────────────────────────────────────────────────────────
// // function PublicPreview({ articles }) {
// //   const published = articles.filter((n) => n.isPublished);
// //   const hero = published[0];
// //   const rest = published.slice(1);

// //   if (published.length === 0) {
// //     return (
// //       <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-500">
// //         <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-3xl">🗞️</div>
// //         <p className="text-sm font-semibold">No published articles yet</p>
// //         <p className="text-xs text-zinc-600">Publish an article in the Write tab to see it appear here</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-10">
// //       {hero && (
// //         <section>
// //           <div className="flex items-center gap-3 mb-5">
// //             <span className="w-1 h-6 bg-orange-500 rounded-full" />
// //             <h2 className="font-serif text-base font-bold text-zinc-300">Featured Story</h2>
// //           </div>
// //           <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-2xl border border-zinc-700">
// //             {hero.coverImage
// //               ? <img src={hero.coverImage} alt={hero.title} className="absolute inset-0 w-full h-full object-cover" />
// //               : <div className="absolute inset-0 bg-gradient-to-br from-orange-950/60 via-zinc-800 to-zinc-900" />
// //             }
// //             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
// //             <div className="absolute bottom-0 left-0 right-0 p-7">
// //               <div className="flex items-center gap-3 mb-3">
// //                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${AUDIENCE_BADGE[hero.targetAudience]}`}>
// //                   <span className={`w-1.5 h-1.5 rounded-full ${AUDIENCE_DOT[hero.targetAudience]}`} />
// //                   {AUDIENCE_LABEL[hero.targetAudience]}
// //                 </span>
// //                 <span className="text-zinc-500 text-xs">{fmt(hero.publishedAt || hero.createdAt)}</span>
// //               </div>
// //               <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2">{hero.title}</h2>
// //               <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
// //                 {hero.content?.replace(/<[^>]*>/g, "").slice(0, 180)}…
// //               </p>
// //             </div>
// //           </div>
// //         </section>
// //       )}

// //       {rest.length > 0 && (
// //         <section>
// //           <div className="flex items-center gap-3 mb-5">
// //             <span className="w-1 h-6 bg-orange-500 rounded-full" />
// //             <h2 className="font-serif text-base font-bold text-zinc-300">More Articles</h2>
// //             <span className="text-xs text-zinc-600 ml-auto">{rest.length} more</span>
// //           </div>
// //           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //             {rest.map((news) => (
// //               <div key={news.id} className="bg-zinc-800/60 rounded-2xl border border-zinc-700 overflow-hidden hover:border-zinc-600 transition-colors">
// //                 {news.coverImage ? (
// //                   <div className="h-32 overflow-hidden">
// //                     <img src={news.coverImage} alt={news.title} className="w-full h-full object-cover" />
// //                   </div>
// //                 ) : (
// //                   <div className="h-1 bg-gradient-to-r from-orange-600 to-amber-500" />
// //                 )}
// //                 <div className="p-4 space-y-2">
// //                   <div className="flex items-center gap-2 flex-wrap">
// //                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${AUDIENCE_BADGE[news.targetAudience]}`}>
// //                       <span className={`w-1 h-1 rounded-full ${AUDIENCE_DOT[news.targetAudience]}`} />
// //                       {AUDIENCE_LABEL[news.targetAudience]}
// //                     </span>
// //                     <span className="text-[11px] text-zinc-600">{fmt(news.publishedAt || news.createdAt)}</span>
// //                   </div>
// //                   <h3 className="font-serif text-sm font-bold text-zinc-100 line-clamp-2 leading-snug">{news.title}</h3>
// //                   <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
// //                     {news.content?.replace(/<[^>]*>/g, "").slice(0, 100)}…
// //                   </p>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </section>
// //       )}
// //     </div>
// //   );
// // }

// // // ─── Main Admin Page ──────────────────────────────────────────────────────────
// // export default function AdminNewsPage() {
// //   const {
// //     newsList, isLoading, isSubmitting, error,
// //     filters, setFilters, fetchNews,
// //     createNews, updateNews, deleteNews, clearError,
// //   } = useNewsStore();

// //   const [activeTab, setActiveTab]     = useState("write");
// //   const [form, setForm]               = useState(EMPTY_FORM);
// //   const [editingId, setEditingId]     = useState(null);
// //   const [searchInput, setSearchInput] = useState("");
// //   const [toast, setToast]             = useState(null);
// //   const [confirmId, setConfirmId]     = useState(null);

// //   useEffect(() => { fetchNews(); }, [filters]);

// //   const showToast = useCallback((msg, type = "success") => {
// //     setToast({ msg, type });
// //     setTimeout(() => setToast(null), 4000);
// //   }, []);

// //   const handleField = (key, val) => setForm((f) => ({ ...f, [key]: val }));
// //   const resetForm   = () => { setForm(EMPTY_FORM); setEditingId(null); };

// //   const handleEdit = (news) => {
// //     setForm({
// //       title:          news.title          || "",
// //       content:        news.content        || "",
// //       targetAudience: news.targetAudience || "ALL",
// //       coverImage:     news.coverImage     || "",
// //       publishNow:     news.isPublished    || false,
// //     });
// //     setEditingId(news.id);
// //     setActiveTab("write");
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   const handleSubmit = async () => {
// //     if (!form.title.trim()) { showToast("Title is required.", "error"); return; }
// //     const plainContent = form.content.replace(/<[^>]*>/g, "").trim();
// //     if (!plainContent) { showToast("Content cannot be empty.", "error"); return; }

// //     let result;
// //     if (editingId) {
// //       result = await updateNews(editingId, {
// //         title: form.title, content: form.content,
// //         targetAudience: form.targetAudience,
// //         coverImage: form.coverImage || undefined,
// //         isPublished: form.publishNow,
// //       });
// //       if (result) { showToast("Article updated successfully!"); resetForm(); }
// //       else showToast("Failed to update article.", "error");
// //     } else {
// //       result = await createNews({
// //         title: form.title, content: form.content,
// //         targetAudience: form.targetAudience,
// //         coverImage: form.coverImage || undefined,
// //         publishNow: form.publishNow,
// //       });
// //       if (result) {
// //         showToast(form.publishNow ? "🎉 Article published!" : "💾 Saved as draft!");
// //         resetForm();
// //       } else showToast("Failed to create article.", "error");
// //     }
// //   };

// //   const handleTogglePublish = async (news) => {
// //     const result = await updateNews(news.id, { isPublished: !news.isPublished });
// //     if (result) showToast(result.isPublished ? "✅ Article is now live!" : "Article moved to drafts.");
// //     else showToast("Failed to update status.", "error");
// //   };

// //   const handleDelete = async () => {
// //     const ok = await deleteNews(confirmId);
// //     setConfirmId(null);
// //     if (ok) showToast("Article permanently deleted.");
// //     else showToast("Failed to delete article.", "error");
// //   };

// //   const handleSearch = (e) => { e.preventDefault(); setFilters({ search: searchInput }); };

// //   const filteredList = (newsList || []).filter((n) => {
// //     if (filters.isPublished !== undefined && n.isPublished !== filters.isPublished) return false;
// //     if (filters.targetAudience && n.targetAudience !== filters.targetAudience) return false;
// //     return true;
// //   });

// //   const stats = {
// //     total:     (newsList || []).length,
// //     published: (newsList || []).filter((n) => n.isPublished).length,
// //     drafts:    (newsList || []).filter((n) => !n.isPublished).length,
// //   };

// //   const TABS = [
// //     { key: "write",   icon: "✍️", label: "Write",   badge: editingId ? "Editing" : "New" },
// //     { key: "manage",  icon: "📋", label: "Manage",  badge: `${filteredList.length}` },
// //     { key: "preview", icon: "👁", label: "Preview", badge: `${stats.published} live` },
// //   ];

// //   const wordCount = form.content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length;

// //   return (
// //     <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
// //       {/* inject keyframe for toast slide-in */}
// //       <style>{`
// //         @keyframes slideIn { from { opacity:0; transform: translateX(16px); } to { opacity:1; transform: translateX(0); } }
// //         @keyframes fadeUp  { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
// //       `}</style>

// //       <Toast toast={toast} />
// //       <ConfirmModal open={!!confirmId} onConfirm={handleDelete} onCancel={() => setConfirmId(null)} isSubmitting={isSubmitting} />

// //       {/* ── Header ── */}
// //       <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-50">
// //         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
// //           {/* Brand */}
// //           <div className="flex items-center gap-3.5">
// //             <div className="relative">
// //               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-900/50">
// //                 <span className="text-lg">📰</span>
// //               </div>
// //               <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
// //             </div>
// //             <div>
// //               <h1 className="font-serif text-lg font-bold text-white tracking-tight">FillOps News</h1>
// //               <p className="text-[10px] text-zinc-600 uppercase tracking-[0.15em] font-medium">Editorial Dashboard</p>
// //             </div>
// //           </div>

// //           {/* Stats pills */}
// //           <div className="hidden lg:flex items-center gap-2">
// //             {[
// //               { label: "Articles", val: stats.total,     bg: "bg-zinc-800",            text: "text-zinc-300" },
// //               { label: "Live",     val: stats.published, bg: "bg-emerald-500/10",       text: "text-emerald-400" },
// //               { label: "Drafts",   val: stats.drafts,    bg: "bg-amber-500/10",         text: "text-amber-400" },
// //             ].map((s) => (
// //               <div key={s.label} className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full ${s.bg} border border-zinc-700/50`}>
// //                 <span className={`text-sm font-bold font-serif ${s.text}`}>{s.val}</span>
// //                 <span className="text-[11px] text-zinc-500">{s.label}</span>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Live page link */}
// //           <Link to="/news"
// //             className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs font-semibold transition-all no-underline border border-zinc-700 hover:border-zinc-500 group">
// //             <svg className="w-3.5 h-3.5 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //               <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
// //             </svg>
// //             View Live Page
// //           </Link>
// //         </div>
// //       </header>

// //       {/* ── Tab Bar ── */}
// //       <div className="border-b border-zinc-800/60 bg-zinc-950/60 backdrop-blur sticky top-[69px] z-40">
// //         <div className="max-w-7xl mx-auto px-6">
// //           <div className="flex">
// //             {TABS.map((tab) => (
// //               <button key={tab.key} onClick={() => setActiveTab(tab.key)}
// //                 className={`relative flex items-center gap-2.5 px-6 py-4 text-sm font-semibold transition-all ${
// //                   activeTab === tab.key ? "text-white" : "text-zinc-600 hover:text-zinc-300"
// //                 }`}>
// //                 <span className="text-base">{tab.icon}</span>
// //                 <span>{tab.label}</span>
// //                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
// //                   activeTab === tab.key
// //                     ? tab.key === "manage" ? "bg-orange-500/20 text-orange-400" : "bg-zinc-700 text-zinc-300"
// //                     : "bg-zinc-800 text-zinc-600"
// //                 }`}>
// //                   {tab.badge}
// //                 </span>
// //                 {activeTab === tab.key && (
// //                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
// //                 )}
// //                 {tab.key === "write" && editingId && (
// //                   <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
// //                 )}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* ════════════════ WRITE TAB ════════════════ */}
// //       {activeTab === "write" && (
// //         <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8">
// //           <div className="space-y-6">

// //             {/* Editing banner */}
// //             {editingId && (
// //               <div className="flex items-center justify-between px-5 py-3.5 rounded-2xl bg-orange-500/8 border border-orange-500/20">
// //                 <div className="flex items-center gap-2.5 text-orange-300 text-sm font-medium">
// //                   <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center text-xs">✏️</div>
// //                   You are editing an existing article
// //                 </div>
// //                 <button onClick={resetForm} className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors font-medium">
// //                   Discard & start new
// //                 </button>
// //               </div>
// //             )}

// //             {/* Title */}
// //             <div className="space-y-2.5">
// //               <label className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
// //                 <span>Headline <span className="text-orange-500">*</span></span>
// //                 <span className="normal-case font-normal text-zinc-700">{form.title.length}/200</span>
// //               </label>
// //               <input
// //                 type="text"
// //                 value={form.title}
// //                 maxLength={200}
// //                 onChange={(e) => handleField("title", e.target.value)}
// //                 placeholder="Write a compelling headline that grabs attention…"
// //                 className="w-full px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-serif transition-all"
// //               />
// //             </div>

// //             {/* Rich Text Editor */}
// //             <div className="space-y-2.5">
// //               <label className="flex items-center justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
// //                 <span>Content <span className="text-orange-500">*</span></span>
// //                 <span className="normal-case font-normal text-zinc-700">{wordCount} words</span>
// //               </label>
// //               <RichEditor
// //                 value={form.content}
// //                 onChange={(val) => handleField("content", val)}
// //                 placeholder="Start writing your article… Use the toolbar above to format text, add headings, lists, and links."
// //               />
// //             </div>

// //             {/* Cover image */}
// //             <div className="space-y-2.5">
// //               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
// //                 Cover Image URL <span className="text-zinc-700 normal-case font-normal">(optional)</span>
// //               </label>
// //               <div className="flex gap-3">
// //                 <input
// //                   type="url"
// //                   value={form.coverImage}
// //                   onChange={(e) => handleField("coverImage", e.target.value)}
// //                   placeholder="https://example.com/cover-image.jpg"
// //                   className="flex-1 px-5 py-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm transition-all"
// //                 />
// //                 {form.coverImage && (
// //                   <button onClick={() => handleField("coverImage", "")}
// //                     className="px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 text-xs font-medium border border-zinc-700 transition-all">
// //                     Remove
// //                   </button>
// //                 )}
// //               </div>
// //               {form.coverImage && (
// //                 <div className="relative h-44 rounded-xl overflow-hidden border border-zinc-700">
// //                   <img src={form.coverImage} alt="cover preview" className="w-full h-full object-cover"
// //                     onError={(e) => { e.target.style.opacity = 0; }} />
// //                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
// //                   <div className="absolute bottom-3 left-3 text-xs text-white/60 font-medium bg-black/40 px-2 py-1 rounded-lg">Cover preview</div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Audience */}
// //             <div className="space-y-2.5">
// //               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">Target Audience</label>
// //               <div className="grid grid-cols-3 gap-3">
// //                 {AUDIENCE_OPTIONS.map((opt) => (
// //                   <button key={opt.value} onClick={() => handleField("targetAudience", opt.value)}
// //                     className={`flex flex-col items-center gap-2.5 px-3 py-5 rounded-2xl border text-xs font-semibold transition-all ${
// //                       form.targetAudience === opt.value
// //                         ? "bg-orange-600/20 border-orange-500/60 text-orange-300 shadow-lg shadow-orange-900/20"
// //                         : "border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60"
// //                     }`}>
// //                     <span className="text-2xl">{opt.icon}</span>
// //                     <div className="text-center">
// //                       <p className="font-bold">{opt.label}</p>
// //                       <p className={`text-[10px] mt-0.5 ${form.targetAudience === opt.value ? "text-orange-400/70" : "text-zinc-600"}`}>{opt.desc}</p>
// //                     </div>
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Publish toggle */}
// //             <div className="flex items-center justify-between px-6 py-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
// //               <div className="flex items-center gap-4">
// //                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${
// //                   form.publishNow ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-zinc-800 border border-zinc-700"
// //                 }`}>
// //                   {form.publishNow ? "🚀" : "💾"}
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-semibold text-zinc-100">{form.publishNow ? "Publishing immediately" : "Save as draft"}</p>
// //                   <p className="text-xs text-zinc-600 mt-0.5">{form.publishNow ? "Article goes live as soon as you submit" : "Only visible to you until you publish"}</p>
// //                 </div>
// //               </div>
// //               <button onClick={() => handleField("publishNow", !form.publishNow)}
// //                 className={`relative w-14 h-7 rounded-full transition-all duration-300 ${form.publishNow ? "bg-emerald-500 shadow-lg shadow-emerald-900/40" : "bg-zinc-700"}`}>
// //                 <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${form.publishNow ? "translate-x-7" : "translate-x-0"}`} />
// //               </button>
// //             </div>

// //             {/* Submit */}
// //             <div className="flex gap-3 pt-2">
// //               {editingId && (
// //                 <button onClick={resetForm}
// //                   className="px-6 py-3.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm font-semibold transition-all">
// //                   Cancel
// //                 </button>
// //               )}
// //               <button onClick={handleSubmit} disabled={isSubmitting}
// //                 className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 active:scale-[0.99] text-white text-sm font-bold transition-all shadow-xl shadow-orange-900/30 disabled:opacity-50 disabled:cursor-not-allowed">
// //                 {isSubmitting ? (
// //                   <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing…</>
// //                 ) : editingId ? (
// //                   <><span>💾</span> Save Changes</>
// //                 ) : form.publishNow ? (
// //                   <><span>🚀</span> Publish Article</>
// //                 ) : (
// //                   <><span>💾</span> Save as Draft</>
// //                 )}
// //               </button>
// //             </div>
// //           </div>

// //           {/* ── Sidebar ── */}
// //           <aside className="hidden xl:block">
// //             <div className="sticky top-36 space-y-5">
// //               {/* Live card preview */}
// //               <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
// //                 <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
// //                   <div className="flex items-center gap-2">
// //                     <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
// //                     <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Card Preview</h3>
// //                   </div>
// //                   <span className="text-[10px] text-zinc-600">Updates live</span>
// //                 </div>
// //                 <div className="p-4">
// //                   <div className="bg-zinc-800/60 rounded-xl border border-zinc-700 overflow-hidden">
// //                     {form.coverImage ? (
// //                       <div className="h-28 overflow-hidden bg-zinc-700">
// //                         <img src={form.coverImage} alt="" className="w-full h-full object-cover"
// //                           onError={(e) => e.target.style.display = "none"} />
// //                       </div>
// //                     ) : (
// //                       <div className="h-1.5 bg-gradient-to-r from-orange-600 to-amber-400" />
// //                     )}
// //                     <div className="p-4 space-y-2.5">
// //                       <div className="flex items-center gap-2">
// //                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${AUDIENCE_BADGE[form.targetAudience]}`}>
// //                           <span className={`w-1 h-1 rounded-full ${AUDIENCE_DOT[form.targetAudience]}`} />
// //                           {AUDIENCE_LABEL[form.targetAudience]}
// //                         </span>
// //                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${form.publishNow ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-700 text-zinc-500"}`}>
// //                           {form.publishNow ? "● Live" : "○ Draft"}
// //                         </span>
// //                       </div>
// //                       <p className="text-sm font-bold font-serif text-zinc-100 leading-snug line-clamp-2">
// //                         {form.title || <span className="text-zinc-600 font-normal italic">Your headline appears here…</span>}
// //                       </p>
// //                       <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
// //                         {form.content
// //                           ? form.content.replace(/<[^>]*>/g, "").slice(0, 120) + (form.content.replace(/<[^>]*>/g, "").length > 120 ? "…" : "")
// //                           : <span className="italic">Article preview appears here…</span>}
// //                       </p>
// //                       <div className="flex justify-between items-center pt-2 border-t border-zinc-700/60">
// //                         <span className="text-[10px] text-zinc-600">{fmt(new Date())}</span>
// //                         <span className="text-[10px] font-semibold text-orange-500">Read more →</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Writing stats */}
// //               <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 space-y-4">
// //                 <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Article Stats</h3>
// //                 <div className="grid grid-cols-2 gap-3">
// //                   {[
// //                     { label: "Words",      val: wordCount,                               color: "text-white" },
// //                     { label: "Characters", val: form.content.replace(/<[^>]*>/g, "").length, color: "text-zinc-300" },
// //                     { label: "Title len",  val: form.title.length,                       color: "text-zinc-300" },
// //                     { label: "Est. read",  val: `${Math.max(1, Math.ceil(wordCount / 200))} min`, color: "text-orange-400" },
// //                   ].map((s) => (
// //                     <div key={s.label} className="bg-zinc-800/60 rounded-xl p-3 text-center border border-zinc-700/50">
// //                       <p className={`text-lg font-bold font-serif ${s.color}`}>{s.val}</p>
// //                       <p className="text-[10px] text-zinc-600 mt-0.5">{s.label}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Tip */}
// //               <div className="bg-orange-500/5 border border-orange-500/15 rounded-2xl p-4">
// //                 <p className="text-xs text-zinc-500 leading-relaxed">
// //                   <span className="text-orange-400 font-semibold">💡 Tip:</span> Switch to the{" "}
// //                   <span className="text-zinc-300 font-semibold">Preview tab</span> to see exactly how the public news page looks with all your changes applied.
// //                 </p>
// //               </div>
// //             </div>
// //           </aside>
// //         </div>
// //       )}

// //       {/* ════════════════ MANAGE TAB ════════════════ */}
// //       {activeTab === "manage" && (
// //         <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
// //           {/* Toolbar */}
// //           <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 mb-6 space-y-4">
// //             <form onSubmit={handleSearch} className="flex gap-3">
// //               <div className="relative flex-1">
// //                 <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
// //                 </svg>
// //                 <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
// //                   placeholder="Search by title or content…"
// //                   className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
// //               </div>
// //               <button type="submit" className="px-5 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm font-semibold transition-all border border-zinc-600">
// //                 Search
// //               </button>
// //               {filters.search && (
// //                 <button type="button" onClick={() => { setSearchInput(""); setFilters({ search: "" }); }}
// //                   className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 text-sm transition-all border border-zinc-700">
// //                   ✕
// //                 </button>
// //               )}
// //             </form>

// //             <div className="flex flex-wrap gap-2 items-center">
// //               <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Filter:</span>
// //               {[
// //                 { label: "All",       val: undefined },
// //                 { label: "● Live",    val: true      },
// //                 { label: "○ Drafts",  val: false     },
// //               ].map((opt) => (
// //                 <button key={String(opt.val)} onClick={() => setFilters({ isPublished: opt.val })}
// //                   className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
// //                     filters.isPublished === opt.val
// //                       ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
// //                       : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-300"
// //                   }`}>
// //                   {opt.label}
// //                 </button>
// //               ))}
// //               <span className="w-px h-4 bg-zinc-800 mx-1" />
// //               {[
// //                 { label: "All Audiences", val: undefined       },
// //                 { label: "🎓 Students",   val: "USERS_ONLY"   },
// //                 { label: "👨‍🏫 Tutors",    val: "TUTORS_ONLY"  },
// //                 { label: "🌍 Everyone",   val: "ALL"          },
// //               ].map((opt) => (
// //                 <button key={String(opt.val)} onClick={() => setFilters({ targetAudience: opt.val })}
// //                   className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
// //                     filters.targetAudience === opt.val
// //                       ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
// //                       : "border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-300"
// //                   }`}>
// //                   {opt.label}
// //                 </button>
// //               ))}
// //               <button onClick={fetchNews}
// //                 className="ml-auto text-xs text-zinc-700 hover:text-orange-400 transition-colors flex items-center gap-1.5 font-medium">
// //                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                   <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// //                 </svg>
// //                 Refresh
// //               </button>
// //             </div>
// //           </div>

// //           <div className="space-y-2.5">
// //             {isLoading && (
// //               <div className="flex items-center justify-center py-20 gap-4 text-zinc-600">
// //                 <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-orange-500 animate-spin" />
// //                 <span className="text-sm">Loading articles…</span>
// //               </div>
// //             )}
// //             {!isLoading && filteredList.length === 0 && (
// //               <div className="text-center py-20 space-y-3">
// //                 <p className="text-4xl">🗞️</p>
// //                 <p className="text-zinc-600 text-sm font-medium">No articles match your filters</p>
// //                 <button onClick={() => { setFilters({ isPublished: undefined, targetAudience: undefined, search: "" }); setSearchInput(""); }}
// //                   className="text-xs text-orange-500 hover:text-orange-400 font-semibold transition-colors">
// //                   Clear all filters
// //                 </button>
// //               </div>
// //             )}
// //             {!isLoading && filteredList.map((news) => (
// //               <ArticleRow key={news.id} news={news}
// //                 onEdit={handleEdit}
// //                 onDelete={(id) => setConfirmId(id)}
// //                 onTogglePublish={handleTogglePublish}
// //                 isSubmitting={isSubmitting}
// //               />
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* ════════════════ PREVIEW TAB ════════════════ */}
// //       {activeTab === "preview" && (
// //         <div className="flex-1 flex flex-col">
// //           <div className="bg-orange-600/8 border-b border-orange-500/15 px-6 py-3">
// //             <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
// //               <div className="flex items-center gap-2.5 text-orange-400/80 text-xs font-semibold">
// //                 <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
// //                 Admin Preview — showing the public news feed as users see it
// //               </div>
// //               <div className="flex items-center gap-4">
// //                 <span className="text-xs text-zinc-600">
// //                   {stats.published} published · {stats.drafts} drafts
// //                 </span>
// //                 <button onClick={fetchNews} className="text-xs text-zinc-600 hover:text-orange-400 transition-colors flex items-center gap-1.5">
// //                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //                     <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
// //                   </svg>
// //                   Refresh
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           <div className="flex-1 bg-zinc-950/50">
// //             {/* Simulated public header */}
// //             <div className="bg-zinc-900 border-b-4 border-orange-600">
// //               <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
// //                 <div className="flex items-center gap-3">
// //                   <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center">
// //                     <span className="text-lg">📰</span>
// //                   </div>
// //                   <div>
// //                     <h1 className="font-serif text-xl font-bold text-white">FillOps News</h1>
// //                     <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Stay informed · Stay ahead</p>
// //                   </div>
// //                 </div>
// //                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700 text-[11px] text-zinc-500">
// //                   <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
// //                   Admin Preview Mode
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="max-w-6xl mx-auto px-6 py-10">
// //               {isLoading ? (
// //                 <div className="flex items-center justify-center py-24 gap-3 text-zinc-600">
// //                   <div className="w-8 h-8 rounded-full border-3 border-zinc-800 border-t-orange-500 animate-spin" />
// //                   <p className="text-sm">Loading…</p>
// //                 </div>
// //               ) : (
// //                 <PublicPreview articles={newsList || []} />
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }











// import { useEffect, useState, useCallback, useRef } from "react";
// import { Link } from "react-router-dom";
// import useNewsStore from "@/store/newsStore";

// // ─── Config ───────────────────────────────────────────────────────────────────
// const AUDIENCE_OPTIONS = [
//   { value: "ALL",         label: "Everyone",  icon: "🌍", desc: "All platform users" },
//   { value: "USERS_ONLY",  label: "Students",  icon: "🎓", desc: "Student accounts only" },
//   { value: "TUTORS_ONLY", label: "Tutors",    icon: "👨‍🏫", desc: "Tutor accounts only" },
// ];
// const AUDIENCE_BADGE = {
//   ALL:         "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30",
//   USERS_ONLY:  "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
//   TUTORS_ONLY: "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30",
// };
// const AUDIENCE_DOT   = { ALL: "bg-blue-400",    USERS_ONLY: "bg-emerald-400", TUTORS_ONLY: "bg-amber-400" };
// const AUDIENCE_LABEL = { ALL: "Everyone",       USERS_ONLY: "Students",       TUTORS_ONLY: "Tutors" };
// const EMPTY_FORM = { title: "", content: "", targetAudience: "ALL", coverImage: "", publishNow: false };

// function fmt(d) {
//   if (!d) return "—";
//   return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
// }
// function stripHtml(html) { return html?.replace(/<[^>]*>/g, "") || ""; }
// function wordCount(html) {
//   return stripHtml(html).trim().split(/\s+/).filter(Boolean).length;
// }
// function readTime(html) {
//   return Math.max(1, Math.ceil(wordCount(html) / 200));
// }

// // ─── Rich Text Toolbar Button ─────────────────────────────────────────────────
// function ToolBtn({ onClick, active, title, children }) {
//   return (
//     <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }} title={title}
//       className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150 ${
//         active
//           ? "bg-blue-600 text-white shadow-md shadow-blue-900/50"
//           : "text-slate-400 hover:text-white hover:bg-slate-700/80"
//       }`}>
//       {children}
//     </button>
//   );
// }

// // ─── Rich Text Editor ─────────────────────────────────────────────────────────
// function RichEditor({ value, onChange, placeholder }) {
//   const ref = useRef(null);
//   const [fmt, setFmt] = useState({});

//   useEffect(() => {
//     if (ref.current && document.activeElement !== ref.current)
//       ref.current.innerHTML = value || "";
//   }, [value]);

//   const sync = () => {
//     setFmt({
//       bold: document.queryCommandState("bold"),
//       italic: document.queryCommandState("italic"),
//       underline: document.queryCommandState("underline"),
//       strikeThrough: document.queryCommandState("strikeThrough"),
//       insertUnorderedList: document.queryCommandState("insertUnorderedList"),
//       insertOrderedList: document.queryCommandState("insertOrderedList"),
//     });
//   };

//   const exec = (cmd, val = null) => {
//     ref.current?.focus();
//     document.execCommand(cmd, false, val);
//     sync();
//     if (ref.current) onChange(ref.current.innerHTML);
//   };

//   const TOOLBAR_GROUPS = [
//     [
//       { cmd: "bold",          title: "Bold",          icon: <b>B</b> },
//       { cmd: "italic",        title: "Italic",        icon: <i>I</i> },
//       { cmd: "underline",     title: "Underline",     icon: <u>U</u> },
//       { cmd: "strikeThrough", title: "Strikethrough", icon: <s>S</s> },
//     ],
//     [
//       { act: () => exec("formatBlock","h2"), title: "Heading 2", icon: "H2" },
//       { act: () => exec("formatBlock","h3"), title: "Heading 3", icon: "H3" },
//       { act: () => exec("formatBlock","p"),  title: "Paragraph", icon: "¶"  },
//     ],
//     [
//       { cmd: "insertUnorderedList", title: "Bullet list",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg> },
//       { cmd: "insertOrderedList",   title: "Numbered list", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg> },
//       { act: () => exec("indent"),  title: "Indent",        icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg> },
//       { act: () => exec("outdent"), title: "Outdent",       icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg> },
//     ],
//     [
//       { act: () => exec("justifyLeft"),   title: "Left",   icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8M4 18h12"/></svg> },
//       { act: () => exec("justifyCenter"), title: "Center", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M6 18h12"/></svg> },
//       { act: () => exec("justifyRight"),  title: "Right",  icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M12 12h8M8 18h12"/></svg> },
//     ],
//     [
//       { act: () => { const u = prompt("Enter URL:"); if (u) exec("createLink", u); }, title: "Insert link", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg> },
//       { act: () => exec("removeFormat"), title: "Clear formatting", icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg> },
//     ],
//   ];

//   const isEmpty = !value || value === "<br>" || value === "<div><br></div>";

//   return (
//     <div className="rounded-xl border border-slate-600/60 overflow-hidden bg-slate-800/60 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-inner">
//       {/* Toolbar */}
//       <div className="flex items-center gap-1 px-3 py-2.5 bg-slate-900/80 border-b border-slate-700/60 flex-wrap">
//         {TOOLBAR_GROUPS.map((group, gi) => (
//           <div key={gi} className="flex items-center gap-0.5">
//             {gi > 0 && <span className="w-px h-5 bg-slate-700 mx-1.5" />}
//             {group.map((btn, bi) => (
//               <ToolBtn key={bi} title={btn.title} active={btn.cmd ? !!fmt[btn.cmd] : false}
//                 onClick={btn.act ?? (() => exec(btn.cmd))}>
//                 {btn.icon}
//               </ToolBtn>
//             ))}
//           </div>
//         ))}
//         <div className="ml-auto flex items-center gap-3">
//           <span className="text-[10px] text-slate-600 font-mono tabular-nums">
//             {wordCount(value)} words · {readTime(value)} min read
//           </span>
//         </div>
//       </div>

//       {/* Editable */}
//       <div className="relative">
//         {isEmpty && (
//           <p className="absolute top-4 left-5 right-5 text-slate-500 text-sm pointer-events-none select-none leading-relaxed">
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
//           onKeyDown={(e) => { if (e.key === "Tab") { e.preventDefault(); exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;"); } }}
//           className="min-h-[300px] max-h-[560px] overflow-y-auto px-5 py-4 text-slate-200 text-sm leading-7 outline-none
//             [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-slate-700 [&_h2]:pb-2
//             [&_h3]:font-serif [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-100 [&_h3]:mt-4 [&_h3]:mb-2
//             [&_p]:mb-4 [&_p]:leading-7
//             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
//             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
//             [&_li]:leading-relaxed [&_li]:text-slate-300
//             [&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-blue-300
//             [&_strong]:text-white [&_strong]:font-bold
//             [&_em]:text-slate-300 [&_em]:italic
//             [&_u]:underline [&_u]:underline-offset-2
//             [&_hr]:border-slate-700 [&_hr]:my-5
//             [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-5 [&_blockquote]:text-slate-400 [&_blockquote]:italic [&_blockquote]:my-4
//           "
//           style={{ caretColor: "#60a5fa" }}
//         />
//       </div>
//     </div>
//   );
// }

// // ─── Toast ────────────────────────────────────────────────────────────────────
// function Toast({ toast }) {
//   if (!toast) return null;
//   return (
//     <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold border ${
//       toast.type === "error"
//         ? "bg-red-950 border-red-800/60 text-red-200 shadow-red-950/60"
//         : "bg-slate-900 border-blue-700/40 text-blue-100 shadow-blue-950/60"
//     }`} style={{ animation: "slideIn .3s ease" }}>
//       <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
//         toast.type === "error" ? "bg-red-600" : "bg-blue-600"
//       }`}>
//         {toast.type === "error" ? "✕" : "✓"}
//       </span>
//       {toast.msg}
//     </div>
//   );
// }

// // ─── Delete Confirm ───────────────────────────────────────────────────────────
// function ConfirmModal({ open, onConfirm, onCancel, isSubmitting }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[998] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center px-4">
//       <div className="bg-slate-900 border border-slate-700 rounded-2xl p-7 max-w-sm w-full shadow-2xl shadow-slate-950/80">
//         <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
//           <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//           </svg>
//         </div>
//         <h3 className="font-serif text-lg font-bold text-white mb-1.5">Delete this article?</h3>
//         <p className="text-sm text-slate-400 mb-6 leading-relaxed">This is permanent and cannot be undone. The article will be removed from the platform immediately.</p>
//         <div className="flex gap-3">
//           <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all">Cancel</button>
//           <button onClick={onConfirm} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all disabled:opacity-50">
//             {isSubmitting ? "Deleting…" : "Delete Article"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Article Row ──────────────────────────────────────────────────────────────
// function ArticleRow({ news, onEdit, onDelete, onTogglePublish, isSubmitting }) {
//   const badge = AUDIENCE_BADGE[news.targetAudience] ?? AUDIENCE_BADGE.ALL;
//   const dot   = AUDIENCE_DOT[news.targetAudience]   ?? AUDIENCE_DOT.ALL;
//   const plain = stripHtml(news.content);

//   return (
//     <div className="group flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all duration-200">
//       {/* Thumb */}
//       <div className="hidden sm:flex w-11 h-11 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0 items-center justify-center">
//         {news.coverImage ? (
//           <img src={news.coverImage} alt="" className="w-full h-full object-cover"
//             onError={(e) => { e.target.style.display = "none"; e.target.parentElement.innerHTML = '<span class="text-lg">📰</span>'; }} />
//         ) : (
//           <span className="text-base">📰</span>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1 flex-wrap">
//           <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${badge}`}>
//             <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
//             {AUDIENCE_LABEL[news.targetAudience]}
//           </span>
//           <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
//             news.isPublished
//               ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
//               : "bg-slate-800 text-slate-500 ring-1 ring-slate-700"
//           }`}>
//             {news.isPublished ? "● Live" : "○ Draft"}
//           </span>
//           <span className="text-[11px] text-slate-600 font-medium">{fmt(news.publishedAt || news.createdAt)}</span>
//         </div>
//         <p className="text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">{news.title}</p>
//         <p className="text-xs text-slate-600 truncate mt-0.5">{plain.slice(0, 95)}{plain.length > 95 ? "…" : ""}</p>
//       </div>

//       {/* Actions */}
//       <div className="flex items-center gap-1 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
//         <button onClick={() => onEdit(news)} title="Edit"
//           className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all">
//           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
//           Edit
//         </button>

//         <button onClick={() => onTogglePublish(news)} disabled={isSubmitting} title={news.isPublished ? "Unpublish" : "Publish"}
//           className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all disabled:opacity-40 ${
//             news.isPublished
//               ? "text-slate-400 hover:text-amber-300 hover:bg-amber-500/10"
//               : "text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10"
//           }`}>
//           {news.isPublished
//             ? <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>Unpublish</>
//             : <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Publish</>
//           }
//         </button>

//         <button onClick={() => onDelete(news.id)} disabled={isSubmitting} title="Delete"
//           className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition-all disabled:opacity-40">
//           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Public Preview ───────────────────────────────────────────────────────────
// function PublicPreview({ articles }) {
//   const published = (articles || []).filter((n) => n.isPublished);
//   const hero = published[0];
//   const rest = published.slice(1);

//   if (!published.length) return (
//     <div className="flex flex-col items-center justify-center py-28 gap-4 text-slate-500">
//       <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl">🗞️</div>
//       <p className="font-semibold text-slate-400">No published articles yet</p>
//       <p className="text-sm text-slate-600">Publish an article in the Write tab to see it appear here</p>
//     </div>
//   );

//   return (
//     <div className="space-y-10">
//       {hero && (
//         <section>
//           <div className="flex items-center gap-3 mb-6">
//             <span className="w-1 h-7 bg-blue-500 rounded-full" />
//             <h2 className="font-serif text-lg font-bold text-slate-200">Featured Story</h2>
//           </div>
//           <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl shadow-slate-950/60">
//             {hero.coverImage
//               ? <img src={hero.coverImage} alt={hero.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => e.target.style.display="none"} />
//               : <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950" />
//             }
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent" />
//             <div className="absolute bottom-0 left-0 right-0 p-8">
//               <div className="flex items-center gap-3 mb-3">
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${AUDIENCE_BADGE[hero.targetAudience]}`}>
//                   <span className={`w-1.5 h-1.5 rounded-full ${AUDIENCE_DOT[hero.targetAudience]}`} />{AUDIENCE_LABEL[hero.targetAudience]}
//                 </span>
//                 <span className="text-slate-500 text-xs font-medium">{fmt(hero.publishedAt || hero.createdAt)}</span>
//               </div>
//               <h2 className="font-serif text-2xl font-extrabold text-white leading-tight mb-2">{hero.title}</h2>
//               <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 max-w-2xl">{stripHtml(hero.content).slice(0, 200)}…</p>
//             </div>
//           </div>
//         </section>
//       )}

//       {rest.length > 0 && (
//         <section>
//           <div className="flex items-center gap-3 mb-6">
//             <span className="w-1 h-7 bg-blue-500 rounded-full" />
//             <h2 className="font-serif text-lg font-bold text-slate-200">More Articles</h2>
//             <span className="ml-auto text-xs text-slate-600 font-medium">{rest.length} more</span>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {rest.map((n) => (
//               <div key={n.id} className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
//                 {n.coverImage
//                   ? <div className="h-32"><img src={n.coverImage} alt={n.title} className="w-full h-full object-cover" onError={(e) => e.target.style.display="none"} /></div>
//                   : <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
//                 }
//                 <div className="p-4 space-y-2">
//                   <div className="flex items-center gap-2">
//                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${AUDIENCE_BADGE[n.targetAudience]}`}>
//                       <span className={`w-1 h-1 rounded-full ${AUDIENCE_DOT[n.targetAudience]}`} />{AUDIENCE_LABEL[n.targetAudience]}
//                     </span>
//                     <span className="text-[11px] text-slate-600">{fmt(n.publishedAt || n.createdAt)}</span>
//                   </div>
//                   <h3 className="font-serif text-sm font-bold text-slate-100 line-clamp-2 leading-snug">{n.title}</h3>
//                   <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{stripHtml(n.content).slice(0, 110)}…</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function AdminNewsPage() {
//   const { newsList, isLoading, isSubmitting, filters, setFilters, fetchNews, createNews, updateNews, deleteNews } = useNewsStore();

//   const [tab, setTab]               = useState("write");
//   const [form, setForm]             = useState(EMPTY_FORM);
//   const [editingId, setEditingId]   = useState(null);
//   const [search, setSearch]         = useState("");
//   const [toast, setToast]           = useState(null);
//   const [confirmId, setConfirmId]   = useState(null);

//   useEffect(() => { fetchNews(); }, [filters]);

//   const showToast = useCallback((msg, type = "success") => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 4000);
//   }, []);

//   const field = (k, v) => setForm(f => ({ ...f, [k]: v }));
//   const reset = () => { setForm(EMPTY_FORM); setEditingId(null); };

//   const doEdit = (n) => {
//     setForm({ title: n.title || "", content: n.content || "", targetAudience: n.targetAudience || "ALL", coverImage: n.coverImage || "", publishNow: n.isPublished || false });
//     setEditingId(n.id);
//     setTab("write");
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const doSubmit = async () => {
//     if (!form.title.trim()) { showToast("Title is required.", "error"); return; }
//     if (!stripHtml(form.content).trim()) { showToast("Content cannot be empty.", "error"); return; }
//     let result;
//     if (editingId) {
//       result = await updateNews(editingId, { title: form.title, content: form.content, targetAudience: form.targetAudience, coverImage: form.coverImage || undefined, isPublished: form.publishNow });
//       if (result) { showToast("Article updated successfully!"); reset(); }
//       else showToast("Failed to update article.", "error");
//     } else {
//       result = await createNews({ title: form.title, content: form.content, targetAudience: form.targetAudience, coverImage: form.coverImage || undefined, publishNow: form.publishNow });
//       if (result) { showToast(form.publishNow ? "Article published!" : "Draft saved!"); reset(); }
//       else showToast("Failed to create article.", "error");
//     }
//   };

//   const doToggle = async (n) => {
//     const r = await updateNews(n.id, { isPublished: !n.isPublished });
//     if (r) showToast(r.isPublished ? "Article is now live!" : "Moved to drafts.");
//     else showToast("Failed to update status.", "error");
//   };

//   const doDelete = async () => {
//     const ok = await deleteNews(confirmId);
//     setConfirmId(null);
//     if (ok) showToast("Article deleted."); else showToast("Delete failed.", "error");
//   };

//   const filtered = (newsList || []).filter(n => {
//     if (filters.isPublished !== undefined && n.isPublished !== filters.isPublished) return false;
//     if (filters.targetAudience && n.targetAudience !== filters.targetAudience) return false;
//     return true;
//   });

//   const stats = {
//     total:     (newsList || []).length,
//     live:      (newsList || []).filter(n => n.isPublished).length,
//     drafts:    (newsList || []).filter(n => !n.isPublished).length,
//   };

//   const wc = wordCount(form.content);
//   const rt = readTime(form.content);

//   const TABS = [
//     { key: "write",   label: "Write",   icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>, badge: editingId ? "Editing" : "New" },
//     { key: "manage",  label: "Manage",  icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>, badge: String(filtered.length) },
//     { key: "preview", label: "Preview", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>, badge: `${stats.live} live` },
//   ];

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
//       <style>{`
//         @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
//       `}</style>

//       <Toast toast={toast} />
//       <ConfirmModal open={!!confirmId} onConfirm={doDelete} onCancel={() => setConfirmId(null)} isSubmitting={isSubmitting} />

//       {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
//       <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
//         {/* Top accent line */}
//         <div className="h-0.5 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-700" />
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
//           {/* Brand */}
//           <div className="flex items-center gap-3.5 mr-auto">
//             <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 shadow-lg shadow-blue-900/50">
//               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
//               </svg>
//             </div>
//             <div>
//               <p className="text-base font-bold text-white tracking-tight font-serif leading-none">FillOps News</p>
//               <p className="text-[10px] text-slate-500 uppercase tracking-[0.18em] mt-0.5">Editorial Dashboard</p>
//             </div>
//           </div>

//           {/* Stats */}
//           <div className="hidden md:flex items-center divide-x divide-slate-800">
//             {[
//               { label: "Total",   val: stats.total, color: "text-slate-300" },
//               { label: "Live",    val: stats.live,  color: "text-emerald-400" },
//               { label: "Drafts",  val: stats.drafts, color: "text-amber-400" },
//             ].map(s => (
//               <div key={s.label} className="px-5 text-center">
//                 <p className={`text-xl font-bold font-serif tabular-nums ${s.color}`}>{s.val}</p>
//                 <p className="text-[10px] text-slate-600 uppercase tracking-wider font-medium mt-0.5">{s.label}</p>
//               </div>
//             ))}
//           </div>

//           {/* Live page button */}
//           <Link to="/news" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all no-underline border border-slate-700 hover:border-slate-500 group">
//             <svg className="w-3.5 h-3.5 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//             </svg>
//             Live Page
//           </Link>
//         </div>
//       </header>

//       {/* ══ TAB BAR ══════════════════════════════════════════════════════════════ */}
//       <div className="sticky top-[65px] z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-xl">
//         <div className="max-w-7xl mx-auto px-6">
//           <div className="flex">
//             {TABS.map(t => (
//               <button key={t.key} onClick={() => setTab(t.key)}
//                 className={`relative flex items-center gap-2.5 px-5 py-4 text-sm font-semibold transition-all duration-200 ${
//                   tab === t.key ? "text-blue-300" : "text-slate-500 hover:text-slate-300"
//                 }`}>
//                 <span className={`transition-colors ${tab === t.key ? "text-blue-400" : "text-slate-600"}`}>{t.icon}</span>
//                 {t.label}
//                 <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tabular-nums ${
//                   tab === t.key
//                     ? "bg-blue-500/20 text-blue-300"
//                     : "bg-slate-800 text-slate-600"
//                 }`}>
//                   {t.badge}
//                 </span>
//                 {tab === t.key && (
//                   <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
//                 )}
//                 {t.key === "write" && editingId && (
//                   <span className="absolute top-3.5 right-2 w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ══ WRITE TAB ════════════════════════════════════════════════════════════ */}
//       {tab === "write" && (
//         <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">

//           {/* ── Left: Form ── */}
//           <div className="space-y-7">

//             {/* Editing banner */}
//             {editingId && (
//               <div className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-blue-500/8 border border-blue-500/20">
//                 <div className="flex items-center gap-3 text-blue-300 text-sm font-medium">
//                   <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
//                     <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
//                   </div>
//                   Editing existing article
//                 </div>
//                 <button onClick={reset} className="text-xs text-slate-600 hover:text-slate-300 font-medium transition-colors">Discard changes</button>
//               </div>
//             )}

//             {/* Title */}
//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Headline <span className="text-blue-500">*</span></label>
//                 <span className="text-[10px] text-slate-700 font-mono tabular-nums">{form.title.length}/200</span>
//               </div>
//               <input type="text" value={form.title} maxLength={200} onChange={e => field("title", e.target.value)}
//                 placeholder="Write a compelling headline…"
//                 className="w-full px-5 py-4 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-serif transition-all shadow-inner" />
//             </div>

//             {/* Rich text */}
//             <div className="space-y-2">
//               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Content <span className="text-blue-500">*</span></label>
//               <RichEditor value={form.content} onChange={v => field("content", v)}
//                 placeholder="Start writing your article… Use the toolbar to add headings, lists, links, and rich formatting." />
//             </div>

//             {/* Cover image */}
//             <div className="space-y-2">
//               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
//                 Cover Image URL <span className="text-slate-700 normal-case font-normal">(optional)</span>
//               </label>
//               <div className="flex gap-3">
//                 <input type="url" value={form.coverImage} onChange={e => field("coverImage", e.target.value)}
//                   placeholder="https://example.com/cover.jpg"
//                   className="flex-1 px-5 py-3.5 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all" />
//                 {form.coverImage && (
//                   <button onClick={() => field("coverImage", "")}
//                     className="px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all">
//                     Remove
//                   </button>
//                 )}
//               </div>
//               {form.coverImage && (
//                 <div className="relative mt-2 h-44 rounded-xl overflow-hidden border border-slate-700">
//                   <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover"
//                     onError={e => { e.target.style.display = "none"; }} />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
//                   <span className="absolute bottom-3 left-3 text-xs text-white/50 bg-black/40 px-2 py-1 rounded-lg font-medium">Cover preview</span>
//                 </div>
//               )}
//             </div>

//             {/* Audience */}
//             <div className="space-y-3">
//               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Audience</label>
//               <div className="grid grid-cols-3 gap-3">
//                 {AUDIENCE_OPTIONS.map(opt => (
//                   <button key={opt.value} onClick={() => field("targetAudience", opt.value)}
//                     className={`relative flex flex-col items-center gap-3 px-3 py-5 rounded-xl border text-xs font-semibold transition-all ${
//                       form.targetAudience === opt.value
//                         ? "bg-blue-600/15 border-blue-500/50 text-blue-300 shadow-lg shadow-blue-950/30"
//                         : "border-slate-800 bg-slate-900/40 text-slate-500 hover:border-slate-700 hover:text-slate-300 hover:bg-slate-800/40"
//                     }`}>
//                     {form.targetAudience === opt.value && (
//                       <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500" />
//                     )}
//                     <span className="text-2xl">{opt.icon}</span>
//                     <div className="text-center leading-tight">
//                       <p className="font-bold">{opt.label}</p>
//                       <p className={`text-[10px] mt-0.5 ${form.targetAudience === opt.value ? "text-blue-400/60" : "text-slate-600"}`}>{opt.desc}</p>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Publish toggle */}
//             <div className="flex items-center justify-between px-6 py-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
//               <div className="flex items-center gap-4">
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${
//                   form.publishNow
//                     ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
//                     : "bg-slate-800 border-slate-700 text-slate-500"
//                 }`}>
//                   {form.publishNow
//                     ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" /></svg>
//                     : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
//                   }
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-slate-100">{form.publishNow ? "Will publish immediately" : "Save as draft"}</p>
//                   <p className="text-xs text-slate-600 mt-0.5">{form.publishNow ? "Goes live the moment you submit" : "Only visible to admin until published"}</p>
//                 </div>
//               </div>
//               <button onClick={() => field("publishNow", !form.publishNow)}
//                 className={`relative w-14 h-7 rounded-full transition-all duration-300 ${form.publishNow ? "bg-emerald-500 shadow-lg shadow-emerald-900/30" : "bg-slate-700"}`}>
//                 <span className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${form.publishNow ? "translate-x-7" : "translate-x-0"}`} />
//               </button>
//             </div>

//             {/* Action buttons */}
//             <div className="flex gap-3 pt-1">
//               {editingId && (
//                 <button onClick={reset}
//                   className="px-6 py-3.5 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 text-sm font-semibold transition-all">
//                   Cancel
//                 </button>
//               )}
//               <button onClick={doSubmit} disabled={isSubmitting}
//                 className="flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white text-sm font-bold transition-all shadow-xl shadow-blue-950/50 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/50">
//                 {isSubmitting
//                   ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Saving…</>
//                   : editingId ? "Save Changes"
//                   : form.publishNow ? "Publish Article"
//                   : "Save as Draft"
//                 }
//               </button>
//             </div>
//           </div>

//           {/* ── Right: Sidebar ── */}
//           <aside className="hidden xl:flex flex-col gap-5">
//             <div className="sticky top-36 space-y-5">

//               {/* Live card preview */}
//               <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
//                 <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
//                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Card Preview</h3>
//                   </div>
//                   <span className="text-[10px] text-slate-700">Live as you type</span>
//                 </div>
//                 <div className="p-4">
//                   <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
//                     {form.coverImage
//                       ? <div className="h-28 bg-slate-800"><img src={form.coverImage} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display="none"} /></div>
//                       : <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-400" />
//                     }
//                     <div className="p-4 space-y-2.5">
//                       <div className="flex items-center gap-2">
//                         <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${AUDIENCE_BADGE[form.targetAudience]}`}>
//                           <span className={`w-1 h-1 rounded-full ${AUDIENCE_DOT[form.targetAudience]}`} />{AUDIENCE_LABEL[form.targetAudience]}
//                         </span>
//                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${form.publishNow ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
//                           {form.publishNow ? "● Live" : "○ Draft"}
//                         </span>
//                       </div>
//                       <p className="text-sm font-bold font-serif text-slate-100 leading-snug line-clamp-2">
//                         {form.title || <span className="text-slate-600 font-normal italic text-xs">Headline appears here…</span>}
//                       </p>
//                       <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
//                         {stripHtml(form.content).slice(0, 120) || <span className="italic">Content preview…</span>}
//                       </p>
//                       <div className="flex justify-between items-center pt-2 border-t border-slate-800">
//                         <span className="text-[10px] text-slate-600">{fmt(new Date())}</span>
//                         <span className="text-[10px] font-semibold text-blue-400">Read more →</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Writing stats */}
//               <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
//                 <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Article Stats</h3>
//                 <div className="grid grid-cols-2 gap-2.5">
//                   {[
//                     { label: "Words",      val: wc,          color: "text-white" },
//                     { label: "Characters", val: stripHtml(form.content).length, color: "text-slate-300" },
//                     { label: "Est. read",  val: `${rt} min`, color: "text-blue-300" },
//                     { label: "Title len",  val: form.title.length, color: "text-slate-400" },
//                   ].map(s => (
//                     <div key={s.label} className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
//                       <p className={`text-lg font-bold font-serif tabular-nums ${s.color}`}>{s.val}</p>
//                       <p className="text-[10px] text-slate-600 mt-0.5">{s.label}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Tip */}
//               <div className="bg-blue-950/30 border border-blue-900/40 rounded-xl p-4">
//                 <p className="text-xs text-slate-500 leading-relaxed">
//                   <span className="text-blue-400 font-semibold">Tip —</span> Switch to the{" "}
//                   <button onClick={() => setTab("preview")} className="text-slate-300 font-semibold hover:text-blue-300 transition-colors underline underline-offset-2">Preview tab</button>{" "}
//                   to see the full public news page as users experience it.
//                 </p>
//               </div>
//             </div>
//           </aside>
//         </div>
//       )}

//       {/* ══ MANAGE TAB ════════════════════════════════════════════════════════════ */}
//       {tab === "manage" && (
//         <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">
//           {/* Toolbar card */}
//           <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6 space-y-4">
//             {/* Search */}
//             <form onSubmit={e => { e.preventDefault(); setFilters({ search }); }} className="flex gap-3">
//               <div className="relative flex-1">
//                 <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//                 <input type="text" value={search} onChange={e => setSearch(e.target.value)}
//                   placeholder="Search articles by title or content…"
//                   className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
//               </div>
//               <button type="submit" className="px-5 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-semibold transition-all border border-slate-600">Search</button>
//               {filters.search && (
//                 <button type="button" onClick={() => { setSearch(""); setFilters({ search: "" }); }}
//                   className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-500 text-sm border border-slate-700 transition-all">✕</button>
//               )}
//             </form>

//             {/* Filter chips */}
//             <div className="flex flex-wrap gap-2 items-center">
//               <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mr-1">Filter:</span>
//               {[{ label: "All Status", val: undefined }, { label: "● Live", val: true }, { label: "○ Drafts", val: false }].map(opt => (
//                 <button key={String(opt.val)} onClick={() => setFilters({ isPublished: opt.val })}
//                   className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${filters.isPublished === opt.val ? "bg-blue-500/15 border-blue-500/40 text-blue-300" : "border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-300"}`}>
//                   {opt.label}
//                 </button>
//               ))}
//               <span className="w-px h-4 bg-slate-800 mx-1" />
//               {[{ label: "All", val: undefined }, { label: "🎓 Students", val: "USERS_ONLY" }, { label: "👨‍🏫 Tutors", val: "TUTORS_ONLY" }, { label: "🌍 Everyone", val: "ALL" }].map(opt => (
//                 <button key={String(opt.val)} onClick={() => setFilters({ targetAudience: opt.val })}
//                   className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${filters.targetAudience === opt.val ? "bg-blue-500/15 border-blue-500/40 text-blue-300" : "border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-300"}`}>
//                   {opt.label}
//                 </button>
//               ))}
//               <button onClick={fetchNews} className="ml-auto flex items-center gap-1.5 text-xs text-slate-700 hover:text-blue-400 font-medium transition-colors">
//                 <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* List */}
//           <div className="space-y-2">
//             {isLoading && (
//               <div className="flex items-center justify-center py-24 gap-3 text-slate-600">
//                 <div className="w-6 h-6 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
//                 <span className="text-sm">Loading articles…</span>
//               </div>
//             )}
//             {!isLoading && !filtered.length && (
//               <div className="text-center py-24 space-y-3">
//                 <p className="text-4xl">🗞️</p>
//                 <p className="text-slate-500 text-sm font-medium">No articles found</p>
//                 <button onClick={() => { setFilters({ isPublished: undefined, targetAudience: undefined, search: "" }); setSearch(""); }}
//                   className="text-xs text-blue-500 hover:text-blue-400 font-semibold transition-colors">Clear all filters</button>
//               </div>
//             )}
//             {!isLoading && filtered.map(n => (
//               <ArticleRow key={n.id} news={n} onEdit={doEdit} onDelete={id => setConfirmId(id)} onTogglePublish={doToggle} isSubmitting={isSubmitting} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* ══ PREVIEW TAB ═══════════════════════════════════════════════════════════ */}
//       {tab === "preview" && (
//         <div className="flex-1 flex flex-col">
//           {/* Banner */}
//           <div className="bg-blue-950/30 border-b border-blue-900/30 px-6 py-3">
//             <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
//               <div className="flex items-center gap-2.5 text-blue-400/80 text-xs font-semibold">
//                 <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
//                 Admin Preview — showing the public news feed exactly as users see it
//               </div>
//               <div className="flex items-center gap-4">
//                 <span className="text-xs text-slate-600">{stats.live} published · {stats.drafts} drafts</span>
//                 <button onClick={fetchNews} className="text-xs text-slate-600 hover:text-blue-400 transition-colors flex items-center gap-1.5 font-medium">
//                   <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
//                   Refresh
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Simulated public page */}
//           <div className="flex-1 bg-slate-950">
//             <div className="bg-slate-900 border-b border-slate-800" style={{ borderBottomWidth: "3px", borderBottomColor: "#2563eb" }}>
//               <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
//                     <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
//                   </div>
//                   <div>
//                     <p className="font-serif text-xl font-bold text-white">FillOps News</p>
//                     <p className="text-[10px] text-slate-500 uppercase tracking-widest">Stay informed · Stay ahead</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-[11px] text-slate-500 font-medium">
//                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
//                   Admin Preview
//                 </div>
//               </div>
//             </div>

//             <div className="max-w-6xl mx-auto px-6 py-10">
//               {isLoading
//                 ? <div className="flex items-center justify-center py-24 gap-3 text-slate-600"><div className="w-7 h-7 rounded-full border-2 border-slate-800 border-t-blue-500 animate-spin" /><span className="text-sm">Loading…</span></div>
//                 : <PublicPreview articles={newsList || []} />
//               }
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useNewsStore from "@/store/newsStore";

// ─── Constants ────────────────────────────────────────────────────────────────
const AUDIENCE_OPTIONS = [
  { value: "ALL",         label: "Everyone",  icon: "🌍", desc: "All platform users"   },
  { value: "USERS_ONLY",  label: "Students",  icon: "🎓", desc: "Student accounts"     },
  { value: "TUTORS_ONLY", label: "Tutors",    icon: "👨‍🏫", desc: "Tutor accounts"      },
];
const AUDIENCE_BADGE = {
  ALL:         "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  USERS_ONLY:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  TUTORS_ONLY: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};
const AUDIENCE_DOT = { ALL: "bg-blue-500", USERS_ONLY: "bg-emerald-500", TUTORS_ONLY: "bg-amber-500" };
const AUDIENCE_LABEL = { ALL: "Everyone", USERS_ONLY: "Students", TUTORS_ONLY: "Tutors" };
const EMPTY_FORM = { title: "", content: "", targetAudience: "ALL", coverImage: "", publishNow: false };

function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function stripHtml(h) { return h?.replace(/<[^>]*>/g, "") || ""; }
function wc(h) { return stripHtml(h).trim().split(/\s+/).filter(Boolean).length; }
function rt(h) { return Math.max(1, Math.ceil(wc(h) / 200)); }

// ─── Rich Text Toolbar Btn ────────────────────────────────────────────────────
function ToolBtn({ onClick, active, title, children }) {
  return (
    <button type="button" onMouseDown={e => { e.preventDefault(); onClick(); }} title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
        active ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
      }`}>
      {children}
    </button>
  );
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────
function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const [activeFmt, setActiveFmt] = useState({});

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current)
      ref.current.innerHTML = value || "";
  }, [value]);

  const sync = () => setActiveFmt({
    bold: document.queryCommandState("bold"),
    italic: document.queryCommandState("italic"),
    underline: document.queryCommandState("underline"),
    strikeThrough: document.queryCommandState("strikeThrough"),
    insertUnorderedList: document.queryCommandState("insertUnorderedList"),
    insertOrderedList: document.queryCommandState("insertOrderedList"),
  });

  const exec = (cmd, val = null) => {
    ref.current?.focus();
    document.execCommand(cmd, false, val);
    sync();
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const GROUPS = [
    [
      { cmd: "bold",          title: "Bold",          icon: <b className="text-[11px]">B</b> },
      { cmd: "italic",        title: "Italic",        icon: <i className="text-[11px]">I</i> },
      { cmd: "underline",     title: "Underline",     icon: <u className="text-[11px]">U</u> },
      { cmd: "strikeThrough", title: "Strikethrough", icon: <s className="text-[11px]">S</s> },
    ],
    [
      { act: () => exec("formatBlock","h2"), title: "Heading 2", icon: <span className="text-[10px] font-black">H2</span> },
      { act: () => exec("formatBlock","h3"), title: "Heading 3", icon: <span className="text-[10px] font-black">H3</span> },
      { act: () => exec("formatBlock","p"),  title: "Paragraph", icon: <span className="text-[11px]">¶</span> },
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
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200 flex-wrap">
        {GROUPS.map((g, gi) => (
          <div key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="w-px h-4 bg-slate-200 mx-1.5" />}
            {g.map((btn, bi) => (
              <ToolBtn key={bi} title={btn.title} active={btn.cmd ? !!activeFmt[btn.cmd] : false}
                onClick={btn.act ?? (() => exec(btn.cmd))}>
                {btn.icon}
              </ToolBtn>
            ))}
          </div>
        ))}
        <span className="ml-auto text-[10px] text-slate-400 font-mono tabular-nums">
          {wc(value)} words · {rt(value)} min
        </span>
      </div>

      {/* Content area */}
      <div className="relative">
        {empty && (
          <p className="absolute top-4 left-5 right-5 text-slate-400 text-sm pointer-events-none select-none leading-relaxed">
            {placeholder}
          </p>
        )}
        <div ref={ref} contentEditable suppressContentEditableWarning
          onInput={() => { if (ref.current) onChange(ref.current.innerHTML); sync(); }}
          onKeyUp={sync} onMouseUp={sync}
          onKeyDown={e => { if (e.key === "Tab") { e.preventDefault(); exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;"); } }}
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
          "
          style={{ caretColor: "#2563eb" }}
        />
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-[999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${
      toast.type === "error"
        ? "bg-white border-red-200 text-red-700 shadow-red-100"
        : "bg-white border-emerald-200 text-emerald-700 shadow-emerald-100"
    }`} style={{ animation: "slideUp .3s ease" }}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${toast.type === "error" ? "bg-red-500" : "bg-emerald-500"}`}>
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
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">This action is permanent and cannot be undone. The article will be removed immediately.</p>
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

// ─── Article Table Row ────────────────────────────────────────────────────────
function ArticleTableRow({ news, onEdit, onDelete, onTogglePublish, isSubmitting, index }) {
  const badge = AUDIENCE_BADGE[news.targetAudience] ?? AUDIENCE_BADGE.ALL;
  const dot   = AUDIENCE_DOT[news.targetAudience]   ?? AUDIENCE_DOT.ALL;
  const plain = stripHtml(news.content);

  return (
    <tr className="group border-b border-slate-100 hover:bg-blue-50/30 transition-colors">
      {/* # */}
      <td className="pl-6 py-4 w-10">
        <span className="text-xs text-slate-400 font-mono tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      </td>

      {/* Cover + title */}
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {news.coverImage ? (
              <img src={news.coverImage} alt="" className="w-full h-full object-cover"
                onError={e => { e.target.style.display="none"; }} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate max-w-xs group-hover:text-blue-700 transition-colors">
              {news.title}
            </p>
            <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
              {plain.slice(0, 70)}{plain.length > 70 ? "…" : ""}
            </p>
          </div>
        </div>
      </td>

      {/* Audience */}
      <td className="py-4 pr-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
          {AUDIENCE_LABEL[news.targetAudience]}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 pr-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
          news.isPublished
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${news.isPublished ? "bg-emerald-500" : "bg-slate-400"}`} />
          {news.isPublished ? "Live" : "Draft"}
        </span>
      </td>

      {/* Date */}
      <td className="py-4 pr-4">
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{fmt(news.publishedAt || news.createdAt)}</span>
      </td>

      {/* Read time */}
      <td className="py-4 pr-4">
        <span className="text-xs text-slate-400">{rt(news.content)} min</span>
      </td>

      {/* Actions */}
      <td className="py-4 pr-6">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          <button onClick={() => onEdit(news)} title="Edit"
            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={() => onTogglePublish(news)} disabled={isSubmitting} title={news.isPublished ? "Unpublish" : "Publish"}
            className={`p-2 rounded-lg transition-all disabled:opacity-40 ${
              news.isPublished
                ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
            }`}>
            {news.isPublished ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button onClick={() => onDelete(news.id)} disabled={isSubmitting} title="Delete"
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Public Preview ───────────────────────────────────────────────────────────
function PublicPreview({ articles }) {
  const published = (articles || []).filter(n => n.isPublished);
  const hero = published[0];
  const featured = published.slice(1, 3);
  const more = published.slice(3);

  if (!published.length) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-400">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      </div>
      <p className="font-semibold text-slate-500">No published articles yet</p>
      <p className="text-sm">Publish an article to see the public feed here</p>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Hero */}
      {hero && (
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 380 }}>
          {hero.coverImage
            ? <img src={hero.coverImage} alt={hero.title} className="absolute inset-0 w-full h-full object-cover" onError={e => e.target.style.display="none"} />
            : <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900" />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${AUDIENCE_BADGE[hero.targetAudience]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${AUDIENCE_DOT[hero.targetAudience]}`} />{AUDIENCE_LABEL[hero.targetAudience]}
            </span>
            <h2 className="font-serif text-2xl font-bold text-white leading-tight mb-2">{hero.title}</h2>
            <p className="text-slate-300 text-sm line-clamp-2 max-w-2xl">{stripHtml(hero.content).slice(0, 200)}</p>
          </div>
        </div>
      )}

      {/* Featured 2-col */}
      {featured.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4" style={{ fontFamily: "Georgia, serif" }}>Featured</h3>
          <div className="grid grid-cols-2 gap-4">
            {featured.map(n => (
              <div key={n.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-md transition-shadow">
                <div className="h-36 rounded-lg overflow-hidden bg-slate-100 mb-3">
                  {n.coverImage
                    ? <img src={n.coverImage} alt={n.title} className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
                    : <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-200 flex items-center justify-center"><svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                  }
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${AUDIENCE_BADGE[n.targetAudience]}`}>
                  <span className={`w-1 h-1 rounded-full ${AUDIENCE_DOT[n.targetAudience]}`} />{AUDIENCE_LABEL[n.targetAudience]}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1 line-clamp-2 leading-snug" style={{ fontFamily: "Georgia, serif" }}>{n.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2">{stripHtml(n.content).slice(0, 100)}</p>
                <p className="text-[11px] text-slate-400 mt-2">{n.author ? `${n.author.firstName} ${n.author.lastName}` : "FillOps"} · {rt(n.content)} min read</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* More grid */}
      {more.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-slate-800 mb-4" style={{ fontFamily: "Georgia, serif" }}>More Stories</h3>
          <div className="grid grid-cols-3 gap-5">
            {more.map(n => (
              <div key={n.id} className="group cursor-pointer">
                <div className="h-40 rounded-xl overflow-hidden bg-slate-100 mb-3">
                  {n.coverImage
                    ? <img src={n.coverImage} alt={n.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => e.target.style.display="none"} />
                    : <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"><svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                  }
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${AUDIENCE_BADGE[n.targetAudience]}`}>
                  <span className={`w-1 h-1 rounded-full ${AUDIENCE_DOT[n.targetAudience]}`} />{AUDIENCE_LABEL[n.targetAudience]}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 mb-1 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors" style={{ fontFamily: "Georgia, serif" }}>{n.title}</h4>
                <p className="text-xs text-slate-400">{n.author ? `${n.author.firstName} ${n.author.lastName}` : "FillOps"} · {rt(n.content)} min</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminNewsPage() {
  const { newsList, isLoading, isSubmitting, filters, setFilters, fetchNews, createNews, updateNews, deleteNews } = useNewsStore();

  const [tab, setTab]             = useState("write");
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "live" | "draft"
  const [audienceFilter, setAudienceFilter] = useState("all");

  useEffect(() => { fetchNews(); }, [filters]);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const field = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const reset = () => { setForm(EMPTY_FORM); setEditingId(null); };

  const doEdit = n => {
    setForm({ title: n.title||"", content: n.content||"", targetAudience: n.targetAudience||"ALL", coverImage: n.coverImage||"", publishNow: n.isPublished||false });
    setEditingId(n.id);
    setTab("write");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const doSubmit = async () => {
    if (!form.title.trim()) { showToast("Title is required.", "error"); return; }
    if (!stripHtml(form.content).trim()) { showToast("Content cannot be empty.", "error"); return; }
    let result;
    if (editingId) {
      result = await updateNews(editingId, { title: form.title, content: form.content, targetAudience: form.targetAudience, coverImage: form.coverImage||undefined, isPublished: form.publishNow });
      if (result) { showToast("Article updated!"); reset(); } else showToast("Failed to update.", "error");
    } else {
      result = await createNews({ title: form.title, content: form.content, targetAudience: form.targetAudience, coverImage: form.coverImage||undefined, publishNow: form.publishNow });
      if (result) { showToast(form.publishNow ? "Article published!" : "Draft saved!"); reset(); }
      else showToast("Failed to create article.", "error");
    }
  };

  const doToggle = async n => {
    const r = await updateNews(n.id, { isPublished: !n.isPublished });
    if (r) showToast(r.isPublished ? "Article is now live!" : "Moved to drafts."); else showToast("Failed.", "error");
  };

  const doDelete = async () => {
    const ok = await deleteNews(confirmId);
    setConfirmId(null);
    if (ok) showToast("Article deleted."); else showToast("Delete failed.", "error");
  };

  // Client-side filtering for the table
  const filtered = (newsList || []).filter(n => {
    if (statusFilter === "live"  && !n.isPublished) return false;
    if (statusFilter === "draft" &&  n.isPublished) return false;
    if (audienceFilter !== "all" && n.targetAudience !== audienceFilter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !stripHtml(n.content).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total:   (newsList||[]).length,
    live:    (newsList||[]).filter(n => n.isPublished).length,
    drafts:  (newsList||[]).filter(n => !n.isPublished).length,
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
          {/* Brand */}
          <div className="flex items-center gap-3 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-900 leading-none">FillOps News</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Editorial Dashboard</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: "Total",   val: stats.total, color: "text-slate-700",   bg: "bg-slate-100" },
              { label: "Live",    val: stats.live,  color: "text-emerald-700", bg: "bg-emerald-50" },
              { label: "Drafts",  val: stats.drafts, color: "text-amber-700",  bg: "bg-amber-50" },
            ].map(s => (
              <div key={s.label} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${s.bg}`}>
                <span className={`text-sm font-bold tabular-nums ${s.color}`}>{s.val}</span>
                <span className="text-[11px] text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Live page */}
          <Link to="/news"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all no-underline group">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Live Page
          </Link>
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
              {tab === t.key && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
              )}
              {t.key === "write" && editingId && (
                <span className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══ WRITE TAB ══════════════════════════════════════════════════════════ */}
      {tab === "write" && (
        <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">

          {/* Form */}
          <div className="space-y-6">

            {/* Editing banner */}
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

            {/* Cover image */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                Cover Image <span className="text-slate-300 normal-case font-normal">(optional)</span>
              </label>
              <div className="flex gap-3">
                <input type="url" value={form.coverImage} onChange={e => field("coverImage", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50" />
                {form.coverImage && (
                  <button onClick={() => field("coverImage", "")}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 text-xs font-semibold transition-all">
                    Remove
                  </button>
                )}
              </div>
              {form.coverImage && (
                <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 mt-2">
                  <img src={form.coverImage} alt="" className="w-full h-full object-cover" onError={e => e.target.style.opacity = 0} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <span className="absolute bottom-2 left-3 text-[11px] text-white/70 bg-black/30 px-2 py-0.5 rounded-md">Cover preview</span>
                </div>
              )}
            </div>

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
                    {form.targetAudience === opt.value && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500" />
                    )}
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="text-center leading-tight">
                      <p className="font-bold">{opt.label}</p>
                      <p className={`text-[10px] mt-0.5 ${form.targetAudience === opt.value ? "text-blue-500" : "text-slate-400"}`}>{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
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
                  : editingId ? "Save Changes"
                  : form.publishNow ? "Publish Article"
                  : "Save as Draft"
                }
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden xl:block">
            <div className="sticky top-36 space-y-4">

              {/* Card preview */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Card Preview</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Live as you type</span>
                </div>
                <div className="p-4">
                  <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                    {form.coverImage
                      ? <div className="h-28 bg-slate-100"><img src={form.coverImage} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display="none"} /></div>
                      : <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
                    }
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${AUDIENCE_BADGE[form.targetAudience]}`}>
                          <span className={`w-1 h-1 rounded-full ${AUDIENCE_DOT[form.targetAudience]}`} />{AUDIENCE_LABEL[form.targetAudience]}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${form.publishNow ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                          {form.publishNow ? "● Live" : "○ Draft"}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 leading-snug line-clamp-2" style={{ fontFamily: "Georgia, serif" }}>
                        {form.title || <span className="text-slate-300 font-normal italic text-xs">Headline appears here…</span>}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {stripHtml(form.content).slice(0, 110) || <span className="italic text-slate-300">Content preview…</span>}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">{fmt(new Date())}</span>
                        <span className="text-[10px] font-semibold text-blue-600">Read more →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Article Stats</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Words",      val: wordsTyped,                    color: "text-slate-800" },
                    { label: "Characters", val: stripHtml(form.content).length, color: "text-slate-600" },
                    { label: "Est. read",  val: `${readMins} min`,             color: "text-blue-600"  },
                    { label: "Title",      val: `${form.title.length} chars`,  color: "text-slate-500" },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className={`text-base font-bold tabular-nums ${s.color}`}>{s.val}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tip */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-bold">Tip —</span> Switch to the{" "}
                  <button onClick={() => setTab("preview")} className="font-bold underline underline-offset-2 hover:text-blue-900 transition-colors">Preview tab</button>{" "}
                  to see how the public news page looks.
                </p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ══ MANAGE TAB ════════════════════════════════════════════════════════ */}
      {tab === "manage" && (
        <div className="max-w-7xl mx-auto px-6 py-8 w-full flex-1">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all" />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">✕</button>
              )}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {[{ label: "All", val: "all" }, { label: "Live", val: "live" }, { label: "Drafts", val: "draft" }].map(opt => (
                <button key={opt.val} onClick={() => setStatusFilter(opt.val)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === opt.val ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Audience filter */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {[{ label: "All", val: "all" }, { label: "🎓", val: "USERS_ONLY" }, { label: "👨‍🏫", val: "TUTORS_ONLY" }, { label: "🌍", val: "ALL" }].map(opt => (
                <button key={opt.val} onClick={() => setAudienceFilter(opt.val)} title={opt.val === "all" ? "All audiences" : AUDIENCE_LABEL[opt.val]}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    audienceFilter === opt.val ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button onClick={fetchNews}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 text-xs font-semibold shadow-sm transition-all ml-auto">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          {/* Table */}
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

            {/* Table footer */}
            {!isLoading && filtered.length > 0 && (
              <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{stats.total}</span> articles
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
        <div className="flex-1 flex flex-col">
          {/* Banner */}
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5 text-blue-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Admin Preview — showing the public news feed as users see it
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500">{stats.live} published · {stats.drafts} drafts</span>
                <button onClick={fetchNews} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Simulated public page — white bg */}
          <div className="flex-1 bg-white">
            <nav className="bg-white border-b border-slate-200">
              <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <span className="text-[15px] font-bold text-slate-900">FillOps News</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-600 font-semibold">
                  👁 Admin Preview
                </div>
              </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-10">
              {isLoading ? (
                <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
                  <div className="w-8 h-8 rounded-full border-3 border-slate-200 border-t-blue-500 animate-spin" />
                  <p className="text-sm">Loading…</p>
                </div>
              ) : (
                <PublicPreview articles={newsList || []} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}