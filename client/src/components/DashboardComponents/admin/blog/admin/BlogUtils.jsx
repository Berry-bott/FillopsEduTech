// ─── Category Options ─────────────────────────────────────────────────────────
export const CATEGORY_OPTIONS = [
  { value: "WAEC",        label: "WAEC",        icon: "📝", desc: "WAEC exam content"    },
  { value: "JAMB",        label: "JAMB",        icon: "🎯", desc: "JAMB exam content"    },
  { value: "NECO",        label: "NECO",        icon: "📚", desc: "NECO exam content"    },
  { value: "GCE",         label: "GCE",         icon: "🎓", desc: "GCE exam content"     },
  { value: "Study Tips",  label: "Study Tips",  icon: "💡", desc: "General study advice" },
  { value: "News",        label: "News",        icon: "📰", desc: "Platform news"         },
];

export const CATEGORY_BADGE = {
  WAEC:          "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  JAMB:          "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  NECO:          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  GCE:           "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "Study Tips":  "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  News:          "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
};

export const CATEGORY_DOT = {
  WAEC:          "bg-blue-500",
  JAMB:          "bg-purple-500",
  NECO:          "bg-emerald-500",
  GCE:           "bg-amber-500",
  "Study Tips":  "bg-rose-500",
  News:          "bg-slate-400",
};

// Convenient display label — mirrors the value but kept separate
// so callers never hardcode strings or fall through to undefined
export const CATEGORY_LABEL = {
  WAEC:          "WAEC",
  JAMB:          "JAMB",
  NECO:          "NECO",
  GCE:           "GCE",
  "Study Tips":  "Study Tips",
  News:          "News",
};

export const EMPTY_BLOG_FORM = {
  title:           "",
  content:         "",
  category:        "",
  coverImage:      "",
  metaTitle:       "",
  metaDescription: "",
  keywords:        "",
  publishNow:      false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function stripHtml(h) {
  return (h || "")
    .replace(/(&amp;)+nbsp;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function wc(h) {
  return stripHtml(h).trim().split(/\s+/).filter(Boolean).length;
}

export function rt(h) {
  return Math.ceil(wc(h) / 50);
}

export function cleanContent(html) {
  return (html || "")
    .replace(/(&amp;)+nbsp;/g, " ")
    .replace(/&nbsp;/g, " ");
}