import { useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import useBlogStore from "@/store/adminBlogStore";
import { CATEGORY_BADGE, CATEGORY_DOT } from "./blogUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stripHtml(html) {
  return (html || "")
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

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function readTime(html) {
  return Math.max(1, Math.ceil(stripHtml(html).trim().split(/\s+/).filter(Boolean).length / 200));
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/blog" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">FillOps Blog</span>
        </Link>
        <div className="hidden md:flex items-center gap-4 text-[13px] text-slate-500">
          <Link to="/blog" className="hover:text-slate-900 no-underline transition-colors font-medium">
            All Posts
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="font-bold text-slate-800">FillOps Blog</span>
        </div>
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} FillOps. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Category Pill ────────────────────────────────────────────────────────────
function CategoryPill({ category }) {
  if (!category) return null;
  const badge = CATEGORY_BADGE[category] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  const dot   = CATEGORY_DOT[category]   ?? "bg-slate-400";
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {category}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BlogDetailPage() {
  // Route can be /blog/:slug (public SEO) or /blog/:id (admin preview)
  const { slug } = useParams();
  const navigate  = useNavigate();
  const location  = useLocation();

  const {
    selectedBlog, isLoading, error,
    fetchBlogBySlug, fetchAdminBlogById, clearError,
  } = useBlogStore();

  // Admin preview passes state.from so the back button returns to the dashboard
  const backPath  = location.state?.from ?? "/blog";
  const backLabel = location.state?.from?.includes("admin") ? "Back to dashboard" : "Back to blog";

  useEffect(() => {
    clearError();
    window.scrollTo(0, 0);

    // If the param looks like a UUID use the admin fetch, otherwise treat as slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    if (isUuid) {
      fetchAdminBlogById(slug);
    } else {
      fetchBlogBySlug(slug);
    }
  }, [slug]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-violet-600 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">Loading post…</p>
      </div>
      <Footer />
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <span className="text-5xl">⚠️</span>
        <h3
          className="text-lg font-semibold text-slate-700"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Post not found
        </h3>
        <p className="text-sm text-red-400 text-center max-w-xs">{error}</p>
        <button
          onClick={() => navigate(backPath)}
          className="mt-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          ← {backLabel}
        </button>
      </div>
      <Footer />
    </div>
  );

  if (!selectedBlog) return null;

  const author     = selectedBlog.author;
  const authorName = author ? `${author.firstName} ${author.lastName}` : "FillOps";
  const authorInit = author
    ? `${author.firstName?.[0] ?? ""}${author.lastName?.[0] ?? ""}`
    : "F";
  const date    = fmtDate(selectedBlog.publishedAt || selectedBlog.createdAt);
  const rt      = readTime(selectedBlog.content);
  const isHtml  = /<[a-z][\s\S]*>/i.test(selectedBlog.content || "");

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* SEO meta tags via document.title — for a real app use react-helmet */}
      {(() => {
        document.title = selectedBlog.metaTitle || selectedBlog.title || "FillOps Blog";
        const desc = document.querySelector('meta[name="description"]');
        if (desc && selectedBlog.metaDescription) desc.setAttribute("content", selectedBlog.metaDescription);
        return null;
      })()}

      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* ── Back link ──────────────────────────────────────────────────── */}
        <button
          onClick={() => navigate(backPath)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-8 transition-colors group bg-transparent border-0 cursor-pointer p-0"
        >
          <svg
            style={{ width: 14, height: 14 }}
            className="group-hover:-translate-x-0.5 transition-transform"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {backLabel}
        </button>

        {/* ── Category pill ──────────────────────────────────────────────── */}
        {selectedBlog.category && (
          <div className="mb-4">
            <CategoryPill category={selectedBlog.category} />
          </div>
        )}

        {/* ── Title ──────────────────────────────────────────────────────── */}
        <h1
          className="font-bold text-slate-900 leading-tight mb-4"
          style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", lineHeight: 1.18 }}
        >
          {selectedBlog.title}
        </h1>

        {/* ── Meta description as subtitle ───────────────────────────────── */}
        {selectedBlog.metaDescription && (
          <p className="text-base text-slate-500 leading-relaxed mb-6 border-l-4 border-violet-200 pl-4 italic">
            {selectedBlog.metaDescription}
          </p>
        )}

        {/* ── Author row ─────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between py-4 border-y mb-8"
          style={{ borderColor: "#e8eaed" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
              {authorInit}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none mb-1">{authorName}</p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{date}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <svg style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {rt} min read
                </span>
                {selectedBlog.category && (
                  <>
                    <span>·</span>
                    <span className="text-violet-500 font-medium">{selectedBlog.category}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Share button */}
          <button
            onClick={() =>
              navigator.share?.({
                title: selectedBlog.title,
                text:  selectedBlog.metaDescription || "",
                url:   window.location.href,
              }).catch(() => {})
            }
            className="p-2 rounded-full border border-slate-200 text-slate-400 hover:text-violet-600 hover:border-violet-200 transition-colors"
          >
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>

        {/* ── Cover image ────────────────────────────────────────────────── */}
        {selectedBlog.coverImage && (
          <div className="mb-10 rounded-2xl overflow-hidden bg-slate-100" style={{ maxHeight: 480 }}>
            <img
              src={selectedBlog.coverImage}
              alt={selectedBlog.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.parentElement.style.display = "none"; }}
            />
          </div>
        )}

        {/* ── Body ───────────────────────────────────────────────────────── */}
        {isHtml ? (
          <div
            className="
              [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-tight
              [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-[1.05rem] [&_p]:leading-[1.9] [&_p]:text-slate-700 [&_p]:mb-5
              [&_a]:text-violet-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-violet-700
              [&_strong]:text-slate-900 [&_strong]:font-bold
              [&_em]:italic [&_em]:text-slate-600
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul]:space-y-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol]:space-y-2
              [&_li]:text-slate-700 [&_li]:text-[1.05rem] [&_li]:leading-relaxed
              [&_blockquote]:border-l-4 [&_blockquote]:border-violet-400 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-6 [&_blockquote]:bg-violet-50/40 [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl
              [&_hr]:border-slate-200 [&_hr]:my-8
              [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:rounded-xl [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:my-6
              [&_code]:bg-slate-100 [&_code]:text-violet-700 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.9em] [&_code]:font-mono
            "
            dangerouslySetInnerHTML={{
              __html: (selectedBlog.content || "")
                .replace(/(&amp;)+nbsp;/g, " ")
                .replace(/&nbsp;/g, " "),
            }}
          />
        ) : (
          <div className="space-y-5">
            {(selectedBlog.content || "").split("\n").filter(p => p.trim()).map((para, i) => (
              <p
                key={i}
                className="text-slate-700 leading-[1.9]"
                style={{ fontSize: "1.05rem", fontFamily: "Georgia, serif" }}
              >
                {i === 0 && para.length > 0 ? (
                  <>
                    <span
                      className="float-left font-bold text-slate-900 leading-none mr-2"
                      style={{ fontFamily: "Georgia, serif", fontSize: "4rem", lineHeight: 0.85, marginTop: "0.1em" }}
                    >
                      {para[0]}
                    </span>
                    {para.slice(1)}
                  </>
                ) : para}
              </p>
            ))}
          </div>
        )}

        {/* ── Keywords / tags ────────────────────────────────────────────── */}
        {selectedBlog.keywords && (
          <div className="mt-10 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {selectedBlog.keywords.split(",").map(k => k.trim()).filter(Boolean).map(kw => (
                <span
                  key={kw}
                  className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-violet-50 hover:text-violet-700 transition-colors cursor-default"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Author card ────────────────────────────────────────────────── */}
        <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">
            {authorInit}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1">Written by {authorName}</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              FillOps editorial team — helping students and tutors navigate exams with confidence.
            </p>
          </div>
        </div>

        {/* ── Bottom back ────────────────────────────────────────────────── */}
        <div className="mt-14 pt-8 border-t border-slate-100">
          <button
            onClick={() => navigate(backPath)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors bg-transparent border-0 cursor-pointer p-0"
          >
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {backLabel}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}