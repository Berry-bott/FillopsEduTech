import React, { useState, useEffect, useCallback, useRef } from "react"
import { useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TiptapImage from "@tiptap/extension-image"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import {TextStyle} from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Placeholder from "@tiptap/extension-placeholder"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Mathematics, createMathMigrateTransaction, mathMigrationRegex } from "@tiptap/extension-mathematics"
import { fileToCompressedDataUrl } from "./image-utils"
import katex from "katex"
import "katex/dist/katex.min.css"
import DrawingPadModal from "./DrawingPadModal"
import { renderListsInHtml, renderImageMarkersInHtml, renderLineBreaksInHtml } from "./rich-text-utils"
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Subscript as SubIcon, Superscript as SupIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, ImageIcon, List, ListOrdered,
  Highlighter, Palette, Undo, Redo, Minus, Code, Link as LinkIcon, Sigma, PenTool,
} from "lucide-react"

// ── Editor helpers ─────────────────────────────────────────────────────────────

// Image node handling. Uses the stock BLOCK image (inline images proved
// unreliable for insertion in this setup). Inserted images/drawings render
// full-size in the editor via scoped CSS below.
const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      imageKind: { default: "upload" },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(EditableImageNodeView)
  },
})

function EditableImageNodeView({ node, deleteNode }) {
  return (
    <NodeViewWrapper className="relative inline-block group my-1">
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || "Inserted image"}
        title={node.attrs.title || undefined}
        data-image-kind={node.attrs.imageKind || "upload"}
        className="editor-inserted-image block max-w-full h-auto rounded-md border border-slate-300"
      />
      <button
        type="button"
        aria-label="Remove image"
        title="Remove image"
        contentEditable={false}
        onMouseDown={(event) => event.preventDefault()}
        onClick={deleteNode}
        className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow group-hover:flex"
      >
        ×
      </button>
    </NodeViewWrapper>
  )
}

// Insert an image anchored to the end of the document so it always appears
// (block image node). Uses editor.chain() so onUpdate fires and the parent's
// questionText stays in sync.
function insertAnchoredImage(editor, src, imageKind = "upload") {
  if (!editor) return false
  const attrs = { src, imageKind, alt: imageKind === "drawing" ? "Drawing" : "Uploaded image" }

  // 1. Try the straightforward caret insert first (fires onUpdate too)
  if (editor.chain().focus("end").setImage(attrs).run()) {
    if (JSON.stringify(editor.getJSON()).includes('"image"')) return true
  }

  // 2. Robust fallback: append a block image at the end of the document.
  return editor.chain()
    .focus("end")
    .insertContent({ type: "image", attrs })
    .run()
}

// Convert $…$ delimiter text in the document into live math nodes
// (used after loading saved content into the editor). onEmit receives the
// migrated HTML so the parent form state stays in sync.
function migrateDelimiterMath(editor, onEmit) {
  if (!editor) return
  try {
    if (!/\$[^$]*\$/.test(editor.getHTML())) return
    const tr = createMathMigrateTransaction(editor, editor.state.tr, mathMigrationRegex)
    editor.view.dispatch(tr)
    onEmit?.(editor.getHTML())
  } catch { /* nothing to migrate */ }
}

// Convert [LIST] markers back to proper HTML lists in the editor.
// Called after loading saved content so lists render correctly.
function migrateDelimiterLists(editor, onEmit) {
  if (!editor) return
  try {
    const html = editor.getHTML()
    if (!html.includes("[LIST:")) return
    const migrated = renderListsInHtml(html)
    if (migrated !== html) {
      editor.commands.setContent(migrated, false, { preserveWhitespace: "full" })
      onEmit?.(editor.getHTML())
    }
  } catch { /* nothing to migrate */ }
}

// Quick-insert snippets for the formula popover.
const MATH_PALETTE = [
  { label: "a/b", latex: "\\frac{}{}", caretOffset: 3 },
  { label: "x²", latex: "^{}", caretOffset: 1 },
  { label: "x₂", latex: "_{}", caretOffset: 1 },
  { label: "√", latex: "\\sqrt{}", caretOffset: 6 },
  { label: "√ⁿ", latex: "\\sqrt[]{}", caretOffset: 7 },
  { label: "∑", latex: "\\sum_{i=1}^{n}", caretOffset: 14 },
  { label: "∫", latex: "\\int_{}^{}", caretOffset: 6 },
  { label: "lim", latex: "\\lim_{x \\to \\infty}" },
  { label: "≤", latex: "\\leq " },
  { label: "≥", latex: "\\geq " },
  { label: "≠", latex: "\\neq " },
  { label: "≈", latex: "\\approx " },
  { label: "±", latex: "\\pm " },
  { label: "×", latex: "\\times " },
  { label: "÷", latex: "\\div " },
  { label: "∞", latex: "\\infty " },
  { label: "°", latex: "^\\circ " },
  { label: "α", latex: "\\alpha " },
  { label: "β", latex: "\\beta " },
  { label: "θ", latex: "\\theta " },
  { label: "π", latex: "\\pi " },
  { label: "Δ", latex: "\\Delta " },
  { label: "∠", latex: "\\angle " },
  { label: "△", latex: "\\triangle " },
  { label: "sin", latex: "\\sin " },
  { label: "cos", latex: "\\cos " },
  { label: "tan", latex: "\\tan " },
  { label: "log", latex: "\\log " },
]

// ── Rich Text Toolbar ──────────────────────────────────────────────────────────

function ToolbarButton({ onClick, active, title, children, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border mx-0.5" />
}

function RichTextToolbar({ editor, onOpenDraw }) {
  const imageInputRef = useRef(null)
  const [uploadMsg, setUploadMsg] = useState(null)

  const flashMsg = (type, msg, ms = 4000) => {
    setUploadMsg({ type, msg })
    setTimeout(() => setUploadMsg(null), ms)
  }

  // Pick a local file → compress → insert inline as dataURL. Same
  // choose-file experience as the main "Question Image" uploader.
  const insertImage = useCallback(async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length || !editor) return
    e.target.value = ""

    const invalid = files.find((file) => !file.type.startsWith("image/"))
    if (invalid) {
      flashMsg("error", "Please select only image files.")
      return
    }

    const oversized = files.find((file) => file.size > 5 * 1024 * 1024)
    if (oversized) {
      flashMsg("error", "Each image must be under 5 MB.")
      return
    }

    try {
      for (const file of files) {
        const dataUrl = await fileToCompressedDataUrl(file)
        insertAnchoredImage(editor, dataUrl, "upload")
      }
      flashMsg("success", `${files.length} image${files.length > 1 ? "s" : ""} inserted.`)
    } catch {
      flashMsg("error", "Could not process that image.")
    }
  }, [editor])

  const insertImageFromUrl = useCallback(() => {
    const url = prompt("Enter image URL:")
    if (url) insertAnchoredImage(editor, url)
  }, [editor])

  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/30 rounded-t-md">
      {/* Undo / Redo */}
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text formatting */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
        <Bold className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
        <Italic className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <UnderlineIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <Strikethrough className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code">
        <Code className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Sub / Sup */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive("subscript")} title="Subscript (H₂O)">
        <SubIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive("superscript")} title="Superscript (x²)">
        <SupIcon className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Highlight + Color */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">
        <Highlighter className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ColorPicker editor={editor} />

      <ToolbarDivider />

      {/* Alignment */}
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
        <AlignLeft className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
        <AlignCenter className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
        <AlignRight className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("justify").run()} active={editor.isActive({ textAlign: "justify" })} title="Justify">
        <AlignJustify className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <List className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
        <ListOrdered className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          active={editor.isActive("heading", { level })}
          title={`Heading ${level}`}
        >
          <span className="text-xs font-bold">H{level}</span>
        </ToolbarButton>
      ))}

      <ToolbarDivider />

      {/* Horizontal rule */}
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus className="w-3.5 h-3.5" />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Image / Draw / Formula */}
      <ToolbarButton onClick={() => imageInputRef.current?.click()} title="Insert Image (from device)">
        <ImageIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <ToolbarButton onClick={insertImageFromUrl} title="Insert Image from URL">
        <LinkIcon className="w-3.5 h-3.5" />
      </ToolbarButton>
      <input ref={imageInputRef} type="file" accept="image/*" multiple className="sr-only" onChange={insertImage} />

      {onOpenDraw && (
        <ToolbarButton onClick={() => onOpenDraw()} title="Draw a Diagram">
          <PenTool className="w-3.5 h-3.5" />
        </ToolbarButton>
      )}

      <FormulaButton editor={editor} />

      {/* Upload status message */}
      {uploadMsg && (
        <span className={`text-xs font-medium ${uploadMsg.type === "success" ? "text-emerald-600" : "text-red-600"}`}>
          {uploadMsg.msg}
        </span>
      )}
    </div>
  )
}

// ── Color Picker (reliable swatches — native input stole editor focus) ────────
const SWATCHES = ["#111827", "#dc2626", "#ea580c", "#16a34a", "#2563eb", "#7c3aed", "#db2777", "#0891b2"]

function ColorPicker({ editor }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Text Color"
          className="p-1.5 rounded hover:bg-muted cursor-pointer flex items-center relative"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Palette className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-background" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-auto p-2 z-[9999]">
        <div className="grid grid-cols-4 gap-1.5">
          {SWATCHES.map((c) => (
            <button
              key={c}
              type="button"
              title={c}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { editor.chain().focus().setColor(c).run(); setOpen(false) }}
              className="w-6 h-6 rounded-md border border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
          Custom
          <input
            type="color"
            className="w-8 h-6 cursor-pointer border rounded"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
      </PopoverContent>
    </Popover>
  )
}
// ── Formula Button (LaTeX via KaTeX — inline or block) ────────────────────────
function FormulaButton({ editor }) {
  const [open, setOpen] = useState(false)
  const [latex, setLatex] = useState("")
  const [isBlock, setIsBlock] = useState(false)
  const inputRef = useRef(null)
  const editingRef = useRef(false)

  const isActiveMath = editor.isActive("inlineMath") || editor.isActive("blockMath")

  // Pre-fill when opening with a math node selected (edit mode)
  const handleOpenChange = (next) => {
    if (next) {
      editingRef.current = isActiveMath
      const existing =
        editor.getAttributes("inlineMath")?.latex ??
        editor.getAttributes("blockMath")?.latex ?? ""
      setLatex(existing)
      setIsBlock(editor.isActive("blockMath"))
      setTimeout(() => inputRef.current?.focus(), 50)
    }
    setOpen(next)
  }

  const insertSnippet = (snippet, caretOffset = 0) => {
    setLatex((prev) => prev + snippet)
    setTimeout(() => {
      const el = inputRef.current
      if (!el) return
      const pos = (el.value.length - snippet.length) + caretOffset
      el.focus()
      el.setSelectionRange(pos, pos)
    }, 0)
  }

  const apply = () => {
    const cleanLatex = latex.trim()
    if (!cleanLatex) return
    if (editingRef.current && isActiveMath) {
      if (editor.isActive("inlineMath")) editor.chain().focus().updateInlineMath({ latex: cleanLatex }).run()
      else editor.chain().focus().updateBlockMath({ latex: cleanLatex }).run()
    } else if (isBlock) {
      editor.chain().focus().insertBlockMath({ latex: cleanLatex }).run()
    } else {
      editor.chain().focus().insertInlineMath({ latex: cleanLatex }).run()
    }
    setOpen(false)
  }

  let previewHtml = ""
  try {
    previewHtml = katex.renderToString(latex || "\\frac{a}{b}", {
      throwOnError: false,
      displayMode: isBlock,
      output: "html", // visual only
    })
  } catch {
    previewHtml = ""
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title="Insert / Edit Formula (LaTeX)"
          onMouseDown={(e) => e.preventDefault()}
          className="p-1.5 rounded transition-colors hover:bg-muted text-muted-foreground hover:text-foreground flex items-center gap-0.5"
        >
          <Sigma className="w-3.5 h-3.5" />
          <span className="text-[11px] font-serif italic">fx</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="w-[340px] p-3 space-y-2 z-[9999]">
        <p className="text-xs font-medium">Formula — LaTeX</p>

        {/* Live preview */}
        <div
          className="min-h-[46px] rounded-md border bg-muted/40 px-3 py-2 text-center overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />

        <input
          ref={inputRef}
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply() } }}
          placeholder="e.g. \\frac{a}{b} + \\sqrt{x^2+1}"
          className="w-full h-8 px-2 text-sm rounded-md border bg-transparent focus:outline-none focus:ring-1 focus:ring-ring font-mono"
        />

        {/* Symbol palette */}
        <div className="flex flex-wrap gap-1 max-h-[92px] overflow-y-auto">
          {MATH_PALETTE.map((s) => (
            <button
              key={s.label}
              type="button"
              title={s.latex}
              onClick={() => insertSnippet(s.latex, s.caretOffset)}
              className="min-w-[34px] h-7 px-1 rounded border bg-card hover:bg-muted text-xs"
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={isBlock}
              onChange={(e) => setIsBlock(e.target.checked)}
              className="accent-primary"
            />
            Block (own line)
          </label>
          <div className="flex gap-1.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="button" size="sm" onClick={apply}>
              {editingRef.current && isActiveMath ? "Update" : "Insert"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
// ── Rich Text Editor ───────────────────────────────────────────────────────────

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  minHeight = "120px",
  imageUrls = [],
}) {
  const [drawOpen, setDrawOpen] = useState(false)
  const hydratedValue = renderLineBreaksInHtml(renderImageMarkersInHtml(value || "", imageUrls))

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ResizableImage.configure({ allowBase64: true, inline: true }),
      Mathematics,
      Placeholder.configure({ placeholder }),
    ],
    content: hydratedValue,
    parseOptions: { preserveWhitespace: "full" },
    onUpdate: ({ editor }) => {
      lastEmittedRef.current = editor.getHTML()
      onChange(editor.getHTML())
    },
    // note: image/drawing inserts via a raw transaction don't fire onUpdate,
    // so we also emit after those in insertAnchoredImage via the toolbars.
    editorProps: {
      attributes: {
        class: "rich-content prose prose-sm max-w-none focus:outline-none px-3 py-2",
        "data-rich-content": "true",
        style: `min-height: ${minHeight}`,
      },
      transformPastedHTML: (html) => html,
    },
  })

  // Sync external value changes ONLY when they didn't originate from this editor
  // (e.g. loading an existing question). Comparing against what we last emitted
  // prevents the parent's state from wiping a just-inserted image/drawing.
  const lastEmittedRef = useRef(value)
  const emitRef = useRef(null)
  emitRef.current = onChange
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML() && value !== lastEmittedRef.current) {
      lastEmittedRef.current = null
      editor.commands.setContent(
        renderLineBreaksInHtml(renderImageMarkersInHtml(value || "", imageUrls)),
        false,
        { preserveWhitespace: "full" }
      )
      // Saved content stores math as $…$ text and lists as [LIST] markers
      // (sanitizer-proof); convert to live nodes so they render in the editor.
      migrateDelimiterMath(editor, (html) => {
        lastEmittedRef.current = html
        emitRef.current?.(html)
      })
      migrateDelimiterLists(editor, (html) => {
        lastEmittedRef.current = html
        emitRef.current?.(html)
      })
    }
  }, [value, editor, imageUrls])

  // One-time migration on mount too (covers the initial content value).
  useEffect(() => {
    if (!editor) return
    migrateDelimiterMath(editor, (html) => {
      lastEmittedRef.current = html
      emitRef.current?.(html)
    })
    migrateDelimiterLists(editor, (html) => {
      lastEmittedRef.current = html
      emitRef.current?.(html)
    })
  }, [editor])

  // The pad hands over a flattened PNG dataURL. Insert it inline at the cursor
  // position, just like the image uploader — it will be extracted and uploaded
  // as a multipart field when the question is saved.
  const insertDrawnImage = useCallback((dataUrl) => {
    if (!dataUrl || !editor) return
    insertAnchoredImage(editor, dataUrl, "drawing")
  }, [editor])

  return (
    <div className="border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
      {/* Scoped styles — class-based (.rich-content is applied to the ProseMirror
          element itself, so these always apply). Tailwind preflight strips list
          markers and the typography plugin isn't installed. */}
      <style>{`
        .rich-content ul { list-style: disc outside; padding-left: 1.5rem; margin: .4rem 0; }
        .rich-content ol { list-style: decimal outside; padding-left: 1.5rem; margin: .4rem 0; }
        .rich-content li { margin: .2rem 0; display: list-item; }
        .rich-content { white-space: pre-wrap; overflow-wrap: anywhere; }
        .rich-content p { margin: .25rem 0; }
        .rich-content p:has(> .editor-inserted-image:only-child) { display: inline-block; vertical-align: middle; margin: 0; }
        /* Keep inserted images and drawings compact in the editor. */
        .rich-content .editor-inserted-image { display: inline-block; vertical-align: middle; width: 100px; height: 100px; object-fit: contain; border-radius: 6px; border: 1px solid #cbd5e1; margin: .4rem .25rem; background: white; }
        .rich-content .editor-inserted-image[data-image-kind="drawing"] { height: 64px; }
        .rich-content [data-type="inline-math"],
        .rich-content [data-type="block-math"] { display: inline-block; min-width: .5em; min-height: 1em; }
        .rich-content [data-type="block-math"] { display: block; text-align: center; margin: .35rem 0; }
        .rich-content .katex { font-size: 1.05em; }
      `}</style>

      {/* Only show the draw tool when the parent can persist the result */}
      <RichTextToolbar editor={editor} onOpenDraw={() => setDrawOpen(true)} />
      <EditorContent editor={editor} />
      <p className="border-t bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
        Images stack vertically by default. To place images side by side, drag one image onto the same line as another image when the editor allows it.
      </p>

      <DrawingPadModal
        open={drawOpen}
        onOpenChange={setDrawOpen}
        onInsert={insertDrawnImage}
      />
    </div>
  )
}
