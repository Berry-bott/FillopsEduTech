// ── Shared rich-text helpers ─────────────────────────────────────────────────
// Sanitizer-proof conversion utilities shared between the RichTextEditor and
// the question panel that renders/saves rich content.
import katex from "katex"

// ── Sanitizer-proof list storage ──────────────────────────────────────────────
// The backend HTML sanitizer also STRIPS <ul>, <ol>, <li> tags. We convert
// lists to plain text markers before saving, then restore them on load/display.
//
// Unordered list items → "• Item 1"  (bullet U+2022)
// Ordered list items  → "1. Item 1", "2. Item 2", etc.
//
// Delimiter format:
//   [LIST:ul]• Item 1[/LIST]    — unordered list item
//   [LIST:ol:1]1. Item 1[/LIST] — ordered list item (with start number)

// Convert editor HTML lists → plain text markers (called before SAVE)
export function listsToDelimiters(html) {
  if (!html || (html.indexOf("<ul") === -1 && html.indexOf("<ol") === -1)) return html
  const box = document.createElement("div")
  box.innerHTML = html

  let listEl
  while ((listEl = box.querySelector("ul, ol")) !== null) {
    const isOrdered = listEl.tagName === "OL"
    const items = []
    let startNum = 1

    if (isOrdered) {
      const startAttr = listEl.getAttribute("start")
      if (startAttr) startNum = parseInt(startAttr, 10) || 1
    }

    listEl.querySelectorAll("li").forEach((li, index) => {
      const text = li.textContent.trim()
      if (!text) return

      if (isOrdered) {
        const num = startNum + index
        items.push(`[LIST:ol:${num}]${num}. ${text}[/LIST]`)
      } else {
        items.push(`[LIST:ul]• ${text}[/LIST]`)
      }
    })

    const replacement = document.createTextNode(items.join("\n"))
    listEl.replaceWith(replacement)
  }

  return box.innerHTML
}

// Render list markers back to proper HTML lists (called on LOAD/DISPLAY)
export function renderListsInHtml(html) {
  if (!html) return html

  const hasMarkerLists = html.indexOf("[LIST:") !== -1
  const hasPlainListLines = /(?:^|\n|>)(?:[•\-]\s+.+|\d+\.\s+.+)/m.test(html)
  if (!hasMarkerLists && !hasPlainListLines) return html

  let result = html

  // Sanitizers commonly turn each list item into a separate paragraph. Convert
  // consecutive bullet/number paragraphs before processing marker variants.
  const box = document.createElement("div")
  box.innerHTML = result
  const children = [...box.children]
  let index = 0
  while (index < children.length) {
    const first = children[index]
    const firstText = first.textContent.trim()
    const isBullet = /^([•\-])\s+/.test(firstText)
    const isNumbered = /^\d+\.\s+/.test(firstText)
    if (!isBullet && !isNumbered) {
      index += 1
      continue
    }

    const items = [first]
    let nextIndex = index + 1
    while (nextIndex < children.length) {
      const nextText = children[nextIndex].textContent.trim()
      const sameType = isBullet
        ? /^([•\-])\s+/.test(nextText)
        : /^\d+\.\s+/.test(nextText)
      if (!sameType) break
      items.push(children[nextIndex])
      nextIndex += 1
    }

    if (items.length > 0) {
      const list = document.createElement(isBullet ? "ul" : "ol")
      const firstItem = items[0]
      firstItem.parentNode.insertBefore(list, firstItem)
      items.forEach((item) => {
        const li = document.createElement("li")
        li.innerHTML = item.innerHTML.replace(/^\s*(?:[•\-]|\d+\.)\s+/, "")
        list.appendChild(li)
        item.remove()
      })
    }
    index = nextIndex
  }
  result = box.innerHTML

  const plainListBlockRegex = /(?:^|\n)((?:[•\-]\s+.+|\d+\.\s+.+)(?:\n(?:[•\-]\s+.+|\d+\.\s+.+))*)/g
  result = result.replace(plainListBlockRegex, (block) => {
    const lines = block.split(/\n/).map((line) => line.trim()).filter(Boolean)
    if (lines.length === 0) return block

    const allBullets = lines.every((line) => /^([•\-])\s+/.test(line))
    const allNumbers = lines.every((line) => /^\d+\.\s+/.test(line))

    if (!allBullets && !allNumbers) return block

    const items = lines.map((line) => {
      const text = line.replace(/^([•\-]|\d+\.)\s+/, "").trim()
      return "<li>" + text + "</li>"
    })

    if (allBullets) return "<ul>" + items.join("") + "</ul>"
    return "<ol>" + items.join("") + "</ol>"
  })

  // Restore each backend marker independently. The API may return different
  // list types adjacent to each other, with no whitespace between markers.
  result = result.replace(/\[LIST:ul\]([\s\S]*?)\[\/LIST\]/g, (_, text) => {
    const itemText = text.replace(/^•\s*/, "").trim()
    return itemText ? `<ul><li>${itemText}</li></ul>` : ""
  })

  result = result.replace(/\[LIST:ol:(\d+)\]([\s\S]*?)\[\/LIST\]/g, (_, start, text) => {
    const itemText = text.replace(/^\d+\.\s*/, "").trim()
    const startAttr = Number(start) > 1 ? ` start="${Number(start)}"` : ""
    return itemText ? `<ol${startAttr}><li>${itemText}</li></ol>` : ""
  })

  // Clean up any remaining standalone markers
  result = result.replace(/\[LIST:[^\]]*\][^\[]*\[\/LIST\]/g, "")

  return result
}

const INLINE_MATH_TYPE = "inline-math"
const BLOCK_MATH_TYPE = "block-math"

// Convert editor math spans → $…$ / $$…$$ text (called before SAVE)
export function mathSpansToDelimiters(html) {
  if (!html || html.indexOf("data-type=") === -1) return html
  const box = document.createElement("div")
  box.innerHTML = html
  box.querySelectorAll(`[data-type="${INLINE_MATH_TYPE}"],[data-type="${BLOCK_MATH_TYPE}"]`).forEach((el) => {
    const latex = (el.getAttribute("data-latex") || "").trim()
    const delim = el.getAttribute("data-type") === BLOCK_MATH_TYPE ? "$$" : "$"
    el.replaceWith(document.createTextNode(`${delim}${latex}${delim}`))
  })
  return box.innerHTML
}

// Render $…$ / $$…$$ delimiters AND any legacy data-type spans to visible
// KaTeX (display side). Idempotent via the .katex guard.
export function renderMathInHtml(html) {
  if (!html) return html
  const hasSpans = html.indexOf("data-type=") !== -1
  const hasDelims = /\$\$[^$]+\$\$|\$[^$\s][^$]*?\$/.test(html)
  if (!hasSpans && !hasDelims) return html

  const box = document.createElement("div")
  box.innerHTML = html

  // Legacy/alternate source: real math spans
  box.querySelectorAll(`[data-type="${INLINE_MATH_TYPE}"],[data-type="${BLOCK_MATH_TYPE}"]`).forEach((el) => {
    if (el.querySelector(".katex")) return
    let latex = el.getAttribute("data-latex") || ""
    latex = latex.replace(/\\\\/g, "\\")
    try {
      el.innerHTML = katex.renderToString(latex, {
        throwOnError: false,
        displayMode: el.getAttribute("data-type") === BLOCK_MATH_TYPE,
        output: "html",
      })
    } catch { /* leave as-is */ }
  })

  // Delimiter form: walk text nodes, replace $…$ / $$…$$ with rendered KaTeX
  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT)
  const textNodes = []
  while (walker.nextNode()) {
    if (/\$\$[^$]+\$\$|\$[^$\s][^$]*?\$/.test(walker.currentNode.nodeValue)) textNodes.push(walker.currentNode)
  }
  textNodes.forEach((tn) => {
    const frag = document.createElement("span")
    frag.innerHTML = tn.nodeValue.replace(
      /\$\$([^$]+)\$\$|\$([^$\s][^$]*?)\$/g,
      (_, blockLatex, inlineLatex) => {
        const latex = (blockLatex ?? inlineLatex ?? "").replace(/\\\\/g, "\\").trim()
        if (!latex) return _
        try {
          return katex.renderToString(latex, {
            throwOnError: false,
            displayMode: blockLatex != null,
            output: "html",
          })
        } catch { return _ }
      }
    )
    tn.replaceWith(...frag.childNodes)
  })

  return box.innerHTML
}

// Helper to strip HTML tags for plain text comparisons / previews
export function stripHtml(html) {
  return html?.replace(/<[^>]*>/g, "") || ""
}

// Remove embedded editor image nodes while preserving their URLs separately for
// the backend's `imageUrls` array. The server sanitizes HTML aggressively and
// strips <img> tags, so the images must be captured and stored via the array.
export function stripImageNodesFromHtml(html) {
  if (!html || html.indexOf("<img") === -1) return html

  const box = document.createElement("div")
  box.innerHTML = html
  box.querySelectorAll("img").forEach((img) => {
    const parent = img.parentNode
    if (parent) parent.replaceChild(document.createTextNode(""), img)
  })

  return box.innerHTML
}

// Restore image placeholders saved alongside the backend imageUrls array.
// Supports both question text and explanation content without assuming that
// the API returns the URLs in the same object shape on every endpoint.
export function renderImageMarkersInHtml(html, imageUrls = []) {
  if (!html || !Array.isArray(imageUrls) || imageUrls.length === 0) return html

  const hydrated = html.replace(/\[IMAGE:(D:)?(\d+)\]/g, (_, drawingMarker, index) => {
    const src = imageUrls[Number(index)]
    if (!src) return ""
    const escapedSrc = String(src).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    const kind = drawingMarker ? " data-image-kind=\"drawing\"" : ""
    return `<img src="${escapedSrc}" alt="${drawingMarker ? "Drawing" : "Inserted question image"}"${kind} />`
  })

  // The backend stores image positions as markers inside paragraphs. Convert
  // image-only paragraphs to inline wrappers so adjacent images stay adjacent.
  const box = document.createElement("div")
  box.innerHTML = hydrated
  box.querySelectorAll("p").forEach((paragraph) => {
    const imageChildren = [...paragraph.children].filter((child) => child.tagName === "IMG")
    const hasOnlyImages = [...paragraph.childNodes].every((node) =>
      node.nodeType === Node.ELEMENT_NODE
        ? node.tagName === "IMG"
        : !node.textContent.trim()
    )
    if (!hasOnlyImages || imageChildren.length === 0) return

    const wrapper = document.createElement("span")
    wrapper.className = "inline-image-paragraph"
    wrapper.innerHTML = paragraph.innerHTML
    paragraph.replaceWith(wrapper)
  })

  return box.innerHTML
}

export function renderLineBreaksInHtml(html) {
  if (!html || html.indexOf("[LINEBREAK]") === -1) return html
  return html.replace(/\[LINEBREAK\]/g, "<p><br></p>")
}

// Convert rich text into the exact backend-safe representation: math delimiters,
// list markers, and no <img> nodes. This keeps the sanitizer-compatible payload
// aligned with the API contract in the backend code.
export function normalizeRichTextForBackend(html, imageOffset = 0) {
  if (!html) return ""

  const box = document.createElement("div")
  box.innerHTML = html
  let imageIndex = imageOffset
  box.querySelectorAll("img").forEach((img) => {
    const marker = img.getAttribute("data-image-kind") === "drawing" ? "D:" : ""
    img.replaceWith(document.createTextNode(`[IMAGE:${marker}${imageIndex}]`))
    imageIndex += 1
  })

  // Empty paragraphs are how Tiptap represents extra Enter presses. Store an
  // explicit marker because the backend sanitizer may remove empty <p> tags.
  box.querySelectorAll("p").forEach((paragraph) => {
    if (paragraph.textContent.trim() || paragraph.querySelector("img")) return
    paragraph.replaceWith(document.createTextNode("[LINEBREAK]"))
  })

  let output = box.innerHTML
  output = listsToDelimiters(output)
  output = mathSpansToDelimiters(output)

  return output
}
