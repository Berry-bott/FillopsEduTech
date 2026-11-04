export function stripHtmlToText(value) {
  if (!value) return "";

  const normalized = String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(\/)?(p|div|li|ul|ol|h[1-6]|blockquote|pre|table|tr|td|th)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!normalized) return "";

  const txt = document.createElement("textarea");
  txt.innerHTML = normalized;

  return txt.value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}
