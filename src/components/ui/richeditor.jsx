import { useEffect, useState, useRef } from "react";

// ─── Inline helpers (no external dependency) ─────────────────────────────────
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

// ─── Toolbar Button ───────────────────────────────────────────────────────────
function ToolBtn({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
        active
          ? "bg-blue-600 text-white shadow-sm"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

// ─── RichEditor ───────────────────────────────────────────────────────────────
export default function RichEditor({ value, onChange, placeholder }) {
  const ref = useRef(null);
  const [activeFmt, setActiveFmt] = useState({});

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
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 bg-slate-50 border-b border-slate-200 flex-wrap">
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
          "
          style={{ caretColor: "#2563eb" }}
        />
      </div>
    </div>
  );
}