// ─── Shared Constants ─────────────────────────────────────────────────────────
export const AUDIENCE_OPTIONS = [
  { value: "ALL",         label: "Everyone",  icon: "🌍", desc: "All platform users"  },
  { value: "USERS_ONLY",  label: "Students",  icon: "🎓", desc: "Student accounts"    },
  { value: "TUTORS_ONLY", label: "Tutors",    icon: "👨‍🏫", desc: "Tutor accounts"     },
];

export const AUDIENCE_BADGE = {
  ALL:         "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  USERS_ONLY:  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  TUTORS_ONLY: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export const AUDIENCE_DOT = {
  ALL:         "bg-blue-500",
  USERS_ONLY:  "bg-emerald-500",
  TUTORS_ONLY: "bg-amber-500",
};

export const AUDIENCE_LABEL = {
  ALL:         "Everyone",
  USERS_ONLY:  "Students",
  TUTORS_ONLY: "Tutors",
};

export const EMPTY_FORM = {
  title: "",
  content: "",
  targetAudience: "ALL",
  coverImage: "",
  publishNow: false,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
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
  return Math.max(1, Math.ceil(wc(h) / 200));
}

export function cleanContent(html) {
  return (html || "")
    .replace(/(&amp;)+nbsp;/g, " ")
    .replace(/&nbsp;/g, " ");
}