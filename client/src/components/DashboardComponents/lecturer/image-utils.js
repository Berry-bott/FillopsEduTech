// Shared image compression helpers for the question editors.
// Guarantees a dataURL under a character budget (backend validates
// question.text at 90,000 chars, so inline images must stay small).

const BUDGET_DEFAULT = 40000 // ~30KB binary → leaves room for text + more images

function loadImage(src) {
  return new Promise((resolve, reject) => {
    // createElement (NOT new Image()) — `Image` is shadowed by the Tiptap import
    const el = document.createElement("img")
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error("decode-failed"))
    el.src = src
  })
}

function drawToDataUrl(img, width, height, type, quality) {
  const canvas = document.createElement("canvas")
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  const ctx = canvas.getContext("2d")
  ctx.fillStyle = "#ffffff" // flatten transparency onto white
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL(type, quality)
}

/**
 * Decode an image source (File reader result or dataURL), then downscale +
 * reduce quality stepwise until the dataURL fits within maxChars.
 * Returns { dataUrl, width, height }.
 */
export async function compressToBudget(source, { maxDim = 900, maxChars = BUDGET_DEFAULT } = {}) {
  const img = await loadImage(source)
  const steps = [
    { s: Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1)), q: 0.78 },
    { s: 0.7, q: 0.7 }, { s: 0.55, q: 0.62 }, { s: 0.42, q: 0.55 },
    { s: 0.32, q: 0.5 }, { s: 0.24, q: 0.45 },
  ]
  let best = null
  for (const step of steps) {
    const w = Math.max(24, Math.round((img.width || maxDim) * step.s))
    const h = Math.max(24, Math.round((img.height || maxDim) * step.s))
    const dataUrl = drawToDataUrl(img, w, h, "image/jpeg", step.q)
    best = { dataUrl, width: w, height: h }
    if (dataUrl.length <= maxChars) return best
  }
  return best
}

/** Convenience: File → compressed dataURL */
export async function fileToCompressedDataUrl(file, opts = {}) {
  const reader = new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onerror = () => reject(new Error("read-failed"))
    r.onload = () => resolve(r.result)
    r.readAsDataURL(file)
  })
  const raw = await reader
  const { dataUrl } = await compressToBudget(raw, opts)
  return dataUrl
}

/** Convenience: existing dataURL → guaranteed-small dataURL */
export async function shrinkDataUrl(dataUrl, opts = {}) {
  if (!dataUrl || dataUrl.length <= (opts.maxChars ?? BUDGET_DEFAULT)) return dataUrl
  const { dataUrl: small } = await compressToBudget(dataUrl, opts)
  return small
}